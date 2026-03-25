import React from "react";
import { useTaskModal } from "../context/TaskModalContext";
import Button from "./ReUsedComponents/Button";
import TaskModalForm from "./TaskModalForm";
import styles from "../styles/TaskModal.module.css";

function TaskModal() {
  const { closeTaskModal } = useTaskModal();

  const closeBtnClass = `${styles.modal__closeBtn}`;

  return (
    <div className={styles.overlay} onClick={closeTaskModal}>
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Create New Task</h2>
          <Button className={closeBtnClass} onClick={closeTaskModal}>
            &times;
          </Button>
        </div>

        <TaskModalForm />
      </section>
    </div>
  );
}

export default TaskModal;
