import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import https from "../helpers/https";
import Swal from "sweetalert2";

export default function UpdateProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "", email: "", profilePicture: "" });
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // State untuk file gambar

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const response = await https({
        method: "GET",
        url: "/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to fetch user",
      });
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    try {
      await https({
        method: "PUT",
        url: "/profile/update",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: { name: user.name, email: user.email, password },
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully",
      });

      navigate("/profile");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to update profile",
      });
    }
  }

  async function handleUpdatePhoto(e) {
    e.preventDefault();

    if (!selectedFile) {
      Swal.fire({
        icon: "warning",
        title: "No file selected",
        text: "Please choose a file before uploading",
      });
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    try {
      const response = await https({
        method: "PATCH",
        url: "/profile/update/image",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: formData,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile picture updated successfully",
      });

      setUser((prev) => ({
        ...prev,
        profilePicture: response.data.profilePictureURL,
      }));
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.data?.message || "Failed to update profile picture",
      });
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Update Profile</h2>

      <form onSubmit={handleUpdatePhoto} className="card p-4 shadow mt-4">
        <h5>Update Profile Picture</h5>

        <div className="text-center mb-3">
          <img
            src={
              user.profilePicture ||
              "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
            }
            alt="Profile"
            className="rounded-circle"
            width="150"
            height="150"
          />
        </div>

        <input
          type="file"
          className="form-control"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        <button type="submit" className="btn btn-dark mt-3 w-100">
          Upload Photo
        </button>
      </form>

      <hr />

      <form onSubmit={handleUpdateProfile} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Update Profile
        </button>
      </form>
    </div>
  );
}
