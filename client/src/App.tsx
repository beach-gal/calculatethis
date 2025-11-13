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
    const adZone = document.getElementById("ad-zone");
    if (adZone) adZone.appendChild(configScript);

    const invokeScript = document.createElement("script");
    invokeScript.src = "//www.highperformanceformat.com/1694f76c60dc9c369aaaed6a68a889c0/invoke.js";
    invokeScript.type = "text/javascript";
    if (adZone) adZone.appendChild(invokeScript);
  }, []);

  return (
    <div style={{ padding: "2rem", background: "#f0f0f0" }}>
      <h1>✅ React App Is Rendering</h1>
      <p>This confirms your layout is working.</p>
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
