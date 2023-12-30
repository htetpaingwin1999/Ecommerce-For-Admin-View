import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventForm() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [onStatus, setOnStatus] = useState(0);
  const [besideOrUp, setBesideOrUp] = useState(0); // New state for besideOrUp
  const [isUploading, setIsUploading] = useState(false);

  async function saveEvent(ev) {
    ev.preventDefault();

    if (!image) {
      toast.error("Please select an image for the main image.");
      return;
    }

    if (!backgroundImage) {
      toast.error("Please select an image for the background.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadImageData = new FormData();
      uploadImageData.append("file", image);

      // Upload the main image
      const mainImageUploadResponse = await axios.post("/api/event-upload", uploadImageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const mainImagePath = mainImageUploadResponse.data.links[0].link;

      const uploadBackgroundData = new FormData();
      uploadBackgroundData.append("file", backgroundImage);

      // Upload the background image
      const backgroundUploadResponse = await axios.post("/api/event-background-upload", uploadBackgroundData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const backgroundImagePath = backgroundUploadResponse.data.links[0].link;

      const eventData = {
        name,
        image_path: mainImagePath,
        background_image_path: backgroundImagePath,
        onStatus,
        besideOrUp, // Include besideOrUp in the eventData
      };

      // Call API to save the event
      await axios.post("/api/events", eventData);

      // Clear the data
      setName("");
      setImage(null);
      setBackgroundImage(null);
      setOnStatus(0);
      setBesideOrUp(0); // Reset besideOrUp

      setIsUploading(false);

      // Show a success toast
      toast.success("Event saved successfully!");
    } catch (error) {
      console.error(error);
      setIsUploading(false);

      // Show an error toast if save fails
      toast.error("Failed to save event.");
    }
  }

  const handleNameChange = (ev) => {
    setName(ev.target.value);
  };

  const handleOnStatusChange = (ev) => {
    setOnStatus(Number(ev.target.value));
  };

  const handleBesideOrUpChange = (ev) => {
    setBesideOrUp(Number(ev.target.value));
  };

  return (
    <form onSubmit={saveEvent}>
      <label className="block">Event Name</label>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={handleNameChange}
      />

      <label className="block">Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setImage(ev.target.files[0])}
      />

      <label className="block">Background Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setBackgroundImage(ev.target.files[0])}
      />

      <label className="block">On Status</label>
      <select
        value={onStatus}
        onChange={handleOnStatusChange}
      >
        <option value={0}>Off</option>
        <option value={1}>On</option>
      </select>

      <label className="block">Beside Or Up</label>
      <select
        value={besideOrUp}
        onChange={handleBesideOrUpChange}
      >
        <option value={0}>ဘေးဘက်</option>
        <option value={1}>အပေါ်ဘက်</option>
      </select>

      <br />
      <button type="submit" className="btn-primary">
        {isUploading ? "Uploading..." : "Save Event"}
      </button>
    </form>
  );
}
