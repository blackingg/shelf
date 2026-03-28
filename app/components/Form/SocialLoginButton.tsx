import { FcGoogle } from "react-icons/fc";

export const SocialLoginButton: React.FC<{
  provider: "google";
  onClick?: () => void;
  isLoading?: boolean;
  loader?: React.ReactNode;
}> = ({ provider, onClick, isLoading = false, loader }) => {
  const icons = {
    google: <FcGoogle className="w-5 h-5 mr-3" />,
  };

  const labels = {
    google: "Continue with Google",
  };

  return (
    <button
      onClick={onClick}
      className="w-full inline-flex justify-center items-center py-3 px-4 rounded-sm border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 text-sm font-medium text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer"
      disabled={isLoading}
    >
      {isLoading && loader ? (
        <span className="mr-2">{loader}</span>
      ) : (
        icons[provider]
      )}
      {isLoading ? "Loading..." : labels[provider]}
    </button>
  );
};
