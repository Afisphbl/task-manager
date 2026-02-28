import React, { createContext, useContext, useState } from "react";
import { INITIAL_TASKS } from "../data/taskData";

const tasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  function onUpdateTasks(updatedTasks) {
    setTasks((prev) => [updatedTasks, ...prev]);
  }

  function onDeleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }
  return (
    <tasksContext.Provider value={{ tasks, onUpdateTasks, onDeleteTask }}>
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
