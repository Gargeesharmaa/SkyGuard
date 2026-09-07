import joblib
import numpy as np
from sklearn.ensemble import IsolationForest

class MultivariateDetector:
    def __init__(self, model_path: str = "models/saved_models/isolation_forest.pkl"):
        self.model_path = model_path
        self.model = IsolationForest(n_estimators=100, contamination=0.02, random_state=42)

    def fit(self, X_train: np.ndarray):
        """Fits the Isolation Forest on clean training features."""
        self.model.fit(X_train)
        joblib.dump(self.model, self.model_path)

    def load_model(self):
        """Loads pre-trained model weights from disk."""
        self.model = joblib.load(self.model_path)

    def predict_point(self, feature_vector: np.ndarray) -> tuple[bool, float]:
        """
        Evaluates a single hourly feature observation.
        Returns anomaly flag and normalized outlier confidence.
        """
        # Feature vector shape: (1, num_features)
        raw_score = self.model.decision_function(feature_vector)[0]
        prediction = self.model.predict(feature_vector)[0]
        
        is_anomaly = True if prediction == -1 else False
        # Convert decision function score to a 0.0 - 1.0 confidence value
        confidence = round(float(np.clip((0.5 - raw_score), 0.0, 1.0)), 4)
        
        return is_anomaly, confidence