import React from "react";

function App() {
  const subjects = [
    { name: "Mathematics", progress: "82%", status: "On Track" },
    { name: "Computer Science", progress: "91%", status: "Excellent" },
    { name: "Physics", progress: "74%", status: "Improving" },
    { name: "English", progress: "88%", status: "Strong" }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Student Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome to the frontend container deployed through Continuous Deployment.
        </p>

        <div style={styles.summaryRow}>
          <div style={styles.summaryBox}>
            <h3>Total Courses</h3>
            <p>4</p>
          </div>
          <div style={styles.summaryBox}>
            <h3>Attendance</h3>
            <p>93%</p>
          </div>
          <div style={styles.summaryBox}>
            <h3>Assignments</h3>
            <p>12 Submitted</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Course Progress</h2>

        <div>
          {subjects.map((subject, index) => (
            <div key={index} style={styles.subjectCard}>
              <div>
                <strong>{subject.name}</strong>
                <p style={styles.smallText}>Status: {subject.status}</p>
              </div>
              <div style={styles.progress}>{subject.progress}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    margin: 0,
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.2)"
  },
  title: {
    margin: 0,
    color: "#0f172a"
  },
  subtitle: {
    color: "#475569",
    marginBottom: "24px"
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px"
  },
  summaryBox: {
    background: "#eff6ff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center"
  },
  sectionTitle: {
    color: "#1e293b",
    marginBottom: "16px"
  },
  subjectCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "12px"
  },
  progress: {
    fontWeight: "bold",
    color: "#2563eb"
  },
  smallText: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px"
  }
};

export default App;
