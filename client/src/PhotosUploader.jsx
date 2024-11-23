import React, { useState } from "react";
import axios from "axios";

export default function PhotosUploader() {
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");

  // Function to handle uploading photos from local machine
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]); // Append each file to the FormData object
    }

    // Send the files to the backend
    axios
      .post("http://localhost:4000/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => [...prev, ...filenames]); // Update state with the filenames received from backend
      })
      .catch((error) => {
        console.error("Failed to upload photos:", error);
        alert("Failed to upload photos. Please try again.");
      });
  }

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    try {
      const { data: filename } = await axios.post(
        "http://localhost:4000/upload-by-link",
        {
          link: photoLink,
        }
      );
      setAddedPhotos((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (error) {
      console.error("Failed to upload photo by link:", error);
      alert("Failed to upload photo. Please check the URL and try again.");
    }
  }

  function getImageSrc(link) {
    if (link.startsWith("http")) {
      return link; // For remote URLs
    } else {
      return `http://localhost:4000/uploads/${link.replace(/\\/g, "/")}`; // Correct the path here
    }
  }

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          placeholder={"Add using a link ....jpg"}
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 px-4 rounded-2xl"
        >
          Add&nbsp;photo
        </button>
      </div>
      <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-44 flex" key={link}>
              <img
                className="rounded-2xl w-full object-cover"
                src={getImageSrc(link)} // Use the getImageSrc function to determine the correct src
                alt="Uploaded"
              />
            </div>
          ))}
        <label className="h-44 cursor-pointer gp-1 flex items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-500">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto} // Call uploadPhoto when files are selected
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M4.5 13a3.5 3.5 0 0 1-1.41-6.705A3.5 3.5 0 0 1 9.72 4.124a2.5 2.5 0 0 1 3.197 3.018A3.001 3.001 0 0 1 12 13H4.5Zm.72-5.03a.75.75 0 0 0 1.06 1.06l.97-.97v2.69a.75.75 0 0 0 1.5 0V8.06l.97.97a.75.75 0 1 0 1.06-1.06L8.53 5.72a.75.75 0 0 0-1.06 0L5.22 7.97Z"
              clipRule="evenodd"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}
