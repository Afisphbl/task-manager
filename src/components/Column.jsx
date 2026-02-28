import React from "react";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import TaskCard from "./TaskCard";
import styles from "../styles/Column.module.css";

function Column({ title, count, tasks }) {
  const { onAddTask } = useTasks();
  const btnClass = styles.column__addBtn;

  return (
    <section className={styles.column}>
      <div className={styles.column__header}>
        <div className={styles.column__titleGroup}>
          <span className={styles.column__dot} />
          <h2 className={styles.column__title}>{title}</h2>

          <span className={styles.column__count}>{count}</span>
        </div>
      </div>

      <div className={styles.column__body}>
        {count === 0 && <EmptyState />}
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>
      <Button className={btnClass} onClick={onAddTask}>
        + Add Task
      </Button>
    </section>
  );
}

export function EmptyState() {
  return (
    <div className={styles.column__empty}>
      No tasks here yet — add one below
    </div>
  );
}

export default Column;
