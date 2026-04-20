import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="landing-shell">
      <section className="landing-card">
        <p className="eyebrow">React + Firebase project idea</p>
        <h1>StudySync AI helps students study with clarity, structure, and momentum.</h1>
        <p className="landing-copy">
          A smart study companion with personalized planning, subject mastery tracking,
          revision notes, and focused recommendations built for portfolio-level scoring.
        </p>

        <div className="landing-actions">
          <Link className="primary-button" to="/signup">
            Create Account
          </Link>
          <Link className="secondary-button" to="/login">
            Demo Login
          </Link>
        </div>

        <div className="feature-strip">
          <div>
            <h3>Problem</h3>
            <p>Students often study without priorities, weak-topic visibility, or a clear plan.</p>
          </div>
          <div>
            <h3>Solution</h3>
            <p>One dashboard for tasks, subjects, notes, and recommendation-driven revision.</p>
          </div>
          <div>
            <h3>Outcome</h3>
            <p>Better consistency, better preparation, and a stronger React project story.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
