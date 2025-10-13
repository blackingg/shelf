import { FcGoogle } from "react-icons/fc";

export const SocialLoginButton: React.FC<{
  provider: "google";
  onClick?: () => void;
}> = ({ provider, onClick }) => {
  const icons = {
    google: <FcGoogle className="w-5 h-5 mr-2" />,
  };

  const labels = {
    google: "Google",
  };

  return (
    <button
      onClick={onClick}
      className="w-full inline-flex justify-center items-center py-2.5 px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
    >
      {icons[provider]}
      {labels[provider]}
    </button>
  );
};
