export type TabId = "about" | "resume" | "portfolio" | "contact" | "gallery";

export type PortfolioPayload = {
  profile: {
    name: string;
    title: string;
    email: string;
    phone: string | null;
    location: string | null;
    bio: string;
    avatarUrl: string | null;
    resumeUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    twitterUrl: string | null;
    websiteUrl: string | null;
    footerText: string | null;
  };
  settings: {
    aboutTitle: string;
    highlightsTitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    resumeTitle: string;
    experienceTitle: string;
    educationTitle: string;
    skillsTitle: string;
    portfolioTitle: string;
    contactTitle: string;
    contactDetailsTitle: string;
    contactFormTitle: string;
    galleryTitle: string;
  };
  highlights: { id: string; value: string; label: string }[];
  experiences: {
    id: string;
    company: string;
    role: string;
    location: string | null;
    period: string;
    description: string;
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    period: string;
    description: string | null;
  }[];
  skillGroups: {
    id: string;
    name: string;
    skills: { id: string; name: string }[];
  }[];
  projects: {
    id: string;
    title: string;
    url: string | null;
    description: string;
    content: string | null;
    imageUrl: string | null;
    featured: boolean;
    accessMode: "link" | "hidden" | "request";
  }[];
  gallery: {
    id: string;
    imageUrl: string;
    caption: string | null;
  }[];
};
