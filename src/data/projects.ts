import { getPublicProjects } from '../utils/projectStats';

export type ProjectStatus = 'Completed' | 'Ongoing' | 'Upcoming';

export interface Project {
  id: string;
  name: string;
  location: string;
  projectType: string | null;
  completionYear: number;
  status: ProjectStatus;
  publicationStatus?: 'published' | 'draft' | 'hidden';
  landArea: string | null;
  totalUnits: number | null;
  description: string;
  images: readonly string[];
  landscapeImage?: { src: string; width: number; height: number };
  displayOrder: number;
  isComingSoonPlaceholder: boolean;
  width: number;
  height: number;
  alt: string;
  position: string;
  detailPath?: string;
}

// Client-approved listing order; hero order is defined separately below.
// No verified units or unambiguous land areas exist for these six website entries.
// Historical Punawale measurements remain offline in assets/PROJECT_SOURCE_NOTES.md.
const projectRecords: readonly Project[] = [
  { id: 'sukhada-apartment', name: 'Sukhada Apartment', location: 'Punawale', projectType: 'Residential + Complex', completionYear: 2023, status: 'Completed', landArea: null, totalUnits: null, description: 'Sukhada Apartment marks a completed chapter in Punawale, delivered in 2023.', images: ['/media/projects/sukhada-apartment.webp'], landscapeImage: { src: '/media/projects/Landscape_Project_Assets/Sukhada_Landscape.webp', width: 1672, height: 941 }, displayOrder: 1, isComingSoonPlaceholder: false, width: 677, height: 595, alt: 'Architectural render of Sukhada Apartment in Punawale', position: '50% 50%' },
  { id: 'sinclair-place', name: 'Sinclair Place', location: 'Punawale', projectType: 'Residential + Complex', completionYear: 2024, status: 'Completed', landArea: null, totalUnits: null, description: 'Completed in 2024, Sinclair Place continues the WER1 story in Punawale.', images: ['/media/projects/sinclair-place.webp'], landscapeImage: { src: '/media/projects/Landscape_Project_Assets/Sinclair_Landscape.webp', width: 1672, height: 941 }, displayOrder: 2, isComingSoonPlaceholder: false, width: 677, height: 595, alt: 'Architectural render of Sinclair Place in Punawale', position: '50% 50%' },
  { id: 'aikyam', name: 'Aikyam', location: 'Punawale', projectType: 'Residential + Complex', completionYear: 2025, status: 'Completed', landArea: null, totalUnits: null, description: 'Aikyam brings WER1’s completed Punawale portfolio forward into 2025.', images: ['/media/projects/aikyam.webp'], landscapeImage: { src: '/media/projects/Landscape_Project_Assets/Aikyam_Landscape.webp', width: 1672, height: 941 }, displayOrder: 3, isComingSoonPlaceholder: false, width: 677, height: 723, alt: 'Architectural render of Aikyam in Punawale', position: '50% 50%' },
  { id: 'marunji', name: 'Marunji', location: 'Marunji', projectType: 'Residential + Complex', completionYear: 2027, status: 'Ongoing', landArea: null, totalUnits: null, description: 'Taking shape in Marunji, this ongoing development looks ahead to 2027.', images: ['/media/projects/marunji.webp'], landscapeImage: { src: '/media/projects/Landscape_Project_Assets/Marunji_Landscape.webp', width: 1672, height: 941 }, displayOrder: 4, isComingSoonPlaceholder: false, width: 871, height: 960, alt: 'Architectural render of Marunji', position: '50% 45%' },
  { id: 'punawale', name: 'Punawale', location: 'Punawale', projectType: 'Residential + Complex', completionYear: 2027, status: 'Upcoming', landArea: null, totalUnits: null, description: 'A new chapter in Punawale, with expected completion in 2027.', images: [], displayOrder: 5, isComingSoonPlaceholder: true, width: 1200, height: 532, alt: '', position: '50% 50%' },
  { id: 'chinchwad', name: 'Chinchwad', location: 'Chinchwad', projectType: 'Residential + Complex', completionYear: 2028, status: 'Ongoing', landArea: null, totalUnits: null, description: 'An ongoing development in Chinchwad, working towards expected completion in 2028.', images: ['/media/projects/chinchwad.webp'], landscapeImage: { src: '/media/projects/Landscape_Project_Assets/Chinchwad_Landscape.webp', width: 1672, height: 941 }, displayOrder: 6, isComingSoonPlaceholder: false, width: 960, height: 1200, alt: 'Architectural render of Chinchwad', position: '50% 45%' },
];

// Public consumers share this ordered snapshot. Future API responses can use the same selectors.
export const projects: readonly Project[] = getPublicProjects(projectRecords);

export const heroProjectIds = ['aikyam', 'chinchwad', 'sinclair-place', 'sukhada-apartment', 'marunji'] as const;
export const heroProjects: readonly Project[] = heroProjectIds.flatMap(id => {
  const project = projects.find(entry => entry.id === id);
  return project ? [project] : [];
});

export function completionLabel(project: Project): string {
  return project.status === 'Completed' ? 'Completion' : 'Expected completion';
}
