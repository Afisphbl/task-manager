import React, { useEffect, useRef, useState } from "react";
import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import styles from "../styles/TaskModal.module.css";

function TaskModal() {
  const { state, dispatch } = useTasks();
  const { editingTask, selectedColumn } = state;
  const titleInputRef = useRef();
  const [hasTitleError, setHasTitleError] = useState(false);
  const [taskDraft, setTaskDraft] = useState({
    id: editingTask.id || crypto.randomUUID(),
    title: editingTask.title || "",
    description: editingTask.description || "",
    priority: editingTask.priority || "",
    label: editingTask.label || "",
    dueDate: editingTask.dueDate || "",
    column: editingTask.column || selectedColumn,
    createdAt: new Date().toISOString(),
  });

  const minDate =
    taskDraft.column === "todo" || taskDraft.column === "inprogress"
      ? new Date().toISOString().split("T")[0]
      : "";
  const maxDate =
    taskDraft.column === "done" ? new Date().toISOString().split("T")[0] : "";

  const closeBtnClass = `${styles.modal__closeBtn}`;

  const cancelBtnClass = `${styles.btn__cancel}`;

  const saveBtnClass = `${styles.btn__save}`;

  const priorityClass = "priority__btn";

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    titleInputRef.current.focus();
  }, []);

  function handleFormSubmit(event) {
    event.preventDefault();

    if (taskDraft.title === "") {
      setHasTitleError(true);
      return;
    }

    dispatch({ type: TASK_ACTIONS.UPSERT_TASK, payload: taskDraft });
    dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_MODAL });
    setHasTitleError(false);
    setTaskDraft({
      title: "",
      description: "",
      priority: "",
      label: "",
      dueDate: "",
      column: selectedColumn,
      createdAt: new Date().toISOString(),
    });
  }
  return (
    <div
      className={styles.overlay}
      onClick={() => dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_MODAL })}
    >
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Create New Task</h2>
          <Button
            className={closeBtnClass}
            onClick={() => dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_MODAL })}
          >
            &times;
          </Button>
        </div>

        <form className={styles.modal__form} onSubmit={handleFormSubmit}>
          <div className={styles.field}>
            <Input
              htmlFor="title"
              ref={titleInputRef}
              className={`${styles.field__input} ${hasTitleError ? styles.field__input__error : ""}`}
              labelClassName={styles.field__label}
              type="text"
              id="title"
              placeholder="e.g., Fix navigation bug on mobile"
              value={taskDraft.title}
              onChange={(e) =>
                setTaskDraft({ ...taskDraft, title: e.target.value })
              }
            >
              Task Title <span className={styles.field__required}>*</span>
            </Input>
            {hasTitleError && (
              <p className={styles.field__error}>Task title is required</p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="desc" className={styles.field__label}>
              Description
            </label>
            <textarea
              name="desc"
              id="desc"
              className={styles.field__textarea}
              placeholder="Add detailed information about the task..."
              value={taskDraft.description}
              onChange={(e) =>
                setTaskDraft({ ...taskDraft, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="column" className={styles.field__label}>
                Column
              </label>
              <select
                name="column"
                id="column"
                className={styles.field__select}
                value={taskDraft.column}
                onChange={(e) =>
                  setTaskDraft({ ...taskDraft, column: e.target.value })
                }
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className={styles.field}>
              <p className={styles.field__label}>Priority</p>
              <div className={styles.priority__group}>
                {priorityOptions.map((option) => (
                  <Button
                    type="button"
                    key={option.value}
                    className={`${styles[`${priorityClass}`]} ${styles[`${priorityClass}__${option.value}`]} ${taskDraft.priority === option.value ? styles[`${priorityClass}__active`] : ""}`}
                    onClick={() =>
                      setTaskDraft({ ...taskDraft, priority: option.value })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <Input
                htmlFor="label"
                className={styles.field__input}
                labelClassName={styles.field__label}
                type="text"
                id="label"
                placeholder="e.g., Dev, Design, Marketing"
                value={taskDraft.label}
                onChange={(e) =>
                  setTaskDraft({ ...taskDraft, label: e.target.value })
                }
              >
                Label
              </Input>
            </div>

            <div className={styles.field}>
              <Input
                htmlFor="dueDate"
                className={styles.field__input}
                labelClassName={styles.field__label}
                type="date"
                id="dueDate"
                value={taskDraft.dueDate}
                min={minDate}
                max={maxDate}
                onChange={(e) =>
                  setTaskDraft({ ...taskDraft, dueDate: e.target.value })
                }
              >
                Due Date
              </Input>
            </div>
          </div>

          <div className={styles.modal__actions}>
            <Button
              className={cancelBtnClass}
              onClick={() => dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_MODAL })}
              type="button"
            >
              Cancel
            </Button>
            <Button className={saveBtnClass} type="submit">
              Save
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskModal;
