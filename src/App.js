import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch all feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("https://feedback-form-backend-1.onrender.com/feedback");
      setFeedbacks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Simple validation
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.message.trim()) errors.message = "Feedback message is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("https://feedback-form-backend-1.onrender.com/feedback", formData);
      setSuccessMessage("Thank you for your feedback!");
      setFormData({ name: "", email: "", message: "" });
      fetchFeedbacks();
      setErrors({});
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setSuccessMessage("");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Submit Your Feedback</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            className={`form-control ${errors.name ? "is-invalid" : ""}`} 
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={`form-control ${errors.email ? "is-invalid" : ""}`} 
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Feedback</label>
          <textarea 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            className={`form-control ${errors.message ? "is-invalid" : ""}`} 
            rows="4"
          />
          {errors.message && <div className="invalid-feedback">{errors.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      <hr className="my-5" />

      <h3>All Feedback</h3>
      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedbacks.map(({ _id, name, email, message, timestamp }) => (
          <div key={_id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{name} <small className="text-muted">&lt;{email}&gt;</small></h5>
              <p className="card-text">{message}</p>
              <p className="card-text"><small className="text-muted">{new Date(timestamp).toLocaleString()}</small></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
