import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Bg from "../../components/Background/Bg";
import logo from "../../assets/logo.png";
import styles from "./login.module.css";
import { login } from "../../services/userApi";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle input change
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
      const response = await login(formData);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        alert("Login successful");
        // Navigate to the dashboard or homepage
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert("Something went wrong. Please try again.", error);
    }
  };

  // Navigate to Signup page
  const goToSignup = () => {
    navigate("/");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="logo" />
      </div>

      <div className={styles.bg}>
        <Bg />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.formHeader}>
          <button className={styles.signUpHeaderBtn} onClick={goToSignup}>
            SingUp
          </button>
          <button className={styles.loginHeaderBtn}>Login</button>
        </div>
        <div className={styles.formTitle}> Login</div>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email id"
            value={formData.email || ""}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password || ""}
            onChange={handleChange}
          />
          <button type="submit" className={styles.loginBtn}>
            Login
          </button>
        </form>
        <div className={styles.formFooter}>
          <p>Don’t have an account?</p>
          <button onClick={goToSignup}>Signup</button>
        </div>
      </div>
    </div>
  );
}
