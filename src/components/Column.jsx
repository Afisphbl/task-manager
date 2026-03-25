import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TASK_ACTIONS, useTasksDispatch } from "../context/DataProvider";
import { useBoardData } from "../context/BoardContext";
import Button from "./ReUsedComponents/Button";
import TaskCard from "./TaskCard";
import styles from "../styles/Column.module.css";

function Column({ id, className = "", dragDisabled = false }) {
  const dispatch = useTasksDispatch();
  const { columnOrder, columns, counts, dotStyle } = useBoardData();

  const tasks = columns[id] || [];
  const count = counts[id] || 0;
  const title = id;
  const dotColor = dotStyle[columnOrder.indexOf(id)];

  const { setNodeRef, isOver } = useDroppable({ id });

  const btnClass = styles.column__addBtn;

  return (
    <section
      className={`${styles.column} ${isOver ? styles.column__over : ""} ${className}`}
    >
      <div className={styles.column__header}>
        <div className={styles.column__titleGroup}>
          <span
            className={styles.column__dot}
            style={{ backgroundColor: dotColor }}
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
            <TaskCard key={task.id} {...task} dragDisabled={dragDisabled} />
          ))}
        </SortableContext>
      </div>
      <Button
        className={btnClass}
        onClick={() =>
          dispatch({
            type: TASK_ACTIONS.OPEN_TASK_MODAL_FOR_COLUMN,
            payload: title,
          })
        }
      >
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

export default React.memo(Column);
