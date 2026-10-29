"use strict";
// Only the published GitHub Pages site reports traffic; local/review previews do not.
(() => {
  if (location.hostname !== "packetbench.github.io" ||
      !location.pathname.startsWith("/grindstone-guide/") ||
      new URLSearchParams(location.search).has("preview")) return;
  if (document.querySelector("script[data-cf-beacon]")) return;
  const beacon = document.createElement("script");
  beacon.type = "module";
  beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
  // Cloudflare's public site identifier; this is not an account/API credential.
  beacon.setAttribute("data-cf-beacon", JSON.stringify({token: "ede794c80aa04b1686fa955f923858e6"}));
  document.body.appendChild(beacon);
})();
