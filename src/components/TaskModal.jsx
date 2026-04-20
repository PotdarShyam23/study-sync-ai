import { useEffect, useState } from "react";

const initialTask = {
  title: "",
  subject: "",
  dueDate: "",
  priority: "Medium",
  status: "Pending",
  estimatedHours: 1,
};

export default function TaskModal({ isOpen, onClose, onSave, editingTask, subjects }) {
  const [form, setForm] = useState(initialTask);

  useEffect(() => {
    setForm(
      editingTask
        ? {
            ...editingTask,
            estimatedHours: editingTask.estimatedHours ?? 1,
          }
        : initialTask,
    );
  }, [editingTask, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(form);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="panel-header">
          <h3>{editingTask ? "Edit Study Task" : "Add Study Task"}</h3>
          <button type="button" className="ghost-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Task Title</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>

          <label className="field">
            <span>Subject</span>
            <select name="subject" value={form.subject} onChange={handleChange} required>
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Due Date</span>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
            </label>

            <label className="field">
              <span>Estimated Hours</span>
              <input
                type="number"
                min="1"
                max="10"
                name="estimatedHours"
                value={form.estimatedHours}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </label>

            <label className="field">
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </label>
          </div>

          <button type="submit" className="primary-button">
            Save Task
          </button>
        </form>
      </div>
    </div>
  );
}
