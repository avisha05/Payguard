const calculateRisk = (transaction) => {
  let riskScore = 0;
  let reasons = [];

  if (transaction.amount > 50000) {
    riskScore += 40;
    reasons.push("High transaction amount");
  }

  if (transaction.deviceType === "New") {
    riskScore += 30;
    reasons.push("New device used");
  }

  if (transaction.location === "Unknown") {
    riskScore += 30;
    reasons.push("Suspicious location");
  }

  return {
    riskScore,
    isFraud: riskScore >= 70,
    fraudReason: reasons.join(", "),
  };
};

module.exports = calculateRisk;
