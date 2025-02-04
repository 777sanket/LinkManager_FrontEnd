import { useEffect, useState } from "react";
import {
  getTotalClicks,
  getDateWiseClicks,
  getDeviceWiseClicks,
} from "../../services/analyticsApi";
import { LinearProgress, Box, Typography } from "@mui/material";
import styles from "./dash.module.css";

export default function Dash() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const totalClicksData = await getTotalClicks();
      setTotalClicks(totalClicksData.totalClicks);

      const dateWiseData = await getDateWiseClicks();
      const array1 = dateWiseData.clicksByDate;
      setDateWiseClicks(array1);

      const deviceWiseData = await getDeviceWiseClicks();
      setDeviceWiseClicks(
        calculateDevicePercentages(
          deviceWiseData.clicksByDevice,
          totalClicksData.totalClicks
        )
      );
    }

    fetchData();
  }, []);

  function calculateDevicePercentages(devices, totalClicks) {
    return devices.map((device) => ({
      ...device,
      percentage:
        totalClicks > 0
          ? ((device.clicks / totalClicks) * 100).toFixed(2)
          : "0.00",
    }));
  }

  return (
    <div className={styles.dashContainer}>
      <div className={styles.content}>
        <div className={styles.totalClicks}>
          Total Clicks
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span
            style={{
              color: "#1B48DA",
            }}
          >
            {totalClicks}
          </span>
        </div>
        <div className={styles.chartsContainer}>
          {/* Date-wise Clicks Section */}
          <div className={styles.card}>
            <div className={styles.chartHeading}>Date-wise Clicks</div>
            {dateWiseClicks.map((click, index) => (
              <Box key={index} className={styles.barContainer}>
                <Typography
                  className={styles.dateC}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  variant="body2"
                >
                  {click._id.slice(0, 6) + click._id.slice(8, 10)}
                </Typography>
                <LinearProgress
                  className={styles.bar}
                  variant="determinate"
                  value={(click.clicks / totalClicks) * 95}
                  sx={{
                    height: 20,
                    backgroundColor: "white",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#1E40AF" },
                  }}
                />
                <Typography
                  className={styles.numberC}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  variant="body2"
                >
                  {click.clicks}
                </Typography>
              </Box>
            ))}
          </div>
          {/* Device-wise Clicks Section */}
          <div className={styles.card}>
            <div className={styles.chartHeading}>Click Devices</div>
            {deviceWiseClicks.map((device, index) => (
              <Box key={index} className={styles.barContainer}>
                <Typography
                  className={styles.dateC}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  variant="body2"
                >
                  {device.deviceType}
                </Typography>
                <LinearProgress
                  className={styles.bar}
                  variant="determinate"
                  value={device.percentage}
                  sx={{
                    height: 20,
                    backgroundColor: "white",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#1E40AF" },
                  }}
                />
                <Typography
                  className={styles.numberC}
                  sx={{
                    fontSize: "1rem",
                    fontWeight: "600",
                  }}
                  variant="body2"
                >
                  {device.clicks}
                </Typography>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
