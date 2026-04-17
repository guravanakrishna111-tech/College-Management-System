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
import {
  getBestClassesAnalytics,
  getDepartmentComparisonAnalytics,
  getOverviewAnalytics,
  getSubjectPerformanceAnalytics,
  getTopStudentsAnalytics
} from "../../services/analytics.service";

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [overview, setOverview] = useState({ cards: [] });
  const [topStudents, setTopStudents] = useState([]);
  const [bestClasses, setBestClasses] = useState([]);
  const [departmentComparison, setDepartmentComparison] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [overviewData, topStudentsData, bestClassesData, departmentData, subjectData] = await Promise.all([
          getOverviewAnalytics(),
          getTopStudentsAnalytics({ limit: 8 }),
          getBestClassesAnalytics(),
          getDepartmentComparisonAnalytics(),
          getSubjectPerformanceAnalytics()
        ]);

        setOverview(overviewData);
        setTopStudents(topStudentsData.items || []);
        setBestClasses(bestClassesData.items || []);
        setDepartmentComparison(departmentData.items || []);
        setSubjectPerformance(subjectData.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load admin dashboard analytics");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader label="Loading admin analytics..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Admin Dashboard</p>
        <h2>Monitor scheduling, results, and academic performance in one place</h2>
        <p>Use the insights below to identify toppers, best-performing classes, and department trends.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <AnalyticsCards cards={overview.cards} />

      <section className="chart-grid">
        <div className="chart-card">
          <div className="panel-header">
            <h3>Top Students by SGPA</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topStudents}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sgpa" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="panel-header">
            <h3>Best Classes by Average Marks</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestClasses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="classLabel" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageMarks" fill="#0284c7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-grid">
        <div className="chart-card">
          <div className="panel-header">
            <h3>Department Comparison</h3>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={departmentComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="averageMarks" fill="#16a34a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-card">
          <div className="panel-header">
            <h3>Subject Performance Snapshot</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Average Marks</th>
                  <th>Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {subjectPerformance.slice(0, 8).map((subject) => (
                  <tr key={subject.courseCode}>
                    <td>
                      {subject.courseCode}
                      <br />
                      <small>{subject.courseName}</small>
                    </td>
                    <td>{subject.averageMarks}%</td>
                    <td>{subject.passRate}%</td>
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
