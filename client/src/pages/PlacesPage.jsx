import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuests] = useState(1);

  function inputHeader(text) {
    return <p className="text-2xl mt-4">{text}</p>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <div>
        {inputHeader(header)}
        {inputDescription(description)}
      </div>
    );
  }
  async function handleSubmit(ev) {
    ev.preventDefault();
    // Handle form submission logic here (e.g., save the data to your backend)
    console.log("Form submitted:", {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
    });

    try {
      const response = await axios.post("/api/places", {
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
      });
      console.log("Place added successfully:", response.data);
      // Optionally redirect or show success message
    } catch (error) {
      console.error("Failed to add place:", error);
      alert("Failed to add place. Please try again.");
    }
  }

  return (
    <div>
      {action === undefined && <p>No action provided</p>}
      {action !== "new" && (
        <div className="text-center m-6">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-6"
            >
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            Add new place
          </Link>
        </div>
      )}
      {action === "new" && (
        <div>
          <form onSubmit={handleSubmit}>
            {preInput(
              "Title",
              "Title for your place. should be short and catchy as in advertisement."
            )}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title, for example: my lovely apartment"
            />
            {preInput("Address", "Address of the place.")}
            <input
              type="text"
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              placeholder="address"
            />
            {preInput("Photos", "More = Better")}
            <PhotosUploader></PhotosUploader>
            {preInput("Description", "Description of the places.")}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            ></textarea>
            {preInput("Perks", "Select all the perks of your place.")}
            <Perks selected={perks} onChange={setPerks}></Perks>
            {preInput("Extra info", "House rules, etc.")}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            ></textarea>
            {preInput(
              "Check in&out times",
              "Add check in and check out times, remember to have some time window for cleaning the room between guests."
            )}
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <h3 className="mt-2 -mb-1">Check in time</h3>
                <input
                  type="text"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  placeholder="15:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check out time</h3>
                <input
                  type="text"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  placeholder="11:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Max guests</h3>
                <input
                  type="number"
                  value={maxGuest}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                  placeholder="1"
                />
              </div>
            </div>
            <button className="primary my-4" type="submit">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
