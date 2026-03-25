import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TASK_ACTIONS, useTasksDispatch } from "../context/DataProvider";
import {
  TaskCardDragHandle,
  TaskCardFooter,
  TaskCardMeta,
  TaskCardStageRow,
} from "./TaskCardUI";
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
  children,
}) {
  const dispatch = useTasksDispatch();
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
      <TaskCardDragHandle
        dragDisabled={dragDisabled}
        attributes={attributes}
        listeners={listeners}
      />

      <div className={styles.card__content}>
        <TaskCardMeta
          label={label}
          priority={priority}
          priorityClassName={priorityClassByLevel[priority]}
        />

        <h3 className={styles.card__title}>{title}</h3>
        <p className={styles.card__desc}>{description}</p>

        <TaskCardStageRow
          id={id}
          column={column}
          stageOptions={stageOptions}
          onChangeStage={(e) =>
            dispatch({
              type: TASK_ACTIONS.CHANGE_TASK_STAGE,
              payload: { taskId: id, nextColumn: e.target.value },
            })
          }
        />

        {children}

        <TaskCardFooter
          dueDate={dueDate}
          formattedDate={formattedDate}
          onEdit={() =>
            dispatch({ type: TASK_ACTIONS.START_EDIT_TASK, payload: id })
          }
          onDelete={() => handleDeleteRequest(id)}
        />
      </div>
    </section>
  );
}

export default React.memo(TaskCard);
