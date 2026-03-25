import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  TASK_ACTIONS,
  useTasksDispatch,
  useTasksState,
} from "./DataProvider";

const TaskModalContext = createContext();

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

function createDraft(editingTask, selectedColumn) {
  return {
    id: editingTask.id || crypto.randomUUID(),
    title: editingTask.title || "",
    description: editingTask.description || "",
    priority: editingTask.priority || "",
    label: editingTask.label || "",
    dueDate: editingTask.dueDate || "",
    column: editingTask.column || selectedColumn,
    createdAt: editingTask.createdAt || new Date().toISOString(),
  };
}

function TaskModalProvider({ children }) {
  const { state } = useTasksState();
  const dispatch = useTasksDispatch();
  const { editingTask, selectedColumn } = state;

  const titleInputRef = useRef();
  const [hasTitleError, setHasTitleError] = useState(false);
  const [taskDraft, setTaskDraft] = useState(() =>
    createDraft(editingTask, selectedColumn),
  );

  useEffect(() => {
    setTaskDraft(createDraft(editingTask, selectedColumn));
    setHasTitleError(false);
  }, [editingTask, selectedColumn]);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const minDate =
    taskDraft.column === "todo" || taskDraft.column === "inprogress"
      ? today
      : "";
  const maxDate = taskDraft.column === "done" ? today : "";

  function closeTaskModal() {
    dispatch({ type: TASK_ACTIONS.TOGGLE_TASK_MODAL });
  }

  function updateDraft(field, value) {
    setTaskDraft((prev) => ({ ...prev, [field]: value }));
  }

  function submitTask(event) {
    event.preventDefault();

    if (taskDraft.title.trim() === "") {
      setHasTitleError(true);
      return;
    }

    dispatch({ type: TASK_ACTIONS.UPSERT_TASK, payload: taskDraft });
    closeTaskModal();
  }

  const value = {
    taskDraft,
    hasTitleError,
    titleInputRef,
    minDate,
    maxDate,
    priorityOptions: PRIORITY_OPTIONS,
    updateDraft,
    submitTask,
    closeTaskModal,
  };

  return (
    <TaskModalContext.Provider value={value}>
      {children}
    </TaskModalContext.Provider>
  );
}

function useTaskModal() {
  const context = useContext(TaskModalContext);

  if (context === undefined) {
    throw new Error("useTaskModal must be used within a TaskModalProvider");
  }

  return context;
}

export { TaskModalProvider, useTaskModal };
