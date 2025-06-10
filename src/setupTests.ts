// Mock Firebase
jest.mock('./lib/firebase/config', () => ({
  default: {
    auth: jest.fn(),
    firestore: jest.fn(),
    storage: jest.fn(),
  },
  auth: jest.fn(),
  firestore: jest.fn(),
  storage: jest.fn(),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: () => Promise.resolve(),
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
  }),
}));

// Mock des hooks personnalisés
jest.mock('./hooks/useRecommendations', () => ({
  useRecommendations: jest.fn(() => ({
    recommendations: [],
    loading: false,
    error: null,
    fetchMore: jest.fn(),
    hasMore: false,
  })),
}));

jest.mock('./hooks/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    notifications: [],
    loading: false,
    error: null,
    markAsRead: jest.fn(),
  })),
}));