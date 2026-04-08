require("dotenv").config();
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");

const seedTransactions = [
  {
    transactionId: "TXN1001",
    userId: "USER01",
    amount: 1500,
    currency: "INR",
    paymentMethod: "UPI",
    status: "SUCCESS",
    ipAddress: "192.168.1.10",
    deviceType: "Mobile",
    location: "Mumbai, IN",
    riskScore: 0,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN1002",
    userId: "USER01",
    amount: 3200,
    currency: "INR",
    paymentMethod: "CARD",
    status: "SUCCESS",
    ipAddress: "192.168.1.10",
    deviceType: "Desktop",
    location: "Mumbai, IN",
    riskScore: 10,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN2001",
    userId: "USER02",
    amount: 8500,
    currency: "INR",
    paymentMethod: "NETBANKING",
    status: "SUCCESS",
    ipAddress: "10.0.0.5",
    deviceType: "Desktop",
    location: "Delhi, IN",
    riskScore: 20,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN3001",
    userId: "USER03",
    amount: 15000,
    currency: "INR",
    paymentMethod: "CRYPTO",
    status: "SUCCESS",
    ipAddress: "45.33.32.156",
    deviceType: "Mobile",
    location: "Unknown",
    riskScore: 100,
    isFraud: true,
    fraudReason: "High-risk crypto transaction from unknown location",
  },
  {
    transactionId: "TXN3002",
    userId: "USER03",
    amount: 22000,
    currency: "INR",
    paymentMethod: "CRYPTO",
    status: "FAILED",
    ipAddress: "45.33.32.156",
    deviceType: "Mobile",
    location: "Unknown",
    riskScore: 100,
    isFraud: true,
    fraudReason: "Repeated high-value crypto attempt from flagged IP",
  },
  {
    transactionId: "TXN4001",
    userId: "USER04",
    amount: 500,
    currency: "INR",
    paymentMethod: "UPI",
    status: "SUCCESS",
    ipAddress: "103.21.244.0",
    deviceType: "Mobile",
    location: "Bangalore, IN",
    riskScore: 5,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN4002",
    userId: "USER04",
    amount: 950,
    currency: "INR",
    paymentMethod: "UPI",
    status: "PENDING",
    ipAddress: "103.21.244.0",
    deviceType: "Mobile",
    location: "Bangalore, IN",
    riskScore: 15,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN5001",
    userId: "USER05",
    amount: 75000,
    currency: "INR",
    paymentMethod: "CARD",
    status: "SUCCESS",
    ipAddress: "198.51.100.22",
    deviceType: "Desktop",
    location: "Hyderabad, IN",
    riskScore: 85,
    isFraud: true,
    fraudReason: "Unusual high-value transaction, velocity anomaly detected",
  },
  {
    transactionId: "TXN6001",
    userId: "USER02",
    amount: 4100,
    currency: "INR",
    paymentMethod: "NETBANKING",
    status: "SUCCESS",
    ipAddress: "10.0.0.5",
    deviceType: "Desktop",
    location: "Delhi, IN",
    riskScore: 18,
    isFraud: false,
    fraudReason: "",
  },
  {
    transactionId: "TXN7001",
    userId: "USER06",
    amount: 1200,
    currency: "INR",
    paymentMethod: "UPI",
    status: "SUCCESS",
    ipAddress: "172.16.0.3",
    deviceType: "Mobile",
    location: "Pune, IN",
    riskScore: 0,
    isFraud: false,
    fraudReason: "",
  },
];

const seed = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/payguard";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    await Transaction.deleteMany({});
    console.log("Cleared existing transactions");

    await Transaction.insertMany(seedTransactions);
    console.log(`Seeded ${seedTransactions.length} transactions successfully`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();
