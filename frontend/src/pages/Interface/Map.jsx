import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../../components/Layout/Layout";

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
        // url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        // // attribution:
        //   "Tiles &copy; Esri &mdash; Source: Esri, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
      },
    }),
    []
  );

  return (
    <Layout activeSection="map">
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
            <TileLayer
              key={activeLayer}
              attribution={baseLayers[activeLayer].attribution}
              url={baseLayers[activeLayer].url}
            />
            <MapView center={marinduqueCenter} zoom={defaultZoom} />

            {/* Marker for Marinduque Center */}
            <Marker position={marinduqueCenter}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800">
                    Province of Marinduque
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Philippines</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Coordinates: 13.4167°N, 121.9167°E
                  </p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-[1000] space-y-3">
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
