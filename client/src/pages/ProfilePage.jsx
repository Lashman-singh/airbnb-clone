import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import AccountNav from "../AccountNav";
import PlacesPage from "./PlacesPage";

export default function ProfilePage() {
  const { ready, user, logout } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);

  const { subpage = "profile" } = useParams();

  const handleLogout = async () => {
    await logout();
    setRedirect("/");
  };

  if (!ready) return "Loading...";
  if (ready && !user) return <Navigate to="/login" />;
  if (redirect) return <Navigate to={redirect} />;

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})
          <button onClick={handleLogout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
}


