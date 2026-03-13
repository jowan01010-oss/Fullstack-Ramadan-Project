import { useEffect } from "react";
import { createPortal } from "react-dom";
import Crescent from "../assets/Crescent.svg";
import type { TaskCardProps } from "./TaskCard";
import type { Task } from "../api";

type TaskModalProps = TaskCardProps & {
  open: boolean;
  onClose: () => void;
  onToggleCompleted?: () => void;
  onUpdate?: (changes: Partial<Task>) => void; 
  onDelete?: () => void;
};

const TaskModal = ({
  open,
  onClose,
  onToggleCompleted,
  onUpdate, 
  onDelete,
  title,
  description,
  date,
  activeCrescents = 0,
  summary = [],
  volunteersNeeded,
  completed = false,
  completedOn,
}: TaskModalProps) => {

 
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-(--panel-deep) ${
          completed 
            ? "border border-(--gold-cream) shadow-[0_0_40px_8px_rgba(212,175,55,0.22)]" 
            : "border border-(--gold-cream)/50 shadow-[0_0_40px_6px_rgba(212,175,55,0.15)]"
        } rounded-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--gold-cream)/20">
          <h2 className="flex-1 text-center font-bold text-(--gold-cream) text-sm tracking-[0.15em] uppercase">
            {title} Task Details
          </h2>
          <button onClick={onClose} className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-[#FFF1AA]/40 text-[#FFF1AA]/80 hover:border-[#FFF1AA] hover:text-[#FFF1AA]">
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-bold text-(--gold-primary) text-3xl font-lexend">{title}</h1>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={Crescent}
                  className={"w-7 h-7 " + (i < activeCrescents ? "crescent-active" : "crescent-inactive")}
                />
              ))}
            </div>
            <p className="font-semibold text-(--gold-cream) text-sm">Date: {date}</p>
          </div>

          <div className="border-t border-(--gold-cream)/15" />

          {/* Description & Summary */}
          <div>
            <p className="font-bold text-(--gold-primary) text-sm mb-1">Description</p>
            <p className="text-amber-100/80 text-sm leading-relaxed">{description}</p>
          </div>

          {/* Banner Completed */}
          {completed && (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center w-full justify-center gap-4">
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
                <span className="text-(--gold-bright) text-2xl font-bold uppercase">Completed</span>
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
              </div>
            </div>
          )}

          {/* ── Buttons Section ── */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={() => {
                console.log(">>> تم الضغط على زر الإكمال داخل المودال!");
                if (onToggleCompleted) {
                    onToggleCompleted();
                } else {
                    console.error(">>> خطأ: دالة onToggleCompleted غير موجودة في الـ Props!");
                }
              }}
              className={`w-full py-3 rounded-full font-bold text-sm tracking-widest transition-all ${
                completed 
                ? "border-2 border-[#D4AF37] text-[#D4AF37]" 
                : "bg-linear-to-r from-[#C9A227] to-[#E8C84A] text-[#0A1128] shadow-[0_0_18px_rgba(212,175,55,0.3)]"
              }`}
            >
              {completed ? "✓ COMPLETED" : "MARK AS COMPLETED"}
            </button>

            <div className="flex gap-3">
              <button onClick={() => onDelete?.()} className="flex-1 py-2 rounded-full border border-red-400/40 text-red-400/70 text-sm font-bold hover:border-red-400 hover:text-red-400">
                DELETE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;