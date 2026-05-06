"use client";

import { useEffect, useState } from "react";
import { api } from "@/app/lib/api/fetcher";
import { Department } from "@/app/types/departments";

const DEPARTMENT_COLOR_CLASSES = [
  "text-slate-500",
  "text-indigo-600",
  "text-violet-600",
  "text-cyan-600",
  "text-amber-600",
  "text-emerald-600",
  "text-rose-500",
  "text-teal-600",
  "text-fuchsia-500",
  "text-blue-500",
  "text-green-600",
  "text-zinc-500",
] as const;

const DEPARTMENT_COLOR_RULES: Array<{
  keywords: string[];
  color: string;
}> = [
  { keywords: ["all"], color: "text-gray-500" },
  {
    keywords: ["computer-science", "software", "computer", "computing"],
    color: "text-indigo-600",
  },
  {
    keywords: ["electrical", "electronic", "electronics", "telecom"],
    color: "text-amber-600",
  },
  {
    keywords: ["mechanical", "mechatronics", "marine"],
    color: "text-zinc-500",
  },
  {
    keywords: ["civil", "construction", "structural"],
    color: "text-stone-600",
  },
  { keywords: ["chemical", "chemistry", "process"], color: "text-lime-600" },
  {
    keywords: ["agricultural", "agriculture", "crop", "soil", "animal"],
    color: "text-green-600",
  },
  {
    keywords: [
      "architecture",
      "building",
      "surveying",
      "urban",
      "estate",
      "quantity",
    ],
    color: "text-slate-500",
  },
  { keywords: ["law", "jurisprudence"], color: "text-amber-700" },
  {
    keywords: [
      "economics",
      "accounting",
      "administration",
      "management",
      "business",
    ],
    color: "text-emerald-600",
  },
  {
    keywords: ["medicine", "surgery", "clinical", "health"],
    color: "text-red-500",
  },
  { keywords: ["pharmacy", "pharmac"], color: "text-blue-500" },
  { keywords: ["dentistry", "oral"], color: "text-red-400" },
  { keywords: ["biochemistry"], color: "text-teal-600" },
  {
    keywords: ["microbiology", "botany", "zoology", "science", "biology"],
    color: "text-green-500",
  },
  {
    keywords: ["physics", "mathematics", "chemistry", "geology", "statistics"],
    color: "text-cyan-600",
  },
  {
    keywords: ["psychology", "sociology", "political", "demography", "social"],
    color: "text-purple-500",
  },
  { keywords: ["education", "counseling", "teaching"], color: "text-teal-500" },
  {
    keywords: [
      "arts",
      "music",
      "history",
      "english",
      "philosophy",
      "literature",
    ],
    color: "text-fuchsia-500",
  },
  {
    keywords: ["languages", "linguistics", "communication", "mass-comm"],
    color: "text-violet-500",
  },
  {
    keywords: ["geography", "environment", "environmental"],
    color: "text-cyan-500",
  },
];

const departmentColorCache = new Map<string, string>();
let departmentColorLoadPromise: Promise<void> | null = null;

const normalizeKey = (value: string) => value.trim().toLowerCase();

const matchesDepartmentKeywords = (value: string) => {
  const normalized = normalizeKey(value);

  for (const rule of DEPARTMENT_COLOR_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.color;
    }
  }

  return null;
};

const hashString = (value: string) => {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
};

const fallbackDepartmentColor = (slug: string) => {
  const normalized = normalizeKey(slug);

  if (!normalized) {
    return "text-gray-500";
  }

  const matchedColor = matchesDepartmentKeywords(normalized);
  if (matchedColor) {
    return matchedColor;
  }

  return DEPARTMENT_COLOR_CLASSES[
    hashString(normalized) % DEPARTMENT_COLOR_CLASSES.length
  ];
};

const buildDepartmentColorMap = (departments: Department[]) => {
  const colorMap = new Map<string, string>();

  departments.forEach((department) => {
    const keywordColor =
      matchesDepartmentKeywords(`${department.slug} ${department.name}`) ||
      fallbackDepartmentColor(department.slug);

    colorMap.set(normalizeKey(department.slug), keywordColor);
  });

  return colorMap;
};

const loadDepartmentColors = async () => {
  if (departmentColorLoadPromise) {
    return departmentColorLoadPromise;
  }

  departmentColorLoadPromise = api
    .get<Department[]>("/departments/")
    .then((departments) => {
      departmentColorCache.clear();
      const colorMap = buildDepartmentColorMap(departments);

      colorMap.forEach((color, slug) => {
        departmentColorCache.set(slug, color);
      });
    })
    .catch(() => undefined)
    .finally(() => {
      departmentColorLoadPromise = null;
    });

  return departmentColorLoadPromise;
};

export const getDepartmentColor = (slug: string): string => {
  const normalized = normalizeKey(slug);
  return (
    departmentColorCache.get(normalized) || fallbackDepartmentColor(normalized)
  );
};

export const useDepartmentColor = (slug: string | null | undefined) => {
  const normalized = normalizeKey(slug || "");
  const [colorClass, setColorClass] = useState(() =>
    normalized ? getDepartmentColor(normalized) : "text-gray-500",
  );

  useEffect(() => {
    let active = true;

    if (!normalized) {
      setColorClass("text-gray-500");
      return () => {
        active = false;
      };
    }

    const syncColor = () => {
      if (!active) return;
      setColorClass(getDepartmentColor(normalized));
    };

    syncColor();
    void loadDepartmentColors().then(syncColor);

    return () => {
      active = false;
    };
  }, [normalized]);

  return colorClass;
};
