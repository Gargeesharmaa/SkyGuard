import torch
import torch.nn as nn
import numpy as np

class LSTMAutoencoder(nn.Module):
    def __init__(self, sequence_length: int = 24, num_features: int = 6, hidden_dim: int = 32, latent_dim: int = 16):
        super(LSTMAutoencoder, self).__init__()
        self.sequence_length = sequence_length
        self.num_features = num_features
        
        # Encoder
        self.encoder_lstm = nn.LSTM(
            input_size=num_features,
            hidden_size=hidden_dim,
            batch_first=True
        )
        self.encoder_linear = nn.Linear(hidden_dim, latent_dim)
        
        # Decoder
        self.decoder_linear = nn.Linear(latent_dim, hidden_dim)
        self.decoder_lstm = nn.LSTM(
            input_size=hidden_dim,
            hidden_size=num_features,
            batch_first=True
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Encode
        _, (hidden, _) = self.encoder_lstm(x)
        latent = torch.relu(self.encoder_linear(hidden[-1]))
        
        # Expand latent state across temporal sequence length
        repeated_latent = latent.unsqueeze(1).repeat(1, self.sequence_length, 1)
        decoded_hidden, _ = self.decoder_lstm(self.decoder_linear(repeated_latent))
        
        return decoded_hidden

class LSTMTemporalDetector:
    def __init__(self, model_path: str = "models/saved_models/lstm_autoencoder.pt"):
        self.model_path = model_path
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = LSTMAutoencoder().to(self.device)

    def compute_reconstruction_error(self, sequence: np.ndarray) -> float:
        """
        Calculates Mean Squared Error (MSE) between original sequence and reconstructed sequence.
        """
        self.model.eval()
        with torch.no_grad():
            tensor_seq = torch.tensor(sequence, dtype=torch.float32).unsqueeze(0).to(self.device)
            reconstructed = self.model(tensor_seq)
            mse = torch.mean((tensor_seq - reconstructed) ** 2).item()
        return float(mse)

    def predict_anomaly(self, sequence: np.ndarray, threshold: float = 0.05) -> tuple[bool, float]:
        """
        Returns a boolean anomaly flag and normalized severity score (0 to 1).
        """
        error = self.compute_reconstruction_error(sequence)
        is_anomaly = error > threshold
        severity_score = min(error / (threshold * 3), 1.0)
        return is_anomaly, round(severity_score, 4)