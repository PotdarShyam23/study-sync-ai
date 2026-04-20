import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import RecommendationPanel from "../components/RecommendationPanel";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { useStudyData } from "../hooks/useStudyData";
import { buildRecommendations } from "../utils/recommendations";

const COLORS = ["#0f766e", "#f59e0b", "#dc2626"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, subjects, notes, stats, isLoading, error } = useStudyData(user?.id);

  const completionData = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const pending = tasks.filter((task) => task.status !== "Completed").length;

    return [
      { name: "Completed", value: completed || 0 },
      { name: "Pending", value: pending || 0 },
    ];
  }, [tasks]);

  const recommendations = useMemo(
    () => buildRecommendations(tasks, subjects, stats),
    [stats, subjects, tasks],
  );

  if (isLoading) {
    return <SectionHeader title="Loading dashboard..." />;
  }

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Dashboard"
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Student"}`}
        description="Your study rhythm, task priorities, and subject mastery are all in one place."
      />

      {error ? <p className="error-banner">{error}</p> : null}

      <section className="stats-grid">
        <StatCard label="Study Streak" value={`${stats.streak} days`} helper="Consistency builds retention." />
        <StatCard
          label="Weekly Hours"
          value={`${stats.weeklyHours} hrs`}
          helper="Total planned focus this week."
        />
        <StatCard
          label="Tasks"
          value={`${tasks.length}`}
          helper={`${tasks.filter((task) => task.status === "Completed").length} completed`}
        />
        <StatCard
          label="Subjects"
          value={`${subjects.length}`}
          helper={`${subjects.filter((subject) => subject.mastery === "Strong").length} strong`}
        />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Task Completion</h3>
            <span className="badge">Live overview</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={completionData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <RecommendationPanel recommendations={recommendations} />
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Upcoming Tasks</h3>
            <span className="badge">{tasks.length} total</span>
          </div>
          <div className="stack-list">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="list-row">
                <div>
                  <p className="list-title">{task.title}</p>
                  <p className="muted">
                    {task.subject} • {task.priority} priority
                  </p>
                </div>
                <span className={`status-pill ${task.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Revision Notes</h3>
            <span className="badge">{notes.length} saved</span>
          </div>
          <div className="stack-list">
            {notes.slice(0, 4).map((note) => (
              <div key={note.id} className="list-row">
                <div>
                  <p className="list-title">{note.title}</p>
                  <p className="muted">{note.subject}</p>
                </div>
                <p className="note-preview">{note.content.slice(0, 60)}...</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
