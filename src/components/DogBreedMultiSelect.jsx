import React, { useState, useEffect } from "react";
import { Select, Input, Spin } from "antd";

const { Option } = Select;

export default function DogBreedMultiSelect({onBreedsChange}) {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/dogs/breeds`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        setBreeds(data);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
  };

  const handleChange = (value) => {
    setSelectedBreeds(value);
    onBreedsChange(value)
  };

  const filteredBreeds = query
    ? breeds.filter((breed) =>
        breed.toLowerCase().includes(query.toLowerCase())
      )
    : breeds;

  return (
    <div >
      {loading ? (
        <Spin />
      ) : (
        <Select
          mode="multiple"
          allowClear
          placeholder="Select breeds..."
          value={selectedBreeds}
          onChange={handleChange}
          style={{ width: "100%" }}
          optionFilterProp="children"
        >
          {filteredBreeds.map((breed, index) => (
            <Option key={index} value={breed}>
              {breed}
            </Option>
          ))}
        </Select>
      )}
    </div>
  );
};
