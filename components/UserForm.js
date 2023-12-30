import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function saveUser(ev) {
    ev.preventDefault();

    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", image);

      // Upload the image
      const uploadResponse = await axios.post("/api/user-upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Get the uploaded image path from the response
      const uploadedImagePath = uploadResponse.data.links[0].link;

      const userData = {
        name,
        email,
        image: uploadedImagePath,
        emailVerified,
      };

      // Call API to save the user
      await axios.post("/api/users", userData);

      // Clear the data
      setName("");
      setEmail("");
      setImage(null);
      setEmailVerified(false);

      setIsUploading(false);

      // Show a success toast
      toast.success("User saved successfully!");
    } catch (error) {
      console.error(error);
      setIsUploading(false);

      // Show an error toast if save fails
      toast.error("Failed to save user.");
    }
  }

  return (
    <form onSubmit={saveUser}>
      <label className="block">Name</label>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)}
      />

      <label className="block">Email</label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)}
      />

      <label className="block">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setImage(ev.target.files[0])}
      />

      <label className="block">Email Verified</label>
      <input
        type="checkbox"
        checked={emailVerified}
        onChange={(ev) => setEmailVerified(ev.target.checked)}
      />

      <br />
      <button type="submit" className="btn-primary">
        {isUploading ? "Uploading..." : "Save User"}
      </button>
    </form>
  );
}
