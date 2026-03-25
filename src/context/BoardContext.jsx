import { createContext, useContext, useEffect, useReducer } from "react";
import { TASK_ACTIONS, useTasks } from "./DataProvider";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

const BoardContext = createContext();

const INITIAL_BOARD_STATE = {
  activeTask: null,
  activeMobileColumn: "todo",
  isMobileMenuOpen: false,
  isMobileView:
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case "SET_MOBILE_VIEW":
      return {
        ...state,
        isMobileView: action.payload,
      };

    case "SET_ACTIVE_TASK":
      return {
        ...state,
        activeTask: action.payload,
      };

    case "SET_ACTIVE_MOBILE_COLUMN":
      return {
        ...state,
        activeMobileColumn: action.payload,
        isMobileMenuOpen: false,
      };

    case "IS_MOBILE_MENU_OPEN":
      return {
        ...state,
        isMobileMenuOpen: action.payload,
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

function BoardProvider({ children }) {
  const [boardState, boardDispatch] = useReducer(
    boardReducer,
    INITIAL_BOARD_STATE,
  );
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 5px movement before drag starts (prevents accidental drags)
      activationConstraint: { distance: 5 },
    }),
  );

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia("(max-width: 767px)");
    const handleMediaQueryChange = (event) =>
      boardDispatch({ type: "SET_MOBILE_VIEW", payload: event.matches });

    boardDispatch({
      type: "SET_MOBILE_VIEW",
      payload: mobileMediaQuery.matches,
    });
    mobileMediaQuery.addEventListener("change", handleMediaQueryChange);

    return () =>
      mobileMediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, [boardDispatch]);

  const handleDragStart = ({ active }) => {
    const currentTask = tasks.find((task) => task.id === active.id);
    boardDispatch({ type: "SET_ACTIVE_TASK", payload: currentTask || null });
  };

  const handleDragEnd = ({ active, over }) => {
    boardDispatch({ type: "SET_ACTIVE_TASK", payload: null });
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
    boardDispatch({ type: "SET_ACTIVE_MOBILE_COLUMN", payload: columnId });
  };

  const setIsMobileMenuOpen = (isOpen) => {
    boardDispatch({ type: "IS_MOBILE_MENU_OPEN", payload: isOpen });
  };

  const value = {
    boardState,
    tasks,
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
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined)
    throw new Error("useBoard must be used within a BoardProvider");

  return context;
}

export { BoardProvider, useBoard };
