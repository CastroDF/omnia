import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define types for our store
export interface RecentActivity {
  id: string;
  type: 'render_created' | 'render_viewed' | 'render_edited' | 'render_shared';
  title: string;
  description: string;
  renderSlug?: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface UserSession {
  userId?: string;
  userName?: string;
  userEmail?: string;
  lastActivity: number;
  sessionStarted: number;
}

interface AppStore {
  // Session data
  session: UserSession | null;

  // Recent activities (max 50 items)
  recentActivities: RecentActivity[];

  // UI state
  sidebarOpen: boolean;

  // Actions for session
  setSession: (session: UserSession) => void;
  clearSession: () => void;
  updateLastActivity: () => void;

  // Actions for recent activities
  addRecentActivity: (
    activity: Omit<RecentActivity, 'id' | 'timestamp'>,
  ) => void;
  clearRecentActivities: () => void;
  getRecentActivitiesByType: (type: RecentActivity['type']) => RecentActivity[];
  getRecentActivitiesFromLastDays: (days: number) => RecentActivity[];

  // Actions for UI
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

// Create the store with persistence
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      session: null,
      recentActivities: [],
      sidebarOpen: false,

      // Session actions
      setSession: (session: UserSession) => {
        set({
          session: {
            ...session,
            sessionStarted: Date.now(),
            lastActivity: Date.now(),
          },
        });
      },

      clearSession: () => {
        set({
          session: null,
          recentActivities: [], // Clear activities when session ends
        });
      },

      updateLastActivity: () => {
        const { session } = get();
        if (session) {
          set({
            session: {
              ...session,
              lastActivity: Date.now(),
            },
          });
        }
      },

      // Recent activities actions
      addRecentActivity: activityData => {
        const { recentActivities } = get();
        const newActivity: RecentActivity = {
          ...activityData,
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
        };

        // Add to beginning and limit to 50 items
        const updatedActivities = [newActivity, ...recentActivities].slice(
          0,
          50,
        );

        set({ recentActivities: updatedActivities });

        // Update last activity timestamp
        get().updateLastActivity();
      },

      clearRecentActivities: () => {
        set({ recentActivities: [] });
      },

      getRecentActivitiesByType: (type: RecentActivity['type']) => {
        const { recentActivities } = get();
        return recentActivities.filter(activity => activity.type === type);
      },

      getRecentActivitiesFromLastDays: (days: number) => {
        const { recentActivities } = get();
        const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
        return recentActivities.filter(
          activity => activity.timestamp > cutoffTime,
        );
      },

      // UI actions
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      toggleSidebar: () => {
        const { sidebarOpen } = get();
        set({ sidebarOpen: !sidebarOpen });
      },
    }),
    {
      name: 'omnia-app-store', // Key for localStorage
      partialize: state => ({
        // Only persist certain parts of the state
        session: state.session,
        recentActivities: state.recentActivities,
        // Don't persist UI state like sidebarOpen
      }),
    },
  ),
);

// Helper hooks for commonly used store slices
export const useSession = () => useAppStore(state => state.session);
export const useRecentActivities = () =>
  useAppStore(state => state.recentActivities);
export const useSidebarOpen = () => useAppStore(state => state.sidebarOpen);

// Helper functions for activity tracking
export const trackActivity = {
  renderCreated: (renderName: string, renderSlug: string) => {
    useAppStore.getState().addRecentActivity({
      type: 'render_created',
      title: 'Nuevo modelo creado',
      description: `Creaste el modelo "${renderName}"`,
      renderSlug,
      metadata: { renderName },
    });
  },

  renderViewed: (renderName: string, renderSlug: string) => {
    useAppStore.getState().addRecentActivity({
      type: 'render_viewed',
      title: 'Modelo visualizado',
      description: `Visualizaste el modelo "${renderName}" en AR`,
      renderSlug,
      metadata: { renderName },
    });
  },

  renderEdited: (renderName: string, renderSlug: string) => {
    useAppStore.getState().addRecentActivity({
      type: 'render_edited',
      title: 'Modelo editado',
      description: `Editaste el modelo "${renderName}"`,
      renderSlug,
      metadata: { renderName },
    });
  },

  renderShared: (renderName: string, renderSlug: string) => {
    useAppStore.getState().addRecentActivity({
      type: 'render_shared',
      title: 'Modelo compartido',
      description: `Compartiste el enlace del modelo "${renderName}"`,
      renderSlug,
      metadata: { renderName },
    });
  },
};
