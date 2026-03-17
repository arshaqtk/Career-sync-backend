export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentTitle: string;
  totalYearsExp: number;
  summary: string;
  skills: string[];
  languages: string[];
  education: {
    school: string;
    degree: string;
    startDate: string | null;
    endDate: string | null;
    year: number | null;
  }[];
  experience: {
    role: string;
    company: string;
    startDate: string | null;
    endDate: string | null;
    description: string;
  }[];
}
