import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import { toast } from "react-toastify"; // Import the toast library for displaying notifications

export default function AdvertisementForm({
  _id,
  image_path: existingImagePath,
  start_date: existingStartDate,
  end_date: existingEndDate,
}) {
  const [images, setImages] = useState([]);
  const [startDate, setStartDate] = useState(existingStartDate || "");
  const [endDate, setEndDate] = useState(existingEndDate || "");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if(_id){
      setStartDate(new Date(existingStartDate.split('T')[0]));
      setEndDate(new Date(existingEndDate.split('T')[0]));  
    }
      
  }, []);
  
  async function saveAdvertisement(ev) {
    ev.preventDefault();
    const data = new FormData();

    for (const image of images) {
      data.append("file", image);
    }

    setIsUploading(true);

    try {
      const response = await axios.post("/api/advertisement-upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedImagePaths = response.data.links.map((linkObj) => linkObj.link);
      console.log("Uploaded Image Paths:", uploadedImagePaths);

      // Prepare data for saving the advertisement
      const advertisementData = {
        image_paths: uploadedImagePaths, // Use the uploaded image paths
        start_date: startDate,
        end_date: endDate,
      };

      // Call API to save the advertisement
      await axios.post("/api/advertisements", advertisementData);

      setIsUploading(false);
      setImages([]);
      setStartDate("");
      setEndDate("");

      // Show a success toast
      toast.success("Advertisement saved successfully!");
    } catch (error) {
      console.error(error);
      setIsUploading(false);

      // Show an error toast if save fails
      toast.error("Failed to save advertisement.");
    }
  }

  return (
    <form onSubmit={saveAdvertisement} encType="multipart/form-data">
    <label>Images</label>
    <div className="mb-2">
      <ReactSortable
        list={images}
        setList={setImages}
        className="sortable-images flex flex-wrap gap-1"
        handle=".sortable-handle"
        direction="horizontal"  // Set the direction to horizontal
      >
        {images.map((image, index) => (
          <div key={index} className="sortable-image">
            <img

              src={URL.createObjectURL(image)}
              alt={`Advertisement ${index}`}
              className="sortable-img"
              style={{ width: "200px", height: "200px" }}  // Adjust the image size here
            />
            <div className="sortable-handle">Drag</div>
          </div>
        ))}
      </ReactSortable>
    </div>
    <input
      type="file"
      multiple
      onChange={(ev) => setImages([...ev.target.files])}
    />

    <label>Start Date</label>
    <input
      type="date"
      value={startDate}
      onChange={(ev) => setStartDate(ev.target.value)}
    />

    <label>End Date</label>
    <input
      type="date"
      value={endDate}
      onChange={(ev) => setEndDate(ev.target.value)}
    />

    <button type="submit" className="btn-primary">
      {isUploading ? <Spinner /> : "Save Advertisement"}
    </button>
  </form>
  );
}
