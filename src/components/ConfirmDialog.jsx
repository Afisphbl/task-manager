import React from "react";
import { useTasks } from "../context/DataProvider";
import { AlertTriangleIcon } from "lucide-react";
import Button from "./ReUsedComponents/Button";
import styles from "../styles/ConfirmDialog.module.css";

function ConfirmDialog({ task, desc, cancel, confirm }) {
  const { selectedTaskId, onDeleteTask, toggleDialog } = useTasks();
  const cancelBtnClass = styles.btn__cancel;
  const deleteBtnClass = styles.btn__confirm;
  return (
    <div className={styles.overlay} onClick={toggleDialog}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <span className={styles.dialog__icon}>
          <AlertTriangleIcon size={24} />
        </span>
        <h2 className={styles.dialog__title}>{task}</h2>
        <p className={styles.dialog__msg}>{desc}</p>

        <div className={styles.dialog__actions}>
          <Button className={cancelBtnClass} onClick={toggleDialog}>
            {cancel}
          </Button>
          <Button
            className={deleteBtnClass}
            onClick={() => onDeleteTask(selectedTaskId)}
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
