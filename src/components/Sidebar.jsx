import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/">
        📋 Boards
      </Link>
      <Link to="/users">
        👥 All Members
      </Link>
      <Link to="/github-info">
        🐙 GitHub Info
      </Link>
    </div>
  );
}
