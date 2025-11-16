"""
Sheba Caregiver Matching Algorithm

This stand-alone script implements an intelligent caregiver-matching engine using:
- Haversine distance calculation for location-based scoring
- Cosine similarity for skill matching
- Composite scoring with weighted factors
- Availability checking from bookings data

Author: Sheba Development Team
Date: November 2025
"""

import sys
import io
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
import warnings

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

warnings.filterwarnings('ignore')


class CaregiverMatcher:
    """
    Intelligent caregiver matching engine for Sheba platform.
    
    Scoring Breakdown (0-100):
    - 30% Distance (closer = higher)
    - 25% Skill similarity
    - 20% Rating (0-5 → 0-20)
    - 15% Years of experience
    - 5% Gender match
    - 5% Language/dialect match
    """
    
    # Scoring weights (must sum to 100)
    WEIGHTS = {
        'distance': 0.30,
        'skill': 0.25,
        'rating': 0.20,
        'experience': 0.15,
        'gender': 0.05,
        'language': 0.05
    }
    
    # Earth radius in kilometers
    EARTH_RADIUS_KM = 6371.0
    
    def __init__(self, data_dir: str = None):
        """
        Initialize the matcher with CSV data.
        
        Args:
            data_dir: Path to directory containing CSV files. 
                     Defaults to ml/data/mock/
        """
        if data_dir is None:
            data_dir = Path(__file__).parent / 'data' / 'mock'
        else:
            data_dir = Path(data_dir)
        
        self.data_dir = data_dir
        
        # Load data
        print("Loading data...")
        self.seniors_df = pd.read_csv(data_dir / 'seniors.csv')
        self.caregivers_df = pd.read_csv(data_dir / 'caregivers.csv')
        self.bookings_df = pd.read_csv(data_dir / 'bookings.csv')
        
        # Preprocess data
        self._preprocess_data()
        
        print(f"[OK] Loaded {len(self.seniors_df)} seniors")
        print(f"[OK] Loaded {len(self.caregivers_df)} caregivers")
        print(f"[OK] Loaded {len(self.bookings_df)} bookings")
    
    def _preprocess_data(self):
        """Preprocess and prepare data for matching."""
        # Parse services/skills for caregivers
        self.caregivers_df['services_list'] = self.caregivers_df['services'].apply(
            lambda x: x.split('|') if pd.notna(x) else []
        )
        
        # Build skill vectors using one-hot encoding
        all_skills = set()
        for skills in self.caregivers_df['services_list']:
            all_skills.update(skills)
        
        self.all_skills = sorted(list(all_skills))
        print(f"[OK] Found {len(self.all_skills)} unique skills/services")
        
        # Create MultiLabelBinarizer for skill vectors
        self.mlb = MultiLabelBinarizer(classes=self.all_skills)
        self.skill_vectors = self.mlb.fit_transform(
            self.caregivers_df['services_list']
        )
        
        # Convert booking dates to datetime
        self.bookings_df['booking_date'] = pd.to_datetime(
            self.bookings_df['booking_date']
        )
    
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, 
                          lat2: float, lon2: float) -> float:
        """
        Calculate the great-circle distance between two points 
        on Earth using the Haversine formula.
        
        Args:
            lat1, lon1: Coordinates of first point (degrees)
            lat2, lon2: Coordinates of second point (degrees)
        
        Returns:
            Distance in kilometers
        """
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(
            np.radians, [lat1, lon1, lat2, lon2]
        )
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = (np.sin(dlat / 2) ** 2 + 
             np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2)
        c = 2 * np.arcsin(np.sqrt(a))
        
        return CaregiverMatcher.EARTH_RADIUS_KM * c
    
    def _calculate_distance_score(self, distance_km: float) -> float:
        """
        Convert distance to a score (0-30).
        Closer caregivers get higher scores.
        
        Uses exponential decay: score = 30 * e^(-distance/10)
        """
        if pd.isna(distance_km):
            return 0.0
        
        # Exponential decay - 10km half-life
        score = 30.0 * np.exp(-distance_km / 10.0)
        return max(0.0, min(30.0, score))
    
    def _calculate_skill_score(self, senior_skills: List[str], 
                               caregiver_idx: int) -> float:
        """
        Calculate skill similarity using cosine similarity (0-25).
        
        Args:
            senior_skills: List of required skills
            caregiver_idx: Index of caregiver in caregivers_df
        
        Returns:
            Skill similarity score (0-25)
        """
        if not senior_skills:
            return 0.0
        
        # Create skill vector for senior requirements
        senior_vector = self.mlb.transform([senior_skills])
        caregiver_vector = self.skill_vectors[caregiver_idx].reshape(1, -1)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(senior_vector, caregiver_vector)[0][0]
        
        # Scale to 0-25
        return similarity * 25.0
    
    def _calculate_rating_score(self, rating: float) -> float:
        """
        Convert rating (0-5) to score (0-20).
        """
        if pd.isna(rating):
            return 0.0
        
        # Linear scaling: 5-star = 20 points
        return (rating / 5.0) * 20.0
    
    def _calculate_experience_score(self, years: int) -> float:
        """
        Convert years of experience to score (0-15).
        
        Uses logarithmic scaling to reward experience 
        but with diminishing returns.
        """
        if pd.isna(years) or years <= 0:
            return 0.0
        
        # Log scaling: 15 years+ = max score
        score = 15.0 * np.log1p(years) / np.log1p(15)
        return min(15.0, score)
    
    def _calculate_gender_score(self, senior_gender: str, 
                                caregiver_gender: str) -> float:
        """
        Calculate gender match score (0-5).
        
        Returns 5 if genders match, 0 otherwise.
        """
        if pd.isna(senior_gender) or pd.isna(caregiver_gender):
            return 0.0
        
        return 5.0 if senior_gender == caregiver_gender else 0.0
    
    def _calculate_language_score(self, senior_area: str, 
                                  caregiver_area: str) -> float:
        """
        Calculate language/dialect match score (0-5).
        
        Uses area/district as proxy for Bengali dialect familiarity.
        Same area = 5 points, same district = 2.5 points.
        """
        if pd.isna(senior_area) or pd.isna(caregiver_area):
            return 0.0
        
        # Exact area match
        if senior_area.lower() == caregiver_area.lower():
            return 5.0
        
        # Same general region (partial match)
        senior_parts = senior_area.lower().split()
        caregiver_parts = caregiver_area.lower().split()
        
        if any(part in caregiver_parts for part in senior_parts):
            return 2.5
        
        return 0.0
    
    def _check_availability(self, caregiver_id: str, 
                           booking_date: str, 
                           start_time: str, 
                           duration_hrs: int) -> bool:
        """
        Check if caregiver is available for the requested time slot.
        
        Args:
            caregiver_id: Caregiver UUID
            booking_date: Date in YYYY-MM-DD format
            start_time: Start time in HH:MM:SS format
            duration_hrs: Duration in hours
        
        Returns:
            True if available, False otherwise
        """
        try:
            # Parse requested slot
            req_date = pd.to_datetime(booking_date)
            req_start = pd.to_datetime(f"{booking_date} {start_time}")
            req_end = req_start + timedelta(hours=duration_hrs)
            
            # Get caregiver's bookings on that date
            caregiver_bookings = self.bookings_df[
                (self.bookings_df['caregiver_id'] == caregiver_id) &
                (self.bookings_df['booking_date'] == req_date) &
                (self.bookings_df['status'].isin(['confirmed', 'completed', 'in_progress']))
            ]
            
            # Check for overlaps
            for _, booking in caregiver_bookings.iterrows():
                booking_start = pd.to_datetime(
                    f"{booking['booking_date']} {booking['start_time']}"
                )
                booking_end = booking_start + timedelta(
                    hours=booking['duration_hrs']
                )
                
                # Check overlap
                if (req_start < booking_end and req_end > booking_start):
                    return False
            
            return True
            
        except Exception as e:
            print(f"Warning: Error checking availability: {e}")
            return True  # Assume available if check fails
    
    def match_caregivers(self, 
                        senior_id: str = None,
                        senior_lat: float = None, 
                        senior_lon: float = None,
                        required_skills: List[str] = None,
                        senior_gender: str = None,
                        senior_area: str = None,
                        booking_date: str = None,
                        start_time: str = "09:00:00",
                        duration_hrs: int = 4,
                        top_n: int = 5) -> List[Dict]:
        """
        Find and rank the best matching caregivers for a senior.
        
        Args:
            senior_id: Senior UUID (optional, if provided will look up details)
            senior_lat: Senior's latitude
            senior_lon: Senior's longitude
            required_skills: List of required skills/services
            senior_gender: Senior's gender (for gender matching)
            senior_area: Senior's area (for language/dialect matching)
            booking_date: Desired booking date (YYYY-MM-DD)
            start_time: Desired start time (HH:MM:SS)
            duration_hrs: Booking duration in hours
            top_n: Number of top caregivers to return
        
        Returns:
            List of dictionaries with caregiver details and scores
        """
        # If senior_id provided, look up details
        if senior_id:
            senior = self.seniors_df[
                self.seniors_df['id'] == senior_id
            ].iloc[0]
            
            senior_lat = senior['latitude']
            senior_lon = senior['longitude']
            senior_gender = senior['gender']
            senior_area = senior['area']
            
            # Extract required skills from medical conditions
            if required_skills is None:
                medical_conditions = senior.get('medical_conditions', '')
                if pd.notna(medical_conditions):
                    # Map medical conditions to services
                    condition_to_service = {
                        'ডায়াবেটিস': 'Diabetes Care',
                        'উচ্চ রক্তচাপ': 'Blood Pressure Monitoring',
                        'ডিমেনশিয়া': 'Dementia Care',
                        'পারকিনসন্স': 'Palliative Care',
                        'স্ট্রোক': 'Post-Surgery Care',
                        'আর্থ্রাইটিস': 'Mobility Assistance',
                        'হৃদরোগ': 'Nursing'
                    }
                    
                    conditions = medical_conditions.split('|')
                    required_skills = [
                        condition_to_service.get(c.strip(), 'Personal Care') 
                        for c in conditions
                    ]
                    
                    # Add basic services
                    required_skills.extend([
                        'Personal Care', 
                        'Companionship',
                        'Medication Management'
                    ])
                    required_skills = list(set(required_skills))
        
        # Default values
        if required_skills is None:
            required_skills = ['Personal Care', 'Companionship']
        if booking_date is None:
            booking_date = datetime.now().strftime('%Y-%m-%d')
        
        # Validate coordinates
        if pd.isna(senior_lat) or pd.isna(senior_lon):
            raise ValueError("Senior location coordinates are required")
        
        print(f"\n{'='*60}")
        print(f"Matching caregivers for senior at ({senior_lat}, {senior_lon})")
        print(f"Required skills: {', '.join(required_skills)}")
        print(f"Booking: {booking_date} at {start_time} for {duration_hrs}h")
        print(f"{'='*60}\n")
        
        # Calculate scores for all caregivers
        matches = []
        
        for idx, caregiver in self.caregivers_df.iterrows():
            # Skip if missing location
            if pd.isna(caregiver['latitude']) or pd.isna(caregiver['longitude']):
                continue
            
            # Calculate distance
            distance_km = self.haversine_distance(
                senior_lat, senior_lon,
                caregiver['latitude'], caregiver['longitude']
            )
            
            # Calculate component scores
            distance_score = self._calculate_distance_score(distance_km)
            skill_score = self._calculate_skill_score(required_skills, idx)
            rating_score = self._calculate_rating_score(
                caregiver['average_rating']
            )
            experience_score = self._calculate_experience_score(
                caregiver['experience_years']
            )
            gender_score = self._calculate_gender_score(
                senior_gender, caregiver['gender']
            )
            language_score = self._calculate_language_score(
                senior_area, caregiver['area']
            )
            
            # Calculate total score
            total_score = (
                distance_score + 
                skill_score + 
                rating_score + 
                experience_score + 
                gender_score + 
                language_score
            )
            
            # Check availability
            is_available = self._check_availability(
                caregiver['id'], 
                booking_date, 
                start_time, 
                duration_hrs
            )
            
            # Build result
            match = {
                'caregiver_id': caregiver['id'],
                'name': caregiver['full_name'],
                'distance_km': round(distance_km, 2),
                'total_score': round(total_score, 2),
                'available': is_available,
                'breakdown': {
                    'distance': round(distance_score, 2),
                    'skill': round(skill_score, 2),
                    'rating': round(rating_score, 2),
                    'experience': round(experience_score, 2),
                    'gender': round(gender_score, 2),
                    'language': round(language_score, 2)
                },
                'details': {
                    'phone': caregiver['phone'],
                    'email': caregiver['email'],
                    'experience_years': int(caregiver['experience_years']),
                    'average_rating': round(caregiver['average_rating'], 2),
                    'total_reviews': int(caregiver['total_reviews']),
                    'hourly_rate': int(caregiver['hourly_rate']),
                    'services': caregiver['services'].split('|'),
                    'area': caregiver['area']
                }
            }
            
            # Generate human-readable reason
            reasons = []
            
            if distance_km < 3:
                reasons.append(f"খুব কাছাকাছি ({distance_km:.1f} কিমি)")
            elif distance_km < 10:
                reasons.append(f"কাছাকাছি এলাকায় ({distance_km:.1f} কিমি)")
            
            if skill_score > 20:
                reasons.append("প্রয়োজনীয় দক্ষতা রয়েছে")
            
            if rating_score > 15:
                reasons.append(f"উচ্চ রেটিং ({caregiver['average_rating']:.1f}/5)")
            
            if experience_score > 10:
                reasons.append(f"{int(caregiver['experience_years'])} বছরের অভিজ্ঞতা")
            
            if gender_score > 0:
                reasons.append("জেন্ডার ম্যাচ")
            
            if language_score > 0:
                reasons.append("একই এলাকা")
            
            if not is_available:
                reasons.append("⚠ সময়সূচী দ্বন্দ্ব")
            
            match['reason'] = '; '.join(reasons) if reasons else "ভালো বিকল্প"
            
            matches.append(match)
        
        # Sort by score (descending) and filter available first
        matches.sort(key=lambda x: (x['available'], x['total_score']), 
                    reverse=True)
        
        # Return top N
        return matches[:top_n]
    
    def print_matches(self, matches: List[Dict]):
        """Pretty print matching results."""
        print(f"\n{'='*80}")
        print(f"Top {len(matches)} Caregiver Matches")
        print(f"{'='*80}\n")
        
        for i, match in enumerate(matches, 1):
            status = "[AVAILABLE]" if match['available'] else "[BUSY]"
            
            print(f"{i}. {match['name']} [{status}]")
            print(f"   Score: {match['total_score']:.1f}/100 | Distance: {match['distance_km']} km")
            print(f"   Phone: {match['details']['phone']} | Rate: ৳{match['details']['hourly_rate']}/hr")
            print(f"   Experience: {match['details']['experience_years']} years | "
                  f"Rating: {match['details']['average_rating']}/5 "
                  f"({match['details']['total_reviews']} reviews)")
            
            # Score breakdown
            b = match['breakdown']
            print(f"   Breakdown: Distance={b['distance']:.1f}, Skill={b['skill']:.1f}, "
                  f"Rating={b['rating']:.1f}, Exp={b['experience']:.1f}, "
                  f"Gender={b['gender']:.1f}, Lang={b['language']:.1f}")
            
            print(f"   Reason: {match['reason']}")
            print(f"   Services: {', '.join(match['details']['services'][:5])}...")
            print()


