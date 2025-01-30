import HomeBg from "../../assets/HomeBg.png";
import style from "./bg.module.css";

export default function Bg() {
  return (
    <div className={style.bgContainer}>
      <img src={HomeBg} alt="HomeBg" className="homeBg" />
    </div>
  );
}
