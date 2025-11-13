import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `
      atOptions = {
        'key': '1694f76c60dc9c369aaaed6a68a889c0',
        'format': 'iframe',
        'height': 90,
        'width': 728,
        'params': {}
      };
    `;
    document.getElementById("ad-zone")?.appendChild(configScript);

    const invokeScript = document.createElement("script");
    invokeScript.src = "//www.highperformanceformat.com/1694f76c60dc9c369aaaed6a68a889c0/invoke.js";
    invokeScript.type = "text/javascript";
    document.getElementById("ad-zone")?.appendChild(invokeScript);
  }, []);

  return (
    <div
      style={{
        background: "#ff0",
        color: "#000",
        padding: "3rem",
        fontSize: "2rem",
        border: "5px solid red",
        zIndex: 9999,
        position: "relative",
      }}
    >
      <h1>🔥 React App Is Rendering</h1>
      <p>This content should be impossible to miss.</p>
      <div
        id="ad-zone"
        style={{
          width: "728px",
          height: "90px",
          margin: "2rem auto",
          border: "2px dashed #000",
          background: "#fff",
        }}
      ></div>
    </div>
  );
}
