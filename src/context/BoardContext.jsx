import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { TASK_ACTIONS, useTasksDispatch, useTasksState } from "./DataProvider";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";

const BoardDataContext = createContext();
const BoardUIContext = createContext();

const COLUMN_ORDER = ["todo", "inprogress", "done"];
const COLUMN_LABELS = {
  todo: "Todo",
  inprogress: "In Progress",
  done: "Done",
};
const DOT_STYLE = [
  "var(--col-todo-dot)",
  "var(--col-inprogress-dot)",
  "var(--col-done-dot)",
];

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
  const { state, filteredTasks } = useTasksState();
  const dispatch = useTasksDispatch();
  const { tasks, isDeleteDialogOpen, isTaskModalOpen } = state;
  const columns = useMemo(
    () => ({
      todo: filteredTasks.filter((task) => task.column === "todo"),
      inprogress: filteredTasks.filter((task) => task.column === "inprogress"),
      done: filteredTasks.filter((task) => task.column === "done"),
    }),
    [filteredTasks],
  );

  const counts = useMemo(
    () => ({
      todo: columns.todo.length,
      inprogress: columns.inprogress.length,
      done: columns.done.length,
    }),
    [columns],
  );

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

  const handleDragStart = useCallback(
    ({ active }) => {
      const currentTask = tasks.find((task) => task.id === active.id);
      boardDispatch({ type: "SET_ACTIVE_TASK", payload: currentTask || null });
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      boardDispatch({ type: "SET_ACTIVE_TASK", payload: null });
      if (!over) return;
      if (active.id === over.id) return;
      dispatch({
        type: TASK_ACTIONS.MOVE_TASK,
        payload: { activeId: active.id, overId: over.id },
      });
    },
    [dispatch],
  );

  const handleSelectMobileColumn = useCallback((columnId) => {
    boardDispatch({ type: "SET_ACTIVE_MOBILE_COLUMN", payload: columnId });
  }, []);

  const setIsMobileMenuOpen = useCallback((isOpen) => {
    boardDispatch({ type: "IS_MOBILE_MENU_OPEN", payload: isOpen });
  }, []);

  const dataValue = useMemo(
    () => ({
      isDeleteDialogOpen,
      isTaskModalOpen,
      columnOrder: COLUMN_ORDER,
      columnLabels: COLUMN_LABELS,
      columns,
      counts,
      sensors,
      dotStyle: DOT_STYLE,
      handleDragEnd,
    }),
    [
      isDeleteDialogOpen,
      isTaskModalOpen,
      columns,
      counts,
      sensors,
      handleDragEnd,
    ],
  );

  const uiValue = useMemo(
    () => ({
      activeTask: boardState.activeTask,
      activeMobileColumn: boardState.activeMobileColumn,
      isMobileMenuOpen: boardState.isMobileMenuOpen,
      isMobileView: boardState.isMobileView,
      handleDragStart,
      handleSelectMobileColumn,
      setIsMobileMenuOpen,
    }),
    [
      boardState.activeTask,
      boardState.activeMobileColumn,
      boardState.isMobileMenuOpen,
      boardState.isMobileView,
      handleDragStart,
      handleSelectMobileColumn,
      setIsMobileMenuOpen,
    ],
  );

  return (
    <BoardDataContext.Provider value={dataValue}>
      <BoardUIContext.Provider value={uiValue}>
        {children}
      </BoardUIContext.Provider>
    </BoardDataContext.Provider>
  );
}

function useBoardData() {
  const context = useContext(BoardDataContext);
  if (context === undefined)
    throw new Error("useBoardData must be used within a BoardProvider");

  return context;
}

function useBoardUI() {
  const context = useContext(BoardUIContext);
  if (context === undefined)
    throw new Error("useBoardUI must be used within a BoardProvider");

  return context;
}

function useBoard() {
  return {
    ...useBoardData(),
    ...useBoardUI(),
  };
}

export { BoardProvider, useBoard, useBoardData, useBoardUI };
