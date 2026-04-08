const Transaction = require("../models/Transaction");

// Summary analytics
exports.getSummary = async (req, res) => {
  try {
    const total = await Transaction.countDocuments();
    const fraud = await Transaction.countDocuments({ isFraud: true });
    const safe = total - fraud;

    const fraudPercentage =
      total === 0 ? 0 : ((fraud / total) * 100).toFixed(2);

    res.json({
      total,
      fraud,
      safe,
      fraudPercentage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fraud transactions
exports.getFrauds = async (req, res) => {
  try {
    const frauds = await Transaction.find({ isFraud: true }).sort({
      createdAt: -1,
    });

    res.json(frauds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Risk distribution
exports.getRiskDistribution = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $bucket: {
          groupBy: "$riskScore",
          boundaries: [0, 30, 70, 100],
          default: "High",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
