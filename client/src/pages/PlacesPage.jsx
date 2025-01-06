import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";

export default function PlacesPage() {
  const { action } = useParams();

  // States for form data
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuest, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState("");

  // States for places data
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");

  // Fetch all places on component mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const { data } = await axios.get("/places");
        setPlaces(data);
        console.log(data);
      } catch (err) {
        console.error("Failed to fetch places:", err);
        setError("Failed to load places. Please try again.");
      }
    };

    fetchPlaces();
  }, []);

  // Handle form submission for adding a new place
  const handleSubmit = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/places", {
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
      setRedirect("/account/places");
    } catch (error) {
      console.error("Failed to add place:", error);
      alert("Failed to add place. Please try again.");
    }
  };

  // Redirect after successful form submission
  if (redirect) return <Navigate to={redirect} />;

  return (
    <div>
      {action !== "new" ? (
        <>
          {/* Show error message if fetching places fails */}
          {error && <div className="error">{error}</div>}

          {/* Button to add a new place */}
          <div className="text-center m-6">
            <Link
              to="/account/places/new"
              className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
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

          {/* Display list of places */}
          <div>
            {places.length === 0 ? (
              <p>No places found.</p>
            ) : (
              <ul>
                {places.map((place) => (
                  <li key={place._id} className="place-item">
                    <h3>{place.title}</h3>
                    <p>
                      <strong>Address:</strong> {place.address}
                    </p>
                    <p>
                      <strong>Description:</strong> {place.description}
                    </p>
                    <p>
                      <strong>Max Guests:</strong> {place.maxGuest}
                    </p>
                    {place.photos?.length > 0 && (
                      <div className="photos">
                        {place.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo}
                            alt={`${place.title} - ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        // Render the form for adding a new place
        <form onSubmit={handleSubmit}>
          <InputField label="Title" value={title} setValue={setTitle} />
          <InputField label="Address" value={address} setValue={setAddress} />
          <PhotosUploader onPhotoChange={setAddedPhotos} />
          <InputField
            label="Description"
            value={description}
            setValue={setDescription}
            type="textarea"
          />
          <Perks selected={perks} onChange={setPerks} />
          <InputField
            label="Extra Info"
            value={extraInfo}
            setValue={setExtraInfo}
            type="textarea"
          />
          <InputField
            label="Check-In Time"
            value={checkIn}
            setValue={setCheckIn}
            type="number"
          />
          <InputField
            label="Check-Out Time"
            value={checkOut}
            setValue={setCheckOut}
            type="number"
          />
          <InputField
            label="Max Guests"
            value={maxGuest}
            setValue={setMaxGuests}
            type="number"
          />
          <button className="primary my-4" type="submit">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

// Helper component for input fields
function InputField({ label, value, setValue, type = "text" }) {
  return (
    <div>
      <h3>{label}</h3>
      {type === "textarea" ? (
        <textarea value={value} onChange={(ev) => setValue(ev.target.value)} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(ev) => setValue(ev.target.value)}
        />
      )}
    </div>
  );
}
