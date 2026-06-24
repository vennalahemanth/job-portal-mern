function JobCard({ job, onDelete, isOwner }) {
  return (
    <div className="job-card">
      <h2>{job.role}</h2>
      <p>🏢 {job.company}</p>
      <p className="salary">💰 ₹{job.salary}/month</p>
      <p style={{ fontSize: "12px", color: "#999" }}>
        Posted by: {job.postedBy?.name || "Unknown"}
      </p>
      <button className="apply-btn">Apply Now</button>
      {isOwner && (
        <button
          className="delete-btn"
          onClick={() => onDelete(job._id)}
        >
          🗑️ Delete
        </button>
      )}
    </div>
  );
}

export default JobCard;