export interface Project {
  id: string;
  name: string;
  location: string;
  type: 'Residential + Commercial';
  status: string;
  phase: 'Completed' | 'Ongoing' | 'Upcoming';
  launch?: string;
  details?: string;
  areas?: readonly { label: string; value: string }[];
  image: string | null;
  imageWidth: number;
  imageHeight: number;
  scrollRange: readonly [number, number];
  side: 'left' | 'right';
  format: 'portrait' | 'wide';
}

// User-specified website presentation type overrides every source-document label.
const type = 'Residential + Commercial' as const;
export const projects: readonly Project[] = [
  { id: 'sukhada-apartment', phase: 'Completed', name: 'SUKHADA APARTMENT', location: 'Punawale', type, status: '2023', image: '/images/projects/sukhada-apartment.webp', imageWidth: 677, imageHeight: 595, scrollRange: [.08, .20], side: 'left', format: 'portrait' },
  { id: 'sinclair-place', phase: 'Completed', name: 'SINCLAIR PLACE', location: 'Punawale', type, status: '2024', image: '/images/projects/sinclair-place.webp', imageWidth: 677, imageHeight: 595, scrollRange: [.20, .32], side: 'right', format: 'portrait' },
  { id: 'aikyam', phase: 'Completed', name: 'AIKYAM', location: 'Punawale', type, status: '2025', image: '/images/projects/aikyam.webp', imageWidth: 677, imageHeight: 723, scrollRange: [.32, .44], side: 'left', format: 'portrait' },
  { id: 'marunji', phase: 'Ongoing', name: 'MARUNJI', location: 'Marunji', type, status: 'Completion 2027', image: '/images/projects/marunji.webp', imageWidth: 871, imageHeight: 960, scrollRange: [.44, .56], side: 'right', format: 'portrait' },
  { id: 'punawale-phase-1', phase: 'Upcoming', launch: 'Early 2027', details: 'Located along Aundh–Ravet BRT Road, this planned development brings together contemporary residential and commercial spaces.', areas: [{ label: 'Land', value: '50,000' }, { label: 'Residential space', value: '1,63,000' }, { label: 'Commercial space', value: '61,000' }], name: 'PUNAWALE PHASE 1', location: 'Punawale', type, status: 'Launching 2027', image: null, imageWidth: 1200, imageHeight: 456, scrollRange: [.56, .68], side: 'left', format: 'wide' },
  { id: 'punawale-phase-2', phase: 'Upcoming', launch: 'End of 2027', details: 'Planned along the emerging Aundh–Ravet BRT Road corridor, this development focuses on refined architecture and contemporary design.', areas: [{ label: 'Land', value: '41,000' }, { label: 'Residential space', value: '2,20,000' }], name: 'PUNAWALE PHASE 2', location: 'Punawale', type, status: 'Launching 2027', image: null, imageWidth: 1200, imageHeight: 532, scrollRange: [.68, .82], side: 'right', format: 'wide' },
  { id: 'chinchwad', phase: 'Ongoing', name: 'CHINCHWAD', location: 'Chinchwad', type, status: 'Completion 2028', image: '/images/projects/chinchwad.webp', imageWidth: 960, imageHeight: 1200, scrollRange: [.82, .96], side: 'left', format: 'portrait' },
];
