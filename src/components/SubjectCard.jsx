export default function SubjectCard({ subject, onMasteryChange, onDelete }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <div>
          <h3>{subject.name}</h3>
          <p className="muted">Upcoming focus: {subject.focusArea}</p>
        </div>
        <button type="button" className="ghost-button danger" onClick={() => onDelete(subject.id)}>
          Delete
        </button>
      </div>

      <div className="subject-grid">
        <div>
          <p className="muted">Mastery Level</p>
          <select
            value={subject.mastery}
            onChange={(event) => onMasteryChange(subject.id, event.target.value)}
          >
            <option>Not Started</option>
            <option>Learning</option>
            <option>Strong</option>
          </select>
        </div>

        <div>
          <p className="muted">Revision Frequency</p>
          <p>{subject.revisionFrequency}</p>
        </div>
      </div>
    </article>
  );
}
