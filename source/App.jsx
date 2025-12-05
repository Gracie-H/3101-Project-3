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

  const [errorMsg, setErrorMsg] = useState("");

  function handleDragStart(e, item) {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function handleDrop(e, targetCountry) {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData("text/plain"));

    // 如果拖错了国家
    if (item.country !== targetCountry) {
      showError("Wrong country! Try again.");
      return; // ❌ 不放进去
    }

    // 正确 → 从未分类区移除
    setUnsorted((prev) => prev.filter((x) => x.id !== item.id));

    // 放入正确分类
    setCategories((prev) => ({
      ...prev,
      [targetCountry]: [...prev[targetCountry], item],
    }));
  }

  function showError(message) {
    setErrorMsg(message);

    // 2 秒后自动消失
    setTimeout(() => {
      setErrorMsg("");
    }, 2000);
  }

  return (
    <div className="app">
      <h1 className="title">BRUTALIST MONUMENT CLASSIFIER</h1>

      {/* 错误提示 */}
      {errorMsg && <div className="error-popup">{errorMsg}</div>}

      {/* 顶部图片 gallery */}
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
                <img key={b.id} src={b.img} alt={b.country} className="thumb" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
