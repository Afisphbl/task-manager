import React from "react";
import { GripVertical, Calendar, LucideEdit, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Badge from "./Badge";
import styles from "../styles/TaskCard.module.css";
import badgeStyles from "../styles/Badge.module.css";

const priorityClassByLevel = {
  low: badgeStyles.badge__low,
  medium: badgeStyles.badge__medium,
  high: badgeStyles.badge__high,
};

function TaskCard({
  id,
  title,
  description,
  priority,
  label,
  dueDate,
  column,
  dragDisabled = false,
  isDragging,
}) {
  const { dispatch } = useTasks();
  const dueDateValue = dueDate && new Date(dueDate);
  const formattedDate =
    dueDate &&
    dueDateValue.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  function handleDeleteRequest(taskId) {
    dispatch({ type: TASK_ACTIONS.SELECT_TASK_FOR_DELETE, payload: taskId });
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id, disabled: dragDisabled });

  const cardStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isBeingDragged = isDragging || isSortableDragging;

  const stageOptions = [
    { value: "todo", label: "Todo" },
    { value: "inprogress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <section
      ref={setNodeRef}
      style={cardStyle}
      className={`${styles.card} ${isBeingDragged ? styles.card__dragging : ""}`}
    >
      <div
        className={`${styles.card__dragHandle} ${dragDisabled ? styles.card__dragHandleHidden : ""}`}
        {...(dragDisabled ? {} : attributes)}
        {...(dragDisabled ? {} : listeners)}
        title="Use this to drag and drop"
      >
        <GripVertical size={14} />
      </div>

      <div className={styles.card__content}>
        <div className={styles.card__meta}>
          {label && <span className={styles.card__label}>{label}</span>}
          <Badge className={priorityClassByLevel[priority]}>{priority}</Badge>
        </div>

        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>

        <div className={styles.card__stageRow}>
          <label className={styles.card__stageLabel} htmlFor={`stage-${id}`}>
            Stage
          </label>
          <select
            id={`stage-${id}`}
            className={styles.card__stageSelect}
            value={column}
            onChange={(e) =>
              dispatch({
                type: TASK_ACTIONS.CHANGE_TASK_STAGE,
                payload: { taskId: id, nextColumn: e.target.value },
              })
            }
          >
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.card__footer}>
          <p className={styles.card__date}>
            {dueDate && <Calendar size={12} />}
            {formattedDate}
          </p>

          <div className={styles.card__actions}>
            <Button
              type="button"
              className={styles.card__actionBtn}
              onClick={() =>
                dispatch({ type: TASK_ACTIONS.START_EDIT_TASK, payload: id })
              }
            >
              <LucideEdit size={14} />
            </Button>

            <Button
              type="button"
              className={
                styles.card__actionBtn + " " + styles.card__actionBtn__delete
              }
              onClick={() => handleDeleteRequest(id)}
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
