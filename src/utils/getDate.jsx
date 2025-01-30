/**
 * Formats the current date into "Sun, Jan 26" format based on Indian Standard Time.
 * @returns {string} - Formatted date string.
 */
export default function getDate() {
  const options = {
    weekday: "short", // Abbreviated day (e.g., "Sun")
    month: "short", // Abbreviated month (e.g., "Jan")
    day: "numeric", // Day of the month (e.g., "26")
    timeZone: "Asia/Kolkata", // Set to Indian Standard Time
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    new Date()
  );
  return formattedDate;
}
