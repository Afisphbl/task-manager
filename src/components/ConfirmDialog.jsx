import React from "react";
import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import { AlertTriangleIcon } from "lucide-react";
import Button from "./ReUsedComponents/Button";
import styles from "../styles/ConfirmDialog.module.css";

function ConfirmDialog({
  task: dialogTitle,
  desc: dialogDescription,
  cancel: cancelLabel,
  confirm: confirmLabel,
}) {
  const { state, dispatch } = useTasks();
  const { pendingDeleteTaskId } = state;
  const cancelBtnClass = styles.btn__cancel;
  const deleteBtnClass = styles.btn__confirm;
  return (
    <div
      className={styles.overlay}
      onClick={() => dispatch({ type: TASK_ACTIONS.TOGGLE_DELETE_DIALOG })}
    >
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <span className={styles.dialog__icon}>
          <AlertTriangleIcon size={24} />
        </span>
        <h2 className={styles.dialog__title}>{dialogTitle}</h2>
        <p className={styles.dialog__msg}>{dialogDescription}</p>

        <div className={styles.dialog__actions}>
          <Button
            className={cancelBtnClass}
            onClick={() =>
              dispatch({ type: TASK_ACTIONS.TOGGLE_DELETE_DIALOG })
            }
          >
            {cancelLabel}
          </Button>
          <Button
            className={deleteBtnClass}
            onClick={() =>
              dispatch({
                type: TASK_ACTIONS.DELETE_TASK,
                payload: pendingDeleteTaskId,
              })
            }
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
