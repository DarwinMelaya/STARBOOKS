import { useEffect, useMemo, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Layout from "../../components/Layout/Layout";
import api from "../../utils/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import ChatBotModal from "../../components/Modals/ChatBotModal";

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

// Create awesome custom marker icon for implementations
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
        background: linear-gradient(135deg, ${color.primary} 0%, ${
    color.secondary
  } 100%);
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
          ${
            isImplemented
              ? `<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
              : `<path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`
          }
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

// Get color scheme based on program type
const getProgramTypeColors = (programType) => {
  const colorMap = {
    "GIA: Grants-In-Aid Program": {
      primary: "#10b981", // emerald-500
      secondary: "#059669", // emerald-600
      light: "#d1fae5", // emerald-100
      ring: "#34d399", // emerald-400
    },
    "SETUP: Small Enterprise Technology Upgrading Program": {
      primary: "#f59e0b", // amber-500
      secondary: "#d97706", // amber-600
      light: "#fef3c7", // amber-100
      ring: "#fbbf24", // amber-400
    },
    "CEST: Community Empowerment through Science and Technology Program": {
      primary: "#8b5cf6", // violet-500
      secondary: "#7c3aed", // violet-600
      light: "#ede9fe", // violet-100
      ring: "#a78bfa", // violet-400
    },
    "SSCP: Smart and Sustainable Communities Program": {
      primary: "#06b6d4", // cyan-500
      secondary: "#0891b2", // cyan-600
      light: "#cffafe", // cyan-100
      ring: "#22d3ee", // cyan-400
    },
  };

  // Default to indigo if program type not found
  return (
    colorMap[programType] || {
      primary: "#6366f1", // indigo-500
      secondary: "#4f46e5", // indigo-600
      light: "#e0e7ff", // indigo-100
      ring: "#818cf8", // indigo-400
    }
  );
};

// Create custom marker icon for projects (different style based on program type)
const createProjectMarkerIcon = (programType, projectTitle = "") => {
  const color = getProgramTypeColors(programType);

  // Truncate title if too long
  const displayTitle =
    projectTitle && projectTitle.length > 20
      ? projectTitle.substring(0, 20) + "..."
      : projectTitle;

  const iconHtml = `
    <div style="
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    ">
      ${
        projectTitle
          ? `
      <!-- Project Title Label -->
      <div style="
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-bottom: 8px;
        padding: 4px 8px;
        background: linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%);
        color: white;
        font-size: 10px;
        font-weight: 600;
        white-space: nowrap;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.8);
        z-index: 10;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        pointer-events: none;
      ">
        ${displayTitle}
        <!-- Arrow pointing down -->
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid ${color.secondary};
        "></div>
      </div>
      `
          : ""
      }
      
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
        background: linear-gradient(135deg, ${color.primary} 0%, ${
    color.secondary
  } 100%);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 
                    0 0 0 3px rgba(255, 255, 255, 0.8),
                    inset 0 2px 4px rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        transition: transform 0.2s ease;
      ">
        <!-- Inner icon - folder/project icon -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

  // Calculate icon size based on whether title exists
  const iconHeight = projectTitle ? 70 : 48;
  const iconAnchorY = projectTitle ? 70 : 48;
  const popupAnchorY = projectTitle ? -70 : -48;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [40, iconHeight],
    iconAnchor: [20, iconAnchorY],
    popupAnchor: [0, popupAnchorY],
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
  const [projects, setProjects] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [pointsError, setPointsError] = useState(null);
  const [projectsError, setProjectsError] = useState(null);
  const [showSTARBOOKS, setShowSTARBOOKS] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const mapContainerRef = useRef(null);

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
        attribution: "",
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

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectsError(null);
        const res = await api.get("/projects");
        if (res.data?.success) {
          setProjects(res.data.data || []);
        } else {
          setProjectsError(res.data?.message || "Failed to load projects");
        }
      } catch (error) {
        setProjectsError(
          error.response?.data?.message || "Failed to load projects"
        );
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchImplementations();
    fetchProjects();
  }, []);

  const exportMapAsPNG = async () => {
    if (!mapContainerRef.current) {
      toast.error("Map container not found");
      return;
    }

    setExporting(true);
    try {
      // Hide controls temporarily for clean export
      const originalShowControls = showControls;
      if (showControls) {
        setShowControls(false);
        // Wait for controls to hide
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Wait a bit for map to stabilize
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mapElement =
        mapContainerRef.current.querySelector(".leaflet-container");
      if (!mapElement) {
        toast.error("Map element not found");
        if (originalShowControls) {
          setShowControls(true);
        }
        return;
      }

      toast.loading("Capturing map...", { id: "export-toast" });

      const canvas = await html2canvas(mapElement, {
        backgroundColor: "#f3f4f6",
        useCORS: true,
        scale: 2,
        logging: false,
        width: mapElement.offsetWidth,
        height: mapElement.offsetHeight,
        windowWidth: mapElement.offsetWidth,
        windowHeight: mapElement.offsetHeight,
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `DOST-Project-Map-${
        new Date().toISOString().split("T")[0]
      }.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast.success("Map exported as PNG successfully", { id: "export-toast" });

      // Restore controls
      if (originalShowControls) {
        setShowControls(true);
      }
    } catch (error) {
      console.error("Error exporting map as PNG:", error);
      toast.error("Failed to export map as PNG", { id: "export-toast" });
      setShowControls(showControls);
    } finally {
      setExporting(false);
    }
  };

  const exportMapAsPDF = async () => {
    if (!mapContainerRef.current) {
      toast.error("Map container not found");
      return;
    }

    setExporting(true);
    try {
      // Hide controls temporarily for clean export
      const originalShowControls = showControls;
      if (showControls) {
        setShowControls(false);
        // Wait for controls to hide
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Wait a bit for map to stabilize
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mapElement =
        mapContainerRef.current.querySelector(".leaflet-container");
      if (!mapElement) {
        toast.error("Map element not found");
        if (originalShowControls) {
          setShowControls(true);
        }
        return;
      }

      toast.loading("Generating PDF...", { id: "export-toast" });

      const canvas = await html2canvas(mapElement, {
        backgroundColor: "#f3f4f6",
        useCORS: true,
        scale: 2,
        logging: false,
        width: mapElement.offsetWidth,
        height: mapElement.offsetHeight,
        windowWidth: mapElement.offsetWidth,
        windowHeight: mapElement.offsetHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions (A4 landscape)
      const pdfWidth = 297; // A4 width in mm (landscape)
      const pdfHeight = 210; // A4 height in mm (landscape)
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgWidthInMM = imgWidth * ratio;
      const imgHeightInMM = imgHeight * ratio;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Center the image
      const xOffset = (pdfWidth - imgWidthInMM) / 2;
      const yOffset = (pdfHeight - imgHeightInMM) / 2;

      pdf.addImage(
        imgData,
        "PNG",
        xOffset,
        yOffset,
        imgWidthInMM,
        imgHeightInMM
      );
      pdf.save(
        `DOST-Project-Map-${new Date().toISOString().split("T")[0]}.pdf`
      );

      toast.success("Map exported as PDF successfully", { id: "export-toast" });

      // Restore controls
      if (originalShowControls) {
        setShowControls(true);
      }
    } catch (error) {
      console.error("Error exporting map as PDF:", error);
      toast.error("Failed to export map as PDF", { id: "export-toast" });
      setShowControls(showControls);
    } finally {
      setExporting(false);
    }
  };

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
        /* Custom scrollbar for map controls */
        .map-controls-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .map-controls-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .map-controls-scroll::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 10px;
        }
        .map-controls-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .map-controls-scroll {
            max-width: calc(100vw - 2rem);
          }
        }
      `}</style>
      <div className="h-full w-full flex flex-col bg-gray-100">
        {/* Map Container */}
        <div ref={mapContainerRef} className="flex-1 relative min-h-0">
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
            {showSTARBOOKS &&
              implementations.map((impl) => (
                <Marker
                  key={`impl-${impl._id}`}
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
              ))}

            {/* Markers for projects */}
            {showProjects &&
              projects.map((project) => (
                <Marker
                  key={`project-${project._id}`}
                  position={[project.coordinates.lat, project.coordinates.lng]}
                  icon={createProjectMarkerIcon(
                    project.programType,
                    project.projectTitle
                  )}
                >
                  <Popup
                    className="custom-popup"
                    closeButton={true}
                    autoPan={true}
                  >
                    <div className="text-left min-w-[200px]">
                      {(() => {
                        const colors = getProgramTypeColors(
                          project.programType
                        );
                        return (
                          <>
                            <div
                              className="flex items-center gap-2 mb-2 pb-2 border-b"
                              style={{
                                borderColor: `${colors.ring}80`,
                              }}
                            >
                              <div
                                className="w-3 h-3 rounded-full animate-pulse"
                                style={{ backgroundColor: colors.primary }}
                              ></div>
                              <h3 className="font-bold text-gray-800 text-base">
                                {project.projectTitle}
                              </h3>
                            </div>
                            <div className="space-y-2">
                              <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: colors.light,
                                  color: colors.secondary,
                                }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                {project.programType?.split(":")[0] ||
                                  "Project"}
                              </div>
                              {project.programType && (
                                <p
                                  className="text-xs font-medium"
                                  style={{ color: colors.secondary }}
                                >
                                  {project.programType}
                                </p>
                              )}
                            </div>
                          </>
                        );
                      })()}
                      <div className="text-xs text-gray-600 space-y-1 mt-3">
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
                          <span className="font-medium text-gray-800">
                            {project.location}
                          </span>
                        </p>
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
                            {project.coordinates.lat.toFixed(6)},{" "}
                            {project.coordinates.lng.toFixed(6)}
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
                          {new Date(project.createdAt).toLocaleString("en-PH", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}

            {/* Default marker if no points */}
            {implementations.length === 0 && projects.length === 0 && (
              <Marker
                position={marinduqueCenter}
                icon={createCustomMarkerIcon(true)}
              >
                <Popup className="custom-popup" closeButton={true}>
                  <div className="text-center min-w-[200px]">
                    <h3 className="font-bold text-gray-800 text-base mb-2">
                      Province of Marinduque
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">Philippines</p>
                    <p className="text-xs text-gray-500">
                      Add implementation points or projects to see them on the
                      map.
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Chat Bot Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed md:absolute bottom-4 right-4 z-[1001] w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-xl shadow-2xl border border-indigo-400/50 backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group"
            aria-label="Open DOST Assistant"
            title="Ask about DOST Projects in Marinduque"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white transition-all duration-300"
            >
              <path
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse ring-2 ring-emerald-400/50"></div>
          </button>

          {/* Toggle Controls Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="fixed md:absolute top-4 right-4 z-[1001] w-12 h-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 group"
            aria-label="Toggle controls"
          >
            {showControls ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white transition-all duration-300"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-white transition-all duration-300"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-pulse ring-2 ring-indigo-400/50"></div>
          </button>

          {/* Map Controls Overlay */}
          <div
            className={`absolute top-20 md:top-4 right-4 z-[1000] space-y-3 max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-2rem)] overflow-y-auto pr-1 map-controls-scroll transition-all duration-300 ease-in-out ${
              showControls
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-full pointer-events-none"
            } w-[calc(100vw-2rem)] md:w-auto max-w-xs`}
          >
            {/* Filter Controls */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl p-4 md:p-5 w-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                    Layer Filters
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* STARBOOKS Toggle */}
                  <div
                    onClick={() => setShowSTARBOOKS(!showSTARBOOKS)}
                    className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      showSTARBOOKS
                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-400/50 shadow-lg shadow-emerald-500/20"
                        : "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            showSTARBOOKS
                              ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/50"
                              : "bg-gray-700"
                          }`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={
                              showSTARBOOKS ? "text-white" : "text-gray-500"
                            }
                          >
                            <path
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {showSTARBOOKS && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse ring-2 ring-emerald-400/50"></div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold transition-colors ${
                            showSTARBOOKS ? "text-white" : "text-gray-400"
                          }`}
                        >
                          STARBOOKS
                        </span>
                        <span className="text-xs text-gray-400">
                          {implementations.length} locations
                        </span>
                      </div>
                    </div>
                    {/* Modern Toggle Switch */}
                    <div className="relative">
                      <div
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          showSTARBOOKS
                            ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                            : "bg-gray-700"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                            showSTARBOOKS ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Projects Toggle */}
                  <div
                    onClick={() => setShowProjects(!showProjects)}
                    className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      showProjects
                        ? "bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-400/50 shadow-lg shadow-indigo-500/20"
                        : "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            showProjects
                              ? "bg-gradient-to-br from-indigo-400 to-purple-600 shadow-lg shadow-indigo-500/50"
                              : "bg-gray-700"
                          }`}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={
                              showProjects ? "text-white" : "text-gray-500"
                            }
                          >
                            <path
                              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        {showProjects && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-400 rounded-full animate-pulse ring-2 ring-indigo-400/50"></div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm font-semibold transition-colors ${
                            showProjects ? "text-white" : "text-gray-400"
                          }`}
                        >
                          Projects
                        </span>
                        <span className="text-xs text-gray-400">
                          {projects.length} locations
                        </span>
                      </div>
                    </div>
                    {/* Modern Toggle Switch */}
                    <div className="relative">
                      <div
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          showProjects
                            ? "bg-gradient-to-r from-indigo-400 to-purple-600"
                            : "bg-gray-700"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-300 ${
                            showProjects ? "translate-x-6" : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status / Legend */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl p-4 md:p-5 w-full">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                    Statistics
                  </h3>
                </div>

                {/* Implementations Section */}
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-white"
                        >
                          <path
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        STARBOOKS
                      </span>
                    </div>
                    {loadingPoints && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-emerald-500 border-t-transparent"></div>
                        <p className="text-xs">Loading…</p>
                      </div>
                    )}
                    {pointsError && (
                      <p className="text-red-400 font-medium text-xs">
                        {pointsError}
                      </p>
                    )}
                    {!loadingPoints && !pointsError && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          Total:{" "}
                          <span className="font-bold text-emerald-400">
                            {implementations.length}
                          </span>
                        </p>
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div>
                            <span className="text-xs text-gray-400">
                              Implemented
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div>
                            <span className="text-xs text-gray-400">
                              Pending
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Projects Section */}
                  <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-white"
                        >
                          <path
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        Projects
                      </span>
                    </div>
                    {loadingProjects && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-indigo-500 border-t-transparent"></div>
                        <p className="text-xs">Loading…</p>
                      </div>
                    )}
                    {projectsError && (
                      <p className="text-red-400 font-medium text-xs">
                        {projectsError}
                      </p>
                    )}
                    {!loadingProjects && !projectsError && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          Total:{" "}
                          <span className="font-bold text-indigo-400">
                            {projects.length}
                          </span>
                        </p>
                        <div className="space-y-2 pt-2 border-t border-gray-700">
                          {(() => {
                            const programTypeCounts = projects.reduce(
                              (acc, project) => {
                                const programType =
                                  project.programType || "Unknown";
                                acc[programType] = (acc[programType] || 0) + 1;
                                return acc;
                              },
                              {}
                            );

                            return Object.entries(programTypeCounts).map(
                              ([programType, count]) => {
                                const colors =
                                  getProgramTypeColors(programType);
                                const shortName = programType.split(":")[0];
                                return (
                                  <div
                                    key={programType}
                                    className="flex items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <div
                                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                                        style={{
                                          backgroundColor: colors.primary,
                                          boxShadow: `0 0 4px ${colors.ring}80`,
                                        }}
                                      ></div>
                                      <span className="text-xs text-gray-400">
                                        {shortName}
                                      </span>
                                    </div>
                                    <span
                                      className="text-xs font-semibold"
                                      style={{ color: colors.primary }}
                                    >
                                      {count}
                                    </span>
                                  </div>
                                );
                              }
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Layers */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl p-4 md:p-5 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                    Layers
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.values(baseLayers).map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => setActiveLayer(layer.id)}
                      className={`relative px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all duration-300 ${
                        activeLayer === layer.id
                          ? "bg-gradient-to-r from-indigo-500/30 to-purple-600/30 text-white border-indigo-400/50 shadow-lg shadow-indigo-500/20"
                          : "bg-gray-800/50 text-gray-400 border-gray-700/50 hover:bg-gray-800/70 hover:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{layer.label}</span>
                        {activeLayer === layer.id && (
                          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl p-4 md:p-5 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                    Map Controls
                  </h3>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 flex items-center justify-center border border-cyan-400/30">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-cyan-400"
                      >
                        <path
                          d="M12 2v20M2 12h20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">Zoom</p>
                      <p className="text-xs text-gray-400">Use mouse wheel</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center border border-blue-400/30">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-blue-400"
                      >
                        <path
                          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 2v4M12 18v4M2 12h4M18 12h4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">Pan</p>
                      <p className="text-xs text-gray-400">Click and drag</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Controls */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700/50 backdrop-blur-xl p-4 md:p-5 w-full">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                  <h3 className="font-bold text-white text-sm tracking-wide uppercase">
                    Export Map
                  </h3>
                </div>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={exportMapAsPNG}
                    disabled={exporting}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border border-blue-400/50 hover:from-blue-500/30 hover:to-indigo-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 flex items-center justify-center border border-blue-400/30">
                      {exporting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-blue-400"
                        >
                          <path
                            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold text-white">
                        Export as PNG
                      </p>
                      <p className="text-xs text-gray-400">
                        {exporting ? "Exporting..." : "Download map image"}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={exportMapAsPDF}
                    disabled={exporting}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-600/20 border border-red-400/50 hover:from-red-500/30 hover:to-pink-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400/20 to-pink-500/20 flex items-center justify-center border border-red-400/30">
                      {exporting ? (
                        <svg
                          className="animate-spin h-4 w-4 text-red-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-red-400"
                        >
                          <path
                            d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-semibold text-white">
                        Export as PDF
                      </p>
                      <p className="text-xs text-gray-400">
                        {exporting ? "Exporting..." : "Download map document"}
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot Modal */}
      <ChatBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </Layout>
  );
};

export default Map;
