import { useEffect, useState } from "react";

const initialNote = {
  title: "",
  subject: "",
  content: "",
};

export default function NoteEditor({ subjects, editingNote, onSave, onCancel }) {
  const [form, setForm] = useState(initialNote);

  useEffect(() => {
    setForm(editingNote || initialNote);
  }, [editingNote]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(form);
    setForm(initialNote);
  };

  return (
    <article className="panel">
      <div className="panel-header">
        <h3>{editingNote ? "Edit Revision Note" : "Create Revision Note"}</h3>
        {editingNote ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>

        <label className="field">
          <span>Subject</span>
          <select name="subject" value={form.subject} onChange={handleChange} required>
            <option value="">Choose subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Key Notes</span>
          <textarea
            rows="6"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Summarize the topic in your own words..."
            required
          />
        </label>

        <button type="submit" className="primary-button">
          Save Note
        </button>
      </form>
    </article>
  );
}
