import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormContributor = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    number: "",
    type: "",
    link: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Contributor submitted:", form);
    alert("Contributor registered!");
    navigate("/");
  };

  return (
    <div className="form-container">
      <div className="bubbles">
        <span className="bubble bubble1"></span>
        <span className="bubble bubble2"></span>
        <span className="bubble bubble3"></span>
        <span className="bubble bubble4"></span>
        <span className="bubble bubble5"></span>
      </div>

      <div className="form-card">
        <h1 className="form-title">Contributor Form</h1>
        <form className="arena-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            value={form.number}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Contribution Type</option>
            <option value="boutique">Boutique</option>
            <option value="service">Professional Service</option>
            <option value="entertainment">Entertainment & Events</option>
            <option value="education">Education / Training</option>
            <option value="restauration">Restaurant / Food</option>
            <option value="art-culture">Art & Culture</option>
            <option value="health">Health & Wellness</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="link"
            placeholder="Website or Page Link"
            value={form.link}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>

      <style jsx="true">{`
        html,
        body {
          height: 100%;
          margin: 0;
          font-family: "Segoe UI", sans-serif;
        }

        .form-container {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          overflow: hidden;
        }

        /* Blurred bubbles */
        .bubbles {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
          filter: blur(10px);
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 123, 255, 0.15);
        }
        .bubble1 {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 15%;
        }
        .bubble2 {
          width: 150px;
          height: 150px;
          top: 30%;
          left: 70%;
        }
        .bubble3 {
          width: 80px;
          height: 80px;
          top: 60%;
          left: 40%;
        }
        .bubble4 {
          width: 120px;
          height: 120px;
          top: 75%;
          left: 20%;
        }
        .bubble5 {
          width: 90px;
          height: 90px;
          top: 50%;
          left: 85%;
        }

        .form-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.85);
          padding: 30px 20px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .form-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #222;
        }

        .arena-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .arena-form input,
        .arena-form select,
        .arena-form textarea {
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-size: 1rem;
          width: 100%;
          box-sizing: border-box;
        }

        .arena-form textarea {
          min-height: 100px;
          resize: vertical;
        }

        .arena-form button {
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: #2575fc;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.3s;
        }
        .arena-form button:hover {
          background: #6a11cb;
        }

        @media (max-width: 768px) {
          .form-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default FormContributor;
