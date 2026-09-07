import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import joblib

class AWSDataPreprocessor:
    def __init__(self, scaler_path: str = "models/saved_models/scaler.pkl"):
        self.scaler_path = scaler_path
        self.scaler = StandardScaler()

    def clean_and_resample(self, df: pd.DataFrame, is_imperial: bool = False) -> pd.DataFrame:
        """
        Parses timestamps, converts units to Metric (°C, hPa, %), and resamples hourly.
        """
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp').set_index('timestamp')
        
        # Imperial unit conversion if IEM ASOS raw feed is used
        if is_imperial:
            if 'temperature_f' in df.columns:
                df['temperature'] = (df['temperature_f'] - 32) * 5 / 9
            if 'pressure_inhg' in df.columns:
                df['pressure'] = df['pressure_inhg'] * 33.8639

        # Filter strictly to required 3 parameters
        df = df[['temperature', 'pressure', 'humidity']]
        
        # Resample to hourly mean to eliminate irregular METAR time steps
        df = df.resample('1h').mean().ffill().bfill()
        return df

    def extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Engineers temporal rate-of-change, rolling statistics, and cross-parameter indices.
        """
        processed_df = df.copy()
        
        # 1. Rate of Change (Spike Detection Helper)
        processed_df['temp_rate'] = processed_df['temperature'].diff().fillna(0)
        processed_df['pressure_rate'] = processed_df['pressure'].diff().fillna(0)
        
        # 2. Moving Window Statistics (Frozen Value & Drift Helper)
        processed_df['temp_roll_std_3h'] = processed_df['temperature'].rolling(3, min_periods=1).std().fillna(0)
        processed_df['humidity_roll_mean_6h'] = processed_df['humidity'].rolling(6, min_periods=1).mean()
        
        # 3. Derived Parameter Ratios (Multivariate Consistency)
        processed_df['temp_pressure_ratio'] = processed_df['temperature'] / (processed_df['pressure'] + 1e-5)
        
        return processed_df

    def fit_transform_scaler(self, df: pd.DataFrame) -> np.ndarray:
        """Fits standard scaler on clean features and saves the weights."""
        scaled_data = self.scaler.fit_transform(df)
        joblib.dump(self.scaler, self.scaler_path)
        return scaled_data

    def transform_scaler(self, df: pd.DataFrame) -> np.ndarray:
        """Transforms runtime features using pre-saved scaler weights."""
        scaler = joblib.load(self.scaler_path)
        return scaler.transform(df)