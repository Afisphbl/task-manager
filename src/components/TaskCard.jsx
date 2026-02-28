import React from "react";
import { useTasks } from "../context/DataProvider";
import { GripVertical, Calendar, LucideEdit, Trash2 } from "lucide-react";
import Button from "./ReUsedComponents/Button";
import Badge from "./Badge";
import styles from "../styles/TaskCard.module.css";
import style from "../styles/Badge.module.css";

function TaskCard({
  id,
  title,
  description,
  priority,
  label,
  dueDate,
  createdAt,
}) {
  const { toggleDialog, selectTask } = useTasks();
  const priorityColors = `${style[`badge__${priority}`]}`;
  const createdAtDate = new Date(createdAt);
  const formattedDate = createdAtDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  function handleDelete(id) {
    selectTask(id);
    toggleDialog();
  }

  return (
    <section className={styles.card}>
      <div className={styles.card__dragHandle}>
        <GripVertical size={14} />
      </div>

      <div className={styles.card__content}>
        <div className={styles.card__meta}>
          <span className={styles.card__label}>{label}</span>
          <Badge className={priorityColors}>{priority}</Badge>
        </div>

        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>

        <div className={styles.card__footer}>
          <p className={styles.card__date}>
            <Calendar size={12} />
            {formattedDate}
          </p>

          <div className={styles.card__actions}>
            <Button type="button" className={styles.card__actionBtn}>
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
