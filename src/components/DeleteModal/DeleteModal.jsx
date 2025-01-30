import { useState } from "react";
import ReactDOM from "react-dom";
import { Close2 } from "../../utils/getDashboardImg";
import styles from "./deleteModal.module.css";

export default function DeleteModal({ isOpen, heading, onConfirm, onCancel }) {
  const [selectedButton, setSelectedButton] = useState("No"); // Default selection

  if (!isOpen) return null;

  // return (
  //   <div className={styles.modalOverlay}>
  //     <div className={styles.modalBox}>
  //       <div className={styles.closeIcon} onClick={onCancel}>
  //         <img src={Close2} alt="Close" />
  //       </div>
  //       <div className={styles.bottomContainer}>
  //         <h2 className={styles.modalHeading}>{heading}</h2>
  //         <div className={styles.buttonContainer}>
  //           <button
  //             className={`${styles.noButton} ${
  //               selectedButton === "No" ? styles.activeButton : ""
  //             }`}
  //             onClick={() => {
  //               setSelectedButton("No");
  //               onCancel(); // Call the onCancel function
  //             }}
  //           >
  //             No
  //           </button>
  //           <button
  //             className={`${styles.yesButton} ${
  //               selectedButton === "Yes" ? styles.activeButton : ""
  //             }`}
  //             onClick={() => {
  //               setSelectedButton("Yes");
  //               onConfirm(); // Call the onConfirm function
  //             }}
  //           >
  //             Yes
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  const modalContent = (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.closeIcon} onClick={onCancel}>
          <img src={Close2} alt="Close" />
        </div>
        <div className={styles.bottomContainer}>
          <h2 className={styles.modalHeading}>{heading}</h2>
          <div className={styles.buttonContainer}>
            <button
              className={`${styles.noButton} ${
                selectedButton === "No" ? styles.activeButton : ""
              }`}
              onClick={() => {
                setSelectedButton("No");
                onCancel(); // Call the onCancel function
              }}
            >
              No
            </button>
            <button
              className={`${styles.yesButton} ${
                selectedButton === "Yes" ? styles.activeButton : ""
              }`}
              onClick={() => {
                setSelectedButton("Yes");
                onConfirm(); // Call the onConfirm function
              }}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
