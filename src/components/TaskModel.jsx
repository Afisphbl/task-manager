import React, { useEffect, useRef, useState } from "react";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import styles from "../styles/TaskModal.module.css";

function TaskModel() {
  const { editTask, column, onToggleAdd, onAddNewTask } = useTasks();
  const ref = useRef();
  const [error, setError] = useState(false);
  const [newTask, setNewTask] = useState({
    id: editTask.id || crypto.randomUUID(),
    title: editTask.title || "",
    description: editTask.description || "",
    priority: editTask.priority || "",
    label: editTask.label || "",
    dueDate: editTask.dueDate || "",
    column: editTask.column || column,
    createdAt: new Date().toISOString(),
  });

  const minDate =
    newTask.column === "todo" || newTask.column === "inprogress"
      ? new Date().toISOString().split("T")[0]
      : "";
  const maxDate =
    newTask.column === "done" ? new Date().toISOString().split("T")[0] : "";

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
    ref.current.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (newTask.title === "") {
      setError(true);
      return;
    }

    onAddNewTask(newTask);
    onToggleAdd();
    setError(false);
    setNewTask({
      title: "",
      description: "",
      priority: "",
      label: "",
      dueDate: "",
      column: column,
      createdAt: new Date().toISOString(),
    });
  }
  return (
    <div className={styles.overlay} onClick={onToggleAdd}>
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Create New Task</h2>
          <Button className={closeBtnClass} onClick={onToggleAdd}>
            &times;
          </Button>
        </div>

        <form className={styles.modal__form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <Input
              htmlFor="title"
              ref={ref}
              className={`${styles.field__input} ${error ? styles.field__input__error : ""}`}
              labelClassName={styles.field__label}
              type="text"
              id="title"
              placeholder="e.g., Fix navigation bug on mobile"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            >
              Task Title <span className={styles.field__required}>*</span>
            </Input>
            {error && (
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
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
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
                value={newTask.column}
                onChange={(e) =>
                  setNewTask({ ...newTask, column: e.target.value })
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
                    className={`${styles[`${priorityClass}`]} ${styles[`${priorityClass}__${option.value}`]} ${newTask.priority === option.value ? styles[`${priorityClass}__active`] : ""}`}
                    onClick={() =>
                      setNewTask({ ...newTask, priority: option.value })
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
                value={newTask.label}
                onChange={(e) =>
                  setNewTask({ ...newTask, label: e.target.value })
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
                value={newTask.dueDate}
                min={minDate}
                max={maxDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              >
                Due Date
              </Input>
            </div>
          </div>

          <div className={styles.modal__actions}>
            <Button
              className={cancelBtnClass}
              onClick={onToggleAdd}
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

export default TaskModel;
