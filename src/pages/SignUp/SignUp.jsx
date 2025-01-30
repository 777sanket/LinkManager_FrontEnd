import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bg from "../../components/Background/Bg";
import logo from "../../assets/logo.png";
import styles from "./signUp.module.css";
import { register } from "../../services/userApi";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await register(formData);

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("User created successfully");
        navigate("/login"); // Navigate to the login page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle navigation to login page
  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className={styles.signUpContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </div>

      <div className={styles.bg}>
        <Bg />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <button className={styles.signUpHeaderBtn}>SingUp</button>
          <button className={styles.loginHeaderBtn} onClick={goToLogin}>
            Login
          </button>
        </div>
        <div className={styles.formTitle}> Join us Today!</div>
        <form className={styles.signUpForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email || ""}
            onChange={handleChange}
          />
          <input
            type="number"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile || ""}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword || ""}
            onChange={handleChange}
          />
          <button type="submit" className={styles.signUpBtn}>
            Register
          </button>
        </form>
        <div className={styles.formFooter}>
          <p>Already have an account?</p>
          <button onClick={goToLogin}>Login</button>
        </div>
      </div>
    </div>
  );
}
