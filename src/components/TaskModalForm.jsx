import React from "react";
import { useTaskModal } from "../context/TaskModalContext";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import TaskModalField from "./TaskModalField";
import styles from "../styles/TaskModal.module.css";

function TaskModalForm() {
  const {
    taskDraft,
    hasTitleError,
    titleInputRef,
    minDate,
    maxDate,
    priorityOptions,
    updateDraft,
    submitTask,
    closeTaskModal,
  } = useTaskModal();

  const cancelBtnClass = `${styles.btn__cancel}`;
  const saveBtnClass = `${styles.btn__save}`;
  const priorityClass = "priority__btn";

  return (
    <form className={styles.modal__form} onSubmit={submitTask}>
      <TaskModalField error={hasTitleError ? "Task title is required" : ""}>
        <Input
          htmlFor="title"
          ref={titleInputRef}
          className={`${styles.field__input} ${hasTitleError ? styles.field__input__error : ""}`}
          labelClassName={styles.field__label}
          type="text"
          id="title"
          placeholder="e.g., Fix navigation bug on mobile"
          value={taskDraft.title}
          onChange={(e) => updateDraft("title", e.target.value)}
        >
          Task Title <span className={styles.field__required}>*</span>
        </Input>
      </TaskModalField>

      <TaskModalField>
        <label htmlFor="desc" className={styles.field__label}>
          Description
        </label>
        <textarea
          name="desc"
          id="desc"
          className={styles.field__textarea}
          placeholder="Add detailed information about the task..."
          value={taskDraft.description}
          onChange={(e) => updateDraft("description", e.target.value)}
        ></textarea>
      </TaskModalField>

      <div className={styles.row}>
        <TaskModalField>
          <label htmlFor="column" className={styles.field__label}>
            Column
          </label>
          <select
            name="column"
            id="column"
            className={styles.field__select}
            value={taskDraft.column}
            onChange={(e) => updateDraft("column", e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </TaskModalField>

        <TaskModalField>
          <p className={styles.field__label}>Priority</p>
          <div className={styles.priority__group}>
            {priorityOptions.map((option) => (
              <Button
                type="button"
                key={option.value}
                className={`${styles[`${priorityClass}`]} ${styles[`${priorityClass}__${option.value}`]} ${taskDraft.priority === option.value ? styles[`${priorityClass}__active`] : ""}`}
                onClick={() => updateDraft("priority", option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </TaskModalField>
      </div>

      <div className={styles.row}>
        <TaskModalField>
          <Input
            htmlFor="label"
            className={styles.field__input}
            labelClassName={styles.field__label}
            type="text"
            id="label"
            placeholder="e.g., Dev, Design, Marketing"
            value={taskDraft.label}
            onChange={(e) => updateDraft("label", e.target.value)}
          >
            Label
          </Input>
        </TaskModalField>

        <TaskModalField>
          <Input
            htmlFor="dueDate"
            className={styles.field__input}
            labelClassName={styles.field__label}
            type="date"
            id="dueDate"
            value={taskDraft.dueDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => updateDraft("dueDate", e.target.value)}
          >
            Due Date
          </Input>
        </TaskModalField>
      </div>

      <div className={styles.modal__actions}>
        <Button
          className={cancelBtnClass}
          onClick={closeTaskModal}
          type="button"
        >
          Cancel
        </Button>
        <Button className={saveBtnClass} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}

export default TaskModalForm;
