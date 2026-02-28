import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { arrayMove } from "@dnd-kit/sortable";

const tasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });
  const [editTask, setEditTask] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [column, setColumn] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const filteredTasks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return tasks;

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term),
    );
  }, [tasks, searchTerm]);

  function moveTask(activeId, overId) {
    setTasks((tasks) => {
      const oldIndex = tasks.findIndex((t) => t.id === activeId);
      if (oldIndex === -1) return tasks;

      const updated = [...tasks];
      const isColumnDrop = ["todo", "inprogress", "done"].includes(overId);

      if (isColumnDrop) {
        if (updated[oldIndex].column === overId) return tasks;
        updated[oldIndex] = {
          ...updated[oldIndex],
          column: overId,
        };
        return updated;
      }

      const newIndex = tasks.findIndex((t) => t.id === overId);
      if (newIndex === -1) return tasks;

      // Update column when crossing columns
      updated[oldIndex] = {
        ...updated[oldIndex],
        column: updated[newIndex].column,
      };

      return arrayMove(updated, oldIndex, newIndex);
    });
  }

  function onEditTask({ id }) {
    const task = tasks.find((t) => t.id === id);
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
    const t = tasks.find((t) => t.id === newTask.id);
    if (t) {
      setTasks((prev) =>
        prev.map((task) => (task.id === newTask.id ? newTask : task)),
      );
    } else {
      setTasks((prev) => [newTask, ...prev]);
    }

    setEditTask({});
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function onDeleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskId(null);
    setIsDialogOpen(false);
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
        tasks,
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
