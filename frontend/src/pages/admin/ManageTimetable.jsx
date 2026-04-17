import { useEffect, useMemo, useState } from "react";
import Loader from "../../components/common/Loader";
import TimetableTable from "../../components/timetable/TimetableTable";
import api from "../../services/api";
import {
  deleteExam,
  deleteTimetable,
  getExams,
  getTimetables,
  saveExam,
  saveTimetable
} from "../../services/timetable.service";

const emptyClassForm = {
  entryType: "CLASS",
  courseId: "",
  facultyId: "",
  departmentId: "",
  year: 1,
  semester: 1,
  section: "A",
  dayOfWeek: "Monday",
  period: 1,
  startTime: "09:00",
  endTime: "09:55",
  room: ""
};

const emptyExamForm = {
  examId: "",
  courseId: "",
  facultyId: "",
  departmentId: "",
  year: 1,
  semester: 1,
  section: "A",
  examType: "MID_SEM",
  academicYear: "2025-2026",
  date: "",
  startTime: "10:00",
  endTime: "12:00",
  room: ""
};

function ManageTimetable() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState({ departments: [], courses: [], faculty: [] });
  const [filters, setFilters] = useState({ departmentId: "", year: 2, semester: 4, section: "A" });
  const [classForm, setClassForm] = useState(emptyClassForm);
  const [examForm, setExamForm] = useState(emptyExamForm);
  const [editingClassId, setEditingClassId] = useState("");
  const [editingExamId, setEditingExamId] = useState("");
  const [timetables, setTimetables] = useState([]);
  const [exams, setExams] = useState([]);

  const loadMeta = async () => {
    const { data } = await api.get("/meta/bootstrap");
    setMeta(data);

    if (data.departments.length) {
      setFilters((current) => ({
        ...current,
        departmentId: current.departmentId || data.departments[0]._id
      }));
    }
  };

  const loadSchedules = async (activeFilters = filters) => {
    const [timetableData, examData] = await Promise.all([getTimetables(activeFilters), getExams(activeFilters)]);
    setTimetables(timetableData.items || []);
    setExams(examData.items || []);
  };

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      setError("");

      try {
        await loadMeta();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load scheduling metadata");
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!filters.departmentId) {
      return;
    }

    const refresh = async () => {
      setLoading(true);

      try {
        await loadSchedules();
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load schedule data");
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, [filters]);

  const courses = useMemo(
    () => meta.courses.filter((course) => !filters.departmentId || course.departmentId?._id === filters.departmentId),
    [meta.courses, filters.departmentId]
  );

  const applyCourseDefaults = (courseId, currentForm) => {
    const course = meta.courses.find((item) => item._id === courseId);
    if (!course) {
      return currentForm;
    }

    return {
      ...currentForm,
      courseId,
      departmentId: course.departmentId?._id || course.departmentId,
      facultyId: currentForm.facultyId || course.facultyId || "",
      year: course.year,
      semester: course.semester,
      section: filters.section
    };
  };

  const handleClassSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await saveTimetable(classForm, editingClassId || null);
      setClassForm({
        ...emptyClassForm,
        departmentId: filters.departmentId,
        year: filters.year,
        semester: filters.semester,
        section: filters.section
      });
      setEditingClassId("");
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save timetable entry");
    }
  };

  const handleExamSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await saveExam(examForm, editingExamId || null);
      setExamForm({
        ...emptyExamForm,
        departmentId: filters.departmentId,
        year: filters.year,
        semester: filters.semester,
        section: filters.section
      });
      setEditingExamId("");
      await loadSchedules();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save exam schedule");
    }
  };

  if (loading && !meta.departments.length) {
    return <Loader label="Loading scheduling workspace..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Timetable Management</p>
        <h2>Create class schedules and exam schedules with conflict detection</h2>
        <p>Filters below update both the class timetable grid and the exam schedule list.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <h3>Active Filters</h3>
        </div>
        <div className="form-grid">
          <label className="field">
            <span>Department</span>
            <select value={filters.departmentId} onChange={(event) => setFilters((current) => ({ ...current, departmentId: event.target.value }))}>
              {meta.departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.code}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Year</span>
            <input type="number" min="1" max="4" value={filters.year} onChange={(event) => setFilters((current) => ({ ...current, year: Number(event.target.value) }))} />
          </label>
          <label className="field">
            <span>Semester</span>
            <input type="number" min="1" max="8" value={filters.semester} onChange={(event) => setFilters((current) => ({ ...current, semester: Number(event.target.value) }))} />
          </label>
          <label className="field">
            <span>Section</span>
            <input value={filters.section} onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))} />
          </label>
        </div>
      </section>

      <section className="two-column">
        <form className="panel" onSubmit={handleClassSubmit}>
          <div className="panel-header">
            <h3>{editingClassId ? "Edit Class Entry" : "Create Class Entry"}</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Course</span>
              <select
                value={classForm.courseId}
                onChange={(event) => setClassForm((current) => applyCourseDefaults(event.target.value, current))}
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Faculty</span>
              <select value={classForm.facultyId} onChange={(event) => setClassForm((current) => ({ ...current, facultyId: event.target.value }))} required>
                <option value="">Select faculty</option>
                {meta.faculty.map((person) => (
                  <option key={person._id} value={person._id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Day</span>
              <select value={classForm.dayOfWeek} onChange={(event) => setClassForm((current) => ({ ...current, dayOfWeek: event.target.value }))}>
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Period</span>
              <input type="number" min="1" max="8" value={classForm.period} onChange={(event) => setClassForm((current) => ({ ...current, period: Number(event.target.value) }))} />
            </label>
            <label className="field">
              <span>Start</span>
              <input type="time" value={classForm.startTime} onChange={(event) => setClassForm((current) => ({ ...current, startTime: event.target.value }))} />
            </label>
            <label className="field">
              <span>End</span>
              <input type="time" value={classForm.endTime} onChange={(event) => setClassForm((current) => ({ ...current, endTime: event.target.value }))} />
            </label>
            <label className="field">
              <span>Room</span>
              <input value={classForm.room} onChange={(event) => setClassForm((current) => ({ ...current, room: event.target.value }))} required />
            </label>
          </div>
          <div className="inline-actions">
            <button className="primary-button" type="submit">
              {editingClassId ? "Update Entry" : "Create Entry"}
            </button>
            {editingClassId && (
              <button className="ghost-button" type="button" onClick={() => { setEditingClassId(""); setClassForm(emptyClassForm); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <form className="panel" onSubmit={handleExamSubmit}>
          <div className="panel-header">
            <h3>{editingExamId ? "Edit Exam Schedule" : "Create Exam Schedule"}</h3>
          </div>
          <div className="form-grid">
            <label className="field">
              <span>Exam ID</span>
              <input value={examForm.examId} onChange={(event) => setExamForm((current) => ({ ...current, examId: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Course</span>
              <select
                value={examForm.courseId}
                onChange={(event) => setExamForm((current) => applyCourseDefaults(event.target.value, current))}
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Exam Type</span>
              <select value={examForm.examType} onChange={(event) => setExamForm((current) => ({ ...current, examType: event.target.value }))}>
                {["MID_SEM", "END_SEM", "QUIZ", "PRACTICAL"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Date</span>
              <input type="date" value={examForm.date} onChange={(event) => setExamForm((current) => ({ ...current, date: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Start</span>
              <input type="time" value={examForm.startTime} onChange={(event) => setExamForm((current) => ({ ...current, startTime: event.target.value }))} required />
            </label>
            <label className="field">
              <span>End</span>
              <input type="time" value={examForm.endTime} onChange={(event) => setExamForm((current) => ({ ...current, endTime: event.target.value }))} required />
            </label>
            <label className="field">
              <span>Room</span>
              <input value={examForm.room} onChange={(event) => setExamForm((current) => ({ ...current, room: event.target.value }))} required />
            </label>
          </div>
          <div className="inline-actions">
            <button className="primary-button" type="submit">
              {editingExamId ? "Update Exam" : "Create Exam"}
            </button>
            {editingExamId && (
              <button className="ghost-button" type="button" onClick={() => { setEditingExamId(""); setExamForm(emptyExamForm); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <TimetableTable
        title="Class Timetable"
        items={timetables}
        type="class"
        onEdit={(item) => {
          setEditingClassId(item._id);
          setClassForm({
            entryType: item.entryType,
            courseId: item.courseId?._id || item.courseId,
            facultyId: item.facultyId?._id || item.facultyId,
            departmentId: item.departmentId?._id || item.departmentId,
            year: item.year,
            semester: item.semester,
            section: item.section,
            dayOfWeek: item.dayOfWeek,
            period: item.period,
            startTime: item.startTime,
            endTime: item.endTime,
            room: item.room
          });
        }}
        onDelete={async (item) => {
          await deleteTimetable(item._id);
          await loadSchedules();
        }}
      />

      <TimetableTable
        title="Exam Schedule"
        items={exams}
        type="exam"
        onEdit={(item) => {
          setEditingExamId(item._id);
          setExamForm({
            examId: item.examId,
            courseId: item.courseId?._id || item.courseId,
            facultyId: item.facultyId?._id || item.facultyId,
            departmentId: item.departmentId?._id || item.departmentId,
            year: item.year,
            semester: item.semester,
            section: item.section,
            examType: item.examType,
            academicYear: item.academicYear,
            date: item.date?.slice(0, 10),
            startTime: item.startTime,
            endTime: item.endTime,
            room: item.room
          });
        }}
        onDelete={async (item) => {
          await deleteExam(item._id);
          await loadSchedules();
        }}
      />
    </div>
  );
}

export default ManageTimetable;
