import { useCallback, useMemo, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { useStudyData } from "../hooks/useStudyData";

export default function PlannerPage() {
  const { user } = useAuth();
  const { tasks, subjects, isLoading, error, addTask, editTask, removeTask } = useStudyData(user?.id);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = useMemo(() => {
    if (statusFilter === "All") {
      return tasks;
    }

    return tasks.filter((task) => task.status === statusFilter);
  }, [statusFilter, tasks]);

  const handleSaveTask = useCallback(
    async (task) => {
      if (editingTask) {
        await editTask(editingTask.id, task);
      } else {
        await addTask(task);
      }
      setEditingTask(null);
    },
    [addTask, editTask, editingTask],
  );

  const handleEdit = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  if (isLoading) {
    return <SectionHeader title="Loading planner..." />;
  }

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Planner"
        title="Manage study tasks with deadlines and priorities"
        description="This page demonstrates CRUD operations, controlled forms, filtering, and optimized rendering."
        action={
          <button type="button" className="primary-button" onClick={() => setIsModalOpen(true)}>
            Add Task
          </button>
        }
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="panel">
        <div className="filter-row">
          {["All", "Pending", "In Progress", "Completed"].map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? "filter-button active" : "filter-button"}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="stack-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-row">
              <div>
                <p className="list-title">{task.title}</p>
                <p className="muted">
                  {task.subject} • Due {task.dueDate} • {task.estimatedHours} hr
                </p>
              </div>

              <div className="task-actions">
                <span className={`status-pill ${task.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {task.status}
                </span>
                <button type="button" className="ghost-button" onClick={() => handleEdit(task)}>
                  Edit
                </button>
                <button type="button" className="ghost-button danger" onClick={() => removeTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        subjects={subjects}
      />
    </div>
  );
}
