export const Divider: React.FC<{ text?: string }> = ({
  text = "Or continue with",
}) => (
  <div className="my-8">
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-line-subtle" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
        <span className="px-4 bg-background text-faint">
          {text}
        </span>
      </div>
    </div>
  </div>
);
