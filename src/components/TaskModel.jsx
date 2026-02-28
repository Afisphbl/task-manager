import React, { useState } from "react";
import { useTasks } from "../context/DataProvider";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import styles from "../styles/TaskModal.module.css";

function TaskModel() {
  const { column, onToggleAdd, onAddNewTask } = useTasks();
  const [error, setError] = useState(false);
  const [newTask, setNewTask] = useState({
    id: crypto.randomUUID(),
    title: "",
    desc: "",
    priority: "",
    label: "",
    dueDate: "",
    column: column,
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
      id: crypto.randomUUID(),
      title: "",
      desc: "",
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
              className={`${styles.field__input} ${error ? styles.field__input__error : ""}`}
              labelClassName={styles.field__label}
              type="text"
              id="title"
              placeholder="e.g., Fix navigation bug on mobile"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value.trim() })
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
              value={newTask.desc}
              onChange={(e) =>
                setNewTask({ ...newTask, desc: e.target.value.trim() })
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
                  setNewTask({ ...newTask, column: e.target.value.trim() })
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
                <span
                  className={
                    styles.priority__btn + " " + styles.priority__btn__low
                  }
                  onClick={() => setNewTask({ ...newTask, priority: "low" })}
                >
                  Low
                </span>
                <span
                  className={
                    styles.priority__btn + " " + styles.priority__btn__medium
                  }
                  onClick={() => setNewTask({ ...newTask, priority: "medium" })}
                >
                  Medium
                </span>
                <span
                  className={
                    styles.priority__btn + " " + styles.priority__btn__high
                  }
                  onClick={() => setNewTask({ ...newTask, priority: "high" })}
                >
                  High
                </span>
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
                  setNewTask({ ...newTask, label: e.target.value.trim() })
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
