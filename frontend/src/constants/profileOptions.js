export const branchOptions = [
  "computer science engineering",
  "computer science engineering (artificial intelligence and machine learning)",
  "electronics and communication engineering",
  "mechanical engineering",
  "civil engineering",
  "electrical engineering",
  "biotechnology",
];

export const defaultRoleOptions = ["student", "faculty"];

export const roleLabel = (role) => {
  const labels = {
    student: "student",
    faculty: "faculty",
    admin: "admin",
  };

  return labels[role] || role;
};
