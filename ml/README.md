# Sheba Caregiver Matching Algorithm

**Intelligent caregiver-senior matching engine using ML techniques**

## Overview

This module implements Sheba's core matching algorithm that intelligently pairs seniors with the most suitable caregivers based on multiple weighted factors including location, skills, experience, ratings, and availability.

## Features

### 🎯 Multi-Factor Scoring (0-100 points)

- **30%** - Distance (Haversine formula, closer = better)
- **25%** - Skill Similarity (Cosine similarity of skill vectors)
- **20%** - Rating (0-5 star rating scaled)
- **15%** - Years of Experience (logarithmic scaling)
- **5%** - Gender Match (optional preference)
- **5%** - Language/Dialect Match (area-based)

### 📍 Location Intelligence

- Precise GPS distance calculation using Haversine formula
- Exponential decay scoring (10km half-life)
- Real-time distance-based filtering

### 🧠 Skill Matching

- One-hot encoding of caregiver skills
- Cosine similarity for semantic skill matching
- Multi-skill requirement support

### 📅 Availability Checking

- Conflict detection with existing bookings
- Time slot overlap validation
- Real-time availability status

## Quick Start

### 1. Install Dependencies

```bash
cd ml
pip install -r requirements.txt
```

### 2. Convert Mock Data to CSV

```bash
python convert_json_to_csv.py
```

This will create:

- `data/mock/seniors.csv` (with GPS coordinates)
- `data/mock/caregivers.csv` (with skills and location)
- `data/mock/bookings.csv` (for availability checking)

### 3. Run the Matching Algorithm

```python
from matching_algorithm import CaregiverMatcher

# Initialize
matcher = CaregiverMatcher()

# Match by senior ID
matches = matcher.match_caregivers(
    senior_id="c4841607-921d-4c6c-ad32-cabea4d700ec",
    booking_date='2025-11-20',
    start_time='10:00:00',
    duration_hrs=4,
    top_n=5
)

# Print results
matcher.print_matches(matches)
```

### 4. Or Run the Demo

```bash
python matching_algorithm.py
```

## API Reference

### `CaregiverMatcher` Class

#### `__init__(data_dir: str = None)`

Initialize the matcher with CSV data.

#### `match_caregivers(...)` → `List[Dict]`

**Parameters:**

- `senior_id` (str, optional): Senior UUID - auto-loads details
- `senior_lat` (float): Senior's latitude
- `senior_lon` (float): Senior's longitude
- `required_skills` (List[str]): Required services/skills
- `senior_gender` (str): For gender matching
- `senior_area` (str): For language/dialect matching
- `booking_date` (str): Format: 'YYYY-MM-DD'
- `start_time` (str): Format: 'HH:MM:SS'
- `duration_hrs` (int): Booking duration
- `top_n` (int): Number of matches to return (default: 5)

**Returns:**

```python
[
    {
        "caregiver_id": "uuid-string",
        "name": "রুমানা খান",
        "distance_km": 2.34,
        "total_score": 87.5,
        "available": True,
        "breakdown": {
            "distance": 28.5,
            "skill": 22.0,
            "rating": 18.0,
            "experience": 12.5,
            "gender": 5.0,
            "language": 5.0
        },
        "details": {
            "phone": "+8801234567890",
            "email": "caregiver@example.com",
            "experience_years": 8,
            "average_rating": 4.5,
            "total_reviews": 120,
            "hourly_rate": 500,
            "services": ["Diabetes Care", "Personal Care", ...],
            "area": "Mirpur"
        },
        "reason": "খুব কাছাকাছি (2.3 কিমি); প্রয়োজনীয় দক্ষতা রয়েছে; উচ্চ রেটিং (4.5/5)"
    },
    ...
]
```

## Algorithm Details

### Distance Calculation (Haversine)

```python
distance_km = haversine_distance(senior_lat, senior_lon, caregiver_lat, caregiver_lon)
distance_score = 30 * exp(-distance / 10)  # Exponential decay
```

