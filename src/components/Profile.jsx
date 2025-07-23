import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-4">
      <h2>Profile</h2>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
