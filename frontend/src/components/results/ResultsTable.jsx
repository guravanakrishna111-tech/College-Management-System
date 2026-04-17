function ResultsTable({ items = [] }) {
  if (!items.length) {
    return <div className="empty-state">No result rows found for the selected filters.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Exam</th>
              <th>Semester</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>
                  {item.studentId?.name}
                  <br />
                  <small>{item.studentId?.rollNumber}</small>
                </td>
                <td>
                  {item.courseId?.code}
                  <br />
                  <small>{item.courseId?.name}</small>
                </td>
                <td>{item.examType}</td>
                <td>{item.semester}</td>
                <td>{item.totalMarks}</td>
                <td>{item.percentage}%</td>
                <td>{item.grade}</td>
                <td>
                  <span className={`status-chip ${item.status === "PASS" ? "pass" : "fail"}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResultsTable;
