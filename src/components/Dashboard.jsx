import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filterBreed, setFilterBreed] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);

  const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

  useEffect(() => {
    fetchDogs();
  }, [filterBreed, sortOrder, page]);

  const fetchDogs = async () => {
    console.log("here");

    // Build the query parameters based on optional parameters
    const params = new URLSearchParams();
    console.log('hi', sortOrder, filterBreed)
    if (sortOrder) {
      params.append("sort", `breed:${sortOrder}`);
    }
    // if (filterBreed) {
    //   params.append("breeds", filterBreed);
    // }
    // if (page) {
    //   params.append("size", 10);
    //   params.append("from", (page - 1) * 10);
    // }
    console.log(params)
    // Make the GET request with the query parameters
    const response = await fetch(
      `${API_BASE_URL}/dogs/search${
        params.toString() ? `?${params.toString()}` : ""
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log("search", response);
    const data = await response.json();
    console.log("data", data);
    const dogDetails = await fetchDogDetails(data.resultIds);
    setDogs(dogDetails);
  };

  const fetchDogDetails = async (ids) => {
    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ids),
    });
    return response.json();
  };

  const toggleFavorite = (dog) => {
    if (favorites.some((fav) => fav.id === dog.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const generateMatch = async () => {
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(favorites.map((dog) => dog.id)),
    });
    const match = await response.json();
    alert(`Your match is: ${match.match}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex gap-2 mb-4">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select"
        >
          <option value="asc">Breed Ascending</option>
          <option value="desc">Breed Descending</option>
        </select>
      </div>

      {/* Dog Cards */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {dogs.map((dog) => (
          <div key={dog.id} className="col">
            <div className="card h-100">
              <img
                src={dog.img}
                alt={dog.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{dog.name}</h5>
                <p className="card-text">Breed: {dog.breed}</p>
                <p className="card-text">Age: {dog.age}</p>
                <p className="card-text">Location: {dog.zip_code}</p>
                <button
                  onClick={() => toggleFavorite(dog)}
                  className={`btn w-100 mt-2 ${
                    favorites.some((fav) => fav.id === dog.id)
                      ? "btn-danger"
                      : "btn-success"
                  }`}
                >
                  {favorites.some((fav) => fav.id === dog.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="btn btn-outline-secondary"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="btn btn-outline-secondary ms-2"
          >
            Next
          </button>
        </div>
        <button
          onClick={generateMatch}
          className={`btn ${
            favorites.length === 0 ? "btn-secondary" : "btn-primary"
          }`}
        >
          Generate Match
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
