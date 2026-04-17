import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import AnalyticsCards from "../../components/analytics/AnalyticsCards";
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import { getTopStudentsAnalytics } from "../../services/analytics.service";
import { getMyResults } from "../../services/result.service";
import { getExams } from "../../services/timetable.service";
import api from "../../services/api";
import { formatDate } from "../../utils/helpers";

function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultSheet, setResultSheet] = useState(null);
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user?.studentProfile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const profile = user.studentProfile;
        const [resultData, eventData, examData, rankingData] = await Promise.all([
          getMyResults(),
          api.get(`/events?month=${new Date().toISOString().slice(0, 7)}-01&limit=50`),
          getExams({
            departmentId: profile.departmentId?._id || profile.departmentId,
            year: profile.year,
            semester: profile.semester,
            section: profile.section
          }),
          getTopStudentsAnalytics({
            departmentId: profile.departmentId?._id || profile.departmentId,
            year: profile.year,
            semester: profile.semester,
            limit: 5
          })
        ]);

        setResultSheet(resultData);
        setEvents(eventData.data.items || []);
        setExams(examData.items || []);
        setRankings(rankingData.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your student dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) {
    return <Loader label="Loading your dashboard..." />;
  }

  const cards = [
    { label: "Current CGPA", value: resultSheet?.cgpa ?? 0 },
    { label: "Overall Percentage", value: `${resultSheet?.percentage ?? 0}%` },
    { label: "Upcoming Exams", value: exams.length },
    { label: "This Month Events", value: events.length }
  ];

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Student Dashboard</p>
        <h2>Track your academic progress, important dates, and upcoming assessments</h2>
        <p>Everything here is read-only and personalized to your class, semester, and department.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <AnalyticsCards cards={cards} />

      <section className="chart-grid">
        <div className="chart-card">
          <div className="panel-header">
            <h3>Semester SGPA Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={resultSheet?.semesters || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semester" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sgpa" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="table-card">
          <div className="panel-header">
            <h3>Top Students in Your Cohort</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SGPA</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((student) => (
                  <tr key={student.studentId}>
                    <td>
                      {student.name}
                      <br />
                      <small>{student.rollNumber}</small>
                    </td>
                    <td>{student.sgpa}</td>
                    <td>{student.averageMarks}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="two-column">
        <div className="table-card">
          <div className="panel-header">
            <h3>Upcoming Exams</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Course</th>
                  <th>Date</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam._id}>
                    <td>{exam.examType}</td>
                    <td>{exam.courseId?.code}</td>
                    <td>{formatDate(exam.date)}</td>
                    <td>{exam.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="panel-header">
            <h3>Academic Calendar Highlights</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.eventType}</td>
                    <td>{formatDate(event.startDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
