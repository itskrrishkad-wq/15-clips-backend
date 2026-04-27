import {
  Target,
  Code,
  Palette,
  Camera,
  Rocket,
  Briefcase,
  Lightbulb,
  MoreHorizontal,
  Stethoscope,
  GraduationCap,
  Building2,
  Wrench,
  Truck,
  ShoppingBag,
  Mic,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";

export const Topprofessions = ["All", "Engineer", "Doctor", "Digital Marketer"];

export const PROFESSIONS = [
  // Core
  { id: "student", label: "Student", icon: Target },
  { id: "freelancer", label: "Freelancer", icon: Briefcase },
  { id: "entrepreneur", label: "Entrepreneur", icon: Rocket },

  // Tech / Creative
  { id: "developer", label: "Developer", icon: Code },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "creator", label: "Content Creator", icon: Camera },

  // Corporate / Business
  { id: "corporate", label: "Corporate Employee", icon: Building2 },
  { id: "business", label: "Business Owner", icon: ShoppingBag },
  { id: "marketing", label: "Marketing / Sales", icon: BarChart3 },
  { id: "manager", label: "Manager / Team Lead", icon: Users },

  // Public / Services
  { id: "teacher", label: "Teacher / Educator", icon: GraduationCap },
  { id: "healthcare", label: "Healthcare Worker", icon: Stethoscope },
  { id: "government", label: "Government / Public Service", icon: Shield },

  // Skilled / General workforce
  { id: "skilled_worker", label: "Skilled Worker", icon: Wrench },
  { id: "driver", label: "Driver / Transport", icon: Truck },

  // Creative / Misc
  { id: "artist", label: "Artist", icon: Lightbulb },
  { id: "media", label: "Media / Entertainment", icon: Mic },

  // Fallback
  { id: "other", label: "Other", icon: MoreHorizontal },
];
