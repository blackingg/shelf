export interface Categories {
  id: string;
  name: string;
  color: string;
}

export const CATEGORIES: Categories[] = [
  { id: "all", name: "All", color: "bg-gray-500" },
  { id: "scifi", name: "Sci-Fi", color: "bg-blue-500" },
  { id: "fantasy", name: "Fantasy", color: "bg-purple-500" },
  { id: "drama", name: "Drama", color: "bg-pink-500" },
  { id: "business", name: "Business", color: "bg-emerald-500" },
  { id: "education", name: "Education", color: "bg-orange-500" },
  { id: "comics", name: "Comics", color: "bg-red-500" },
  { id: "magazines", name: "Magazines", color: "bg-indigo-500" },
];

export const getCategoryName = (categoryId: string): string => {
  const category = CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.name : categoryId;
};

export const CATEGORY_NAMES: Record<string, string> = CATEGORIES.reduce(
  (categoryMap, category) => {
    categoryMap[category.id] = category.name;
    return categoryMap;
  },
  {} as Record<string, string>
);
