import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigation = [
  { label: "Dashboard", to: "/app/dashboard" },
  { label: "Planner", to: "/app/planner" },
  { label: "Subjects", to: "/app/subjects" },
  { label: "Notes", to: "/app/notes" },
  { label: "Profile", to: "/app/profile" },
];

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">StudySync AI</p>
          <h1>Your study cockpit</h1>
          <p className="muted">
            Plan smarter, revise stronger, and keep every subject moving forward.
          </p>
        </div>

        <nav className="nav-list">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="profile-card">
          <p className="profile-name">{user?.name}</p>
          <p className="muted">{user?.email}</p>
          <button type="button" className="ghost-button" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
}
