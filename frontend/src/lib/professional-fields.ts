// The values must match the ProfessionalField enum in the backend exactly
export const professionalFieldOptions = [
  { value: "teacher", label: "Teacher" },
  { value: "school_social_work", label: "School social work" },
  { value: "early_childhood_education", label: "Daycare" },
  { value: "youth_welfare", label: "Youth welfare office" },
  { value: "education_administration", label: "Education administration" },
];

// Turns a stored value like "school_social_work" into a readable label like "School social work"
export function getProfessionalFieldLabel(value: string): string {
  const matchingOption = professionalFieldOptions.find(
    (fieldOption) => fieldOption.value === value,
  );

  // Fallback: show the raw value if it is not in the list
  return matchingOption ? matchingOption.label : value;
}
