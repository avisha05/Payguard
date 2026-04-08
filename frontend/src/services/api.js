const API_BASE_URL = "http://localhost:5000";

export const fetchSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/api/analytics/summary`);
  return response.json();
};

// fetch all transactions
export const fetchTransactions = async () => {
  const response = await fetch("http://localhost:5000/api/transactions");
  return response.json();
};
// fetch fraud transactions
export const fetchFraudTransactions = async () => {
  const response = await fetch("http://localhost:5000/api/analytics/frauds");
  return response.json();
};
export const fetchRiskDistribution = async () => {
  const res = await fetch(
    "http://localhost:5000/api/analytics/risk-distribution",
  );
  return res.json();
};
