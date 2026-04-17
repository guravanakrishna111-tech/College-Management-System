import useAuth from "../../hooks/useAuth";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">College Academic and Examination Management System</p>
        <h1>{user?.role === "ADMIN" ? "Admin Control Center" : "Student Academic Portal"}</h1>
      </div>
      <div className="topbar-actions">
        <div className="user-pill">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
        </div>
        <button className="ghost-button" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
