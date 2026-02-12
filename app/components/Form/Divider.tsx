export const Divider: React.FC<{ text?: string }> = ({
  text = "Or continue with",
}) => (
  <div className="my-8">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-100 dark:border-neutral-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
        <span className="px-4 bg-white dark:bg-neutral-900 text-gray-400 dark:text-neutral-500">
          {text}
        </span>
      </div>
    </div>
  </div>
);
