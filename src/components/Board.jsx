import React from "react";
import { useTasks } from "../context/DataProvider";
import Column, { EmptyState } from "./Column";
import TaskCard from "./TaskCard";
import styles from "../styles/Board.module.css";

function Board() {
  const { tasks } = useTasks();
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
      <Column title="to do" count={counts.todo}>
        {counts.todo === 0 && <EmptyState />}
        {columns.todo.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </Column>
      <Column title="in progress" count={counts.inprogress}>
        {counts.inprogress === 0 && <EmptyState />}
        {columns.inprogress.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </Column>
      <Column title="done" count={counts.done}>
        {counts.done === 0 && <EmptyState />}
        {columns.done.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </Column>
    </section>
  );
}

export default Board;
