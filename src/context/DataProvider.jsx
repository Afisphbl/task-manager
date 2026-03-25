import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";

const TasksStateContext = createContext();
const TasksDispatchContext = createContext();

const INITIAL_STATE = {
  tasks: localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [],
  editingTask: {},
  searchTerm: "",
  isTaskModalOpen: false,
  selectedColumn: "",
  isDeleteDialogOpen: false,
  pendingDeleteTaskId: null,
};

export const TASK_ACTIONS = {
  UPSERT_TASK: "UPSERT_TASK",
  CHANGE_TASK_STAGE: "CHANGE_TASK_STAGE",
  MOVE_TASK: "MOVE_TASK",
  START_EDIT_TASK: "START_EDIT_TASK",
  SET_SEARCH_TERM: "SET_SEARCH_TERM",
  TOGGLE_TASK_MODAL: "TOGGLE_TASK_MODAL",
  OPEN_TASK_MODAL_FOR_COLUMN: "OPEN_TASK_MODAL_FOR_COLUMN",
  DELETE_TASK: "DELETE_TASK",
  TOGGLE_DELETE_DIALOG: "TOGGLE_DELETE_DIALOG",
  SELECT_TASK_FOR_DELETE: "SELECT_TASK_FOR_DELETE",
};

const tasksReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.UPSERT_TASK: {
      const existingTask = state.tasks.find(
        (taskItem) => taskItem.id === action.payload.id,
      );
      let nextTasks;

      if (existingTask) {
        nextTasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
      } else {
        nextTasks = [action.payload, ...state.tasks];
      }

      return {
        ...state,
        tasks: nextTasks,
        editingTask: {},
      };
    }

    case TASK_ACTIONS.CHANGE_TASK_STAGE:
      const { taskId, nextColumn } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, column: nextColumn } : task,
        ),
      };

    case TASK_ACTIONS.MOVE_TASK: {
      const { activeId, overId } = action.payload;
      const fromIndex = state.tasks.findIndex((task) => task.id === activeId);

      if (fromIndex === -1) return state;

      const nextTasks = [...state.tasks];
      const isColumnDrop = ["todo", "inprogress", "done"].includes(overId);

      if (isColumnDrop) {
        if (nextTasks[fromIndex].column === overId) return state;
        nextTasks[fromIndex] = {
          ...nextTasks[fromIndex],
          column: overId,
        };
        return {
          ...state,
          tasks: nextTasks,
        };
      }

      const toIndex = state.tasks.findIndex((task) => task.id === overId);
      if (toIndex === -1) return state;

      // Update column when crossing columns
      nextTasks[fromIndex] = {
        ...nextTasks[fromIndex],
        column: nextTasks[toIndex].column,
      };

      return {
        ...state,
        tasks: arrayMove(nextTasks, fromIndex, toIndex),
      };
    }

    case TASK_ACTIONS.START_EDIT_TASK:
      const taskToEdit = state.tasks.find((task) => task.id === action.payload);
      return {
        ...state,
        editingTask: taskToEdit,
        isTaskModalOpen: true,
      };

    case TASK_ACTIONS.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case TASK_ACTIONS.TOGGLE_TASK_MODAL:
      return {
        ...state,
        isTaskModalOpen: !state.isTaskModalOpen,
        selectedColumn: "",
        editingTask: {},
      };

    case TASK_ACTIONS.OPEN_TASK_MODAL_FOR_COLUMN:
      return {
        ...state,
        isTaskModalOpen: true,
        selectedColumn: action.payload,
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        isDeleteDialogOpen: false,
        pendingDeleteTaskId: null,
      };

    case TASK_ACTIONS.TOGGLE_DELETE_DIALOG:
      return {
        ...state,
        isDeleteDialogOpen: !state.isDeleteDialogOpen,
      };

    case TASK_ACTIONS.SELECT_TASK_FOR_DELETE:
      return {
        ...state,
        pendingDeleteTaskId: action.payload,
        isDeleteDialogOpen: !state.isDeleteDialogOpen,
      };

    default:
      throw new Error("No action type found in tasksReducer");
  }
};

export function TasksProvider({ children }) {
  const [state, dispatch] = useReducer(tasksReducer, INITIAL_STATE);

  const filteredTasks = useMemo(() => {
    const term = state.searchTerm.trim().toLowerCase();

    if (!term) return state.tasks;

    return state.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term),
    );
  }, [state.tasks, state.searchTerm]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(state.tasks));
  }, [state.tasks]);

  const stateValue = useMemo(
    () => ({
      state,
      filteredTasks,
    }),
    [state, filteredTasks],
  );

  return (
    <TasksDispatchContext.Provider value={dispatch}>
      <TasksStateContext.Provider value={stateValue}>
        {children}
      </TasksStateContext.Provider>
    </TasksDispatchContext.Provider>
  );
}

export function useTasksState() {
  const context = useContext(TasksStateContext);
  if (context === undefined) {
    throw new Error("useTasksState must be used within a TasksProvider");
  }
  return context;
}

export function useTasksDispatch() {
  const context = useContext(TasksDispatchContext);
  if (context === undefined) {
    throw new Error("useTasksDispatch must be used within a TasksProvider");
  }
  return context;
}

export function useTasks() {
  const { state, filteredTasks } = useTasksState();
  const dispatch = useTasksDispatch();
  return { state, filteredTasks, dispatch };
}
