export interface TeamArea {
  id: 'management' | 'engineering';
  title: string;
  description: string;
  image?: string;
  imagePosition?: string;
}

// Add approved planning/engineering image paths here when available.
// Until then, the panels use decorative architectural linework, not substitute photos.
export const teamAreas: readonly TeamArea[] = [
  {
    id: 'management', title: 'MANAGEMENT TEAM',
    description: "Holding master's degrees, our management team brings specialized expertise in project planning, execution, and stakeholder relations.",
  },
  {
    id: 'engineering', title: 'ENGINEERING TEAM',
    description: 'All engineers are civil engineering professionals with 5+ years of hands-on field experience, ensuring quality and precision.',
  },
];
