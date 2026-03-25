import React from "react";
import { Calendar } from "lucide-react";
import { TaskCardMeta } from "./TaskCardUI";
import styles from "../styles/TaskCard.module.css";
import badgeStyles from "../styles/Badge.module.css";

const priorityClassByLevel = {
  low: badgeStyles.badge__low,
  medium: badgeStyles.badge__medium,
  high: badgeStyles.badge__high,
};

function TaskCardPreview({ title, description, priority, label, dueDate }) {
  const dueDateValue = dueDate ? new Date(dueDate) : null;
  const formattedDate = dueDateValue
    ? dueDateValue.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <section className={`${styles.card} ${styles.card__dragging}`}>
      <div className={styles.card__content}>
        <TaskCardMeta
          label={label}
          priority={priority}
          priorityClassName={priorityClassByLevel[priority]}
        />
        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>
        <div className={styles.card__footer}>
          <p className={styles.card__date}>
            {dueDate ? <Calendar size={12} /> : null}
            {formattedDate}
          </p>
        </div>
      </div>
    </section>
  );
}

export default React.memo(TaskCardPreview);
