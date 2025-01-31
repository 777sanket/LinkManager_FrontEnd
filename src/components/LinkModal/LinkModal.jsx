import { useState, useEffect } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for Portals
import { Close, DateTime } from "../../utils/getDashboardImg";
import { createLink, editLink } from "../../services/linkApi";
import styles from "./linkModal.module.css";

export default function LinkModal({
  isOpen,
  heading,
  btnHeading,
  onClose,
  linkData,
  refreshLinks,
}) {
  const [originalLink, setOriginalLink] = useState("");
  const [remark, setRemark] = useState("");
  const [clear, setClear] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [showDateTime, setShowDateTime] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [formattedDateTime, setFormattedDateTime] = useState("");
  const [loading, setLoading] = useState(false);

  // Pre-fill modal if editing
  useEffect(() => {
    if (linkData) {
      setOriginalLink(linkData.originalLink || "");
      setRemark(linkData.remark || "");
      if (linkData.expirationTime) {
        const [preDate, preTime] = linkData.expirationTime.split("T");
        setIsToggled(true);
        setDate(preDate);
        setTime(preTime);
      }
    }
  }, [linkData]);

  if (!isOpen) return null;

  const handleToggleChange = () => {
    setShowDateTime(false);
    setIsToggled(!isToggled);
  };

  const handleIconClick = () => {
    setShowDateTime(!showDateTime);
  };

  const handleClear = (e) => {
    e.preventDefault();
    setOriginalLink("");
    setRemark("");
    setDate("");
    setTime("");
    setClear("");
    setShowDateTime(false);
    setFormattedDateTime("");
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
    formatDateTime(e.target.value, time);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    formatDateTime(date, e.target.value);
  };

  const formatDateTime = (selectedDate, selectedTime) => {
    if (selectedDate && selectedTime) {
      const dateObj = new Date(`${selectedDate}T${selectedTime}`);
      const options = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      setFormattedDateTime(
        new Intl.DateTimeFormat("en-US", options).format(dateObj)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const expirationTime = isToggled ? `${date}T${time}` : null;

    const data = {
      originalLink,
      remark,
      expirationTime,
    };

    try {
      const response = linkData
        ? await editLink(linkData.id, data)
        : await createLink(data);
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert(
          linkData ? "Link updated successfully" : "Link created successfully"
        );
        setOriginalLink("");
        setRemark("");
        setDate("");
        setTime("");
        setFormattedDateTime("");
        setIsToggled(false);
        refreshLinks();
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error creating link:", error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // The modal content
  const modalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <div className={styles.headingText}>{heading}</div>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src={Close} alt="close" />
          </button>
        </div>

        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <div className={styles.inputContainer}>
              <label htmlFor="link">
                Destination Url <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="link"
                name="link"
                value={originalLink}
                onChange={(e) => setOriginalLink(e.target.value)}
                placeholder="https://web.whatsapp.com/"
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="description">
                Remarks <span style={{ color: "red" }}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.toggleContainer}>
                <div className={styles.toggleText}>Link expiration</div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={isToggled}
                    onChange={handleToggleChange}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              {isToggled && (
                <div className={styles.formattedDateTime}>
                  {formattedDateTime ? formattedDateTime : "Select Date & Time"}
                  <img onClick={handleIconClick} src={DateTime} alt="" />
                </div>
              )}

              {showDateTime && (
                <div className={styles.dateTimeContainer}>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className={styles.dateInput}
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={handleTimeChange}
                    className={styles.timeInput}
                  />
                </div>
              )}
            </div>
          </div>

          <div className={styles.btnContainer}>
            <button onClick={handleClear} className={styles.clearBtn}>
              Clear
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {btnHeading}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
