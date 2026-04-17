import { formatDate } from "../../utils/helpers";

function TimetableTable({ title, items = [], type = "class", onEdit, onDelete }) {
  if (!items.length) {
    return <div className="empty-state">No {type} entries available for the selected filters.</div>;
  }

  return (
    <div className="table-card">
      <div className="panel-header">
        <h3>{title}</h3>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{type === "class" ? "Day" : "Date"}</th>
              <th>Course</th>
              <th>{type === "class" ? "Faculty" : "Exam Type"}</th>
              <th>{type === "class" ? "Time" : "Slot"}</th>
              <th>Room</th>
              <th>Class</th>
              {(onEdit || onDelete) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{type === "class" ? item.dayOfWeek : formatDate(item.date)}</td>
                <td>
                  {item.courseId?.code}
                  <br />
                  <small>{item.courseId?.name}</small>
                </td>
                <td>{type === "class" ? item.facultyId?.name : item.examType}</td>
                <td>
                  {item.startTime} - {item.endTime}
                </td>
                <td>{item.room}</td>
                <td>
                  {item.departmentId?.code} Y{item.year} S{item.semester} {item.section}
                </td>
                {(onEdit || onDelete) && (
                  <td>
                    <div className="inline-actions">
                      {onEdit && (
                        <button className="ghost-button" type="button" onClick={() => onEdit(item)}>
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button className="danger-button" type="button" onClick={() => onDelete(item)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimetableTable;
