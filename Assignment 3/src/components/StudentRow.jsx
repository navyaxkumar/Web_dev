import { useState } from "react";

function StudentRow({ index, student, onUpdateScore }) {
  const [inputScore, setInputScore] = useState(student.score);
  const isPassed = student.score >= 40;

  const handleUpdate = () => {
    if (inputScore === "" || isNaN(inputScore)) return;
    if (inputScore < 0 || inputScore > 100) {
      alert("Score must be between 0 and 100");
      return;
    }
    onUpdateScore(student.id, inputScore);
  };

  return (
    <tr className="student-row">
      <td>{index}</td>
      <td>{student.name}</td>
      <td className="score-cell">{student.score}</td>
      <td>
        <span className={isPassed ? "status pass" : "status fail"}>
          {isPassed ? "✅ Pass" : "❌ Fail"}
        </span>
      </td>
      <td className="update-cell">
        <input
          type="number"
          min="0"
          max="100"
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