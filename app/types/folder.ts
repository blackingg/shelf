export type Folder = {
  type: "folder";
  id: string;
  name: string;
  bookCount: number;
  isPublic: boolean;
  coverImages?: string[];
  createdBy?: string;
};