import { createElement } from "react";

export default function SectionCard({ title, icon, children, className = "" }) {
  return (
    <section className={`rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-500/10 backdrop-blur sm:p-6 ${className}`}>
      <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
        {icon && (
          <span className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
            {createElement(icon, { size: 20 })}
          </span>
        )}
        <div>
          <h2 className="font-poppins text-xl font-semibold text-slate-950 sm:text-2xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
