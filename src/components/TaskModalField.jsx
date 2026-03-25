import React from "react";
import styles from "../styles/TaskModal.module.css";

function TaskModalField({ children, error = "", className = "" }) {
  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {children}
      {error ? <p className={styles.field__error}>{error}</p> : null}
    </div>
  );
}

export default TaskModalField;
