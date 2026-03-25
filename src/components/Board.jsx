import React from "react";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { Menu, X } from "lucide-react";
// import { TASK_ACTIONS, useTasks } from "../context/DataProvider";
import Column from "./Column";
import TaskCardPreview from "./TaskCardPreview";
import TaskModal from "./TaskModel";
import ConfirmDialog from "./ConfirmDialog";
import { TaskModalProvider } from "../context/TaskModalContext";
import { useBoardData, useBoardUI } from "../context/BoardContext";
import styles from "../styles/Board.module.css";

function Board() {
  const {
    isDeleteDialogOpen,
    isTaskModalOpen,
    columnOrder,
    columnLabels,
    counts,
    sensors,
    handleDragEnd,
    dotStyle,
  } = useBoardData();

  const {
    activeTask,
    activeMobileColumn,
    isMobileMenuOpen,
    isMobileView,
    handleDragStart,
    handleSelectMobileColumn,
    setIsMobileMenuOpen,
  } = useBoardUI();

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

        {isTaskModalOpen && (
          <TaskModalProvider>
            <TaskModal />
          </TaskModalProvider>
        )}

        {columnOrder.map((col) => (
          <Column
            id={col}
            key={col}
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
        {activeTask && <TaskCardPreview {...activeTask} />}
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
