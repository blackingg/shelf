export const getDepartmentColor = (slug: string): string => {
  const normalized = slug.toLowerCase();

  const keywordColorRules: Array<{ keywords: string[]; color: string }> = [
    { keywords: ["all"], color: "bg-gray-500" },
    { keywords: ["computer-science", "software"], color: "bg-indigo-600" },
    { keywords: ["electrical", "electronic"], color: "bg-yellow-600" },
    { keywords: ["mechanical"], color: "bg-zinc-600" },
    { keywords: ["civil"], color: "bg-stone-600" },
    { keywords: ["chemical"], color: "bg-lime-600" },
    {
      keywords: ["agricultural", "agriculture", "crop", "soil", "animal"],
      color: "bg-green-700",
    },
    {
      keywords: ["architecture", "building", "surveying"],
      color: "bg-slate-600",
    },
    { keywords: ["urban", "estate", "quantity"], color: "bg-gray-600" },
    { keywords: ["law", "jurisprudence"], color: "bg-amber-700" },
    {
      keywords: ["economics", "accounting", "administration"],
      color: "bg-emerald-600",
    },
    { keywords: ["medicine", "surgery", "clinical"], color: "bg-red-500" },
    { keywords: ["pharmacy", "pharmac"], color: "bg-blue-500" },
    { keywords: ["dentistry", "oral"], color: "bg-red-400" },
    { keywords: ["biochemistry"], color: "bg-teal-600" },
    {
      keywords: ["microbiology", "botany", "zoology", "science"],
      color: "bg-green-500",
    },
    {
      keywords: ["physics", "mathematics", "chemistry", "geology"],
      color: "bg-cyan-600",
    },
    {
      keywords: ["psychology", "sociology", "political", "demography"],
      color: "bg-purple-500",
    },
    { keywords: ["education", "counseling"], color: "bg-teal-500" },
    {
      keywords: ["arts", "music", "history", "english", "philosophy"],
      color: "bg-fuchsia-500",
    },
    {
      keywords: ["languages", "linguistics", "communication"],
      color: "bg-violet-500",
    },
    { keywords: ["geography", "environment"], color: "bg-cyan-500" },
  ];

  for (const rule of keywordColorRules) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.color;
    }
  }

  return "bg-gray-500"; // Fallback color
};
