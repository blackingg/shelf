import { FcGoogle } from "react-icons/fc";

export const SocialLoginButton: React.FC<{
  provider: "google";
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  loader?: React.ReactNode;
}> = ({ provider, onClick, isLoading = false, disabled = false, loader }) => {
  const icons = {
    google: <FcGoogle className="w-4 h-4 mr-2" />,
  };

  return (
    <button
      onClick={onClick}
      className={`w-full inline-flex justify-center items-center py-2 px-4 rounded-sm border border-line-subtle bg-surface text-xs font-medium text-foreground hover:bg-wash transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={isLoading || disabled}
    >
      {isLoading && loader ? (
        <span className="mr-2">{loader}</span>
      ) : (
        icons[provider]
      )}
      {isLoading ? "Loading..." : `Continue with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
    </button>
  );
};