def main():
    """Example usage of the matching algorithm."""
    print("Sheba Caregiver Matching Algorithm")
    print("=" * 80)
    
    # Initialize matcher
    matcher = CaregiverMatcher()
    
    # Example 1: Match by senior ID
    print("\n--- Example 1: Match by Senior ID ---")
    senior_id = matcher.seniors_df.iloc[0]['id']
    
    matches = matcher.match_caregivers(
        senior_id=senior_id,
        booking_date='2025-11-20',
        start_time='10:00:00',
        duration_hrs=4,
        top_n=5
    )
    
    matcher.print_matches(matches)
    
    # Example 2: Match by coordinates and requirements
    print("\n--- Example 2: Match by Coordinates & Requirements ---")
    
    matches = matcher.match_caregivers(
        senior_lat=23.7639,
        senior_lon=90.3709,
        required_skills=['Diabetes Care', 'Medication Management', 'Personal Care'],
        senior_gender='মহিলা',
        senior_area='Mirpur',
        booking_date='2025-11-22',
        start_time='14:00:00',
        duration_hrs=6,
        top_n=5
    )
    
    matcher.print_matches(matches)
    
    # Example 3: Return matches as JSON-like structure
    print("\n--- Example 3: Programmatic Access ---")
    print("First match details:")
    print(f"Caregiver ID: {matches[0]['caregiver_id']}")
    print(f"Total Score: {matches[0]['total_score']}")
    print(f"Available: {matches[0]['available']}")


