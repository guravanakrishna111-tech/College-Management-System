function AnalyticsCards({ cards = [] }) {
  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <article key={card.label} className="metric-card">
          <p>{card.label}</p>
          <h3 className="metric-value">{card.value}</h3>
        </article>
      ))}
    </div>
  );
}

export default AnalyticsCards;
