import axios from "axios";

export const checkFraud = async (features) => {
  try {
    const response = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      { features },
      { timeout: 5000 }
    );
    return response.data;

  } catch (error) {
    // ML service down → don't block payment
    // Return safe defaults + fallback flag
    console.error("ML service unavailable:", error.message);
    return {
      risk_score: 0,
      is_fraud: false,
      reasons: [],
      fallback: true,
    };
  }
};