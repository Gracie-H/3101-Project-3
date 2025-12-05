import { useState } from "react";
import { initialBuildings } from "./data/initialData";
import "./styles.css";

export default function App() {
  const [unsorted, setUnsorted] = useState(
    initialBuildings.sort(() => Math.random() - 0.5)
  );

  const [categories, setCategories] = useState({
    Croatia: [],
    Bosnia: [],
    Serbia: [],
    "North Macedonia": [],
    Montenegro: [],
    Slovenia: [],
  });

  function handleDragStart(e, item) {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function handleDrop(e, country) {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));

    // 移除未分类区
    setUnsorted((prev) => prev.filter((x) => x.id !== item.id));

    // 加入对应分类
    setCategories((prev) => ({
      ...prev,
      [country]: [...prev[country], item],
    }));
  }

  return (
    <div className="app">
      <h1 className="title">BRUTALIST MONUMENT CLASSIFIER</h1>

      {/* 顶部随机图片 gallery */}
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

      {/* 分类区 */}
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
                <img
                  key={b.id}
                  src={b.img}
                  alt={b.country}
                  className="thumb"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
