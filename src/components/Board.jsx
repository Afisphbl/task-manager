import React, { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { useTasks } from "../context/DataProvider";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModel from "./TaskModel";
import ConfirmDialog from "./ConfirmDialog";
import styles from "../styles/Board.module.css";

function Board() {
  const { tasks, filteredTasks, isDialogOpen, isAdding, moveTask } = useTasks();
  const columns = {
    todo: [...filteredTasks.filter((t) => t.column === "todo")],
    inprogress: [...filteredTasks.filter((t) => t.column === "inprogress")],
    done: [...filteredTasks.filter((t) => t.column === "done")],
  };

  const counts = {
    todo: columns.todo.length,
    inprogress: columns.inprogress.length,
    done: columns.done.length,
  };

  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 5px movement before drag starts (prevents accidental drags)
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = ({ active }) => {
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    if (active.id === over.id) return;
    moveTask(active.id, over.id);
  };

  const dotStyle = [
    "var(--col-todo-dot)",
    "var(--col-inprogress-dot)",
    "var(--col-done-dot)",
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <section className={styles.board}>
        {isDialogOpen && (
          <ConfirmDialog
            task="Delete Task?"
            desc="This action cannot be undone. The task will be permanently removed."
            cancel="Cancel"
            confirm="Delete"
          />
        )}

        {isAdding && <TaskModel />}

        {Object.keys(columns).map((col, i) => (
          <Column
            id={col}
            key={col}
            title={col}
            count={counts[col]}
            tasks={columns[col]}
            dotStyle={dotStyle[i]}
          />
        ))}
      </section>
      <DragOverlay>
        {activeTask && (
          <TaskCard
            id={activeTask.id}
            title={activeTask.title}
            description={activeTask.description}
            priority={activeTask.priority}
            label={activeTask.label}
            dueDate={activeTask.dueDate}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default Board;
