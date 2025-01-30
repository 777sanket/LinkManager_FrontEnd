import { useState, useEffect } from "react";
import Navbar from "../../components/NavBar/Navbar";
import SideBar from "../../components/SideBar/SideBar";
import Dash from "../../components/Dash/Dash";
import Links from "../../components/Links/Links";
import Analytics from "../../components/Analytics/Analytics";
import Setting from "../../components/SettingsPage/Setting";
import styles from "./dashboard.module.css";
import { getUser } from "../../services/userApi";
import { getLinks } from "../../services/linkApi";

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState("Dash"); // Default to Dash
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });

  const [links, setLinks] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 3,
    sortBy: "dateCreated",
    order: "desc",
    statusSort: "",
    search: search,
  });

  // ✅ Fetch Links Function (Now in Dashboard)
  const fetchLinks = async () => {
    try {
      const response = await getLinks(filters);
      if (!response.ok) throw new Error("Failed to fetch links");

      const data = await response.json();
      setLinks(data.links);
      setPagination({
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching links:", error.message);
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await getUser();
        const data = await response.json();
        setUserData({
          name: data.user.name,
          email: data.user.email,
          mobile: data.user.mobile,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
  }, []);

  // Function to render the active component
  const renderComponent = () => {
    switch (activeComponent) {
      case "Dash":
        return <Dash />;
      case "Links":
        return (
          <Links
            search={search}
            fetchLinks={fetchLinks}
            links={links}
            pagination={pagination}
            setFilters={setFilters}
            filters={filters}
            setLinks={setLinks}
          />
        );
      case "Analytics":
        return <Analytics />;
      case "Setting":
        return <Setting userData={userData} setUserData={setUserData} />;
      default:
        return <Dash />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.navBarItem}>
        <Navbar
          // search={search}
          userData={userData}
          setSearch={setSearch}
          fetchLinks={fetchLinks}
        />
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.sideBarItem}>
          <SideBar
            active={activeComponent}
            setActive={setActiveComponent}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>

        <div
          className={`${styles.mainContent} ${
            isOpen ? styles.hiddenContent : ""
          }`}
        >
          <div className={styles.mainContainerx}>{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
}
