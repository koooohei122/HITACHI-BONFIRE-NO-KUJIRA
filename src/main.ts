import { GPS_CONFIG, AR_OBJECT } from "./config";

document.addEventListener("DOMContentLoaded", () => {
  const entity = document.getElementById("whale-entity");
  if (!entity) return;

  entity.setAttribute(
    "gps-new-entity-place",
    `latitude: ${GPS_CONFIG.latitude}; longitude: ${GPS_CONFIG.longitude}`
  );
  entity.setAttribute("scale", AR_OBJECT.scale);
  entity.setAttribute("rotation", AR_OBJECT.rotation);
  entity.setAttribute("material", `color: ${AR_OBJECT.color}; opacity: 0.85`);
});
