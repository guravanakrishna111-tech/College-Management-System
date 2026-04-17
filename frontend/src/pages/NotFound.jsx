import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="hero-card">
          <p className="eyebrow">404</p>
          <h2>The page you requested does not exist</h2>
          <p>Return to the portal entry point and continue from there.</p>
        </div>
        <div className="inline-actions">
          <Link className="primary-button" to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
