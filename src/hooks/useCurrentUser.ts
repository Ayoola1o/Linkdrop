import type { User } from '@/lib/types';
import { create } from 'zustand';

interface CurrentUserState {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateInterests: (interests: string[]) => void;
}

// Mock current user for demonstration
const mockUser: User = {
  id: 'user_123',
  name: 'Alex Linkdropper',
  email: 'alex@example.com',
  avatarUrl: 'https://picsum.photos/seed/alex/100/100',
  bio: 'Sharing cool links and discovering new things!',
  interests: ['technology', 'ai', 'nextjs', 'design thinking'],
  location: 'Cyber City',
};

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  user: null, // Initially no user
  isLoading: true, // Simulate initial loading
  login: (user) => set({ user, isLoading: false }),
  logout: () => set({ user: null, isLoading: false }),
  updateInterests: (interests) => set((state) => ({
    user: state.user ? { ...state.user, interests } : null,
  })),
}));

// Simulate fetching user on app load
setTimeout(() => {
  // To simulate a logged-in scenario for development, you can auto-login here.
  // For a real app, this would be based on session/token.
  // useCurrentUserStore.getState().login(mockUser); 
  // For now, let's start unauthenticated
  useCurrentUserStore.setState({ isLoading: false });
}, 500);

export const useCurrentUser = () => {
  const { user, isLoading, login, logout, updateInterests } = useCurrentUserStore();
  return { user, isLoading, login, logout, updateInterests };
};
