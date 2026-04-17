import { formatDate, getMonthMatrix } from "../../utils/helpers";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarGrid({ month, events = [] }) {
  const matrix = getMonthMatrix(month);

  const eventsByDate = events.reduce((accumulator, event) => {
    const current = new Date(event.startDate);
    const end = new Date(event.endDate);

    while (current <= end) {
      const key = current.toISOString().slice(0, 10);
      accumulator[key] = accumulator[key] || [];
      accumulator[key].push(event);
      current.setDate(current.getDate() + 1);
    }

    return accumulator;
  }, {});

  return (
    <div className="calendar-card">
      <div className="panel-header">
        <div>
          <h3>{formatDate(month, { month: "long", year: "numeric" })}</h3>
          <p className="helper-text">Monthly academic calendar view</p>
        </div>
      </div>
      <div className="calendar-grid">
        {weekdayLabels.map((label) => (
          <div key={label} className="calendar-head">
            {label}
          </div>
        ))}
        {matrix.flat().map((day, index) => {
          const key = day ? day.toISOString().slice(0, 10) : `empty-${index}`;
          const dayEvents = day ? eventsByDate[key] || [] : [];

          return (
            <div key={key} className="calendar-cell">
              {day && (
                <>
                  <div className="calendar-date">{day.getDate()}</div>
                  {dayEvents.slice(0, 3).map((event) => (
                    <div key={event._id} className="calendar-event" style={{ background: event.colorTag }}>
                      {event.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarGrid;
