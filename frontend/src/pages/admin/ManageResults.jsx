import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ResultsTable from "../../components/results/ResultsTable";
import api from "../../services/api";
import {
  bulkUploadResults,
  downloadResultsCsv,
  getRankings,
  getResults,
  saveResult
} from "../../services/result.service";
import { getExams } from "../../services/timetable.service";

const emptyForm = {
  studentId: "",
  courseId: "",
  examId: "",
  academicYear: "2025-2026",
  semester: 4,
  marks: {
    internal: 0,
    external: 0,
    practical: 0
  }
};

function ManageResults() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ students: [], courses: [] });
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [filters, setFilters] = useState({ semester: 4, search: "" });
  const [form, setForm] = useState(emptyForm);
  const [bulkText, setBulkText] = useState("");

  const loadData = async () => {
    const [{ data: metaData }, examData, resultData, rankingData] = await Promise.all([
      api.get("/meta/bootstrap"),
      getExams({}),
      getResults(filters),
      getRankings({ semester: filters.semester, limit: 10 })
    ]);

    setMeta(metaData);
    setExams(examData.items || []);
    setResults(resultData.items || []);
    setRankings(rankingData.items || []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      setError("");

      try {
        await loadData();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load result management workspace");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [filters.search, filters.semester]);

  const handleSingleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await saveResult({
        ...form,
        semester: Number(form.semester),
        marks: {
          internal: Number(form.marks.internal),
          external: Number(form.marks.external),
          practical: Number(form.marks.practical)
        }
      });
      setForm(emptyForm);
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save result row");
    }
  };

  const handleBulkSubmit = async () => {
    setError("");

    try {
      const parsed = JSON.parse(bulkText);
      await bulkUploadResults(parsed);
      setBulkText("");
      await loadData();
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Bulk upload failed");
    }
  };

  if (loading && !meta.students.length) {
    return <Loader label="Loading result workspace..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Result Management</p>
        <h2>Upload marks, calculate GPA, and publish ranking lists</h2>
        <p>The backend automatically computes total marks, percentage, SGPA, and CGPA from result rows.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="two-column">
        <form className="panel" onSubmit={handleSingleSubmit}>
          <div className="panel-header">
            <h3>Upload / Update Result</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Student</span>
              <select value={form.studentId} onChange={(event) => setForm((current) => ({ ...current, studentId: event.target.value }))} required>
                <option value="">Select student</option>
                {meta.students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.rollNumber} - {student.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Course</span>
              <select value={form.courseId} onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))} required>
                <option value="">Select course</option>
                {meta.courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Exam</span>
              <select value={form.examId} onChange={(event) => setForm((current) => ({ ...current, examId: event.target.value }))} required>
                <option value="">Select exam</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.examId} - {exam.examType}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Academic Year</span>
              <input value={form.academicYear} onChange={(event) => setForm((current) => ({ ...current, academicYear: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Semester</span>
              <input type="number" min="1" max="8" value={form.semester} onChange={(event) => setForm((current) => ({ ...current, semester: event.target.value }))} />
            </label>
            <label className="field">
              <span>Internal Marks</span>
              <input type="number" value={form.marks.internal} onChange={(event) => setForm((current) => ({ ...current, marks: { ...current.marks, internal: event.target.value } }))} />
            </label>
            <label className="field">
              <span>External Marks</span>
              <input type="number" value={form.marks.external} onChange={(event) => setForm((current) => ({ ...current, marks: { ...current.marks, external: event.target.value } }))} />
            </label>
            <label className="field">
              <span>Practical Marks</span>
              <input type="number" value={form.marks.practical} onChange={(event) => setForm((current) => ({ ...current, marks: { ...current.marks, practical: event.target.value } }))} />
            </label>
          </div>
          <button className="primary-button" type="submit">
            Save Result
          </button>
        </form>

        <div className="panel">
          <div className="panel-header">
            <h3>Bulk Upload JSON</h3>
          </div>
          <label className="field">
            <span>Paste an array of result payload objects</span>
            <textarea value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder='[{"studentId":"...","courseId":"...","examId":"...","academicYear":"2025-2026","semester":4,"marks":{"internal":18,"external":55,"practical":0}}]' />
          </label>
          <div className="inline-actions">
            <button className="primary-button" type="button" onClick={handleBulkSubmit}>
              Upload Bulk Results
            </button>
            <button className="ghost-button" type="button" onClick={() => downloadResultsCsv(filters)}>
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Filters</h3>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Search Student</span>
            <input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} />
          </label>
          <label className="field">
            <span>Semester</span>
            <input type="number" min="1" max="8" value={filters.semester} onChange={(event) => setFilters((current) => ({ ...current, semester: event.target.value }))} />
          </label>
        </div>
      </section>

      <section className="two-column">
        <div className="table-card">
          <div className="panel-header">
            <h3>Top Ranking Students</h3>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
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
                    <td>{student.department}</td>
                    <td>{student.sgpa}</td>
                    <td>{student.averageMarks}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header">
            <h3>Upload Notes</h3>
          </div>
          <p className="helper-text">
            Single-result uploads are ideal for corrections. Bulk upload accepts an array and updates matching
            student-course-exam combinations without creating duplicates.
          </p>
          <p className="helper-text">
            Rankings and GPA calculations use aggregation pipelines on the backend to keep reporting fast for large
            datasets.
          </p>
        </div>
      </section>

      <ResultsTable items={results} />
    </div>
  );
}

export default ManageResults;
