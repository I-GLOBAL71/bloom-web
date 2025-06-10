import { create } from 'zustand';

type SectionId = 'users' | 'credits' | 'messages' | 'moderation' | 'stats' | 'settings';

interface AdminState {
  activeSectionId: SectionId;
  setActiveSection: (section: SectionId) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  activeSectionId: 'users',
  setActiveSection: (sectionId) => set({ activeSectionId: sectionId })
}));