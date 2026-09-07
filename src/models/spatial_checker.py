import numpy as np

class SpatialConsistencyChecker:
    def __init__(self, temp_threshold: float = 3.5, pressure_threshold: float = 2.0):
        self.temp_threshold = temp_threshold
        self.pressure_threshold = pressure_threshold

    def evaluate_spatial_consistency(self, station_data: dict, neighbor_stations: list[dict]) -> tuple[bool, str]:
        """
        Compares target station against surrounding station averages.
        Returns:
            - is_spatial_anomaly (bool)
            - classification ('REAL_WEATHER_EVENT' or 'SENSOR_FAULT')
        """
        if not neighbor_stations:
            return False, "NO_NEIGHBOR_DATA"

        avg_neighbor_temp = np.mean([n["temperature"] for n in neighbor_stations])
        avg_neighbor_pressure = np.mean([n["pressure"] for n in neighbor_stations])

        temp_diff = abs(station_data["temperature"] - avg_neighbor_temp)
        pressure_diff = abs(station_data["pressure"] - avg_neighbor_pressure)

        # Check if local observation deviates significantly from surrounding network
        temp_isolated = temp_diff > self.temp_threshold
        pressure_isolated = pressure_diff > self.pressure_threshold

        if temp_isolated or pressure_isolated:
            return True, "SENSOR_FAULT"
        else:
            return False, "REAL_WEATHER_EVENT"