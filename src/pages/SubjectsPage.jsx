import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import SubjectCard from "../components/SubjectCard";
import { useAuth } from "../context/AuthContext";
import { useStudyData } from "../hooks/useStudyData";

export default function SubjectsPage() {
  const { user } = useAuth();
  const { subjects, error, addSubject, editSubject, removeSubject } = useStudyData(user?.id);
  const [form, setForm] = useState({
    name: "",
    focusArea: "",
    revisionFrequency: "3 times/week",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addSubject({
      ...form,
      mastery: "Learning",
    });
    setForm({
      name: "",
      focusArea: "",
      revisionFrequency: "3 times/week",
    });
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Subjects"
        title="Track topic mastery and revision strategy"
        description="Lifting state and controlled forms make it easy to manage subject progress."
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="dashboard-grid">
        <article className="panel">
          <h3>Add Subject</h3>
          <form className="stack-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Subject Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Focus Area</span>
              <input
                value={form.focusArea}
                onChange={(event) =>
                  setForm((current) => ({ ...current, focusArea: event.target.value }))
                }
                required
              />
            </label>
            <label className="field">
              <span>Revision Frequency</span>
              <select
                value={form.revisionFrequency}
                onChange={(event) =>
                  setForm((current) => ({ ...current, revisionFrequency: event.target.value }))
                }
              >
                <option>2 times/week</option>
                <option>3 times/week</option>
                <option>Daily</option>
              </select>
            </label>
            <button type="submit" className="primary-button">
              Save Subject
            </button>
          </form>
        </article>

        <div className="stack-list">
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onMasteryChange={(id, mastery) => editSubject(id, { mastery })}
              onDelete={removeSubject}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
