"""
EcoSphere (VerdantIQ) GIS & Spatial Intelligence Engine
Handles GeoJSON 2dsphere spatial calculations, geofence bounds, and OpenStreetMap coordinate helpers.
"""

import math

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Computes distance in meters between two GPS coordinates using the Haversine formula.
    """
    R = 6371000  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2) + math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

    return round(R * c, 2)


def create_geojson_point(longitude: float, latitude: float, address: str = ""):
    """
    Formats a GeoJSON Point object compatible with MongoDB 2dsphere indexing.
    """
    return {
        "type": "Point",
        "coordinates": [longitude, latitude],
        "properties": {
            "address": address,
            "geotaggedAt": "ISO-8601 UTC",
        }
    }


def is_within_campus_geofence(
    point_lat: float,
    point_lon: float,
    center_lat: float = 12.9716,
    center_lon: float = 77.5946,
    radius_meters: float = 2500.0
) -> bool:
    """
    Checks if a tree or activity log falls within an institutional campus geofence.
    """
    dist = calculate_haversine_distance(point_lat, point_lon, center_lat, center_lon)
    return dist <= radius_meters
