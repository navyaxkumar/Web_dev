import StudentRow from "./StudentRow";

function StudentTable({ students, onUpdateScore }) {
  return (
    <div className="table-wrapper">
      <h2>Student List ({students.length} students)</h2>
      {students.length === 0 ? (
        <p className="empty-msg">No students added yet. Use the form above!</p>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Score</th>
              <th>Status</th>
              <th>Update Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <StudentRow
                key={student.id}
                index={index + 1}
                student={student}
                onUpdateScore={onUpdateScore}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentTable;