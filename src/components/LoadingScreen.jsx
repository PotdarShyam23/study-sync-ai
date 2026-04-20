export default function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="screen-center">
      <div className="loader-card">
        <div className="spinner" />
        <p>{label}</p>
      </div>
    </div>
  );
}
