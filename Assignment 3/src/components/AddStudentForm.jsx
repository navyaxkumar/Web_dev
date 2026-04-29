import { useState } from "react";

function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [score, setScore] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a student name.");
      return;
    }

    const parsed = Number(score);
    if (!score || isNaN(parsed) || parsed < 0 || parsed > 100) {
      alert("Please enter a valid score between 0 and 100.");
      return;
    }

    onAdd(name.trim(), score);
    setName("");
    setScore("");
  }

  return (
    <div className="form-wrapper">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Score (0–100)</label>
          <input
            type="text"
            placeholder="Score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="form-input"
          />
        </div>
        <button type="submit" className="btn btn-add">Add Student</button>
      </form>
    </div>
  );
}

export default AddStudentForm;