import requests
import json

def get_osm_labs(lat, lon, radius=10000):
    overpass_url = "https://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json][timeout:25];
    (
      node["healthcare"="laboratory"](around:{radius},{lat},{lon});
      way["healthcare"="laboratory"](around:{radius},{lat},{lon});
      relation["healthcare"="laboratory"](around:{radius},{lat},{lon});
      node["amenity"="laboratory"](around:{radius},{lat},{lon});
      way["amenity"="laboratory"](around:{radius},{lat},{lon});
      relation["amenity"="laboratory"](around:{radius},{lat},{lon});
    );
    out center;
    """
    print(f"Querying Overpass API for labs within {radius}m of {lat}, {lon}...")
    try:
        response = requests.get(overpass_url, params={'data': overpass_query})
        response.raise_for_status()
        data = response.json()
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []
    
    print(f"Found {len(data.get('elements', []))} elements.")
    labs = []
    for element in data.get('elements', []):
        tags = element.get('tags', {})
        name = tags.get('name') or tags.get('operator') or "Unknown Laboratory"
        
        # Get location
        el_lat = element.get('lat') or element.get('center', {}).get('lat')
        el_lon = element.get('lon') or element.get('center', {}).get('lon')
        
        # Address parts
        street = tags.get('addr:street', '')
        city = tags.get('addr:city', tags.get('addr:suburb', tags.get('addr:district', '')))
        
        location = f"{street}, {city}".strip(', ')
        if not location:
            full_addr = tags.get('addr:full') or tags.get('address')
            if full_addr:
                location = full_addr
            else:
                location = f"{el_lat}, {el_lon}"
            
        labs.append({
            "name": name,
            "location": location,
            "lat": el_lat,
            "lon": el_lon
        })
    return labs

if __name__ == "__main__":
    # Kanjirappally coordinates
    lat, lon = 9.5586, 76.7915
    labs = get_osm_labs(lat, lon)
    
    if not labs:
        print("\nChecking wider area (30km)...")
        labs = get_osm_labs(lat, lon, radius=30000)

    with open("osm_labs_list.txt", "w", encoding="utf-8") as f:
        f.write("List of Lab Names with Locations from OSM\n")
        f.write("=" * 50 + "\n")
        for i, lab in enumerate(labs, 1):
            f.write(f"{i}. Name: {lab['name']}\n")
            f.write(f"   Location: {lab['location']}\n")
            f.write(f"   Coords: {lab['lat']}, {lab['lon']}\n")
            f.write("-" * 50 + "\n")
    
    print(f"Results written to osm_labs_list.txt. Found {len(labs)} labs.")
