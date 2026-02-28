export const INITIAL_TASKS = [
  {
    id: "seed-1",
    title: "Research competitors",
    description:
      "Review top 3 market leaders and document their authentication flows.",
    priority: "high",
    label: "Research",
    dueDate: "",
    column: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "Draft User Stories",
    description:
      "Create user stories for the new dashboard widget implementation.",
    priority: "medium",
    label: "Design",
    dueDate: "",
    column: "todo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    title: "API Integration",
    description:
      "Connect frontend with the new REST API endpoints for user data.",
    priority: "high",
    label: "Dev",
    dueDate: "",
    column: "inprogress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    title: "Landing Page Copy",
    description: "Finalize headlines and subheadlines for the marketing site.",
    priority: "medium",
    label: "Copywriting",
    dueDate: "",
    column: "inprogress",
    createdAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    title: "Q3 Planning Meeting",
    description: "Meeting notes and slide deck distribution.",
    priority: "low",
    label: "Admin",
    dueDate: "",
    column: "done",
    createdAt: new Date().toISOString(),
  },
];

// export function initTasks(defaultTasks) {
//   try {
//     const saved = localStorage.getItem("taskflow_tasks");
//     if (saved) {
//       const parsed = JSON.parse(saved);
//       // Support both the old { tasks: [...] } shape and the new plain array
//       if (Array.isArray(parsed)) return parsed;
//       if (Array.isArray(parsed?.tasks)) return parsed.tasks;
//     }
//   } catch (err) {
//     console.warn("Could not load tasks from localStorage", err);
//   }
//   return defaultTasks;
// }
