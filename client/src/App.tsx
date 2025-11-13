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
  document.body.appendChild(configScript);

  const invokeScript = document.createElement("script");
  invokeScript.src = "//www.highperformanceformat.com/1694f76c60dc9c369aaaed6a68a889c0/invoke.js";
  invokeScript.type = "text/javascript";
  document.body.appendChild(invokeScript);
}, []);
