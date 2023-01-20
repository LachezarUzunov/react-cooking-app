import spinner from "../../assets/spinner.gif";
import classes from "./Spinner.module.css";

function Spinner() {
  return (
    <div className={classes.center}>
      <img width={180} src={spinner} alt="Loading..." />
    </div>
  );
}

export default Spinner;
