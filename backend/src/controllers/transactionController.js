const Transaction = require("mongoose").model("Transaction");

// CREATE transaction
exports.createTransaction = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    let riskScore = 0;
    let isFraud = false;
    let fraudReason = "";

    if (amount > 10000) {
      riskScore += 50;
      fraudReason += "High amount; ";
    }

    if (paymentMethod === "CRYPTO") {
      riskScore += 50;
      fraudReason += "Crypto payment; ";
    }

    if (riskScore >= 70) {
      isFraud = true;
    }

    const transaction = await Transaction.create({
      ...req.body,
      riskScore,
      isFraud,
      fraudReason,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
