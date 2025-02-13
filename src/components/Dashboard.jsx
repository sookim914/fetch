import React, { useState, useEffect } from "react";
import { Select, Button, Card, Row, Col, message } from "antd";
import DogBreedMultiSelect from "./DogBreedMultiSelect";
import LocationFilter from "./LocationFilter";
import AgeFilter from "./AgeFilter";
import DogInfoModal from "./DogInfoModal";

const { Option } = Select;

const Dashboard = () => {
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [matchDogId, setMatchDogId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const API_BASE_URL = "https://frontend-take-home-service.fetch.com";
  const token = "your-auth-token";

  useEffect(() => {
    fetchDogs(page);
  }, [page, sortOrder]);

  const fetchDogs = async (nextPage = null) => {
    try {
      const url = new URL(`${API_BASE_URL}/dogs/search`);
      url.searchParams.append("sort", `breed:${sortOrder}`);
      url.searchParams.append("size", 32);
      if (minAge !== null) url.searchParams.append("ageMin", minAge);
      if (maxAge !== null) url.searchParams.append("ageMax", maxAge);
      if (nextPage) url.searchParams.append("from", 32 * (nextPage - 1));
      if (selectedLocations.length > 0)
        selectedLocations.forEach((zip) =>
          url.searchParams.append("zipCodes", zip)
        );
      if (breeds.length > 0)
        breeds.forEach((breed) => url.searchParams.append("breeds", breed));

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Error fetching dogs: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.resultIds && data.resultIds.length > 0) {
        const dogDetails = await fetchDogDetails(data.resultIds);
        setDogs(dogDetails);
      } else {
        setDogs([]);
      }
    } catch (error) {
      console.error("Error fetching dogs:", error);
      message.error("Failed to fetch dogs");
    }
  };

  const fetchDogDetails = async (ids) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ids),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  const handleSearch = () => {
    setDogs([]);
    fetchDogs();
  };

  const toggleFavorite = (dog) => {
    if (favorites.some((fav) => fav.id === dog.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      message.warning("Please add some dogs to favorites to generate a match.");
      return;
    }

    try {
      const dogIds = favorites.map((dog) => dog.id);
      const response = await fetch(`${API_BASE_URL}/dogs/match`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dogIds),
      });

      if (!response.ok) {
        throw new Error(`Error generating match: ${response.statusText}`);
      }

      const data = await response.json();
      const matchedDogId = data.match;
      setMatchDogId(matchedDogId);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error generating match:", error);
      message.error("Failed to generate match");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-container">
      <Row justify="end">
        <Button className="logout-btn" type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Row>

      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <DogBreedMultiSelect onBreedsChange={(breeds) => setBreeds(breeds)} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <LocationFilter
            onLocationChange={(locations) => setSelectedLocations(locations)}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <AgeFilter
            onAgeChange={(age) => {
              setMinAge(age.minAge);
              setMaxAge(age.maxAge);
            }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} className="dashboard-button-col">
          <Button
            onClick={generateMatch}
            type="primary"
            disabled={favorites.length === 0}
            className="generate-match-btn"
          >
            Find Your Match<i className="fas fa-paw"></i>
          </Button>
          <Button onClick={handleSearch} type="primary" className="search-btn">
            Search
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="sort-order-row">
        <Col xs={18} sm={12} md={6} align="right">
          <Select
            value={sortOrder}
            onChange={(value) => setSortOrder(value)}
            className="sort-order-select"
          >
            <Option value="asc">Breed Ascending</Option>
            <Option value="desc">Breed Descending</Option>
          </Select>
        </Col>
      </Row>

      <Row justify="start" gutter={[16, 16]}>
        {dogs.map((dog) => (
          <Col key={dog.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              cover={
                <img alt={dog.name} src={dog.img} className="dog-card-img" />
              }
              actions={[
                <Button
                  type={
                    favorites.some((fav) => fav.id === dog.id)
                      ? "primary"
                      : "default"
                  }
                  danger={favorites.some((fav) => fav.id === dog.id)}
                  onClick={() => toggleFavorite(dog)}
                  className="favorite-btn"
                >
                  {favorites.some((fav) => fav.id === dog.id)
                    ? "Remove from Favorites"
                    : "Add to Favorites ♡"}
                </Button>,
              ]}
            >
              <Card.Meta
                title={dog.name}
                description={
                  <>
                    <p>Breed: {dog.breed}</p>
                    <p>Age: {dog.age}</p>
                    <p>Location: {dog.zip_code}</p>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <div className="pagination-match-container">
        <div className="pagination-buttons-wrapper">
          <Button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            className="pagination-btn"
          >
            Next
          </Button>
        </div>
      </div>

      <DogInfoModal
        visible={isModalVisible}
        dogId={matchDogId}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
};

export default Dashboard;
