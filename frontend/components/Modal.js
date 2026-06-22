"use client";

import Button from "./Button";

export default function Modal({ title, children, isOpen, onClose, footer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <Button variant="ghost" className="h-9 min-h-9 px-3" onClick={onClose} type="button">
            X
          </Button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-3 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
