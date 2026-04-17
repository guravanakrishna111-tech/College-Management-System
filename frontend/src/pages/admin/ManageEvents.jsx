import { useEffect, useState } from "react";
import CalendarGrid from "../../components/calendar/CalendarGrid";
import Loader from "../../components/common/Loader";
import api from "../../services/api";
import { formatDate } from "../../utils/helpers";

const emptyForm = {
  title: "",
  description: "",
  eventType: "EVENT",
  startDate: "",
  endDate: "",
  venue: "",
  audience: "ALL",
  colorTag: "#0f766e"
};

function ManageEvents() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");

  const loadEvents = async (activeMonth = month) => {
    const { data } = await api.get(`/events?month=${activeMonth}-01&limit=100`);
    setEvents(data.items || []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      setError("");

      try {
        await loadEvents();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load academic calendar");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [month]);

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await api.put(`/events/${editingId}`, form);
      } else {
        await api.post("/events", form);
      }

      setForm(emptyForm);
      setEditingId("");
      await loadEvents();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save event");
    }
  };

  if (loading && !events.length) {
    return <Loader label="Loading academic calendar..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Academic Calendar</p>
        <h2>Maintain events, holidays, and critical academic milestones</h2>
        <p>Calendar updates instantly feed the student portal and monthly planner.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="two-column">
        <form className="panel" onSubmit={submitHandler}>
          <div className="panel-header">
            <h3>{editingId ? "Edit Calendar Item" : "Create Calendar Item"}</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Title</span>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Type</span>
              <select value={form.eventType} onChange={(event) => setForm((current) => ({ ...current, eventType: event.target.value }))}>
                {["EVENT", "HOLIDAY", "ACADEMIC"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Start Date</span>
              <input type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} required />
            </label>
            <label className="field">
              <span>End Date</span>
              <input type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Venue</span>
              <input value={form.venue} onChange={(event) => setForm((current) => ({ ...current, venue: event.target.value }))} />
            </label>
            <label className="field">
              <span>Audience</span>
              <select value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}>
                {["ALL", "STUDENTS", "FACULTY", "ADMIN"].map((audience) => (
                  <option key={audience} value={audience}>
                    {audience}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Color</span>
              <input type="color" value={form.colorTag} onChange={(event) => setForm((current) => ({ ...current, colorTag: event.target.value }))} />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </label>
          </div>
          <div className="inline-actions">
            <button className="primary-button" type="submit">
              {editingId ? "Update Item" : "Add to Calendar"}
            </button>
            {editingId && (
              <button className="ghost-button" type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="panel">
          <div className="panel-header">
            <h3>Calendar Month</h3>
          </div>
          <label className="field">
            <span>Select month</span>
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          </label>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.eventType}</td>
                    <td>
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button
                          className="ghost-button"
                          type="button"
                          onClick={() => {
                            setEditingId(item._id);
                            setForm({
                              ...item,
                              startDate: item.startDate.slice(0, 10),
                              endDate: item.endDate.slice(0, 10)
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="danger-button"
                          type="button"
                          onClick={async () => {
                            await api.delete(`/events/${item._id}`);
                            await loadEvents();
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CalendarGrid month={new Date(`${month}-01`)} events={events} />
    </div>
  );
}

export default ManageEvents;
