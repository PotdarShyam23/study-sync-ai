export function buildRecommendations(tasks, subjects, stats) {
  const weakSubject = subjects.find((subject) => subject.mastery !== "Strong");
  const urgentTask = tasks.find((task) => task.priority === "High" && task.status !== "Completed");

  return [
    {
      id: "rec-1",
      title: weakSubject ? `Strengthen ${weakSubject.name}` : "Maintain your strongest subject",
      message: weakSubject
        ? `Spend 45 focused minutes on ${weakSubject.focusArea} to move this subject toward strong mastery.`
        : "All subjects are doing well. Revise one previously completed topic to retain momentum.",
    },
    {
      id: "rec-2",
      title: urgentTask ? `Finish: ${urgentTask.title}` : "No urgent tasks detected",
      message: urgentTask
        ? `This task has high priority. Tackle it before moving to lower-impact revision.`
        : "Use this buffer to prepare ahead for the next study cycle.",
    },
    {
      id: "rec-3",
      title: "Weekly performance insight",
      message:
        stats.completionRate >= 60
          ? `Your completion rate is ${stats.completionRate}%. Keep the streak going with one more completed task today.`
          : `Your completion rate is ${stats.completionRate}%. Break big tasks into smaller blocks to improve follow-through.`,
    },
  ];
}
