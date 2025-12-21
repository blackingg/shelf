export const getDepartmentColor = (slug: string): string => {
  const colorMap: Record<string, string> = {
    "all": "bg-gray-500",
    "computer-science": "bg-blue-600",
    "software-engineering": "bg-indigo-600",
    "medicine": "bg-red-500",
    "nursing": "bg-pink-500",
    "public-health": "bg-rose-500",
    "dentistry": "bg-red-400",
    "veterinary-medicine": "bg-orange-500",
    "law": "bg-amber-700",
    "economics": "bg-green-600",
    "business-admin": "bg-emerald-600",
    "psychology": "bg-purple-500",
    "mass-communication": "bg-violet-500",
    "languages-communication": "bg-purple-400",
    "education": "bg-teal-500",
    "social-work": "bg-cyan-500",
    "architecture": "bg-slate-600",
    "fine-arts": "bg-fuchsia-500",
    "civil-engineering": "bg-stone-600",
    "mechanical-engineering": "bg-zinc-600",
    "electrical-engineering": "bg-yellow-600",
    "chemical-engineering": "bg-lime-600",
    "agricultural-engineering": "bg-green-700",
    "engineering": "bg-gray-700",
    "pharmacy": "bg-blue-500",
    "biochemistry": "bg-teal-600",
    "industrial-chemistry": "bg-cyan-600",
    "environmental-science": "bg-green-500",
  };

  return colorMap[slug] || "bg-gray-500"; // Fallback color
};
