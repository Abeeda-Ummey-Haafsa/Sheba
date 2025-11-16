"""
Convert JSON mock data to CSV format for the matching algorithm.
This script reads the JSON files from the mock directory and converts them to CSV.
"""

import json
import pandas as pd
import re
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent.parent
MOCK_DIR = BASE_DIR / 'mock'
DATA_DIR = Path(__file__).parent / 'data' / 'mock'

# Ensure output directory exists
DATA_DIR.mkdir(parents=True, exist_ok=True)


def extract_coordinates_from_location(location_str):
    """
    Extract latitude and longitude from PostGIS POINT format.
    Example: "SRID=4326;POINT(90.37091 23.763455)" -> (23.763455, 90.37091)
    """
    if not location_str or not isinstance(location_str, str):
        return None, None
    
    # Extract coordinates using regex
    match = re.search(r'POINT\(([0-9.]+)\s+([0-9.]+)\)', location_str)
    if match:
        lon, lat = float(match.group(1)), float(match.group(2))
        return lat, lon
    return None, None


def convert_seniors_to_csv():
    """Convert seniors.json to CSV format."""
    print("Converting seniors.json to CSV...")
    
    with open(MOCK_DIR / 'seniors.json', 'r', encoding='utf-8') as f:
        seniors = json.load(f)
    
    # Process seniors data
    processed_seniors = []
    for senior in seniors:
        lat, lon = extract_coordinates_from_location(senior.get('location'))
        
        processed_senior = {
            'id': senior['id'],
            'family_user_id': senior['family_user_id'],
            'name': senior['name'],
            'age': senior['age'],
            'gender': senior['gender'],
            'area': senior['area'],
            'sub_area': senior['sub_area'],
            'address': senior['address'],
            'latitude': lat,
            'longitude': lon,
            'medical_conditions': '|'.join(senior.get('medical_conditions', [])),
            'medication_list': senior.get('medication_list', ''),
            'created_at': senior['created_at']
        }
        processed_seniors.append(processed_senior)
    
    df = pd.DataFrame(processed_seniors)
    output_path = DATA_DIR / 'seniors.csv'
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✓ Saved {len(df)} seniors to {output_path}")
    return df


def convert_caregivers_to_csv():
    """Convert caregivers.json to CSV format."""
    print("Converting caregivers.json to CSV...")
    
    with open(MOCK_DIR / 'caregivers.json', 'r', encoding='utf-8') as f:
        caregivers = json.load(f)
    
    # Process caregivers data
    processed_caregivers = []
    for caregiver in caregivers:
        location = caregiver.get('location', {})
        
        processed_caregiver = {
            'id': caregiver['id'],
            'user_id': caregiver['userId'],
            'full_name': caregiver['fullName'],
            'email': caregiver['email'],
            'phone': caregiver['phone'],
            'nid_number': caregiver['nidNumber'],
            'experience_years': caregiver['experienceYears'],
            'services': '|'.join(caregiver.get('services', [])),
            'district': location.get('district', ''),
            'area': location.get('area', ''),
            'address': location.get('address', ''),
            'latitude': location.get('latitude'),
            'longitude': location.get('longitude'),
            'gender': caregiver['gender'],
            'profile_photo': caregiver.get('profilePhoto', ''),
            'nid_verified': caregiver.get('verification', {}).get('nidVerified', False),
            'background_check_passed': caregiver.get('verification', {}).get('backgroundCheckPassed', False),
            'police_clearance': caregiver.get('verification', {}).get('policeClearance', False),
            'average_rating': caregiver.get('ratings', {}).get('averageRating', 0.0),
            'total_reviews': caregiver.get('ratings', {}).get('totalReviews', 0),
            'hourly_rate': caregiver['hourlyRate'],
            'created_at': caregiver['createdAt']
        }
        processed_caregivers.append(processed_caregiver)
    
    df = pd.DataFrame(processed_caregivers)
    output_path = DATA_DIR / 'caregivers.csv'
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✓ Saved {len(df)} caregivers to {output_path}")
    return df


def convert_bookings_to_csv():
    """Convert bookings.json to CSV format."""
    print("Converting bookings.json to CSV...")
    
    with open(MOCK_DIR / 'bookings.json', 'r', encoding='utf-8') as f:
        bookings = json.load(f)
    
    # Process bookings data
    processed_bookings = []
    for booking in bookings:
        processed_booking = {
            'id': booking['id'],
            'senior_id': booking['senior_id'],
            'caregiver_id': booking['caregiver_id'],
            'booking_date': booking['booking_date'],
            'start_time': booking['start_time'],
            'duration_hrs': booking['duration_hrs'],
            'status': booking['status'],
            'hourly_rate': booking['hourly_rate'],
            'total_amount': booking['total_amount'],
            'notes': booking.get('notes', ''),
            'created_at': booking['created_at'],
            'updated_at': booking['updated_at']
        }
        processed_bookings.append(processed_booking)
    
    df = pd.DataFrame(processed_bookings)
    output_path = DATA_DIR / 'bookings.csv'
    df.to_csv(output_path, index=False, encoding='utf-8')
    print(f"✓ Saved {len(df)} bookings to {output_path}")
    return df


def main():
    """Main conversion function."""
    print("=" * 60)
    print("JSON to CSV Conversion for Sheba Mock Data")
    print("=" * 60)
    
    try:
        seniors_df = convert_seniors_to_csv()
        caregivers_df = convert_caregivers_to_csv()
        bookings_df = convert_bookings_to_csv()
        
        print("\n" + "=" * 60)
        print("Conversion Complete!")
        print("=" * 60)
        print(f"Seniors: {len(seniors_df)} records")
        print(f"Caregivers: {len(caregivers_df)} records")
        print(f"Bookings: {len(bookings_df)} records")
        print(f"\nOutput directory: {DATA_DIR}")
        
    except Exception as e:
        print(f"\n❌ Error during conversion: {e}")
        raise


if __name__ == '__main__':
    main()
