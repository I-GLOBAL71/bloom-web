import { Briefcase, Code, Palette, Stethoscope, GraduationCap, Scale, Camera, Coffee } from 'lucide-react';

export const PROFESSION_CATEGORIES = [
  {
    name: 'Tech',
    professions: [
      { id: 'software-engineer', title: 'Software Engineer', icon: Code },
      { id: 'data-scientist', title: 'Data Scientist', icon: Briefcase },
      { id: 'product-manager', title: 'Product Manager', icon: Briefcase },
    ]
  },
  {
    name: 'Creative',
    professions: [
      { id: 'designer', title: 'Designer', icon: Palette },
      { id: 'photographer', title: 'Photographer', icon: Camera },
      { id: 'artist', title: 'Artist', icon: Palette },
    ]
  },
  {
    name: 'Healthcare',
    professions: [
      { id: 'doctor', title: 'Doctor', icon: Stethoscope },
      { id: 'nurse', title: 'Nurse', icon: Stethoscope },
      { id: 'therapist', title: 'Therapist', icon: Stethoscope },
    ]
  },
  {
    name: 'Business',
    professions: [
      { id: 'entrepreneur', title: 'Entrepreneur', icon: Briefcase },
      { id: 'consultant', title: 'Consultant', icon: Briefcase },
      { id: 'lawyer', title: 'Lawyer', icon: Scale },
    ]
  },
  {
    name: 'Education',
    professions: [
      { id: 'teacher', title: 'Teacher', icon: GraduationCap },
      { id: 'professor', title: 'Professor', icon: GraduationCap },
      { id: 'researcher', title: 'Researcher', icon: GraduationCap },
    ]
  },
  {
    name: 'Service',
    professions: [
      { id: 'chef', title: 'Chef', icon: Coffee },
      { id: 'hospitality', title: 'Hospitality', icon: Coffee },
      { id: 'other-service', title: 'Other Service', icon: Briefcase },
    ]
  }
];