if __name__ == '__main__':
    import argparse
    import json
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Sheba Caregiver Matching Algorithm')
    parser.add_argument('--senior_id', type=str, help='Senior ID from database')
    parser.add_argument('--senior_lat', type=float, help='Senior latitude')
    parser.add_argument('--senior_lon', type=float, help='Senior longitude')
    parser.add_argument('--required_skills', type=str, help='Comma-separated list of required skills')
    parser.add_argument('--senior_gender', type=str, help='Senior gender preference')
    parser.add_argument('--senior_area', type=str, help='Senior area/location')
    parser.add_argument('--booking_date', type=str, help='Booking date (YYYY-MM-DD)')
    parser.add_argument('--start_time', type=str, help='Start time (HH:MM:SS)')
    parser.add_argument('--duration_hrs', type=int, default=4, help='Duration in hours')
    parser.add_argument('--top_n', type=int, default=5, help='Number of matches to return')
    parser.add_argument('--json', action='store_true', help='Output as JSON')
    parser.add_argument('--stats', action='store_true', help='Get algorithm statistics')
    
    args = parser.parse_args()
    
    # Initialize matcher
    matcher = CaregiverMatcher()
    
    # Handle stats request
    if args.stats:
        stats = {
            'total_seniors': len(matcher.seniors_df),
            'total_caregivers': len(matcher.caregivers_df),
            'total_bookings': len(matcher.bookings_df),
            'algorithm_version': '1.0.0',
            'scoring_weights': {
                'distance': 30,
                'skill': 25,
                'rating': 20,
                'experience': 15,
                'gender': 5,
                'language': 5
            }
        }
        if args.json:
            print(json.dumps(stats, ensure_ascii=False, indent=2))
        else:
            print("\n=== Matching Algorithm Statistics ===")
            for key, value in stats.items():
                print(f"{key}: {value}")
        exit(0)
    
    # Handle matching request
    if args.json:
        # JSON mode for API
        try:
            matches = matcher.match_caregivers(
                senior_id=args.senior_id,
                senior_lat=args.senior_lat,
                senior_lon=args.senior_lon,
                required_skills=args.required_skills.split(',') if args.required_skills else None,
                senior_gender=args.senior_gender,
                senior_area=args.senior_area,
                booking_date=args.booking_date,
                start_time=args.start_time,
                duration_hrs=args.duration_hrs,
                top_n=args.top_n
            )
            
            result = {
                'success': True,
                'matches': matches,
                'total_caregivers': len(matcher.caregivers_df),
                'query': {
                    'senior_id': args.senior_id,
                    'senior_lat': args.senior_lat,
                    'senior_lon': args.senior_lon,
                    'required_skills': args.required_skills.split(',') if args.required_skills else [],
                    'booking_date': args.booking_date,
                    'start_time': args.start_time,
                    'duration_hrs': args.duration_hrs,
                    'top_n': args.top_n
                }
            }
            print(json.dumps(result, ensure_ascii=False, indent=2))
        except Exception as e:
            error_result = {
                'success': False,
                'error': str(e)
            }
            print(json.dumps(error_result, ensure_ascii=False, indent=2))
            exit(1)
    else:
        # Demo mode - run examples
        main()
