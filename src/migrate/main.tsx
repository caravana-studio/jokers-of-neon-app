const rootElement = document.getElementById("root");
document.documentElement.style.height = "100%";
document.documentElement.style.width = "100%";
document.body.style.display = "block";
document.body.style.placeItems = "initial";
document.body.style.minWidth = "320px";
document.body.style.minHeight = "100svh";
document.body.style.width = "100%";
document.body.style.margin = "0";
if (rootElement) {
  rootElement.style.height = "100%";
  rootElement.style.minHeight = "100svh";
  rootElement.style.width = "100%";
  rootElement.textContent = "Loading...";
}

void import("./mainApp.tsx").catch((error) => {
  console.error("[bootstrap] Failed to start migrate app.", error);
});
