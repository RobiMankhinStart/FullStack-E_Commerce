export const FeatureItem = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 text-center p-2 rounded-xl bg-slate-50/50">
    <div className="text-indigo-600">{icon}</div>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
      {label}
    </span>
  </div>
);
