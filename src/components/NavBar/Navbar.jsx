import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getDate from "../../utils/getDate";
import { logout } from "../../services/userApi";
import { getInitials } from "../../utils/getInitials";
import LinkModal from "../LinkModal/LinkModal";
import {
  Logo,
  Sun,
  Plus,
  Search,
  Evening,
  Night,
} from "../../utils/getDashboardImg";

import styles from "./navbar.module.css";

export default function Navbar({ setSearch, userData, fetchLinks }) {
  const date = getDate();
  const [showLogout, setShowLogout] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalHeading, setLinkModalHeading] = useState("");
  const [linkModalBtnHeading, setLinkModalBtnHeading] = useState("");
  const [greeting, setGreeting] = useState("Good Morning");
  const [greetingImage, setGreetingImage] = useState(Sun);
  const [scaleFactor, setScaleFactor] = useState(1);
  const navigate = useNavigate();
  const initials = getInitials(userData.name);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert UTC to IST
      const hours = istTime.getUTCHours(); // Get IST hours

      if (hours >= 5 && hours < 16) {
        setGreeting("Good Morning");
        setGreetingImage(Sun);
        setScaleFactor(1);
      } else if (hours >= 16 && hours < 23) {
        setGreeting("Good Evening");
        setGreetingImage(Evening);
        setScaleFactor(0.4);
      } else {
        setGreeting("Good Night");
        setGreetingImage(Night);
        setScaleFactor(0.4);
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 1000); // ✅ Update every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleProfileClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.ok) {
        localStorage.removeItem("token");
        setShowLogout(false);
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.", error);
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // ✅ Redirect if token is missing
      }
    };

    checkTokenExpiration();
  }, []);

  const openLinkModal = (heading, btnHeading) => {
    setLinkModalHeading(heading);
    setLinkModalBtnHeading(btnHeading);
    setIsLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
  };

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.leftPart}>
        <div className={styles.logoImg}>
          <img src={Logo} alt="logo" />
        </div>
        <div className={styles.greetings}>
          <div className={styles.sunImg}>
            <img
              src={greetingImage}
              alt={greeting}
              style={{ transform: `scale(${scaleFactor})` }}
            />
          </div>
          <div className={styles.greetingText}>
            <p>
              {greeting},&nbsp; {userData.name}
            </p>
            <div className={styles.greetingDate}>{date}</div>
          </div>
        </div>
      </div>

      <div className={styles.rightPart}>
        <div className={styles.createContainer}>
          <button
            onClick={() => openLinkModal("New Link", "Create New")}
            className={styles.createBtn}
          >
            <img src={Plus} alt="plus" />
            <p>Create New</p>
          </button>

          <div className={styles.searchContainer}>
            <img src={Search} alt="search" />
            <input
              className={styles.searchInp}
              type="text"
              placeholder="Search by remarks"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div onClick={handleProfileClick} className={styles.profileContainer}>
          <div className={styles.initials}>{initials}</div>
          {showLogout && (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          )}
        </div>
      </div>

      <LinkModal
        isOpen={isLinkModalOpen}
        heading={linkModalHeading}
        btnHeading={linkModalBtnHeading}
        onClose={closeLinkModal}
        refreshLinks={fetchLinks}
      />
    </div>
  );
}
