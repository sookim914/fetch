import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

export default function AgeFilter({ onAgeChange }) {
  const [minAge, setMinAge] = useState(null);
  const [maxAge, setMaxAge] = useState(null);

  const handleMinAgeChange = (value) => {
    setMinAge(value);
    onAgeChange({ minAge: value, maxAge });
  };

  const handleMaxAgeChange = (value) => {
    setMaxAge(value);
    onAgeChange({ minAge, maxAge: value });
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <Select
        placeholder="Min Age"
        value={minAge}
        onChange={handleMinAgeChange}
        style={{ width: "50%" }}
      >
        {[...Array(16).keys()].map((age) => (
          <Option key={age} value={age}>
            {age}
          </Option>
        ))}
      </Select>

      <Select
        placeholder="Max Age"
        value={maxAge}
        onChange={handleMaxAgeChange}
        style={{ width: "50%" }}
      >
        {[...Array(16).keys()].map((age) => (
          <Option key={age} value={age}>
            {age}
          </Option>
        ))}
      </Select>
    </div>
  );
}
