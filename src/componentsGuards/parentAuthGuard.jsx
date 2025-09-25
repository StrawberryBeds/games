// componentsGuards/parentAuthGuard.jsx
import { usePlayerSelection } from '../context/playerContext';
import { Navigate, useLocation } from 'react-router-dom';

function ParentAuthGuard({ children }) {
  const { currentPlayer, requiresParentAuth } = usePlayerSelection();
  const location = useLocation();

  // If the user is NOT a parent, block access entirely
  if (!currentPlayer?.isParent) {
    return <Navigate to="/" replace />;
  }

  // If parent auth is required, redirect to password prompt
  if (requiresParentAuth) {
    return <Navigate to="/parent-auth" state={{ from: location }} replace />;
  }

  // Otherwise, allow access
  return children;
}

export default ParentAuthGuard;
