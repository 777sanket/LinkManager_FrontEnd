import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { editUser, deleteUser, getUser } from "../../services/userApi";
import DeleteModal from "../DeleteModal/DeleteModal";
import styles from "./setting.module.css";
import { use } from "react";

export default function Setting({ userData, setUserData }) {
  // const [userData, setUserData] = useState({
  //   name: "",
  //   email: "",
  //   mobile: "",
  // });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(userData);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // ✅ Update local state
  };

  const navigate = useNavigate(); // ✅ Initialize useNavigate

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

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const name = e.target.name.value;
    const email = e.target.email.value;
    const mobile = e.target.mobile.value;

    try {
      const response = await editUser({ name, email, mobile });
      if (!response.ok) throw new Error("Failed to update profile");
      setUserData({ name, email, mobile });
      alert("Profile updated successfully");
      setMessage("Profile updated successfully!");
    } catch (error) {
      setError("Failed to update profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // const confirmDelete = window.confirm(
    //   "Are you sure you want to delete your account? This action is irreversible!"
    // );
    // if (!confirmDelete) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await deleteUser();
      if (!response.ok) throw new Error("Failed to delete account");
      alert("Account deleted successfully");
      setMessage("Account deleted successfully. Redirecting...");

      setTimeout(() => {
        localStorage.removeItem("token"); // Clear user session
        navigate("/"); // ✅ Redirect to home page after deletion
      }, 300);
    } catch (error) {
      setError("Failed to delete account. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.settingContainer}>
      <DeleteModal
        isOpen={showDeleteModal}
        heading=" Are you sure, you want to delete the account ? "
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />

      {/* {message && <div className={styles.successMessage}>{message}</div>}
      {error && <div className={styles.errorMessage}>{error}</div>} */}

      <form className={styles.formContainer} onSubmit={handleEdit}>
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              // value={userData.name}
              value={formData.name} // ✅ Update input value
              onChange={
                // (e) => setUserData({ ...userData, name: e.target.value })
                handleChange
              }
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email id</label>
            <input
              type="email"
              id="email"
              name="email"
              // value={userData.email}
              value={formData.email} // ✅ Update input value
              onChange={
                // (e) =>
                // setUserData({ ...userData, email: e.target.value })
                handleChange
              }
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="mobile">Mobile no</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              // value={userData.mobile}
              value={formData.mobile} // ✅ Update input value
              onChange={
                // (e) =>
                // setUserData({ ...userData, mobile: e.target.value })
                handleChange
              }
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.saveBtn}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            // onClick={handleDelete}
            onClick={openDeleteModal} // ✅ Open delete modal
            disabled={loading}
            className={styles.deleteBtn}
          >
            Delete Account
            {/* {loading ? "Deleting..." : "Delete Account"} */}
          </button>
        </div>
      </form>
    </div>
  );
}
