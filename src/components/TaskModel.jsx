import React from "react";
import Button from "./ReUsedComponents/Button";
import Input from "./ReUsedComponents/Input";
import styles from "../styles/TaskModal.module.css";

function TaskModel() {
  const closeBtnClass = `${styles.modal__closeBtn}`;

  const btnPriorityClass = `${styles.priority__btn}`;

  const btnLowClass = `${btnPriorityClass} ${styles.priority__btn__low}`;

  const btnMediumClass = `${btnPriorityClass} ${styles.priority__btn__medium}`;

  const btnHighClass = `${btnPriorityClass} ${styles.priority__btn__high}`;

  const cancelBtnClass = `${styles.btn__cancel}`;

  const saveBtnClass = `${styles.btn__save}`;
  return (
    <div className={styles.overlay}>
      <section className={styles.modal}>
        <div className={styles.modal__header}>
          <h2 className={styles.modal__title}>Create New Task</h2>
          <Button className={closeBtnClass}>&times;</Button>
        </div>

        <form className={styles.modal__form}>
          <div className={styles.field}>
            <Input
              htmlFor="title"
              className={styles.field__input}
              labelClassName={styles.field__label}
              type="text"
              id="title"
              placeholder="e.g., Fix navigation bug on mobile"
            >
              Task Title <span className={styles.field__required}>*</span>
            </Input>
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
              >
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.field__label}>Priority</label>
              <div className={styles.priority__group}>
                <Button className={btnLowClass}>Low</Button>
                <Button className={btnMediumClass}>Medium</Button>
                <Button className={btnHighClass}>High</Button>
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
              >
                Due Date
              </Input>
            </div>
          </div>

          <div className={styles.modal__actions}>
            <Button className={cancelBtnClass}>Cancel</Button>
            <Button className={saveBtnClass}>Save</Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskModel;
