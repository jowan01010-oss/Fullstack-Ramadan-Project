// ─────────────────────────────────────────────────────────────
// Build this file step by step as you complete each component:
//
//   Step 2  → build the background (SVG, lanterns, gold frame) 
//   Step 3  → import Header        → add <Header /> inside the frame
//   Step 4  → import Input         → add <Input /> below Header
//   Step 5b → import TaskCard      → add useState, import data.json, render card grid
//   Step 6b → import ParticleBackground → add <ParticleBackground /> first in root div
//   Step 7b → import TaskModal     → add handleToggleCompleted + wire <TaskModal />
//   Step 9  → connect to the Flask backend (useEffect + handleSubmit)
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import backGroundPattern from "./assets/Background Vector.svg";
import lanternRight from "./assets/Right lanterns.png";
import lanternLeft from "./assets/left lanterns.png";
import Header from "./components/Header";
import Input from "./components/Input";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import ParticleBackground from "./components/ParticleBackground";
import { getAllTasks, completeTask, updateTask, deleteTask } from "./api";
import type { Task } from "./api";

function App() {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  // ── Task 1: Load tasks from the API when the page first opens ──
  // useEffect with [] runs exactly once — after the first render.
  useEffect(() => {
    getAllTasks().then(setTasks);
  }, []);

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  // Called from Input.tsx after a new task is created.
  // Adds the new task to the list without re-fetching everything.
  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  
  // Toggle a task between completed / not completed.
const handleToggleCompleted = async (id: number) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  
  const updated = task.completed
    ? await updateTask(id, { completed: false, completedOn: undefined })
    : await completeTask(id);
    
  setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
};

  // Save edits made inside TaskModal.
  const handleUpdate = async (id: number, changes: Partial<Task>) => {
    const updated = await updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // Delete a task from TaskModal.
  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setOpenTaskId(null);
  };

  return (
    <div
      className="min-h-screen bg-(--bg-dark) text-white relative overflow-hidden font-sans flex flex-col items-center"
      style={{ backgroundImage: `url(${backGroundPattern})`, backgroundSize: "cover" }}
    >
      <ParticleBackground />

      <img src={lanternRight} alt="Right Lanterns" className="absolute top-0 right-0 w-32 md:w-70 opacity-80 z-2" />
      <img src={lanternLeft} alt="Left Lanterns" className="absolute top-0 left-0 w-32 md:w-70 opacity-80 z-2" />

      {/* Gold border frame */}
      <div className="relative z-2 mx-auto w-[95vw] h-[90vh] border-[3px] border-(--text-cream) flex flex-col items-center gap-10 py-12 px-10 shadow-2xl my-12">
        <div className="max-w-4xl flex flex-col items-center justify-start gap-6">
          <Header />
          <Input onTaskAdded={handleTaskAdded} />

          {/* Task card grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onClick={() => setOpenTaskId(task.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal — rendered outside the border frame so it overlays everything */}
      {openTaskId !== null && (
        <TaskModal
          open={true}
          onClose={() => setOpenTaskId(null)}
          onToggleCompleted={() => handleToggleCompleted(openTaskId)}
          onUpdate={(changes) => handleUpdate(openTaskId, changes)}
          onDelete={() => handleDelete(openTaskId)}
          {...tasks.find(t => t.id === openTaskId)!} 
        />
      )}
    </div>
  );
}

export default App;