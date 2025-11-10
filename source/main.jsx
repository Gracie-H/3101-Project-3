import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

// 只渲染一次，不要再 window.onload 里二次渲染
createRoot(document.getElementById("root")).render(<App />);
