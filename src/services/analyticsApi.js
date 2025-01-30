// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://linkmanager-backend-60mk.onrender.com";

export const getAnalysisRecords = async ({
  page = 1,
  limit = 10,
  sortBy = "dateClicked",
  order = "desc",
} = {}) => {
  const params = new URLSearchParams({
    page,
    limit,
    sortBy,
    order,
  });

  try {
    const response = await fetch(`${BASE_URL}/all/links?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"), // Pass the JWT token
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching analysis records:", error.message);
    throw error;
  }
};

// Fetch Total Clicks
export const getTotalClicks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/clicks/total-clicks`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (!response.ok) throw new Error("Failed to fetch total clicks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching total clicks:", error);
    return { totalClicks: 0 };
  }
};

// Fetch Date-wise Clicks (Last 4 Dates with Clicks)
export const getDateWiseClicks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/date/date-wise-clicks`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (!response.ok) throw new Error("Failed to fetch date-wise clicks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching date-wise clicks:", error);
    return { clicksByDate: [] };
  }
};

// Fetch Device-wise Clicks (Desktop, Tablet, Mobile)
export const getDeviceWiseClicks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/device/device-wise-clicks`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    if (!response.ok) throw new Error("Failed to fetch device-wise clicks");
    return await response.json();
  } catch (error) {
    console.error("Error fetching device-wise clicks:", error);
    return { clicksByDevice: [] };
  }
};

// // Fetch Total Clicks
// export const getTotalClicks = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/clicks/total-clicks`, {
//       method: "GET",
//       headers: {
//         Authorization: localStorage.getItem("token"),
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch total clicks");
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching total clicks:", error);
//     return { totalClicks: 0 };
//   }
// };

// // Fetch Date-wise Clicks and Calculate Growth Percentage
// export const getDateWiseClicks = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/date/date-wise-clicks`, {
//       method: "GET",
//       headers: {
//         Authorization: localStorage.getItem("token"),
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch date-wise clicks");
//     const data = await response.json();

//     // Reverse accumulate clicks for percentage increase calculation
//     let cumulativeClicks = 0;
//     const formattedClicks = data.clicksByDate.map((entry, index) => {
//       cumulativeClicks += entry.clicks;
//       const prevClicks = index > 0 ? data.clicksByDate[index - 1].clicks : 0;
//       const percentageIncrease =
//         prevClicks > 0 ? ((entry.clicks / prevClicks) * 100).toFixed(2) : 100;
//       return {
//         date: entry._id.split("-").reverse().join("-"), // Convert DD-MM-YYYY → YYYY-MM-DD
//         clicks: cumulativeClicks,
//         percentageIncrease,
//       };
//     });

//     return { formattedClicks };
//   } catch (error) {
//     console.error("Error fetching date-wise clicks:", error);
//     return { formattedClicks: [] };
//   }
// };

// // Fetch Device-wise Clicks with Percentage Calculation
// export const getDeviceWiseClicks = async (totalClicks) => {
//   try {
//     const response = await fetch(`${BASE_URL}/device/device-wise-clicks`, {
//       method: "GET",
//       headers: {
//         Authorization: localStorage.getItem("token"),
//       },
//     });

//     if (!response.ok) throw new Error("Failed to fetch device-wise clicks");
//     const data = await response.json();

//     // Calculate percentage for each device type
//     const clicksByDevice = data.clicksByDevice.map((device) => ({
//       deviceType: device.deviceType,
//       clicks: device.clicks,
//       percentage:
//         totalClicks > 0 ? ((device.clicks / totalClicks) * 100).toFixed(2) : 0,
//     }));

//     return { clicksByDevice };
//   } catch (error) {
//     console.error("Error fetching device-wise clicks:", error);
//     return { clicksByDevice: [] };
//   }
// };
