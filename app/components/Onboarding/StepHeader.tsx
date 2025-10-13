export const StepHeader: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center bg-emerald-100 w-14 h-14 rounded-full mb-4">
      {icon}
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
    <p className="text-gray-700">{description}</p>
  </div>
);
