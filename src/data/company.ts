export interface EditorialItem { title: string; description: string }
export interface Service extends EditorialItem { id: string }
export interface Team { title: string; qualifications: readonly string[] }
export interface CredibilityPillar { title: string; description?: string }

export interface Company {
  brand: string;
  profileName: string;
  foundedYear: number;
  industry: string;
  tagline: string;
  introduction: string;
  approach: string;
  mission: string;
  vision: string;
  opening: { label: string; headline: readonly string[]; introduction: string; supportingStatement: string };
  philosophy: { heading: string; paragraphs: readonly string[] };
  values: readonly EditorialItem[];
  approachStages: readonly EditorialItem[];
  closing: { heading: readonly string[]; body: string; signature: string };
  profilePortfolio: { completed: number; ongoing: number; upcoming: number; note: string };
  services: readonly Service[];
  teams: readonly Team[];
  credibilityPillars: readonly CredibilityPillar[];
  contact: {
    phones: readonly { display: string; href: string }[];
    email: string;
    proposedEmail: { address: string; verified: boolean };
    enquiryDeliveryConfigured: boolean;
    address: readonly string[];
    instagram: { handle: string; url: string };
  };
  brandStatements: { purpose: string; aboutHeading: string; contactHeading: string };
}

// Latest approved client messaging takes precedence over the historical profile.
// Detailed Why Choose explanations were not supplied; only approved titles are published.
export const company: Company = {
  brand: 'WER1 Group',
  profileName: 'WeR1 Infra',
  foundedYear: 2022,
  industry: 'Real Estate Development',
  tagline: 'Constructing Happiness',
  introduction: 'Founded in 2022, WeR1 Infra is a construction and real estate company delivering residential and commercial developments. With a growing portfolio of completed, ongoing, and upcoming projects, the company combines disciplined execution, collaborative partnerships, and a commitment to quality, transparency, and timely delivery.',
  approach: 'Trust, transparency and timely delivery guide our approach to construction and real estate.',
  mission: 'Building with quality, safety, integrity, and innovation to create lasting value for society through excellence and sustainable development.',
  vision: 'To grow as a trusted construction company recognized for excellence, integrity, innovation, and the successful delivery of landmark projects that contribute to a better future.',
  opening: {
    label: 'WER1 GROUP',
    headline: ['Transforming Land.', 'Elevating Lifestyles.', 'Constructing Happiness.'],
    introduction: 'At WeR1 Group, we are committed to developing spaces that bring together thoughtful planning, quality construction and lasting value. From residential communities to commercial developments, our focus is on creating meaningful spaces built on trust, designed with purpose and made for a better tomorrow.',
    supportingStatement: 'Building Excellence. Creating Happiness.',
  },
  philosophy: {
    heading: 'Development with a Purpose.',
    paragraphs: [
      'At WeR1 Group, we believe real estate development is about more than transforming land or constructing buildings. It is about understanding people, their aspirations and the way they want to live.',
      'Whether it is a redevelopment initiative, a joint venture with a landowner, a plotted development or a residential or commercial project, our approach begins with understanding the requirements, expectations and needs of the people involved.',
      'We strive to create well-planned spaces that improve everyday living, unlock development potential and deliver lasting value for customers, partners and communities.',
    ],
  },
  values: [
    { title: 'Quality & Excellence', description: 'We are committed to quality construction, attention to detail and professional standards that contribute to lasting value.' },
    { title: 'Integrity & Transparency', description: 'We believe in honest communication, responsible decisions and building relationships founded on trust.' },
    { title: 'Responsibility & Safety', description: 'We value responsible construction practices, attention to safety and accountability throughout project execution.' },
    { title: 'Innovation & Progress', description: 'We encourage thoughtful planning and continuous improvement to create developments that respond to evolving needs.' },
    { title: 'Long-Term Value', description: 'We aim to create spaces that serve practical needs, contribute to better living and deliver lasting value to stakeholders.' },
  ],
  approachStages: [
    { title: 'Understand & Plan', description: 'We begin by understanding project requirements, evaluating opportunities and establishing a clear direction for planning and development.' },
    { title: 'Collaborate & Coordinate', description: 'We work with landowners, customers, consultants and project stakeholders to align objectives and coordinate project requirements.' },
    { title: 'Execute with Care', description: 'We focus on construction quality, engineering coordination, safety and disciplined execution throughout the development process.' },
    { title: 'Deliver Lasting Value', description: 'Our goal is to deliver functional, well-planned residential and commercial spaces while maintaining transparency and a focus on long-term value.' },
  ],
  closing: {
    heading: ["We Don't Just Develop Land.", 'We Create Better Ways to Live.'],
    body: "Every piece of land holds potential. Every project holds a vision. At WeR1 Group, we bring these together to create spaces shaped by people's needs, driven by thoughtful development and built around a better standard of living.",
    signature: 'WeR1 Group — Constructing Happiness.',
  },
  profilePortfolio: { completed: 3, ongoing: 2, upcoming: 2, note: 'Historical company-profile counts. The client now approves one public Upcoming entry named Punawale; no measurements are combined.' },
  services: [
    { id: 'real-estate-development', title: 'Real Estate Development', description: 'Identifying opportunities and transforming land into thoughtfully planned residential and commercial developments that balance functionality, quality and long-term value.' },
    { id: 'redevelopment', title: 'Redevelopment Projects', description: 'Reimagining existing properties and communities through redevelopment solutions designed to make better use of available spaces and meet evolving lifestyle needs.' },
    { id: 'joint-ventures', title: 'Joint-Venture Projects', description: 'Building collaborative partnerships with landowners and stakeholders to unlock development potential and create mutually beneficial opportunities through shared vision and coordinated execution.' },
    { id: 'land-development', title: 'Land Development & Plotting', description: 'Transforming land into well-planned plots with a focus on thoughtful layouts, accessibility and development potential, subject to applicable approvals and regulations.' },
    { id: 'construction', title: 'Residential & Commercial Construction', description: 'Delivering residential and commercial projects with an emphasis on planning, construction quality, practical design and disciplined project execution.' },
  ],
  teams: [
    { title: 'Management Team', qualifications: ["Holds master's degrees", 'Project planning and execution expertise', 'Stakeholder relationship management'] },
    { title: 'Engineering Team', qualifications: ['Civil engineering professionals', '5+ years of field experience', 'Focus on construction quality and precision'] },
  ],
  credibilityPillars: [
    { title: 'Comprehensive Development Capabilities' },
    { title: 'A Customer-Centric Approach' },
    { title: 'Collaborative Partnerships' },
    { title: 'Quality-Focused Execution' },
    { title: 'A Vision for Better Living' },
  ],
  contact: {
    phones: [{ display: '+91 9011881133', href: 'tel:+919011881133' }, { display: '+91 7887700722', href: 'tel:+917887700722' }],
    email: 'wer1infra@gmail.com',
    proposedEmail: { address: 'enquiry@wer1group.in', verified: false },
    enquiryDeliveryConfigured: false,
    address: ['VTP Altitude,', 'Aundh–Ravet BRTS Road,', 'Wakad, Pune – 411033,', 'Maharashtra, India.'],
    instagram: { handle: '@wer1_group', url: 'https://www.instagram.com/wer1_group?vrfl=amszYmQ3cGVmbnk1' },
  },
  brandStatements: { purpose: 'Building Excellence. Creating Happiness.', aboutHeading: 'Creating spaces built for generations.', contactHeading: 'Together, We Build the Future.' },
};
