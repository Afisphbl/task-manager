import React from "react";
import { GripVertical, Calendar, LucideEdit, Trash2 } from "lucide-react";
import Button from "./ReUsedComponents/Button";
import Badge from "./Badge";
import styles from "../styles/TaskCard.module.css";

function TaskCardDragHandle({ dragDisabled, attributes, listeners }) {
  return (
    <div
      className={`${styles.card__dragHandle} ${dragDisabled ? styles.card__dragHandleHidden : ""}`}
      {...(dragDisabled ? {} : attributes)}
      {...(dragDisabled ? {} : listeners)}
      title="Use this to drag and drop"
    >
      <GripVertical size={14} />
    </div>
  );
}

function TaskCardMeta({ label, priority, priorityClassName }) {
  return (
    <div className={styles.card__meta}>
      {label ? <span className={styles.card__label}>{label}</span> : null}
      <Badge className={priorityClassName}>{priority}</Badge>
    </div>
  );
}

function TaskCardStageRow({ id, column, stageOptions, onChangeStage }) {
  return (
    <div className={styles.card__stageRow}>
      <label className={styles.card__stageLabel} htmlFor={`stage-${id}`}>
        Stage
      </label>
      <select
        id={`stage-${id}`}
        className={styles.card__stageSelect}
        value={column}
        onChange={onChangeStage}
      >
        {stageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TaskCardActions({ onEdit, onDelete }) {
  return (
    <div className={styles.card__actions}>
      <Button type="button" className={styles.card__actionBtn} onClick={onEdit}>
        <LucideEdit size={14} />
      </Button>

      <Button
        type="button"
        className={
          styles.card__actionBtn + " " + styles.card__actionBtn__delete
        }
        onClick={onDelete}
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}

function TaskCardFooter({
  dueDate,
  formattedDate,
  onEdit,
  onDelete,
  children,
}) {
  return (
    <div className={styles.card__footer}>
      <p className={styles.card__date}>
        {dueDate ? <Calendar size={12} /> : null}
        {formattedDate}
      </p>

      {children || <TaskCardActions onEdit={onEdit} onDelete={onDelete} />}
    </div>
  );
}

export {
  TaskCardDragHandle,
  TaskCardMeta,
  TaskCardStageRow,
  TaskCardActions,
  TaskCardFooter,
};
