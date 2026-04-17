import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await login(form);
      navigate(response.user.role === "ADMIN" ? "/admin" : "/student");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login with those credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="hero-card">
          <p className="eyebrow">🔐 Secure Access</p>
          <h2>College Management System</h2>
          <p>Sign in to access academic operations, scheduling, results, and analytics</p>
        </div>

        <div className="auth-grid">
          <form className="panel" onSubmit={submitHandler}>
            <div className="panel-header">
              <h3>Login to Your Account</h3>
            </div>
            {error && <div className="error-banner">{error}</div>}
            
            <div className="form-grid">
              <label className="field">
                <span>📧 Email Address</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, email: event.target.value }));
                    if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                  }}
                  placeholder="user@college.edu"
                  className={errors.email ? "field-error" : ""}
                />
                {errors.email && <span className="error-text">❌ {errors.email}</span>}
              </label>

              <label className="field">
                <span>🔑 Password</span>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, password: event.target.value }));
                      if (errors.password) setErrors((e) => ({ ...e, password: "" }));
                    }}
                    placeholder="Enter your password"
                    className={errors.password ? "field-error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && <span className="error-text">❌ {errors.password}</span>}
              </label>
            </div>

            <div className="inline-actions">
              <button 
                className="primary-button" 
                type="submit" 
                disabled={submitting}
              >
                {submitting ? "⏳ Signing in..." : "✓ Sign In"}
              </button>
              <Link className="ghost-button" to="/register">
                Create Account
              </Link>
            </div>

            <div className="login-footer">
              <p>First time here? <Link to="/register" className="link-text">Create an account</Link></p>
            </div>
          </form>

          <div className="panel demo-panel">
            <div className="panel-header">
              <h3>📋 Demo Credentials</h3>
            </div>
            <p className="demo-instructions">Use these credentials to test the system:</p>
            
            <div className="demo-credentials">
              <div className="credential-card">
                <p className="label">👨‍💼 Admin Account</p>
                <div className="credential-value">
                  <div className="cred-item">
                    <span className="cred-label">Email:</span>
                    <code>admin@college.edu</code>
                  </div>
                  <div className="cred-item">
                    <span className="cred-label">Password:</span>
                    <code>Admin@123</code>
                  </div>
                </div>
              </div>

              <div className="credential-card">
                <p className="label">👨‍🎓 Student Account</p>
                <div className="credential-value">
                  <div className="cred-item">
                    <span className="cred-label">Email:</span>
                    <code>student1@college.edu</code>
                  </div>
                  <div className="cred-item">
                    <span className="cred-label">Password:</span>
                    <code>Student@123</code>
                  </div>
                </div>
              </div>
            </div>

            <p className="helper-text">
              💡 Seed the database first using the backend script to populate these accounts. After seeding, you can enjoy full admin and student portal access!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
