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
import Loader from "../../components/common/Loader";
import useAuth from "../../hooks/useAuth";
import { getRankings, getMyResults } from "../../services/result.service";

function ViewResults() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [resultSheet, setResultSheet] = useState(null);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const loadResults = async () => {
      const profile = user?.studentProfile;
      if (!profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const [resultData, rankingData] = await Promise.all([
          getMyResults(),
          getRankings({
            departmentId: profile.departmentId?._id || profile.departmentId,
            year: profile.year,
            semester: profile.semester,
            limit: 10
          })
        ]);

        setResultSheet(resultData);
        setRankings(rankingData.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your results");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user]);

  if (loading) {
    return <Loader label="Loading your results..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Results Dashboard</p>
        <h2>Review semester-wise marks, GPA progression, and ranking context</h2>
        <p>
          Current CGPA: <strong>{resultSheet?.cgpa ?? 0}</strong> | Percentage:{" "}
          <strong>{resultSheet?.percentage ?? 0}%</strong>
        </p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="chart-grid">
        <div className="chart-card">
          <div className="panel-header">
            <h3>SGPA by Semester</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
            <h3>Class Rankings Snapshot</h3>
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

      {(resultSheet?.semesters || []).map((semester) => (
        <section className="table-card" key={semester.semester}>
          <div className="panel-header">
            <div>
              <h3>Semester {semester.semester}</h3>
              <p className="helper-text">
                SGPA {semester.sgpa} | Average {semester.percentage}% | Credits {semester.totalCredits}
              </p>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Credits</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {semester.subjects.map((subject) => (
                  <tr key={`${semester.semester}-${subject.courseCode}-${subject.resultId}`}>
                    <td>
                      {subject.courseCode}
                      <br />
                      <small>{subject.courseName}</small>
                    </td>
                    <td>{subject.credits}</td>
                    <td>{subject.totalMarks}</td>
                    <td>{subject.percentage}%</td>
                    <td>{subject.grade}</td>
                    <td>
                      <span className={`status-chip ${subject.status === "PASS" ? "pass" : "fail"}`}>
                        {subject.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export default ViewResults;
