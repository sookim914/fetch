import React, { useEffect, useState, useCallback } from "react";
import { Select, Spin } from "antd";
import { debounce } from "lodash";

const { Option } = Select;

export default function LocationFilter({ onLocationChange }) {
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchLocations = async (query) => {
    setLoading(true);
    try {
      let requestBody = {};

      if (isNaN(query)) {
        if (query.length === 2) {
          requestBody = { states: [query.trim().toUpperCase()] };
        } else {
          requestBody = { city: query.trim() };
        }

        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/locations/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ...requestBody, size: 100 }),
          }
        );
        const data = await response.json();

        const filteredResults = (data.results || []).filter(
          (location) => location && location.zip_code
        );

        const groupedResults = Object.values(
          filteredResults.reduce((acc, location) => {
            const key = `${location.city},${location.state}`;
            if (!acc[key]) {
              acc[key] = {
                city: location.city,
                state: location.state,
                zip_codes: [],
              };
            }
            if (!acc[key].zip_codes.includes(location.zip_code)) {
              acc[key].zip_codes.push(location.zip_code.toString());
            }
            return acc;
          }, {}) 
        );

        setLocations(groupedResults);
      } else {
        const response = await fetch(
          `https://frontend-take-home-service.fetch.com/locations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify([query.trim()]),
          }
        );
        const data = await response.json();

        const filteredResults = data
          .filter((location) => location && location.zip_code) 
          .reduce((acc, curr) => {
            acc.push({
              ...curr,
              zip_codes: [curr.zip_code],
            });
            return acc;
          }, []);
        setLocations(filteredResults);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query && !loading) {
      setDropdownOpen(true);
    }
  }, [query, loading]);

  const debouncedFetchLocations = useCallback(
    debounce((query) => {
      if (query) {
        fetchLocations(query);
      } else {
        setLocations([]);
      }
    }, 700),
    []
  );

  const handleSearch = (value) => {
    setQuery(value);
    debouncedFetchLocations(value);
  };

  const handleChange = (value) => {
    setSelectedLocations(value);
    onLocationChange(value);
  };

  const handleDropdownVisibleChange = (open) => {
    if (!loading && open && locations.length > 0) {
      setDropdownOpen(true);
    } else if (!open) {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="custom-select-container">
      <Select
        className="custom-select"
        mode="multiple"
        allowClear
        placeholder="Search and select locations..."
        value={selectedLocations}
        onChange={handleChange}
        onSearch={handleSearch}
        style={{ width: "100%" }}
        optionFilterProp="children"
        open={dropdownOpen}
        dropdownRender={(menu) => (
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {menu}
          </div>
        )}
        dropdownStyle={{
          maxHeight: "300px",
          overflow: "auto",
          width: "300px",
        }}
        notFoundContent={
          loading ? (
            <div style={{ textAlign: "center" }}>
              <Spin size="small" />
            </div>
          ) : query && !locations.length ? (
            "No locations found"
          ) : null
        }
        onDropdownVisibleChange={handleDropdownVisibleChange}
      >
        {locations.map((location, index) => (
          <Option key={index} value={location.zip_codes.join(",")}>
            {location.city}, {location.state} ({location.zip_codes.length} zip
            codes)
          </Option>
        ))}
      </Select>
    </div>
  );
}
