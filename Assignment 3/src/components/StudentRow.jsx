import { useState } from "react";

function StudentRow({ index, student, onUpdateScore }) {
  const [inputScore, setInputScore] = useState(student.score);
  const passed = student.score >= 40;

  function handleUpdate() {
    if (!inputScore || isNaN(inputScore)) return;

    const score = Number(inputScore);
    if (score < 0 || score > 100) {
      alert("Score must be between 0 and 100");
      return;
    }

    onUpdateScore(student.id, inputScore);
  }

  return (
    <tr className="student-row">
      <td>{index}</td>
      <td>{student.name}</td>
      <td className="score-cell">{student.score}</td>
      <td>
        <span className={passed ? "status pass" : "status fail"}>
          {passed ? "Pass" : "Fail"}
        </span>
      </td>
      <td className="update-cell">
        <input
          type="text"
          value={inputScore}
          onChange={(e) => setInputScore(e.target.value)}
          className="score-input"
        />
        <button onClick={handleUpdate} className="btn btn-update">
          Update
        </button>
      </td>
    </tr>
  );
}

export default StudentRow;