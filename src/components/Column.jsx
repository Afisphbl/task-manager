import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import TaskCard from "./TaskCard";
import styles from "../styles/Column.module.css";

function Column({ id, title, count, tasks, dotStyle }) {
  const { onAddTask } = useTasks();

  const { setNodeRef, isOver } = useDroppable({ id });

  const btnClass = styles.column__addBtn;

  return (
    <section
      className={`${styles.column} ${isOver ? styles.column__over : ""}`}
    >
      <div className={styles.column__header}>
        <div className={styles.column__titleGroup}>
          <span
            className={styles.column__dot}
            style={{ backgroundColor: dotStyle }}
          />
          <h2 className={styles.column__title}>{title}</h2>

          <span className={styles.column__count}>{count}</span>
        </div>
      </div>

      <div ref={setNodeRef} className={styles.column__body}>
        {count === 0 && <EmptyState />}
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </SortableContext>
      </div>
      <Button className={btnClass} onClick={() => onAddTask(title)}>
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
