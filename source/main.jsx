import { useState } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./styles.css";
createRoot(document.getElementById("root")).render(<App />);

window.addEventListener("load", () => {
  let root = createRoot(document.getElementById("root"));
  root.render(<App />);
});

function App() {
  // Your app code goes here...
  return <p>(This JSX code becomes the contents of your component)</p>;
}