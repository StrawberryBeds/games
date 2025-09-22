// componentsGuards/parentAuthGuard.jsx
import { usePlayerSelection } from '../context/playerContext';
import { Navigate } from 'react-router-dom';

function ParentAuthGuard({ children }) {
  const { currentPlayer, requiresParentAuth } = usePlayerSelection();

  if (currentPlayer?.isParent && requiresParentAuth) {
    return <Navigate to="/parent-auth" state={{ from: location }} />;
  }

  return children;
}

export default ParentAuthGuard;

