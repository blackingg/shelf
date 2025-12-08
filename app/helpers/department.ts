import { DEPARTMENTS } from "../data/department";

export const getDepartmentName = (departmentId: string): string => {
  const department = DEPARTMENTS.find((dep) => dep.id === departmentId);
  return department ? department.name : departmentId;
};
