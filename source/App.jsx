import { useState } from "react";
import { initialBuildings } from "./data/initialData";
import "./styles.css";

export default function App() {
  const [unsorted, setUnsorted] = useState(
    initialBuildings.sort(() => Math.random() - 0.5)
  );

   // Category containers stored in a single structured object
  const [categories, setCategories] = useState({
    Croatia: [],
    Bosnia: [],
    Serbia: [],
    "North Macedonia": [],
    Montenegro: [],
    Slovenia: [],
  });

  const [errorMsg, setErrorMsg] = useState("");

  function handleDragStart(e, item) {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  }

  function allowDrop(e) {
    e.preventDefault();
  }
// logic: incorrect-trigger error message. correct-add to category
  function handleDrop(e, targetCountry) {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));

    
    if (item.country !== targetCountry) {
      showError("Region mismatch detected.");


      return; 
    }


    // Remove from the unsorted group
    setUnsorted((prev) => prev.filter((x) => x.id !== item.id));


    setCategories((prev) => ({
      ...prev,
      [targetCountry]: [...prev[targetCountry], item],
    }));
  }

  function showError() {
    const banner = document.getElementById("error-banner");
    if (!banner) return;
  
    banner.classList.add("show");
  

    setTimeout(() => {
      banner.classList.remove("show");
    }, 1200);
  }
  

  return (
    <div className="app">
      <h1 className="title">BRUTALIST MONUMENT CLASSIFIER</h1>

      {errorMsg && <div className="error-popup">{errorMsg}</div>}


      <div className="gallery">
        {unsorted.map((b) => (
          <img
            key={b.id}
            src={b.img}
            alt={b.country}
            className="gallery-img"
            draggable="true"
            onDragStart={(e) => handleDragStart(e, b)}
          />
        ))}
      </div>


      <div className="categories-container">
        {Object.keys(categories).map((country) => (
          <div
            key={country}
            className="category-box"
            onDragOver={allowDrop}
            onDrop={(e) => handleDrop(e, country)}
          >
            <h2>{country}</h2>

            <div className="category-grid">
              {categories[country].map((b) => (
                <img key={b.id} src={b.img} alt={b.country} className="thumb" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div id="error-banner" className="error-banner">
  Region mismatch detected.
</div>

    </div>
    

  );
}
