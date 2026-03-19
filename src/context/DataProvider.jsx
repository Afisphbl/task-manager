import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";

const tasksContext = createContext();

const initialState = {
  tasks1: localStorage.getItem("tasks")
    ? JSON.parse(localStorage.getItem("tasks"))
    : [],
  editTask1: {},
  searchTerm1: "",
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "onNewTaskAdd":
      const t = state.tasks1.find((t) => t.id === action.payload.id);
      let updatedTasks;

      if (t) {
        updatedTasks = state.tasks1.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
      } else {
        updatedTasks = [action.payload, ...state.tasks1];
      }

      return {
        ...state,
        tasks1: updatedTasks,
        editTask1: {},
      };

    case "onChangeTaskStage":
      const { taskId, nextColumn } = action.payload;
      return {
        ...state,
        tasks1: state.tasks1.map((task) =>
          task.id === taskId ? { ...task, column: nextColumn } : task,
        ),
      };

    case "onMoveTask": {
      const { activeId, overId } = action.payload;
      const oldIndex = state.tasks1.findIndex((t) => t.id === activeId);

      if (oldIndex === -1) return state;

      const updated = [...state.tasks1];
      const isColumnDrop = ["todo", "inprogress", "done"].includes(overId);

      if (isColumnDrop) {
        if (updated[oldIndex].column === overId) return state;
        updated[oldIndex] = {
          ...updated[oldIndex],
          column: overId,
        };
        return {
          ...state,
          tasks1: updated,
        };
      }

      const newIndex = state.tasks1.findIndex((t) => t.id === overId);
      if (newIndex === -1) return state;

      // Update column when crossing columns
      updated[oldIndex] = {
        ...updated[oldIndex],
        column: updated[newIndex].column,
      };

      return {
        ...state,
        tasks1: arrayMove(updated, oldIndex, newIndex),
      };
    }

    case "onDeleteTask":
      return {
        ...state,
        tasks1: state.tasks1.filter((t) => t.id !== action.payload),
      };

    default:
      throw new Error("No action type found in taskReducer");
  }
};

export function TasksProvider({ children }) {
  const [{ tasks1, editTask1, searchTerm1 }, dispatch] = useReducer(
    taskReducer,
    initialState,
  );
  const [editTask, setEditTask] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [column, setColumn] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return tasks1;

    return tasks1.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term),
    );
  }, [tasks1, searchTerm]);

  function moveTask(activeId, overId) {
    dispatch({ type: "onMoveTask", payload: { activeId, overId } });
  }

  function onEditTask({ id }) {
    const task = tasks1.find((t) => t.id === id);
    setEditTask(task);
    setIsAdding(true);
  }

  const onSearchTasks = useCallback((searchTerm) => {
    setSearchTerm(searchTerm);
  }, []);

  function onAddTask(col) {
    setIsAdding(true);
    setColumn(col);
    setEditTask({});
  }

  function onToggleAdd() {
    setIsAdding((prev) => !prev);
    setColumn("");
  }

  function onAddNewTask(newTask) {
    dispatch({ type: "onNewTaskAdd", payload: newTask });
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks1));
  }, [tasks1]);

  function onDeleteTask(taskId) {
    dispatch({ type: "onDeleteTask", payload: taskId });
    setSelectedTaskId(null);
    setIsDialogOpen(false);
  }

  function onChangeTaskStage(taskId, nextColumn) {
    dispatch({ type: "onChangeTaskStage", payload: { taskId, nextColumn } });
  }

  function toggleDialog() {
    setIsDialogOpen((prev) => !prev);
  }

  function selectTask(id) {
    setSelectedTaskId(id);
  }
  return (
    <tasksContext.Provider
      value={{
        tasks1,
        editTask,
        filteredTasks,
        isAdding,
        column,
        isDialogOpen,
        selectedTaskId,
        onEditTask,
        onSearchTasks,
        onAddTask,
        onToggleAdd,
        onAddNewTask,
        onDeleteTask,
        onChangeTaskStage,
        toggleDialog,
        selectTask,
        moveTask,
      }}
    >
      {children}
    </tasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(tasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
}
