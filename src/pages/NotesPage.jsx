import { useMemo, useState } from "react";
import NoteEditor from "../components/NoteEditor";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { useStudyData } from "../hooks/useStudyData";

export default function NotesPage() {
  const { user } = useAuth();
  const { notes, subjects, error, addNote, editNote, removeNote } = useStudyData(user?.id);
  const [editingNote, setEditingNote] = useState(null);

  const sortedNotes = useMemo(
    () => [...notes].sort((left, right) => left.subject.localeCompare(right.subject)),
    [notes],
  );

  const handleSave = async (payload) => {
    if (editingNote) {
      await editNote(editingNote.id, payload);
      setEditingNote(null);
      return;
    }

    await addNote(payload);
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Notes"
        title="Save revision notes and flashcard-style summaries"
        description="Notes stay persistent per user and support full CRUD operations."
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="dashboard-grid">
        <NoteEditor
          subjects={subjects}
          editingNote={editingNote}
          onSave={handleSave}
          onCancel={() => setEditingNote(null)}
        />

        <article className="panel">
          <div className="panel-header">
            <h3>Your Notes</h3>
            <span className="badge">{notes.length} total</span>
          </div>

          <div className="stack-list">
            {sortedNotes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="panel-header">
                  <div>
                    <p className="list-title">{note.title}</p>
                    <p className="muted">{note.subject}</p>
                  </div>
                  <div className="task-actions">
                    <button type="button" className="ghost-button" onClick={() => setEditingNote(note)}>
                      Edit
                    </button>
                    <button type="button" className="ghost-button danger" onClick={() => removeNote(note.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                <p>{note.content}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
