import React from "react";
import { GripVertical, Calendar, LucideEdit, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Badge from "./Badge";
import styles from "../styles/TaskCard.module.css";
import style from "../styles/Badge.module.css";

const priorityColors = {
  low: style.badge__low,
  medium: style.badge__medium,
  high: style.badge__high,
};

function TaskCard({
  id,
  title,
  description,
  priority,
  label,
  dueDate,
  isDragging,
}) {
  const { toggleDialog, selectTask, onUpdateTasks } = useTasks();
  // const priorityColors = `${style[`badge__${priority}`]}`;
  const createdAtDate = dueDate && new Date(dueDate);
  const formattedDate =
    dueDate &&
    createdAtDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  function handleDelete(id) {
    selectTask(id);
    toggleDialog();
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBeingDragged = isDragging || isSortableDragging;

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={`${styles.card} ${isBeingDragged ? styles.card__dragging : ""}`}
    >
      <div className={styles.card__dragHandle} {...attributes} {...listeners}>
        <GripVertical size={14} />
      </div>

      <div className={styles.card__content}>
        <div className={styles.card__meta}>
          {label && <span className={styles.card__label}>{label}</span>}
          <Badge className={priorityColors[priority]}>{priority}</Badge>
        </div>

        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>

        <div className={styles.card__footer}>
          <p className={styles.card__date}>
            {dueDate && <Calendar size={12} />}
            {formattedDate}
          </p>

          <div className={styles.card__actions}>
            <Button
              type="button"
              className={styles.card__actionBtn}
              onClick={() => onUpdateTasks({ id })}
            >
              <LucideEdit size={14} />
            </Button>

            <Button
              type="button"
              className={
                styles.card__actionBtn + " " + styles.card__actionBtn__delete
              }
              onClick={() => handleDelete(id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TaskCard;
