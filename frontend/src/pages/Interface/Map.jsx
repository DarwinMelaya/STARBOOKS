import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Create awesome custom marker icon
const createCustomMarkerIcon = (isImplemented) => {
  const color = isImplemented
    ? {
        primary: "#10b981", // emerald-500
        secondary: "#059669", // emerald-600
        light: "#d1fae5", // emerald-100
        ring: "#34d399", // emerald-400
      }
    : {
        primary: "#f59e0b", // amber-500
        secondary: "#d97706", // amber-600
        light: "#fef3c7", // amber-100
        ring: "#fbbf24", // amber-400
      };

  const iconHtml = `
    <div style="
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <!-- Pulsing ring animation -->
      <div style="
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: ${color.ring};
        opacity: 0.4;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
      
      <!-- Main marker circle -->
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 
                    0 0 0 3px rgba(255, 255, 255, 0.8),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: transform 0.2s ease;
      ">
        <!-- Inner icon -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${isImplemented
            ? `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
            : `<path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`}
        </svg>
      </div>
      
      <!-- Bottom pin/pointer -->
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 8px solid ${color.secondary};
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        z-index: 0;
      "></div>
    </div>
    <style>
      @keyframes pulse-ring {
        0% {
          transform: scale(1);
          opacity: 0.4;
        }
        50% {
          transform: scale(1.3);
          opacity: 0.1;
        }
        100% {
          transform: scale(1);
          opacity: 0.4;
        }
      }
    </style>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });
};

// Component to handle map view changes
const MapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
};

const Map = () => {
  // Marinduque Province coordinates (center of the province)
  const marinduqueCenter = [13.4167, 121.9167];
  const defaultZoom = 10;
  const [activeLayer, setActiveLayer] = useState("satellite");
  const [implementations, setImplementations] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [pointsError, setPointsError] = useState(null);

  const baseLayers = useMemo(
    () => ({
      standard: {
        id: "standard",
        label: "Map",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      satellite: {
        id: "satellite",
        label: "Satellite",
        // Esri World Imagery tiles
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution:
          "Tiles © Esri — Source: Esri, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
      },
    }),
    []
  );

  useEffect(() => {
    const fetchImplementations = async () => {
      try {
        setLoadingPoints(true);
        setPointsError(null);
        const res = await api.get("/implementations");
        if (res.data?.success) {
          setImplementations(res.data.data || []);
        } else {
          setPointsError(res.data?.message || "Failed to load implementations");
        }
      } catch (error) {
        setPointsError(
          error.response?.data?.message || "Failed to load implementations"
        );
      } finally {
        setLoadingPoints(false);
      }
    };

    fetchImplementations();
  }, []);

  return (
    <Layout activeSection="map">
      <style>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 0;
          overflow: hidden;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 16px;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-marker:hover {
          transform: scale(1.1);
          transition: transform 0.2s ease;
        }
      `}</style>
      <div className="h-full w-full flex flex-col bg-gray-100">
        {/* Map Container */}
        <div className="flex-1 relative min-h-0">
          <MapContainer
            center={marinduqueCenter}
            zoom={defaultZoom}
            scrollWheelZoom={true}
            className="h-full w-full z-0"
            style={{ height: "100%", width: "100%" }}
          >
            {(() => {
              const layer = baseLayers[activeLayer] || baseLayers.standard;
              return (
                <TileLayer
                  key={layer.id}
                  attribution={layer.attribution}
                  url={layer.url}
                />
              );
            })()}
            <MapView center={marinduqueCenter} zoom={defaultZoom} />

            {/* Markers for implementations */}
            {implementations.length > 0 ? (
              implementations.map((impl) => (
                <Marker
                  key={impl._id}
                  position={[impl.coordinates.lat, impl.coordinates.lng]}
                  icon={createCustomMarkerIcon(impl.implemented)}
                >
                  <Popup
                    className="custom-popup"
                    closeButton={true}
                    autoPan={true}
                  >
                    <div className="text-left min-w-[200px]">
                      <div
                        className={`flex items-center gap-2 mb-2 pb-2 border-b ${
                          impl.implemented
                            ? "border-emerald-200"
                            : "border-amber-200"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            impl.implemented
                              ? "bg-emerald-500 animate-pulse"
                              : "bg-amber-500 animate-pulse"
                          }`}
                        ></div>
                        <h3 className="font-bold text-gray-800 text-base">
                          {impl.place}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            impl.implemented
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            {impl.implemented ? (
                              <path
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            ) : (
                              <path
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            )}
                          </svg>
                          {impl.implemented ? "Implemented" : "Pending"}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="flex items-center gap-1.5">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-gray-400"
                            >
                              <path
                                d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="10"
                                r="3"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="font-mono">
                              {impl.coordinates.lat.toFixed(6)},{" "}
                              {impl.coordinates.lng.toFixed(6)}
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5 text-gray-500">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="text-gray-400"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <polyline
                                points="12 6 12 12 16 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {new Date(impl.createdAt).toLocaleString("en-PH", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))
            ) : (
              <Marker position={marinduqueCenter} icon={createCustomMarkerIcon(true)}>
                <Popup className="custom-popup" closeButton={true}>
                  <div className="text-center min-w-[200px]">
                    <h3 className="font-bold text-gray-800 text-base mb-2">
                      Province of Marinduque
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Philippines</p>
                    <p className="text-xs text-gray-500">
                      Add implementation points to see them on the map.
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-[1000] space-y-3">
            {/* Status / Legend */}
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs">
              <div className="space-y-2 text-xs text-gray-700">
                <div className="font-bold text-gray-800 text-sm mb-2">
                  Implementations
                </div>
                {loadingPoints && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-500 border-t-transparent"></div>
                    <p>Loading points…</p>
                  </div>
                )}
                {pointsError && (
                  <p className="text-red-500 font-medium">{pointsError}</p>
                )}
                {!loadingPoints && !pointsError && (
                  <div className="space-y-2">
                    <p className="text-sm">
                      Total points:{" "}
                      <span className="font-bold text-indigo-600">
                        {implementations.length}
                      </span>
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs">Implemented</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs">Pending</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-3">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-700">
                  Layers
                </div>
                <div className="flex gap-2">
                  {Object.values(baseLayers).map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setActiveLayer(layer.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        activeLayer === layer.id
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      {layer.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-3">
              <div className="space-y-1 text-xs text-gray-600">
                <div className="font-semibold text-gray-700">Map Controls</div>
                <p>Use mouse wheel to zoom</p>
                <p>Click and drag to pan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
