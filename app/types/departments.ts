export interface Departments {
  id: string;
  name: string;
  color: string;
}

export const DEPARTMENTS: Departments[] = [
  { id: "all", name: "All", color: "bg-gray-500" },

  { id: "computer-science", name: "Computer Science", color: "bg-indigo-500" },
  {
    id: "software-engineering",
    name: "Software Engineering",
    color: "bg-indigo-600",
  },

  { id: "medicine", name: "Medicine", color: "bg-red-500" },
  { id: "nursing", name: "Nursing", color: "bg-red-400" },
  { id: "public-health", name: "Public Health", color: "bg-red-300" },
  { id: "dentistry", name: "Dentistry", color: "bg-red-600" },
  {
    id: "veterinary-medicine",
    name: "Veterinary Medicine",
    color: "bg-red-700",
  },

  { id: "law", name: "Law", color: "bg-red-800" },

  { id: "economics", name: "Economics", color: "bg-emerald-500" },
  {
    id: "business-admin",
    name: "Business Administration",
    color: "bg-emerald-600",
  },

  { id: "psychology", name: "Psychology", color: "bg-orange-600" },
  { id: "mass-communication", name: "Mass Communication", color: "bg-sky-600" },
  {
    id: "languages-communication",
    name: "Languages & Communication",
    color: "bg-sky-700",
  },
  { id: "education", name: "Education", color: "bg-amber-600" },
  { id: "social-work", name: "Social Work", color: "bg-orange-500" },

  { id: "architecture", name: "Architecture", color: "bg-teal-600" },
  {
    id: "fine-arts",
    name: "Fine Arts / Creative Arts",
    color: "bg-pink-500",
  },

  { id: "civil-engineering", name: "Civil Engineering", color: "bg-cyan-600" },
  {
    id: "mechanical-engineering",
    name: "Mechanical Engineering",
    color: "bg-cyan-700",
  },
  {
    id: "electrical-engineering",
    name: "Electrical Engineering",
    color: "bg-cyan-500",
  },
  {
    id: "chemical-engineering",
    name: "Chemical Engineering",
    color: "bg-cyan-800",
  },
  {
    id: "agricultural-engineering",
    name: "Agricultural Engineering",
    color: "bg-lime-600",
  },
  { id: "engineering", name: "General Engineering", color: "bg-cyan-400" },

  { id: "pharmacy", name: "Pharmacy", color: "bg-rose-600" },

  { id: "biochemistry", name: "Biochemistry", color: "bg-green-600" },
  {
    id: "industrial-chemistry",
    name: "Industrial Chemistry",
    color: "bg-green-700",
  },

  {
    id: "environmental-science",
    name: "Environmental Science",
    color: "bg-lime-700",
  },
];
