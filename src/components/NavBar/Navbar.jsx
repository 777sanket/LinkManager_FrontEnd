import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getDate from "../../utils/getDate";
import { getUser, logout } from "../../services/userApi";
import { getInitials } from "../../utils/getInitials";
import LinkModal from "../LinkModal/LinkModal";
import {
  Logo,
  Sun,
  Plus,
  Search,
  Hamburger,
} from "../../utils/getDashboardImg";

import styles from "./navbar.module.css";

export default function Navbar({ setSearch, userData, fetchLinks }) {
  const date = getDate();
  // const [user, setUser] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkModalHeading, setLinkModalHeading] = useState("");
  const [linkModalBtnHeading, setLinkModalBtnHeading] = useState("");

  const navigate = useNavigate();

  const initials = getInitials(userData.name);

  // useEffect(() => {
  //   async function fetchUser() {
  //     try {
  //       const response = await getUser();
  //       const data = await response.json();
  //       setUser(data.user.name);
  //     } catch (error) {
  //       console.error("Error fetching user data: ", error);
  //     }
  //   }
  //   fetchUser();
  // }, []);

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
            <img src={Sun} alt="sun" />
          </div>
          <div className={styles.greetingText}>
            <p>Good Morning,&nbsp; {userData.name}</p>
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

        {/* <button onClick={() => openLinkModal("Edit Link", "Save")}>
          Edit{" "}
        </button> */}

        <div onClick={handleProfileClick} className={styles.profileContainer}>
          <div className={styles.initials}>
            {/* SA */}
            {/* {userData.name.charAt(0).toUpperCase()} */}
            {initials}
          </div>
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
