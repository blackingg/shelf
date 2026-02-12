import { FcGoogle } from "react-icons/fc";

export const SocialLoginButton: React.FC<{
  provider: "google";
  onClick?: () => void;
}> = ({ provider, onClick }) => {
  const icons = {
    google: <FcGoogle className="w-5 h-5 mr-3" />,
  };

  const labels = {
    google: "Continue with Google",
  };

  return (
    <button
      onClick={onClick}
      className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm font-semibold text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
    >
      {icons[provider]}
      {labels[provider]}
    </button>
  );
};
