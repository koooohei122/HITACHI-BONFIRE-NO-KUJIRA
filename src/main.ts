import { GPS_CONFIG, AR_OBJECT } from "./config";

const params = new URLSearchParams(window.location.search);
const isDemo = params.get("demo") === "1";

const DEMO_OFFSET_DEG = 0.000135; // ~15m (geolocation fallback用)

function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
    })
  );
}

async function init() {
  const entity = document.getElementById("whale-entity");
  if (!entity) return;

  let lat = GPS_CONFIG.latitude;
  let lon = GPS_CONFIG.longitude;

  if (isDemo) {
    showDemoBadge();

    // demo.html で復号された座標を sessionStorage から取得
    const stored = sessionStorage.getItem("demo_coords");
    if (stored) {
      const [sLat, sLon] = stored.split(",").map(Number);
      if (!isNaN(sLat) && !isNaN(sLon)) {
        lat = sLat + DEMO_OFFSET_DEG;
        lon = sLon + DEMO_OFFSET_DEG;
        setUiDesc("デモ: 自宅付近 (~15m) にクジラを表示中");
      }
    } else {
      // demo.htmlを経由せず直接アクセスした場合は現在地にフォールバック
      try {
        const pos = await getCurrentPosition();
        lat = pos.coords.latitude + DEMO_OFFSET_DEG;
        lon = pos.coords.longitude + DEMO_OFFSET_DEG;
        setUiDesc("デモ: 現在地付近 (~15m) にクジラを表示中");
      } catch {
        setUiDesc("GPS取得失敗 — シビックセンター座標で代替表示");
      }
    }
  }

  entity.setAttribute(
    "gps-new-entity-place",
    `latitude: ${lat}; longitude: ${lon}`
  );
  entity.setAttribute("scale", AR_OBJECT.scale);
}

function showDemoBadge() {
  const badge = document.getElementById("demo-badge");
  if (badge) badge.style.display = "block";
}

function setUiDesc(text: string) {
  const el = document.getElementById("ui-desc");
  if (el) el.textContent = text;
}

init();
