const express = require("express");
const router = express.Router();

const {
  getSummary,
  getFrauds,
  getRiskDistribution,
} = require("../controllers/analyticsController");

router.get("/summary", getSummary);
router.get("/frauds", getFrauds);
router.get("/risk-distribution", getRiskDistribution);

module.exports = router;
