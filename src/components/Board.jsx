import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { Menu, X } from "lucide-react";
import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModel";
import ConfirmDialog from "./ConfirmDialog";
import styles from "../styles/Board.module.css";

function Board() {
  const { state, filteredTasks, dispatch } = useTasks();
  const { tasks, isDeleteDialogOpen, isTaskModalOpen } = state;
  const columnOrder = ["todo", "inprogress", "done"];
  const columnLabels = {
    todo: "Todo",
    inprogress: "In Progress",
    done: "Done",
  };
  const columns = {
    todo: [...filteredTasks.filter((task) => task.column === "todo")],
    inprogress: [
      ...filteredTasks.filter((task) => task.column === "inprogress"),
    ],
    done: [...filteredTasks.filter((task) => task.column === "done")],
  };

  const counts = {
    todo: columns.todo.length,
    inprogress: columns.inprogress.length,
    done: columns.done.length,
  };

  const [activeTask, setActiveTask] = useState(null);
  const [activeMobileColumn, setActiveMobileColumn] = useState("todo");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 5px movement before drag starts (prevents accidental drags)
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaQueryChange = (event) => setIsMobileView(event.matches);

    setIsMobileView(mobileMediaQuery.matches);
    mobileMediaQuery.addEventListener("change", handleMediaQueryChange);

    return () =>
      mobileMediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, []);

  const handleDragStart = ({ active }) => {
    const currentTask = tasks.find((task) => task.id === active.id);
    setActiveTask(currentTask || null);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    if (active.id === over.id) return;
    dispatch({
      type: TASK_ACTIONS.MOVE_TASK,
      payload: { activeId: active.id, overId: over.id },
    });
  };

  const dotStyle = [
    "var(--col-todo-dot)",
    "var(--col-inprogress-dot)",
    "var(--col-done-dot)",
  ];

  const handleSelectMobileColumn = (columnId) => {
    setActiveMobileColumn(columnId);
    setIsMobileMenuOpen(false);
  };

  const boardContent = (
    <>
      <div className={styles.mobileControls}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-column-menu"
          aria-label="Choose board column"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{columnLabels[activeMobileColumn]}</span>
        </button>

        {isMobileMenuOpen && (
          <div id="mobile-column-menu" className={styles.mobileMenu}>
            {columnOrder.map((columnId) => (
              <button
                key={columnId}
                type="button"
                className={`${styles.mobileMenuItem} ${
                  activeMobileColumn === columnId
                    ? styles.mobileMenuItemActive
                    : ""
                }`}
                onClick={() => handleSelectMobileColumn(columnId)}
              >
                <span
                  className={styles.mobileMenuDot}
                  style={{
                    backgroundColor: dotStyle[columnOrder.indexOf(columnId)],
                  }}
                />
                {columnLabels[columnId]}
                <span className={styles.mobileMenuCount}>
                  {counts[columnId]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <section className={styles.board}>
        {isDeleteDialogOpen && (
          <ConfirmDialog
            task="Delete Task?"
            desc="This action cannot be undone. The task will be permanently removed."
            cancel="Cancel"
            confirm="Delete"
          />
        )}

        {isTaskModalOpen && <TaskModal />}

        {columnOrder.map((col, i) => (
          <Column
            id={col}
            key={col}
            title={col}
            count={counts[col]}
            tasks={columns[col]}
            dotStyle={dotStyle[i]}
            dragDisabled={isMobileView}
            className={
              activeMobileColumn === col
                ? `${styles.mobileVisible}`
                : `${styles.mobileHidden}`
            }
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
    </>
  );

  if (isMobileView) {
    return boardContent;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {boardContent}
    </DndContext>
  );
}

export default Board;
