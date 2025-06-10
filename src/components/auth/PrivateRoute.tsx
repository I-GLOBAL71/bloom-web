import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  requireOnboarding = true
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  console.log('[PrivateRoute] Checking route access:', {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    hasCompletedOnboarding: user?.hasCompletedOnboarding,
    requireOnboarding,
    currentPath: location.pathname
  });

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    console.log('[PrivateRoute] Loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log('[PrivateRoute] User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Rediriger vers l'onboarding si nécessaire
  if (requireOnboarding && user && !user.hasCompletedOnboarding) {
    console.log('[PrivateRoute] User needs onboarding, redirecting to onboarding');
    return <Navigate to="/onboarding" replace />;
  }

  // Rendre le contenu protégé
  console.log('[PrivateRoute] Access granted to protected content');
  return <>{children}</>;
};

export default PrivateRoute;