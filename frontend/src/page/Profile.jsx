import { useState, useEffect } from "react";
import "../styles/Profile.css";

function Profile() {

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
    monthlyIncome: "",
    savings: "",
    targetExpenses: ""
  });

  useEffect(() => {
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        photo: storedUser.photo || "",
        monthlyIncome: storedUser.monthlyIncome || "",
        savings: storedUser.savings || "",
        targetExpenses: storedUser.targetExpenses || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setUser({ ...user, photo: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {

    const existingUser = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
      ...existingUser,   // keep token + id
      ...user
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile Updated Successfully!");

    setIsEditing(false);
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        <h2>My Profile</h2>

        <div className="profile-image">
          <img
            src={
              user.photo
                ? user.photo
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
          />

          {isEditing && (
            <input type="file" onChange={handlePhotoChange} />
          )}
        </div>

        <div className="profile-details">

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled
          />

          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Monthly Income</label>
          <input
            type="number"
            name="monthlyIncome"
            value={user.monthlyIncome}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Savings</label>
          <input
            type="number"
            name="savings"
            value={user.savings}
            disabled={!isEditing}
            onChange={handleChange}
          />

          <label>Target Expenses</label>
          <input
            type="number"
            name="targetExpenses"
            value={user.targetExpenses}
            disabled={!isEditing}
            onChange={handleChange}
          />

        </div>

        <div className="profile-buttons">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSave}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;