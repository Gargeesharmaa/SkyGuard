import requests
import pandas as pd
from datetime import datetime

def fetch_open_meteo_baseline(lat: float = 26.4499, lon: float = 74.6399, start_date: str = "2024-01-01", end_date: str = "2024-12-31")-> pd.DataFrame:
    """
    Fetches the Open Metro Baseline data for a given latitude and longitude within a specified date range.

    Args:
        lat (float): Latitude of the location.
        lon (float): Longitude of the location.
        start_date (str): Start date in 'YYYY-MM-DD' format.
        end_date (str): End date in 'YYYY-MM-DD' format.

    Returns:
        pd.DataFrame: A DataFrame containing the fetched data.
    """
    url ="https://archive-api.open-meteo.com/v1/archive"
    params ={
        "latitude": lat,
        "longitude": lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": ["temperature_2m", "relative_humidity_2m", "surface_pressure"]
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()

    hourly_data = data["hourly"]
    df = pd.DataFrame(
        {
            "timestamp": hourly_data["time"],
            "temperature_2m": hourly_data["temperature_2m"],
            "humidity_2m": hourly_data["relative_humidity_2m"],
            "pressure": hourly_data["surface_pressure"]
        }
    )

    return df

if __name__ == "__main__":
    print("fetching 1-year Baseline weather data from Open-Meteo...")
    df_clean = fetch_open_meteo_baseline()
    df_clean.to_csv("data/raw/open_meteo_baseline.csv", index=False)
    print(f"Saved {len(df_clean)} records to data/raw/open_meteo_baseline.csv")