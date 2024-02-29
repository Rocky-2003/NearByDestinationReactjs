import { useState, useEffect, useRef } from "react";

import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setavailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      try {
        setIsFetching(true);
        const places = await fetchAvailablePlaces();

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            let sortedPlaces = sortPlacesByDistance(
              places,
              position.coords.latitude,
              position.coords.longitude
            );

            setavailablePlaces(sortedPlaces);
            setIsFetching(false);
          });
        }
      } catch (error) {
        setError({
          message:
            error.message || "Could not fetch places, please try again later ",
        });
        setIsFetching(false);
      }
    }
    fetchPlaces();
  }, []);
  if (error) {
    return <Error message={error.message} title="An error occured" />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText={"Fetching Place data..."}
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
