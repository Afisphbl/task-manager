import React, { createContext, useCallback, useContext, useState } from "react";
import { INITIAL_TASKS } from "../data/taskData";

const tasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filteredTasks, setFilteredTasks] = useState([...tasks]);
  const [isAdding, setIsAdding] = useState(false);
  const [column, setColumn] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  function onUpdateTasks(updatedTasks) {
    setTasks((prev) => [updatedTasks, ...prev]);
  }

  const onSearchTasks = useCallback(
    (searchTerm) => {
      const term = searchTerm.trim().toLowerCase();

      if (!term) {
        setFilteredTasks(tasks);
        return;
      }

      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term),
      );

      setFilteredTasks(filtered);
    },
    [tasks],
  );

  function onAddTask(col) {
    setIsAdding(true);
    setColumn(col);
  }

  function onToggleAdd() {
    setIsAdding((prev) => !prev);
    setColumn("");
  }

  function onAddNewTask(newTask) {
    setTasks((prev) => [newTask, ...prev]);
  }

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
        filteredTasks,
        isAdding,
        column,
        isDialogOpen,
        selectedTaskId,
        onUpdateTasks,
        onSearchTasks,
        onAddTask,
        onToggleAdd,
        onAddNewTask,
        onDeleteTask,
        toggleDialog,
        selectTask,
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
