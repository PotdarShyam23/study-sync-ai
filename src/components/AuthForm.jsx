import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AuthForm({
  mode,
  title,
  subtitle,
  buttonLabel,
  footerLabel,
  footerLinkText,
  footerTo,
  onSubmit,
}) {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password || (mode === "signup" && !form.name)) {
      setError("Please fill in all required fields.");
      emailRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(form);
      navigate("/app/dashboard");
    } catch (submitError) {
      setError(submitError.message || "Unable to continue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="hero-panel">
        <p className="eyebrow">Portfolio-grade React project</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <ul className="hero-list">
          <li>Authentication with protected routes</li>
          <li>Dashboard, CRUD, and persistent study data</li>
          <li>Optimized React patterns and clean architecture</li>
        </ul>
      </section>

      <section className="auth-card">
        <form onSubmit={handleSubmit}>
          <h2>{buttonLabel}</h2>
          <p className="muted">Use demo mode instantly or connect Firebase later.</p>

          {mode === "signup" ? (
            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Aarav Sharma"
              />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@example.com"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : buttonLabel}
          </button>
        </form>

        <p className="muted">
          {footerLabel} <Link to={footerTo}>{footerLinkText}</Link>
        </p>
      </section>
    </div>
  );
}
