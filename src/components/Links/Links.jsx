import { useEffect, useState } from "react";
import { deleteLink } from "../../services/linkApi";
import LinkModal from "../LinkModal/LinkModal";
import DeleteModal from "../DeleteModal/DeleteModal";
import {
  CopyI,
  Edit,
  Delete,
  Dropdown,
  Tick,
} from "../../utils/getDashboardImg";
import styles from "./links.module.css";

export default function Links({
  search,
  fetchLinks,
  links,
  pagination,
  setFilters,
  filters,
  setLinks,
}) {
  // const [links, setLinks] = useState([]);
  // const [pagination, setPagination] = useState({
  //   currentPage: 1,
  //   totalPages: 1,
  // });
  // const [filters, setFilters] = useState({
  //   page: 1,
  //   limit: 3,
  //   sortBy: "dateCreated",
  //   order: "desc",
  //   statusSort: "",
  //   search: search,
  // });
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [showCopyMessage, setShowCopyMessage] = useState(false); // ✅ State for copy message

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search }));
  }, [search]);

  const openLinkModal = (link) => {
    setIsLinkModalOpen(true);
    setSelectedLink(link);
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setSelectedLink(null);
  };

  const openDeleteModal = (link) => {
    setIsDeleteModalOpen(true);
    setSelectedLink(link);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedLink(null);
  };

  // useEffect(() => {
  //   const fetchLinks = async () => {
  //     try {
  //       const response = await getLinks(filters);
  //       if (!response.ok) {
  //         throw new Error(`Error: ${response.status} ${response.statusText}`);
  //       }
  //       const data = await response.json();
  //       setLinks(data.links);
  //       setPagination({
  //         currentPage: data.pagination.currentPage,
  //         totalPages: data.pagination.totalPages,
  //       });
  //     } catch (error) {
  //       console.error("Error fetching links:", error.message);
  //     }
  //   };
  //   fetchLinks();
  // }, [filters]);

  // ✅ Extract fetchLinks function so it can be called manually
  // const fetchLinks = async () => {
  //   try {
  //     const response = await getLinks(filters);
  //     if (!response.ok) {
  //       throw new Error(`Error: ${response.status} ${response.statusText}`);
  //     }
  //     const data = await response.json();
  //     setLinks(data.links);
  //     setPagination({
  //       currentPage: data.pagination.currentPage,
  //       totalPages: data.pagination.totalPages,
  //     });
  //   } catch (error) {
  //     console.error("Error fetching links:", error.message);
  //   }
  // };

  // ✅ Fetch links when component mounts and when filters change
  useEffect(() => {
    fetchLinks();
  }, [filters]);

  const handleCopy = async (shortenedLink) => {
    try {
      await navigator.clipboard.writeText(shortenedLink); // Copy to clipboard
      setShowCopyMessage(true); // Show notification
      setTimeout(() => setShowCopyMessage(false), 3000); // Hide after 3 seconds
      // alert("Shortened link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy the link:", error.message);
      alert("Failed to copy the link. Please try again.");
    }
  };

  // const handlePageChange = (newPage) => {
  //   setFilters((prev) => ({ ...prev, page: newPage }));
  // };

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

  // const handleStatusFilter = (statusSort) => {
  //   setFilters((prev) => ({ ...prev, statusSort }));
  // };

  const handleDeleteConfirm = async () => {
    try {
      const response = await deleteLink(selectedLink);
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      alert("Link deleted successfully");
      setLinks((prev) => prev.filter((link) => link.id !== selectedLink));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting link:", error.message);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className={styles.linksContainer}>
      {/* Copy Notification Message */}
      {showCopyMessage && (
        <div className={styles.copyMessage}>
          <img src={Tick} alt="tick" />
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Link Copied
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        heading={"Are you sure you want to delete this link?"}
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />

      <LinkModal
        isOpen={isLinkModalOpen}
        heading="Edit Link"
        btnHeading="Save"
        onClose={closeLinkModal}
        linkData={selectedLink}
        refreshLinks={fetchLinks}
      />
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ display: "flex", alignItems: "center" }}>
                Date
                <button
                  onClick={() => handleSortChange("dateCreated")}
                  className={styles.dropdownBtn}
                >
                  <img src={Dropdown} alt="dropdown" />
                </button>
              </th>
              <th className={styles.orignalLinkContainer}>Original Link</th>
              <th style={{ maxWidth: "250px" }}>Short Links</th>
              <th>Remarks</th>
              <th>Clicks</th>
              <th>
                Status
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      // statusSort:
                      //   prev.statusSort === "activeFirst"
                      //     ? "inactiveFirst"
                      //     : "activeFirst",
                      statusSort:
                        prev.statusSort === "activeFirst"
                          ? "inactiveFirst"
                          : "activeFirst",
                      page: 1,
                    }))
                  }
                  className={styles.dropdownBtn}
                >
                  <img src={Dropdown} alt="dropdown" />
                </button>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td data-label="Date">
                  {/* {new Date(link.dateCreated).toLocaleString()} */}
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // Uses 24-hour format, set `true` for 12-hour format
                  }).format(new Date(link.dateCreated))}
                </td>
                <td
                  data-label="Original Link"
                  className={styles.orignalLinkContainer}
                  style={{ maxWidth: "300px" }}
                >
                  {link.originalLink}
                </td>
                <td
                  data-label="Short Link"
                  style={{
                    maxWidth: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      // width: "80%",
                      overflow: "hidden",
                    }}
                  >
                    {link.shortenedLink}
                  </div>
                  <button
                    className={styles.copyBtn}
                    onClick={() => handleCopy(link.shortenedLink)}
                  >
                    <img
                      // style={{ position: "relative", top: "2px" }}
                      src={CopyI}
                      alt="copy"
                    />
                  </button>
                </td>
                <td
                  data-label="Remarks"
                  style={{ minWidth: "150px", maxWidth: "150px" }}
                >
                  {link.remark}
                </td>
                <td data-label="Clicks">{link.clicks}</td>
                {/* <td data-label="Status">{link.status}</td> */}
                <td
                  data-label="Status"
                  className={
                    link.status === "active"
                      ? styles.activeStatus
                      : styles.inactiveStatus
                  }
                >
                  {/* {link.status} */}
                  {link.status.charAt(0).toUpperCase() + link.status.slice(1)}
                </td>
                <td data-label="Action">
                  <button
                    className={styles.editBtn}
                    onClick={() => openLinkModal(link)}
                  >
                    <img
                      // onClick={() => openLinkModal(link)}
                      src={Edit}
                      alt="edit"
                    />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => openDeleteModal(link.id)}
                  >
                    <img src={Delete} alt="delete" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div className={styles.pagination}>
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className={styles.paginationBtn}
        >
          &lt;
        </button>
        {Array.from({ length: pagination.totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`${styles.paginationNumber} ${
              pagination.currentPage === index + 1 ? styles.activePage : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className={styles.paginationBtn}
        >
          &gt;
        </button>
      </div> */}

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
