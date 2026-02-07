// Partner Profile Page — Redirects to AI Services Strategy cockpit
// All profile editing is consolidated in the Strategy page's Partner Profile tab

import { Navigate } from 'react-router-dom';

export default function PartnerProfilePage() {
  return <Navigate to="/partner/strategy" replace />;
}
