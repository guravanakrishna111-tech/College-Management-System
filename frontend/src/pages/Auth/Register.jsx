import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const departmentOptions = ["CSE", "ECE", "EEE", "ME", "CE", "IT"];

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
    studentId: "",
    rollNumber: "",
    departmentId: "",
    year: 1,
    semester: 1,
    section: "A",
    batchYear: new Date().getFullYear()
  });

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "None", color: "#e5e7eb" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "None", color: "#e5e7eb" },
      { strength: 1, label: "Weak", color: "#fca5a5" },
      { strength: 2, label: "Fair", color: "#fdba74" },
      { strength: 3, label: "Good", color: "#fbbf24" },
      { strength: 4, label: "Strong", color: "#86efac" },
      { strength: 5, label: "Very Strong", color: "#34d399" }
    ];

    return levels[strength] || levels[0];
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

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

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "ADMIN" && !form.adminCode) {
      newErrors.adminCode = "Admin code is required";
    }

    if (role === "STUDENT") {
      if (!form.studentId.trim()) {
        newErrors.studentId = "Student ID is required";
      }
      if (!form.rollNumber.trim()) {
        newErrors.rollNumber = "Roll number is required";
      }
      if (!form.departmentId) {
        newErrors.departmentId = "Department is required";
      }
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
      const payload =
        role === "ADMIN"
          ? {
              name: form.name,
              email: form.email,
              password: form.password,
              role,
              adminCode: form.adminCode
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              role,
              studentProfile: {
                studentId: form.studentId,
                rollNumber: form.rollNumber,
                departmentId: form.departmentId,
                year: Number(form.year),
                semester: Number(form.semester),
                section: form.section,
                batchYear: Number(form.batchYear)
              }
            };

      const response = await register(payload);
      navigate(response.user.role === "ADMIN" ? "/admin" : "/student");
    } catch (requestError) {
      if (requestError.response?.data?.message?.includes("email")) {
        setError("This email is already registered. Please use a different email or login.");
      } else {
        setError(requestError.response?.data?.message || "Unable to register the account");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength(form.password);

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card-register">
        <div className="hero-card">
          <p className="eyebrow">✨ Account Setup</p>
          <h2>Create Your College Portal Account</h2>
          <p>
            {role === "ADMIN" 
              ? "Admin accounts manage academic operations, scheduling, and results."
              : "Student registrations create both login and academic profile in one step."}
          </p>
        </div>

        <form className="panel" onSubmit={submitHandler}>
          <div className="panel-header">
            <h3>
              {role === "ADMIN" ? "👨‍💼 Create Admin Account" : "👨‍🎓 Create Student Account"}
            </h3>
            <div className="inline-actions">
              <button
                className={role === "STUDENT" ? "primary-button" : "ghost-button"}
                type="button"
                onClick={() => {
                  setRole("STUDENT");
                  setErrors({});
                }}
              >
                Student
              </button>
              <button
                className={role === "ADMIN" ? "primary-button" : "ghost-button"}
                type="button"
                onClick={() => {
                  setRole("ADMIN");
                  setErrors({});
                }}
              >
                Admin
              </button>
            </div>
          </div>

          {error && <div className="error-banner">❌ {error}</div>}

          <div className="form-grid">
            {/* Common Fields */}
            <label className="field full-width">
              <span>👤 Full Name</span>
              <input
                value={form.name}
                onChange={(event) => {
                  setForm((current) => ({ ...current, name: event.target.value }));
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                placeholder="John Doe"
                className={errors.name ? "field-error" : ""}
              />
              {errors.name && <span className="error-text">❌ {errors.name}</span>}
            </label>

            <label className="field full-width">
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

            <label className="field full-width">
              <span>🔑 Password (Min 6 characters)</span>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, password: event.target.value }));
                    if (errors.password) setErrors((e) => ({ ...e, password: "" }));
                  }}
                  placeholder="Create a strong password"
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
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar" style={{ backgroundColor: passwordStrength.color }}></div>
                  <span className="strength-label" style={{ color: passwordStrength.color }}>
                    Strength: {passwordStrength.label}
                  </span>
                </div>
              )}
              {errors.password && <span className="error-text">❌ {errors.password}</span>}
            </label>

            <label className="field full-width">
              <span>🔐 Confirm Password</span>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, confirmPassword: event.target.value }));
                    if (errors.confirmPassword) setErrors((e) => ({ ...e, confirmPassword: "" }));
                  }}
                  placeholder="Re-enter your password"
                  className={errors.confirmPassword ? "field-error" : ""}
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
              {errors.confirmPassword && <span className="error-text">❌ {errors.confirmPassword}</span>}
            </label>

            {/* Admin-specific Fields */}
            {role === "ADMIN" && (
              <label className="field full-width">
                <span>🛡️ Admin Registration Code</span>
                <input
                  type="password"
                  value={form.adminCode}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, adminCode: event.target.value }));
                    if (errors.adminCode) setErrors((e) => ({ ...e, adminCode: "" }));
                  }}
                  placeholder="Enter admin code"
                  className={errors.adminCode ? "field-error" : ""}
                />
                {errors.adminCode && <span className="error-text">❌ {errors.adminCode}</span>}
              </label>
            )}

            {/* Student-specific Fields */}
            {role === "STUDENT" && (
              <>
                <label className="field">
                  <span>🆔 Student ID</span>
                  <input
                    value={form.studentId}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, studentId: event.target.value }));
                      if (errors.studentId) setErrors((e) => ({ ...e, studentId: "" }));
                    }}
                    placeholder="e.g., STU-CSE-2024-001"
                    className={errors.studentId ? "field-error" : ""}
                  />
                  {errors.studentId && <span className="error-text">❌ {errors.studentId}</span>}
                </label>

                <label className="field">
                  <span>📝 Roll Number</span>
                  <input
                    value={form.rollNumber}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, rollNumber: event.target.value }));
                      if (errors.rollNumber) setErrors((e) => ({ ...e, rollNumber: "" }));
                    }}
                    placeholder="e.g., 23CSE001"
                    className={errors.rollNumber ? "field-error" : ""}
                  />
                  {errors.rollNumber && <span className="error-text">❌ {errors.rollNumber}</span>}
                </label>

                <label className="field">
                  <span>🏫 Department</span>
                  <select
                    value={form.departmentId}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, departmentId: event.target.value }));
                      if (errors.departmentId) setErrors((e) => ({ ...e, departmentId: "" }));
                    }}
                    className={errors.departmentId ? "field-error" : ""}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && <span className="error-text">❌ {errors.departmentId}</span>}
                </label>

                <label className="field">
                  <span>📅 Year</span>
                  <select
                    value={form.year}
                    onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </label>

                <label className="field">
                  <span>📚 Semester</span>
                  <select
                    value={form.semester}
                    onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field">
                  <span>👥 Section</span>
                  <input
                    value={form.section}
                    onChange={(event) => setForm((current) => ({ ...current, section: event.target.value }))}
                    placeholder="e.g., A, B, C"
                  />
                </label>

                <label className="field">
                  <span>🎓 Batch Year</span>
                  <input
                    type="number"
                    value={form.batchYear}
                    onChange={(event) => setForm((current) => ({ ...current, batchYear: event.target.value }))}
                  />
                </label>
              </>
            )}
          </div>

          <div className="inline-actions">
            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "⏳ Creating Account..." : "✓ Create Account"}
            </button>
            <Link className="ghost-button" to="/login">
              Back to Login
            </Link>
          </div>

          <p className="form-footer">
            Already have an account? <Link to="/login" className="link-text">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
