export default function Loading() {
  return (
    <div className="home has-news" aria-busy="true" aria-label="Loading home">
      <div className="hero skeleton" />
      <div className="panel skeleton-card start" />
      <div className="panel skeleton-card today" />
      <div className="panel skeleton-card news" />
      <div className="panel skeleton-card three" />
      <div className="panel skeleton-card glance" />
      <div className="panel skeleton-short thought" />
    </div>
  );
}
