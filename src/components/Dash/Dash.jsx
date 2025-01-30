// import { useEffect, useState } from "react";
// import {
//   getTotalClicks,
//   getDateWiseClicks,
//   getDeviceWiseClicks,
// } from "../../services/analyticsApi";
// import styles from "./dash.module.css";

// export default function Dash() {
//   const [totalClicks, setTotalClicks] = useState(0);
//   const [dateWiseClicks, setDateWiseClicks] = useState([]);
//   const [deviceWiseClicks, setDeviceWiseClicks] = useState([]);

//   useEffect(() => {
//     async function fetchData() {
//       const totalClicksData = await getTotalClicks();
//       setTotalClicks(totalClicksData.totalClicks);

//       const dateWiseData = await getDateWiseClicks();
//       dateWiseData.clicksByDate.reverse();
//       const mainData = calculateDateWisePercentage(dateWiseData.clicksByDate);
//       mainData.reverse();
//       setDateWiseClicks(mainData);

//       const deviceWiseData = await getDeviceWiseClicks();
//       setDeviceWiseClicks(
//         calculateDevicePercentages(
//           deviceWiseData.clicksByDevice,
//           totalClicksData.totalClicks
//         )
//       );
//     }

//     fetchData();
//   }, []);

//   console.log(dateWiseClicks);

//   // ✅ Calculate Percentage Increase Correctly for Date-wise Clicks
//   function calculateDateWisePercentage(clicks) {
//     let previousTotal = 0; // Store previous total clicks
//     return clicks.map((click, index) => {
//       const currentTotal = click.clicks + previousTotal; // Add current and previous clicks
//       const percentageIncrease =
//         index === 0 ? 100 : ((currentTotal / previousTotal) * 100).toFixed(2); // Correct calculation
//       previousTotal = currentTotal; // Update previous total for next calculation

//       return {
//         _id: click._id.slice(0, 6) + click._id.slice(8, 10), // Convert `30-01-2025` → `30-01-25`
//         clicks: currentTotal,
//         percentageIncrease,
//       };
//     });
//   }

//   // ✅ Calculate Device Clicks as Percentage of Total Clicks
//   function calculateDevicePercentages(devices, totalClicks) {
//     return devices.map((device) => ({
//       ...device,
//       percentage:
//         totalClicks > 0
//           ? ((device.clicks / totalClicks) * 100).toFixed(2)
//           : "0.00",
//     }));
//   }

//   return (
//     <div className={styles.dashContainer}>
//       <h2 className={styles.totalClicks}>
//         Total Clicks <span>{totalClicks}</span>
//       </h2>

//       <div className={styles.chartsContainer}>
//         {/* Date-wise Clicks Section */}
//         <div className={styles.card}>
//           <h3>Date-wise Clicks</h3>
//           {dateWiseClicks.map((click, index) => (
//             <div key={index} className={styles.barContainer}>
//               <span>{click._id}</span>
//               <div
//                 className={styles.bar}
//                 style={{ width: `${(click.clicks / totalClicks) * 100}%` }}
//               ></div>
//               <span>{click.clicks}</span> <br />
//               <span className={styles.percentage}>
//                 {click.percentageIncrease}%
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Device-wise Clicks Section */}
//         <div className={styles.card}>
//           <h3>Click Devices</h3>
//           {deviceWiseClicks.map((device, index) => (
//             <div key={index} className={styles.barContainer}>
//               <span>{device.deviceType}</span>
//               <div
//                 className={styles.bar}
//                 style={{ width: `${device.percentage}%` }}
//               ></div>
//               <span>{device.clicks}</span> <br />
//               <span className={styles.percentage}>{device.percentage}%</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

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
      dateWiseData.clicksByDate.reverse();
      const mainData = calculateDateWisePercentage(dateWiseData.clicksByDate);
      mainData.reverse();
      setDateWiseClicks(mainData);

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

  // ✅ Calculate Percentage Increase Correctly for Date-wise Clicks
  function calculateDateWisePercentage(clicks) {
    let previousTotal = 0;
    return clicks.map((click, index) => {
      const currentTotal = click.clicks + previousTotal;
      const percentageIncrease =
        index === 0 ? 100 : ((currentTotal / previousTotal) * 100).toFixed(2);
      previousTotal = currentTotal;

      return {
        _id: click._id.slice(0, 6) + click._id.slice(8, 10),
        clicks: currentTotal,
        percentageIncrease,
      };
    });
  }

  // ✅ Calculate Device Clicks as Percentage of Total Clicks
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
                  {click._id}
                </Typography>
                <LinearProgress
                  className={styles.bar}
                  variant="determinate"
                  value={(click.clicks / totalClicks) * 100}
                  sx={{
                    height: 20,
                    backgroundColor: "#f0f0f0",
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
                    // borderRadius: 5,
                    // width: "50%",
                    backgroundColor: "#f0f0f0",
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
