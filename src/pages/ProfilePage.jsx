import { useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, saveProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveProfile({ name });
    setSuccess("Profile updated successfully.");
  };

  return (
    <div className="page-stack">
      <SectionHeader
        eyebrow="Profile"
        title="Manage your account details"
        description="A simple settings page makes the project feel complete and realistic."
      />

      <article className="panel narrow-panel">
        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={user?.email || ""} disabled />
          </label>
          <button type="submit" className="primary-button">
            Save Changes
          </button>
          {success ? <p className="success-text">{success}</p> : null}
        </form>
      </article>
    </div>
  );
}
