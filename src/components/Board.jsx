import React from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { Menu, X } from "lucide-react";
// import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModel";
import ConfirmDialog from "./ConfirmDialog";
import { useBoard } from "../context/BoardContext";
import styles from "../styles/Board.module.css";

function Board() {
  const {
    boardState,
    isDeleteDialogOpen,
    isTaskModalOpen,
    columnOrder,
    columnLabels,
    columns,
    counts,
    sensors,
    handleDragStart,
    handleDragEnd,
    dotStyle,
    handleSelectMobileColumn,
    setIsMobileMenuOpen,
  } = useBoard();

  const { activeTask, activeMobileColumn, isMobileMenuOpen, isMobileView } =
    boardState;

  const boardContent = (
    <>
      <div className={styles.mobileControls}>
        <button
          type="button"
          className={styles.mobileMenuBtn}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-column-menu"
          aria-label="Choose board column"
          onClick={() => setIsMobileMenuOpen(isMobileMenuOpen ? false : true)}
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
