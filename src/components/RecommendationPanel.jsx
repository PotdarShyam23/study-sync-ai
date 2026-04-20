export default function RecommendationPanel({ recommendations }) {
  return (
    <article className="panel">
      <div className="panel-header">
        <h3>Smart Recommendations</h3>
        <span className="badge">AI-style insights</span>
      </div>
      <div className="stack-list">
        {recommendations.map((item) => (
          <div key={item.id} className="recommendation-item">
            <p className="recommendation-title">{item.title}</p>
            <p className="muted">{item.message}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
