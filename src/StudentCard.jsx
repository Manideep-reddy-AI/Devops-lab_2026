function StudentCard({ name, rollNumber, marks }) {
  // Calculate total marks
  const total = Object.values(marks).reduce((sum, mark) => sum + mark, 0)
  
  // Calculate average
  const average = (total / Object.keys(marks).length).toFixed(2)
  
  // Calculate grade based on average
  const getGrade = (avg) => {
    if (avg >= 90) return 'A+'
    if (avg >= 80) return 'A'
    if (avg >= 70) return 'B'
    if (avg >= 60) return 'C'
    return 'F'
  }
  
  const grade = getGrade(average)

  return (
    <div className="student-card">
      <div className="card-header">
        <h2>{name}</h2>
        <p className="roll-number">Roll No: {rollNumber}</p>
      </div>

      <div className="marks-section">
        <h3>Marks</h3>
        <div className="marks-list">
          {Object.entries(marks).map(([subject, mark]) => (
            <div key={subject} className="mark-item">
              <span className="subject">{subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
              <span className="mark">{mark}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="summary-section">
        <div className="summary-item">
          <span className="label">Total:</span>
          <span className="value">{total}</span>
        </div>
        <div className="summary-item">
          <span className="label">Average:</span>
          <span className="value">{average}</span>
        </div>
        <div className="summary-item grade-item">
          <span className="label">Grade:</span>
          <span className={`grade ${grade}`}>{grade}</span>
        </div>
      </div>
    </div>
  )
}

export default StudentCard
