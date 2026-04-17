import { useEffect, useState } from "react";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import Loader from "../../components/common/Loader";
import api from "../../services/api";
import { formatDate } from "../../utils/helpers";

function Calendar() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const { data } = await api.get(`/events?month=${month}-01&limit=100`);
        setEvents(data.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load calendar events");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [month]);

  if (loading && !events.length) {
    return <Loader label="Loading calendar..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Academic Calendar</p>
        <h2>View holidays, events, and important academic dates</h2>
        <p>Switch months to browse the central calendar maintained by college management.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <h3>Select Month</h3>
        </div>
        <label className="field">
          <span>Month</span>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
        </label>
      </section>

      <CalendarGrid month={new Date(`${month}-01`)} events={events} />

      <section className="table-card">
        <div className="panel-header">
          <h3>Event List</h3>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Dates</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{event.eventType}</td>
                  <td>
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </td>
                  <td>{event.venue || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Calendar;
