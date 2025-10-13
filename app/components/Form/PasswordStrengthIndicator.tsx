export const PasswordStrengthIndicator: React.FC<{
  password: string;
}> = ({ password }) => {
  const checkStrength = (pwd: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (pwd.length >= 8) score += 1;
    else feedback.push("At least 8 characters");

    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push("One lowercase letter");

    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push("One uppercase letter");

    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push("One number");

    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    else feedback.push("One special character");

    return { score, feedback };
  };

  const { score, feedback } = checkStrength(password);

  const getColor = (s: number) => {
    if (s <= 2) return "bg-red-500";
    if (s <= 3) return "bg-yellow-500";
    if (s <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getText = (s: number) => {
    if (s <= 2) return "Weak";
    if (s <= 3) return "Fair";
    if (s <= 4) return "Good";
    return "Strong";
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2 mb-1">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getColor(
              score
            )}`}
            style={{ width: `${(score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">
          {getText(score)}
        </span>
      </div>
      {feedback.length > 0 && (
        <div className="text-xs text-gray-500">
          {feedback.slice(0, 2).join(", ")}
        </div>
      )}
    </div>
  );
};
