import { useEffect, useState } from "react";
import { getAnalysisRecords } from "../../services/analyticsApi";
import { Dropdown } from "../../utils/getDashboardImg";
import styles from "./analytics.module.css";

export default function Analytics() {
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 3,
    sortBy: "dateClicked",
    order: "desc",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getAnalysisRecords(filters);
        setRecords(data.analyses);
        setPagination({
          currentPage: data.pagination.currentPage,
          totalPages: data.pagination.totalPages,
        });
      } catch (err) {
        setError("Failed to fetch analysis records.");
      }
    };
    fetchRecords();
  }, [filters]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    if (totalPages <= 3) {
      // If total pages are 3 or less, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage === 1) {
      // If on first page, show first three
      pages.push(1, 2, 3);
    } else if (currentPage === totalPages) {
      // If on last page, show last three
      pages.push(totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Otherwise, show previous, current, and next
      pages.push(currentPage - 1, currentPage, currentPage + 1);
    }

    return pages;
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      order: prev.order === "desc" ? "asc" : "desc",
    }));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>
                Time Stamp
                <button
                  onClick={() => handleSortChange("dateClicked")}
                  className={styles.dropdownBtn}
                >
                  <img src={Dropdown} alt="Sort" />
                </button>
              </th>
              <th style={{ maxWidth: "300px" }}>Original Link</th>
              <th>Shortened Link</th>
              <th>IP Address</th>
              <th>User Device</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>
                <td
                  className={styles.orignalLinkContainer}
                  style={{ maxWidth: "300px" }}
                >
                  {record.originalLink}
                </td>
                <td style={{ maxWidth: "300px" }}>{record.shortLink}</td>
                <td>{record.ipAddress}</td>
                <td>{record.userDevice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={styles.paginationBtn}
        >
          &lt;
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${styles.paginationNumber} ${
              pagination.currentPage === page ? styles.activePage : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={styles.paginationBtn}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
