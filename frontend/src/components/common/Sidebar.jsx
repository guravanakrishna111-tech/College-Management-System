import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const adminLinks = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/timetable", label: "Timetables & Exams" },
  { to: "/admin/results", label: "Results & Rankings" },
  { to: "/admin/events", label: "Academic Calendar" }
];

const studentLinks = [
  { to: "/student", label: "Overview" },
  { to: "/student/timetable", label: "Timetable" },
  { to: "/student/results", label: "Results" },
  { to: "/student/calendar", label: "Calendar" }
];

function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "ADMIN" ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <span className="brand-badge">CMS</span>
        <div>
          <strong>College Hub</strong>
          <p>Academic operations in one place</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
