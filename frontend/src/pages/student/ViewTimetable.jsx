import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import TimetableTable from "../../components/timetable/TimetableTable";
import useAuth from "../../hooks/useAuth";
import { getExams, getTimetables } from "../../services/timetable.service";

function ViewTimetable() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timetables, setTimetables] = useState([]);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const loadSchedule = async () => {
      const profile = user?.studentProfile;
      if (!profile) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const filters = {
          departmentId: profile.departmentId?._id || profile.departmentId,
          year: profile.year,
          semester: profile.semester,
          section: profile.section
        };

        const [timetableData, examData] = await Promise.all([getTimetables(filters), getExams(filters)]);
        setTimetables(timetableData.items || []);
        setExams(examData.items || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your timetable");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [user]);

  if (loading) {
    return <Loader label="Loading class schedule..." />;
  }

  return (
    <div className="page-section">
      <section className="hero-card">
        <p className="eyebrow">Timetable Viewer</p>
        <h2>Your class schedule and exam schedule</h2>
        <p>All entries are filtered automatically for your department, year, semester, and section.</p>
      </section>

      {error && <div className="error-banner">{error}</div>}

      <TimetableTable title="Weekly Class Timetable" items={timetables} type="class" />
      <TimetableTable title="Exam Schedule" items={exams} type="exam" />
    </div>
  );
}

export default ViewTimetable;
