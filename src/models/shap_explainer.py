import shap
import numpy as np
import pandas as pd

class AnomalyExplainer:
    def __init__(self, model, feature_names: list[str]):
        self.feature_names = feature_names
        # Create tree explainer for tree-based multivariate isolation models
        self.explainer = shap.TreeExplainer(model)

    def explain_instance(self, feature_vector: np.ndarray) -> dict:
        """
        Calculates SHAP values for an anomalous data point.
        Returns feature contribution rankings.
        """
        shap_values = self.explainer.shap_values(feature_vector)
        
        # For single 2D vector input (1, num_features)
        if isinstance(shap_values, list):
            contributions = np.abs(shap_values[0][0])
        else:
            contributions = np.abs(shap_values[0])

        total_impact = np.sum(contributions) + 1e-6
        normalized_contributions = contributions / total_impact

        explanation_dict = {}
        for idx, feature in enumerate(self.feature_names):
            explanation_dict[feature] = round(float(normalized_contributions[idx]), 4)

        # Sort features by highest impact
        sorted_explanations = dict(sorted(explanation_dict.items(), key=lambda item: item[1], reverse=True))
        return sorted_explanations