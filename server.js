// server.js
const express = require("express");
const cors = require("cors");
const crimeData = require("./bengaluruCrimeData.json");

const app = express();
app.use(cors());

// Helper function to calculate risk score
function calculateRisk(area) {
  const estimated_unreported = area.registered_cases * area.unreported_factor;
  const total_cases = area.registered_cases + estimated_unreported;

  // Risk score formula (0-100)
  let riskScore = area.registered_cases * 1 + estimated_unreported * 0.7;
  riskScore = Math.min(100, Math.round(riskScore));

  let zone = "green";
  if (riskScore > 60) zone = "red";
  else if (riskScore > 30) zone = "orange";

  return {
    zone_name: area.zone_name,
    lat: area.lat,
    lng: area.lng,
    registered: area.registered_cases,
    unreported_est: estimated_unreported,
    total_cases: total_cases,
    risk_score: riskScore,
    zone: zone
  };
}

// API endpoint
app.get("/zones", (req, res) => {
  const zones = crimeData.map(area => calculateRisk(area));
  res.json(zones);
});

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Zone Marker backend running on port ${PORT}`);
});