- 0 km → 30 points
- 5 km → ~18 points
- 10 km → ~11 points
- 20 km → ~4 points

### Skill Matching (Cosine Similarity)

1. Create one-hot vectors for all services
2. Senior requirements → vector A
3. Caregiver skills → vector B
4. Cosine similarity: `cos(θ) = (A·B) / (||A|| ||B||)`
5. Scale to 0-25 points

### Experience Scoring (Logarithmic)

```python
experience_score = 15 * log(1 + years) / log(1 + 15)
```

- 1 year → 4.9 points
- 5 years → 10.2 points
- 10 years → 13.2 points
- 15+ years → 15 points (max)

### Availability Check

1. Parse requested time slot
2. Query bookings for caregiver on that date
3. Check for overlaps with existing bookings
4. Return `True` only if no conflicts

## Data Format

### seniors.csv

```csv
id,name,latitude,longitude,gender,area,medical_conditions,...
uuid,বেগম খাতুন,23.7635,90.3709,মহিলা,mirpur,ডায়াবেটিস|আর্থ্রাইটিস,...
```

### caregivers.csv

```csv
id,full_name,latitude,longitude,services,experience_years,average_rating,...
uuid,রুমানা খান,23.7656,90.3721,Diabetes Care|Personal Care|...,8,4.5,...
```

### bookings.csv

```csv
id,caregiver_id,booking_date,start_time,duration_hrs,status,...
uuid,caregiver-uuid,2025-11-20,10:00:00,4,confirmed,...
```

## Examples

### Example 1: Simple Match by ID

```python
matcher = CaregiverMatcher()
matches = matcher.match_caregivers(
    senior_id="c4841607-921d-4c6c-ad32-cabea4d700ec"
)
```

### Example 2: Custom Requirements

```python
matches = matcher.match_caregivers(
    senior_lat=23.7639,
    senior_lon=90.3709,
    required_skills=[
        'Diabetes Care',
        'Medication Management',
        'Blood Pressure Monitoring'
    ],
    senior_gender='মহিলা',
    senior_area='Mirpur',
    booking_date='2025-11-22',
    start_time='14:00:00',
    duration_hrs=6,
    top_n=10
)
```

### Example 3: Access Match Data Programmatically

```python
for match in matches:
    if match['available'] and match['total_score'] > 80:
        print(f"Excellent match: {match['name']}")
        print(f"  Call: {match['details']['phone']}")
        print(f"  Rate: ৳{match['details']['hourly_rate']}/hr")
```

## Performance

- **Load Time**: ~1-2 seconds for 100+ caregivers
- **Match Time**: ~50-100ms per senior
- **Memory**: ~50MB for full dataset

## Testing

Run the built-in tests:

```bash
python matching_algorithm.py
```

This will demonstrate:

1. Matching by senior ID
2. Matching by coordinates and requirements
3. Programmatic data access

## Customization

### Adjust Scoring Weights

Edit the `WEIGHTS` dictionary in `CaregiverMatcher`:

```python
WEIGHTS = {
    'distance': 0.40,    # Increase distance importance
    'skill': 0.25,
    'rating': 0.15,      # Decrease rating importance
    'experience': 0.15,
    'gender': 0.05,
    'language': 0.00     # Disable language matching
}
```

### Add New Scoring Factors

1. Add new method: `_calculate_new_score()`
2. Update composite score calculation
3. Add to breakdown dictionary
4. Update weights to sum to 100

## Troubleshooting

### CSV files not found

```bash
python convert_json_to_csv.py
```

### Import errors

```bash
pip install -r requirements.txt
```

### No matches returned

- Check if caregivers have valid GPS coordinates
- Verify senior location is within reasonable distance
- Try increasing `top_n` parameter

## License

Part of the Sheba senior care platform.

## Contact

For questions or issues, contact the Sheba development team.
