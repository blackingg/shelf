export interface Departments {
  id: string;
  name: string;
  color: string;
}

export const DEPARTMENTS: Departments[] = [
  { id: "all", name: "All", color: "bg-gray-500" },

  { id: "math-stats", name: "Mathematics & Statistics", color: "bg-blue-500" },
  { id: "cs-it", name: "Computer Science & IT", color: "bg-indigo-500" },
  {
    id: "engineering-tech",
    name: "Engineering & Technology",
    color: "bg-cyan-600",
  },

  {
    id: "physical-sciences",
    name: "Physical Sciences",
    color: "bg-purple-600",
  },
  {
    id: "life-sciences",
    name: "Biological & Life Sciences",
    color: "bg-green-600",
  },

  {
    id: "medical-health",
    name: "Medical & Health Sciences",
    color: "bg-red-500",
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical Sciences",
    color: "bg-rose-600",
  },

  {
    id: "agric-environment",
    name: "Agricultural & Environmental Sciences",
    color: "bg-lime-600",
  },

  {
    id: "business-finance",
    name: "Business & Finance",
    color: "bg-emerald-500",
  },
  {
    id: "social-humanities",
    name: "Social Sciences & Humanities",
    color: "bg-orange-500",
  },

  {
    id: "arts-design",
    name: "Arts, Design & Creative Studies",
    color: "bg-pink-500",
  },
  { id: "law-political", name: "Law & Political Studies", color: "bg-red-700" },

  { id: "education", name: "Education", color: "bg-amber-600" },

  {
    id: "architecture-design",
    name: "Architecture & Built Environment",
    color: "bg-teal-600",
  },

  {
    id: "languages-communication",
    name: "Languages, Literature & Communication",
    color: "bg-sky-600",
  },

  {
    id: "philosophy-religion",
    name: "Religion, Philosophy & Cultural Studies",
    color: "bg-violet-600",
  },
];
