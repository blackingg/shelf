export const getDepartmentColor = (slug: string): string => {
  const normalized = slug.toLowerCase();

  const keywordColorRules: Array<{ keywords: string[]; color: string }> = [
    { keywords: ["all"], color: "text-gray-500" },
    { keywords: ["computer-science", "software"], color: "text-indigo-600" },
    { keywords: ["electrical", "electronic"], color: "text-yellow-600" },
    { keywords: ["mechanical"], color: "text-zinc-600" },
    { keywords: ["civil"], color: "text-stone-600" },
    { keywords: ["chemical"], color: "text-lime-600" },
    {
      keywords: ["agricultural", "agriculture", "crop", "soil", "animal"],
      color: "text-green-700",
    },
    {
      keywords: ["architecture", "building", "surveying"],
      color: "text-slate-600",
    },
    { keywords: ["urban", "estate", "quantity"], color: "text-gray-600" },
    { keywords: ["law", "jurisprudence"], color: "text-amber-700" },
    {
      keywords: ["economics", "accounting", "administration"],
      color: "text-emerald-600",
    },
    { keywords: ["medicine", "surgery", "clinical"], color: "text-red-500" },
    { keywords: ["pharmacy", "pharmac"], color: "text-blue-500" },
    { keywords: ["dentistry", "oral"], color: "text-red-400" },
    { keywords: ["biochemistry"], color: "text-teal-600" },
    {
      keywords: ["microbiology", "botany", "zoology", "science"],
      color: "text-green-500",
    },
    {
      keywords: ["physics", "mathematics", "chemistry", "geology"],
      color: "text-cyan-600",
    },
    {
      keywords: ["psychology", "sociology", "political", "demography"],
      color: "text-purple-500",
    },
    { keywords: ["education", "counseling"], color: "text-teal-500" },
    {
      keywords: ["arts", "music", "history", "english", "philosophy"],
      color: "text-fuchsia-500",
    },
    {
      keywords: ["languages", "linguistics", "communication"],
      color: "text-violet-500",
    },
    { keywords: ["geography", "environment"], color: "text-cyan-500" },
  ];

  for (const rule of keywordColorRules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.color;
    }
  }

  return "text-gray-500"; // Fallback color
};
