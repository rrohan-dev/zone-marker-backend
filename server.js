const express = require("express");
const cors = require("cors");
const crimeData = require("./bengaluruCrimeData.json");

const app = express();
app.use(cors());

// API endpoint
app.get("/zones", (req, res) => {
  const totalCases = crimeData.reduce(
    (sum, area) => sum + area.harassment_cases,
    0
  );

  const zones = crimeData.map((area) => {
    let zone = "green";

    if (area.harassment_cases > 30) zone = "red";
    else if (area.harassment_cases >= 10) zone = "orange";

    const probability = (
      (area.harassment_cases / totalCases) *
      100
    ).toFixed(2);

    return {
      area: area.area,
      latitude: area.latitude,
      longitude: area.longitude,
      cases: area.harassment_cases,
      zone: zone,
      probability: probability + "%"
    };
  });

  res.json(zones);
});

// Server start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Zone Marker backend running on port ${PORT}`);
});

