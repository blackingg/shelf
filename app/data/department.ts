import { Departments } from "../types/departments";

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

export const DEPARTMENT_BOOKS = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "/books/psychology.jpg",
    rating: 4.8,
    pages: 256,
    readingCount: 1203,
    reviews: 210,
    description:
      "Explores the timeless lessons on wealth, greed, and happiness.",
    category: "business",
    departments: ["business-admin", "psychology"],
  },

  {
    id: 5,
    title: "The Bees",
    author: "Laline Paull",
    coverImage: "/books/bees.jpg",
    rating: 4.8,
    pages: 384,
    readingCount: 720,
    reviews: 140,
    description: "A brilliantly imagined dystopian story set in a hive.",
    category: "scifi",
    departments: ["fine-arts", "veterinary-medicine"],
  },

  {
    id: 7,
    title: "Batman: Year One",
    author: "Frank Miller",
    coverImage: "/books/batman.jpg",
    rating: 4.9,
    pages: 200,
    readingCount: 950,
    reviews: 85,
    description: "An iconic comic series detailing Batman's early days.",
    category: "comics",
    departments: ["fine-arts"],
  },

  {
    id: 8,
    title: "Watchmen",
    author: "Alan Moore",
    coverImage: "/books/watchmen.jpg",
    rating: 4.9,
    pages: 448,
    readingCount: 1850,
    reviews: 312,
    description:
      "A groundbreaking graphic novel that redefined the superhero genre.",
    category: "comics",
    departments: ["fine-arts"],
  },

  {
    id: 9,
    title: "The Sandman Vol. 1",
    author: "Neil Gaiman",
    coverImage: "/books/sandman.jpg",
    rating: 4.8,
    pages: 240,
    readingCount: 1420,
    reviews: 268,
    description:
      "The master of dreams embarks on an epic journey through myth and reality.",
    category: "comics",
    departments: ["fine-arts"],
  },

  {
    id: 10,
    title: "Saga Vol. 1",
    author: "Brian K. Vaughan",
    coverImage: "/books/saga.jpg",
    rating: 4.7,
    pages: 160,
    readingCount: 890,
    reviews: 142,
    description: "An epic space opera about family, love, and war.",
    category: "comics",
    departments: ["fine-arts"],
  },

  {
    id: 11,
    title: "National Geographic - Wildlife Edition",
    author: "National Geographic",
    coverImage: "/books/natgeo.jpg",
    rating: 4.6,
    pages: 120,
    readingCount: 560,
    reviews: 78,
    description: "Stunning photography and stories from the natural world.",
    category: "magazines",
    departments: ["agric-environment", "life-sciences"],
  },

  {
    id: 12,
    title: "The Atlantic - Technology & Society",
    author: "The Atlantic",
    coverImage: "/books/atlantic.jpg",
    rating: 4.5,
    pages: 96,
    readingCount: 445,
    reviews: 65,
    description: "In-depth analysis of technology's impact on modern society.",
    category: "magazines",
    departments: ["social-work", "computer-science", "software-engineering"],
  },

  {
    id: 13,
    title: "OAU Data Structures and Algorithms 2021/2022",
    author: "Department of Computer Science, OAU",
    coverImage: "/books/oau-dsa.jpg",
    rating: 4.4,
    pages: 320,
    readingCount: 892,
    reviews: 156,
    description:
      "Comprehensive course material covering data structures and algorithm design.",
    category: "education",
    departments: [
      "computer-science",
      "software-engineering",
      "engineering",
      "math-stats",
    ],
  },

  {
    id: 14,
    title: "Introduction to Machine Learning",
    author: "Dr. Andrew Ng",
    coverImage: "/books/ml-intro.jpg",
    rating: 4.7,
    pages: 450,
    readingCount: 1340,
    reviews: 234,
    description:
      "A foundational guide to machine learning concepts and applications.",
    category: "education",
    departments: [
      "computer-science",
      "software-engineering",
      "math-stats",
      "engineering",
    ],
  },

  {
    id: 15,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    coverImage: "/books/calculus.jpg",
    rating: 4.5,
    pages: 1368,
    readingCount: 2150,
    reviews: 387,
    description:
      "The definitive textbook for learning calculus and mathematical analysis.",
    category: "education",
    departments: ["math-stats", "engineering", "physical-sciences"],
  },

  {
    id: 16,
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    coverImage: "/books/physics.jpg",
    rating: 4.6,
    pages: 1280,
    readingCount: 1680,
    reviews: 298,
    description:
      "A comprehensive introduction to physics principles and problem-solving.",
    category: "education",
    departments: ["physical-sciences", "engineering", "math-stats"],
  },

  {
    id: 21,
    title: "Introduction to Nigerian Constitutional Law",
    author: "Prof. Ben Nwabueze",
    coverImage: "/books/constitution.jpg",
    rating: 4.7,
    pages: 520,
    readingCount: 1320,
    reviews: 210,
    description:
      "A comprehensive exploration of the Nigerian constitution, fundamental rights, and the structure of government.",
    category: "education",
    departments: ["law"],
  },
  {
    id: 22,
    title: "International Law: Principles and Practice",
    author: "Malcolm N. Shaw",
    coverImage: "/books/international-law.jpg",
    rating: 4.8,
    pages: 1450,
    readingCount: 980,
    reviews: 188,
    description:
      "A globally recognized textbook covering treaties, sovereignty, international disputes, and global legal systems.",
    category: "education",
    departments: ["law"],
  },
  {
    id: 23,
    title: "Criminal Law in Theory and Practice",
    author: "Andrew Ashworth",
    coverImage: "/books/criminal-law.jpg",
    rating: 4.6,
    pages: 760,
    readingCount: 860,
    reviews: 140,
    description:
      "An analytical guide to criminal responsibility, offences, defenses, and the modern justice system.",
    category: "education",
    departments: ["law"],
  },
];