export const StepHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center mb-10">
    <div className="inline-flex items-center justify-center bg-primary/5 dark:bg-white/5 w-14 h-14 rounded-sm mb-6 border border-primary/10 dark:border-white/5">
      {icon}
    </div>
    <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
      {title}
    </h2>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] mx-auto leading-relaxed">
      {description}
    </p>
  </div>
);
