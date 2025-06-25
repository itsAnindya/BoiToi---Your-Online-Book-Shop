import React, { useState } from "react";

const SearchBar = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={{
          padding: "8px",
          borderRadius: "4px 0 0 4px",
          border: "1px solid #ccc",
          outline: "none",
          flex: 1,
        }}
      />
      <button
        type="submit"
        style={{
          padding: "8px 16px",
          border: "none",
          borderRadius: "0 4px 4px 0",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;