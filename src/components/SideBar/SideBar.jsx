import { useState, useEffect } from "react";
import {
  Dash,
  Link,
  Analysis,
  Setting,
  Hamburger,
} from "../../utils/getDashboardImg";
import styles from "./sideBar.module.css";

export default function SideBar({ active, setActive, isOpen, setIsOpen }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add or remove 'no-scroll' class on the body
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isMenuOpen]);

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: "Dashboard", icon: Dash },
    { name: "Links", icon: Link },
    { name: "Analytics", icon: Analysis },
  ];

  return (
    <>
      <div className={styles.hamburgerIcon} onClick={toggleMenu}>
        <img src={Hamburger} alt="Menu" />
      </div>

      <div
        className={`${styles.sideBarContainer} ${
          isMenuOpen ? styles.open : ""
        }`}
      >
        <div className={styles.itemContainer}>
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={`${styles.menuItem} ${
                  active === item.name ? styles.active : ""
                }`}
                onClick={() => {
                  setActive(item.name);
                  setIsMenuOpen(false); // Close menu on selection (for mobile)
                  setIsOpen(false); // Close sidebar on selection (for desktop)
                }}
              >
                <img src={item.icon} alt={item.name} />
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.settingContainer}>
          <ul>
            <li
              className={`${styles.menuItem} ${
                active === "Setting" ? styles.active : ""
              }`}
              onClick={() => {
                setActive("Setting");
                setIsMenuOpen(false); // Close menu on selection (for mobile)
                setIsOpen(false); // Close sidebar on selection (for desktop)
              }}
            >
              <img src={Setting} alt="Settings" />
              Settings
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
