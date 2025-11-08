/**
 * Department options for the company
 */
export const DEPARTMENTS = [
  "Accounting",
  "HR",
  "IT",
  "Management",
  "Sales (PKW)",
  "Engineering (PKW)",
  "Field Service (PKW)",
  "Field Service Turn Knife (PKW)",
  "Sales (PKF)",
  "Engineering (PKF)",
  "Field Service (PKF)",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

