import React from "react";
import { useTasks } from "../context/DataProvider";
import Column from "./Column";
import TaskModel from "./TaskModel";
import ConfirmDialog from "./ConfirmDialog";
import styles from "../styles/Board.module.css";

function Board() {
  const { tasks, isDialogOpen } = useTasks();
  const columns = {
    todo: [...tasks.filter((t) => t.column === "todo")],
    inprogress: [...tasks.filter((t) => t.column === "inprogress")],
    done: [...tasks.filter((t) => t.column === "done")],
  };

  const counts = {
    todo: columns.todo.length,
    inprogress: columns.inprogress.length,
    done: columns.done.length,
  };

  return (
    <section className={styles.board}>
      {isDialogOpen && (
        <ConfirmDialog
          task="Delete Task?"
          desc="This action cannot be undone. The task will be permanently removed."
          cancel="Cancel"
          confirm="Delete"
        />
      )}
      <TaskModel />
      {Object.keys(columns).map((col) => (
        <Column
          key={col}
          title={col}
          count={counts[col]}
          tasks={columns[col]}
        />
      ))}
    </section>
  );
}

export default Board;
