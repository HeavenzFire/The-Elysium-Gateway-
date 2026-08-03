import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion, AnimatePresence } from "motion/react";
import { 
  Globe, 
  MapPin, 
  ShieldAlert, 
  Terminal, 
  Wifi, 
  Database, 
  Radio, 
  Eye, 
  Layers, 
  RefreshCw,
  Navigation,
  Info
} from "lucide-react";

interface IPNode {
  id: string;
  ip: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  riskScore: number;
  role: "target" | "relay" | "controller" | "escrow";
  status: "active" | "mitigated" | "monitoring";
  isp: string;
}

const INITIAL_NODES: IPNode[] = [
  { id: "node-1", ip: "204.14.88.192", city: "Seattle", country: "United States", lat: 47.6062, lng: -122.3321, riskScore: 12, role: "target", status: "monitoring", isp: "CenturyLink Digital Solutions" },
  { id: "node-2", ip: "185.220.101.5", city: "Zurich", country: "Switzerland", lat: 47.3769, lng: 8.5417, riskScore: 45, role: "escrow", status: "active", isp: "Swiss Secure Transit Net" },
  { id: "node-3", ip: "103.241.22.84", city: "Manila", country: "Philippines", lat: 14.5995, lng: 120.9842, riskScore: 89, role: "relay", status: "active", isp: "Sovereign VPN Services Node" },
  { id: "node-4", ip: "197.210.64.12", city: "Lagos", country: "Nigeria", lat: 6.5244, lng: 3.3792, riskScore: 95, role: "controller", status: "active", isp: "Offshore Cable Network Gateway" },
  { id: "node-5", ip: "45.138.16.202", city: "Bucharest", country: "Romania", lat: 44.4268, lng: 26.1025, riskScore: 78, role: "relay", status: "mitigated", isp: "Eastern Block Telecom LLC" },
  { id: "node-6", ip: "210.14.92.55", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, riskScore: 62, role: "escrow", status: "monitoring", isp: "Global Cloud Proxy Hub" },
];

export const FraudHeatmap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [nodes, setNodes] = useState<IPNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<IPNode | null>(INITIAL_NODES[3]);
  const [satelliteMode, setSatelliteMode] = useState<boolean>(true);
  const [routingStream, setRoutingStream] = useState<string[]>([]);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(3); // 1-5
  const [orbitalAltitude, setOrbitalAltitude] = useState<number>(680); // km
  const [viewMode, setViewMode] = useState<"scam" | "satellite">("satellite"); // Default to Satellite to highlight feed visual overlays
  const [satelliteModel, setSatelliteModel] = useState<string>("SENTINEL-5P");
  const [filterMode, setFilterMode] = useState<"thermal" | "infrared" | "visible">("thermal");

  // Setup routing stream logs
  useEffect(() => {
    const addresses = ["0x88AF3", "0x22ED0", "TX-ROUTE-819", "AES-256-DUMB", "TCP-7731"];
    const interval = setInterval(() => {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
      const randomAction = addresses[Math.floor(Math.random() * addresses.length)];
      const timestamp = new Date().toLocaleTimeString();
      setRoutingStream(prev => [
        `[${timestamp}] SCAN: Intercepted packet size ${Math.floor(Math.random() * 256) + 64}b from VPN node ${randomNode.ip} (${randomNode.city}) -> Handshake via ${randomAction}`,
        ...prev.slice(0, 15)
      ]);
    }, 4000 / simulationSpeed);

    return () => clearInterval(interval);
  }, [nodes, simulationSpeed]);

  // Handle D3 rendering of the simulated map
  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous elements
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 640;
    const height = 320;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "transparent");

    // Define Projection scales (Cartesian conversion for simple robust plotting)
    // lat standard: -90 (bottom) to 90 (top)
    // lng standard: -180 (left) to 180 (right)
    const xScale = d3.scaleLinear().domain([-180, 180]).range([20, width - 20]);
    const yScale = d3.scaleLinear().domain([90, -90]).range([20, height - 20]);

    if (viewMode === "scam") {
      // ----------------- SCAM NODE TRACE NETWORK VIEW -----------------
      // Draw Grid Lines (Latitude/Longitude curves)
      const gridDataLat = d3.range(-60, 80, 20);
      const gridDataLng = d3.range(-150, 180, 30);

      svg.append("g")
        .attr("class", "grid-lines")
        .selectAll("line.lat")
        .data(gridDataLat)
        .enter()
        .append("line")
        .attr("class", "lat")
        .attr("x1", 20)
        .attr("y1", d => yScale(d))
        .attr("x2", width - 20)
        .attr("y2", d => yScale(d))
        .attr("stroke", satelliteMode ? "rgba(6, 182, 212, 0.08)" : "rgba(245, 158, 11, 0.05)")
        .attr("stroke-width", 0.5);

      svg.append("g")
        .attr("class", "grid-lines")
        .selectAll("line.lng")
        .data(gridDataLng)
        .enter()
        .append("line")
        .attr("class", "lng")
        .attr("x1", d => xScale(d))
        .attr("y1", 20)
        .attr("x2", d => xScale(d))
        .attr("y2", height - 20)
        .attr("stroke", satelliteMode ? "rgba(6, 182, 212, 0.08)" : "rgba(245, 158, 11, 0.05)")
        .attr("stroke-width", 0.5);

      // Draw stylized continents as high-tech vector clusters or grid circles
      const continentPoints: [number, number, string][] = [
        // North America
        [38, -97, "NA"], [45, -75, "NA"], [55, -115, "NA"], [30, -110, "NA"], [60, -95, "NA"],
        // Europe
        [48, 10, "EU"], [55, 30, "EU"], [40, -3, "EU"], [42, 25, "EU"], [60, 15, "EU"],
        // Asia
        [35, 105, "AS"], [50, 80, "AS"], [30, 75, "AS"], [45, 120, "AS"], [15, 100, "AS"], [22, 114, "AS"],
        // Africa
        [0, 25, "AF"], [10, 15, "AF"], [-15, 20, "AF"], [15, -5, "AF"], [25, 30, "AF"],
        // South America
        [-10, -55, "SA"], [-25, -60, "SA"], [-5, -70, "SA"], [-40, -65, "SA"],
        // Australia
        [-25, 135, "AU"], [-30, 145, "AU"], [-20, 120, "AU"]
      ];

      // Background continent circles to form a dot-matrix map
      svg.append("g")
        .attr("class", "continent-matrix")
        .selectAll("circle.continent")
        .data(continentPoints)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[1]))
        .attr("cy", d => yScale(d[0]))
        .attr("r", 15)
        .attr("fill", satelliteMode ? "rgba(6, 182, 212, 0.03)" : "rgba(245, 158, 11, 0.02)")
        .attr("stroke", satelliteMode ? "rgba(6, 182, 212, 0.07)" : "rgba(245, 158, 11, 0.04)")
        .attr("stroke-width", 0.5);

      // Dynamic Bezier connections representing intercepted routing paths
      const linesGroup = svg.append("g").attr("class", "routing-paths");
      
      // Find target node (usually node-1 Seattle)
      const targetNode = nodes.find(n => n.role === "target");
      if (targetNode) {
        const tx = xScale(targetNode.lng);
        const ty = yScale(targetNode.lat);

        nodes.forEach(source => {
          if (source.role !== "target") {
            const sx = xScale(source.lng);
            const sy = yScale(source.lat);

            // Render curve route
            const dx = tx - sx;
            const dy = ty - sy;
            const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // bend factor

            const pathStr = `M${sx},${sy} A${dr},${dr} 0 0,1 ${tx},${ty}`;

            const path = linesGroup.append("path")
              .attr("d", pathStr)
              .attr("fill", "none")
              .attr("stroke", source.riskScore > 80 ? "rgba(239, 68, 68, 0.25)" : "rgba(245, 158, 11, 0.2)")
              .attr("stroke-width", 1)
              .attr("stroke-dasharray", "4, 4");

            // Animate data flow along the curve
            const totalLength = (path.node() as SVGPathElement).getTotalLength();
            
            linesGroup.append("circle")
              .attr("r", 2.2)
              .attr("fill", source.riskScore > 80 ? "#ef4444" : "#f59e0b")
              .append("animateMotion")
              .attr("path", pathStr)
              .attr("begin", "0s")
              .attr("dur", `${6 / simulationSpeed}s`)
              .attr("repeatCount", "indefinite");
          }
        });
      }

      // Interactive glowing beacons
      const beaconsGroup = svg.append("g").attr("class", "risk-nodes");
      
      const nodeSelection = beaconsGroup.selectAll("g.node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .style("cursor", "pointer")
        .on("click", (event, d: any) => {
          setSelectedNode(d);
        });

      // Outer pulsing target tracker rings
      nodeSelection.append("circle")
        .attr("cx", (d: any) => xScale(d.lng))
        .attr("cy", (d: any) => yScale(d.lat))
        .attr("r", (d: any) => d.role === "target" ? 14 : d.riskScore / 5)
        .attr("fill", "none")
        .attr("stroke", (d: any) => d.role === "target" ? "#06b6d4" : d.riskScore > 80 ? "#ef4444" : "#f59e0b")
        .attr("stroke-width", 0.75)
        .attr("opacity", 0.7)
        .append("animate")
        .attr("attributeName", "r")
        .attr("values", (d: any) => {
          const minR = d.role === "target" ? 10 : d.riskScore / 6;
          const maxR = d.role === "target" ? 28 : d.riskScore / 3;
          return `${minR};${maxR}`;
        })
        .attr("dur", (d: any) => d.role === "target" ? "3s" : `${2.5 - (d.riskScore / 50)}s`)
        .attr("repeatCount", "indefinite");

      // Inner bright signal dot
      nodeSelection.append("circle")
        .attr("cx", (d: any) => xScale(d.lng))
        .attr("cy", (d: any) => yScale(d.lat))
        .attr("r", (d: any) => d.role === "target" ? 4 : 3)
        .attr("fill", (d: any) => d.role === "target" ? "#06b6d4" : d.riskScore > 80 ? "#ef4444" : "#f59e0b");

      // Simple text abbreviations hover helpers
      nodeSelection.append("text")
        .attr("x", (d: any) => xScale(d.lng) + 8)
        .attr("y", (d: any) => yScale(d.lat) + 3)
        .text((d: any) => d.city)
        .attr("font-family", "Courier, monospace")
        .attr("font-size", "7.5px")
        .attr("fill", "rgba(255, 255, 255, 0.4)");

      // Simulated Satellite Sweeper/Overlay (Dynamic Orbit Ring and Scan Beam Animation)
      if (satelliteMode) {
        // Sweeping latitude indicator line
        svg.append("line")
          .attr("x1", 20)
          .attr("x2", width - 20)
          .attr("y1", 20)
          .attr("y2", 20)
          .attr("stroke", "rgba(6, 182, 212, 0.25)")
          .attr("stroke-width", 1)
          .append("animate")
          .attr("attributeName", "y1")
          .attr("values", `20;${height - 20};20`)
          .attr("dur", "8s")
          .attr("repeatCount", "indefinite");

        svg.append("line")
          .attr("x1", 20)
          .attr("x2", width - 20)
          .attr("y1", 20)
          .attr("y2", 20)
          .attr("stroke", "rgba(6, 182, 212, 0.25)")
          .attr("stroke-width", 1)
          .append("animate")
          .attr("attributeName", "y2")
          .attr("values", `20;${height - 20};20`)
          .attr("dur", "8s")
          .attr("repeatCount", "indefinite");
      }
    } else {
      // ----------------- LIVE SATELLITE FEED VIEW -----------------
      // Setup dynamic colors depending on user's active spectral filter dial
      let baseColor = "#06b6d4"; // Cyan visible
      let heatBgStart = "rgba(6, 182, 212, 0.15)";
      if (filterMode === "thermal") {
        baseColor = "#ff4e00"; // Heatmap orange-red
        heatBgStart = "rgba(255, 78, 0, 0.25)";
      } else if (filterMode === "infrared") {
        baseColor = "#ec4899"; // Crimson/Infrared pink
        heatBgStart = "rgba(236, 72, 153, 0.22)";
      }

      // Backdrop space scan layer with custom scanner scanning sweeps
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "rgba(0,0,0,0.85)");

      const globeCX = width / 2;
      const globeCY = height / 2;
      const globeRadius = 135;

      // Geostationary Earth Sphere representation with custom radial space projection
      const radialGrad = svg.append("defs")
        .append("radialGradient")
        .attr("id", "sat-earth-grad")
        .attr("cx", "50%")
        .attr("cy", "50%")
        .attr("r", "50%");
      radialGrad.append("stop").attr("offset", "60%").attr("stop-color", "rgba(10, 15, 30, 0.95)");
      radialGrad.append("stop").attr("offset", "100%").attr("stop-color", baseColor).attr("stop-opacity", 0.35);

      // Centered Digital Earth outline
      svg.append("circle")
        .attr("cx", globeCX)
        .attr("cy", globeCY)
        .attr("r", globeRadius)
        .attr("fill", "url(#sat-earth-grad)")
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1);

      // Atmosphere orbital ring sweeps
      const rings = [globeRadius - 30, globeRadius, globeRadius + 35];
      rings.forEach((r, idx) => {
        svg.append("circle")
          .attr("cx", globeCX)
          .attr("cy", globeCY)
          .attr("r", r)
          .attr("fill", "none")
          .attr("stroke", baseColor)
          .attr("stroke-dasharray", idx === 1 ? "4, 8" : "2, 4")
          .attr("stroke-opacity", 0.15)
          .attr("stroke-width", 0.5);
      });

      // Geocentric coordinates axes (Latitude / Longitude crosshairs)
      svg.append("line")
        .attr("x1", globeCX - globeRadius - 40)
        .attr("x2", globeCX + globeRadius + 40)
        .attr("y1", globeCY)
        .attr("y2", globeCY)
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 0.5);

      svg.append("line")
        .attr("x1", globeCX)
        .attr("x2", globeCX)
        .attr("y1", globeCY - globeRadius - 40)
        .attr("y2", globeCY + globeRadius + 40)
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.2)
        .attr("stroke-width", 0.5);

      // Map locations onto the 3D globe coordinate circle boundaries
      const scaleToGlobeX = d3.scaleLinear().domain([-180, 180]).range([globeCX - globeRadius + 15, globeCX + globeRadius - 15]);
      const scaleToGlobeY = d3.scaleLinear().domain([90, -90]).range([globeCY - globeRadius + 20, globeCY + globeRadius - 20]);

      // Interactive satellite sensors overlay
      const satNodesGroup = svg.append("g").attr("class", "sat-beacons");
      const satSelection = satNodesGroup.selectAll("g.sat-node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "sat-node")
        .style("cursor", "pointer")
        .on("click", (event, d: any) => setSelectedNode(d));

      // Flare circles (Thermal index markers)
      satSelection.append("circle")
        .attr("cx", (d: any) => scaleToGlobeX(d.lng))
        .attr("cy", (d: any) => scaleToGlobeY(d.lat))
        .attr("r", (d: any) => Math.max(8, d.riskScore / 3.8))
        .attr("fill", heatBgStart)
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.45)
        .attr("stroke-width", 0.75)
        .append("animate")
        .attr("attributeName", "r")
        .attr("values", (d: any) => `${d.riskScore / 6};${d.riskScore / 3}`)
        .attr("dur", (d: any) => `${2.2 - (d.riskScore / 60)}s`)
        .attr("repeatCount", "indefinite");

      // Signal beacons core
      satSelection.append("circle")
        .attr("cx", (d: any) => scaleToGlobeX(d.lng))
        .attr("cy", (d: any) => scaleToGlobeY(d.lat))
        .attr("r", 2.2)
        .attr("fill", baseColor);

      // Text index logs on hover helper
      satSelection.append("text")
        .attr("x", (d: any) => scaleToGlobeX(d.lng) + 8)
        .attr("y", (d: any) => scaleToGlobeY(d.lat) + 3.5)
        .text((d: any) => `${d.city} (Locked)`)
        .attr("font-family", "Courier, monospace")
        .attr("font-size", "7px")
        .attr("fill", "rgba(255, 255, 255, 0.45)");

      // Active Target Locking HUD overlays (if a node is targeted)
      if (selectedNode) {
        const sx = scaleToGlobeX(selectedNode.lng);
        const sy = scaleToGlobeY(selectedNode.lat);

        // Focal zoom lock target line from earth center
        svg.append("line")
          .attr("x1", globeCX)
          .attr("y1", globeCY)
          .attr("x2", sx)
          .attr("y2", sy)
          .attr("stroke", baseColor)
          .attr("stroke-opacity", 0.45)
          .attr("stroke-width", 0.75)
          .attr("stroke-dasharray", "2, 3");

        // Concentric scan target frame targeting the node
        svg.append("circle")
          .attr("cx", sx)
          .attr("cy", sy)
          .attr("r", 20)
          .attr("fill", "none")
          .attr("stroke", baseColor)
          .attr("stroke-width", 1.25)
          .attr("stroke-dasharray", "6, 4")
          .append("animateTransform")
          .attr("attributeName", "transform")
          .attr("type", "rotate")
          .attr("from", `0 ${sx} ${sy}`)
          .attr("to", `360 ${sx} ${sy}`)
          .attr("dur", "8s")
          .attr("repeatCount", "indefinite");

        // Cyber lock target corner ticks
        const tkSize = 8;
        const tickGroup = svg.append("g").attr("stroke", baseColor).attr("stroke-width", 1.25).attr("fill", "none");
        // Top Left
        tickGroup.append("path").attr("d", `M${sx - tkSize},${sy - tkSize + 2} L${sx - tkSize},${sy - tkSize} L${sx - tkSize + 2},${sy - tkSize}`);
        // Top Right
        tickGroup.append("path").attr("d", `M${sx + tkSize - 2},${sy - tkSize} L${sx + tkSize},${sy - tkSize} L${sx + tkSize},${sy - tkSize + 2}`);
        // Bottom Left
        tickGroup.append("path").attr("d", `M${sx - tkSize},${sy + tkSize - 2} L${sx - tkSize},${sy + tkSize} L${sx - tkSize + 2},${sy + tkSize}`);
        // Bottom Right
        tickGroup.append("path").attr("d", `M${sx + tkSize - 2},${sy + tkSize} L${sx + tkSize},${sy + tkSize} L${sx + tkSize},${sy + tkSize - 2}`);

        // Interactive tool-tip text label on geography feed inside map
        svg.append("rect")
          .attr("x", sx + 12)
          .attr("y", sy - 10)
          .attr("width", 80)
          .attr("height", 14)
          .attr("rx", 2)
          .attr("fill", "rgba(0,0,0,0.92)")
          .attr("stroke", baseColor)
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", 0.5);

        svg.append("text")
          .attr("x", sx + 16)
          .attr("y", sy - 1)
          .text("SENS_LOCK_LIVE")
          .attr("font-family", "Courier, monospace")
          .attr("font-size", "6.5px")
          .attr("font-weight", "bold")
          .attr("fill", baseColor);
      }

      // Orbital elevation sweeps horizontal tracking sweep
      svg.append("line")
        .attr("x1", 30)
        .attr("x2", width - 30)
        .attr("y1", 30)
        .attr("y2", 30)
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.35)
        .attr("stroke-width", 1)
        .append("animate")
        .attr("attributeName", "y1")
        .attr("values", `40;${height - 40};40`)
        .attr("dur", "5s")
        .attr("repeatCount", "indefinite");

      svg.append("line")
        .attr("x1", 30)
        .attr("x2", width - 30)
        .attr("y1", 30)
        .attr("y2", 30)
        .attr("stroke", baseColor)
        .attr("stroke-opacity", 0.35)
        .attr("stroke-width", 1)
        .append("animate")
        .attr("attributeName", "y2")
        .attr("values", `40;${height - 40};40`)
        .attr("dur", "5s")
        .attr("repeatCount", "indefinite");

      // HUD Satellite name overlay
      svg.append("text")
        .attr("x", width - 150)
        .attr("y", height - 20)
        .text(`ACTIVE_EYE: ${satelliteModel}`)
        .attr("font-family", "Courier, monospace")
        .attr("font-size", "8px")
        .attr("fill", baseColor)
        .attr("opacity", 0.85);

      // Orbital scanning sweep sector
      svg.append("path")
        .attr("d", `M ${globeCX} ${globeCY} L ${globeCX - 50} ${globeCY - 120} A 130 130 0 0 1 ${globeCX + 50} ${globeCY - 120} Z`)
        .attr("fill", baseColor)
        .attr("opacity", 0.03)
        .append("animateTransform")
        .attr("attributeName", "transform")
        .attr("type", "rotate")
        .attr("from", `0 ${globeCX} ${globeCY}`)
        .attr("to", `360 ${globeCX} ${globeCY}`)
        .attr("dur", "12s")
        .attr("repeatCount", "indefinite");
    }
  }, [nodes, viewMode, satelliteMode, satelliteModel, filterMode, orbitalAltitude, selectedNode, simulationSpeed]);

  const handleManualScan = () => {
    // Randomize risk scores to emulate live network updates
    setNodes(prev => prev.map(n => {
      if (n.role === "target") return n;
      const delta = Math.floor(Math.random() * 15) - 7;
      const newScore = Math.max(20, Math.min(99, n.riskScore + delta));
      return { ...n, riskScore: newScore };
    }));

    setRoutingStream(prev => [
      `[${new Date().toLocaleTimeString()}] UPDATE: Re-indexing multi-layered trace routes. Scanning space altitude ${orbitalAltitude}km...`,
      ...prev
    ]);
  };

  return (
    <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#ff4e00]/10 text-[#ff4e00]">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif italic text-lg text-white">Forensic Threat Router Grid</h3>
            <p className="text-[9px] text-white/40 font-mono tracking-widest uppercase">
              Simulated IP Routing Channels &amp; Target Monitoring
            </p>
          </div>
        </div>

        {/* View Toggle Switches */}
        <div className="flex items-center gap-2">
          {/* Layer Options */}
          <button
            onClick={() => setSatelliteMode(!satelliteMode)}
            className={`px-3 py-1.5 rounded-xl text-[8.5px] font-mono uppercase tracking-widest flex items-center gap-1.5 border transition-all ${
              satelliteMode 
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                : "bg-white/5 text-white/40 border-white/5 hover:text-white/60"
            }`}
          >
            <Radio className={`w-3 h-3 ${satelliteMode ? "animate-pulse" : ""}`} />
            {satelliteMode ? "Satellite Sensor Overlay (Engaged)" : "Vector Radar Model"}
          </button>

          <button
            onClick={handleManualScan}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-[8.5px] font-mono border border-white/5 flex items-center gap-1 uppercase transition-all"
          >
            <RefreshCw className="w-3 h-3" />
            Recalculate Routes
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Map Visualization Panel (7 columns) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="bg-black/60 rounded-3xl p-4 border border-white/5 relative overflow-hidden flex items-center justify-center">
            
            {/* Top Stats Banner inside map */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
              <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1 rounded-lg border border-white/5 backdrop-blur-md">
                <Wifi className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">
                  Live Satellite Sweep Altitude: {orbitalAltitude} km
                </span>
              </div>
              
              <span className="text-[8px] font-mono text-white/30 tracking-widest">
                FPS: 60 // MODEL: GEOCENTRIC_GRID
              </span>
            </div>

            {/* HUD Overlay Control Panel */}
            <div className="absolute top-14 left-4 z-20 flex flex-col gap-2 bg-black/85 p-2 rounded-2xl border border-white/10 backdrop-blur-md w-[190px] shadow-lg shadow-black/80">
              <div className="flex bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("scam")}
                  className={`flex-1 py-1 px-2 rounded-lg text-[8px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                    viewMode === "scam"
                      ? "bg-[#ff4e00]/20 text-white border border-[#ff4e00]/30"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  <Database className="w-2.5 h-2.5 text-[#ff4e00]" />
                  Scam Node
                </button>
                <button
                  onClick={() => setViewMode("satellite")}
                  className={`flex-1 py-1 px-2 rounded-lg text-[8px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1 ${
                    viewMode === "satellite"
                      ? "bg-cyan-500/20 text-white border border-cyan-500/30"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  <Globe className="w-2.5 h-2.5 text-cyan-400 animate-pulse" />
                  Sat-Feed
                </button>
              </div>

              {/* Collapsible satellite options when under satellite feed mode */}
              <AnimatePresence>
                {viewMode === "satellite" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden text-[8px] font-mono text-white/60"
                  >
                    <div className="border-t border-white/5 pt-1.5 space-y-1">
                      <span className="text-[7.5px] uppercase text-white/30 block">Active Feed Orbiter:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {["SENTINEL-5P", "GOES-16", "COPERNICUS-12"].map((m) => (
                          <button
                            key={m}
                            onClick={() => setSatelliteModel(m)}
                            className={`py-0.5 px-0.5 rounded transition-colors text-[6px] truncate text-center font-bold ${
                              satelliteModel === m
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                          >
                            {m.split('-')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[7.5px] uppercase text-white/30 block">Spectral Lens:</span>
                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { id: "thermal", label: "THERM" },
                          { id: "infrared", label: "IR" },
                          { id: "visible", label: "VIS" }
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFilterMode(f.id as any)}
                            className={`py-0.5 px-0.5 rounded transition-colors text-[7px] font-bold ${
                              filterMode === f.id
                                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/30"
                                : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1 pt-0.5">
                      <div className="flex justify-between text-[7px] text-white/30 uppercase">
                        <span>Aperture Target</span>
                        <span className="text-cyan-400">{orbitalAltitude}km</span>
                      </div>
                      <input 
                        type="range" 
                        min="300" 
                        max="2200" 
                        value={orbitalAltitude} 
                        onChange={(e) => setOrbitalAltitude(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* D3 Render Element */}
            <div className="w-full flex justify-center py-4">
              <svg ref={svgRef} className="max-w-full h-auto" />
            </div>

            {/* Compass Scale Ornamentation */}
            <div className="absolute bottom-3 right-4 font-mono text-[7px] text-white/20 select-none flex items-center gap-2">
              <span>LAT_SENS_TRUE</span>
              <Navigation className="w-2.5 h-2.5 rotate-45 text-cyan-400/50" />
            </div>
            
            <div className="absolute bottom-3 left-4 font-mono text-[7px] text-white/20 select-none">
              N_LAT 47.60 // W_LNG 122.33
            </div>
          </div>

          {/* Controller Speed Bar */}
          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[9px] font-mono text-white/40 uppercase">Simulation Frequency Limit</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSimulationSpeed(Math.max(1, simulationSpeed - 1))}
                className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[10px] text-white font-mono"
              >
                -
              </button>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-black/40 px-3 py-0.5 rounded border border-white/5">
                {simulationSpeed}x speed
              </span>
              <button 
                onClick={() => setSimulationSpeed(Math.min(5, simulationSpeed + 1))}
                className="px-2 py-0.5 rounded bg-black/30 hover:bg-black/50 text-[10px] text-white font-mono"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tactical Info Sidebar (5 columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Node Profile Highlight Panel */}
          <div className="bg-black/40 p-5 rounded-3xl border border-white/5 space-y-4 flex-1">
            <span className="text-[8px] font-mono text-[#ff4e00] tracking-widest uppercase block mb-1">
              Active Targeted Vector Analysis
            </span>
            
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif italic text-base text-white">
                      {selectedNode.city}, {selectedNode.country}
                    </h4>
                    <p className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded mt-1.5 inline-block border border-white/5">
                      IP: {selectedNode.ip}
                    </p>
                  </div>
                  
                  <span className={`text-[8.5px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    selectedNode.riskScore > 80 
                      ? "bg-red-500/10 text-red-500 border-red-500/30" 
                      : selectedNode.riskScore > 30 
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                      : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                  }`}>
                    Risk: {selectedNode.riskScore}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-white/30 block text-[8px] uppercase">Node Role</span>
                    <span className="text-white font-bold uppercase mt-0.5 block">{selectedNode.role}</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <span className="text-white/30 block text-[8px] uppercase">Status</span>
                    <span className="text-cyan-400 font-bold uppercase mt-0.5 block">{selectedNode.status}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[9.5px]">
                  <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/40">
                    <span>Carrier Service System / ISP:</span>
                    <span className="text-white/80 text-right max-w-[150px] truncate">{selectedNode.isp}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1.5 text-white/40">
                    <span>Coordinates Logged:</span>
                    <span className="text-white/80">{selectedNode.lat.toFixed(4)}°, {selectedNode.lng.toFixed(4)}°</span>
                  </div>
                  <div className="flex justify-between pb-1.5 text-white/40">
                    <span>Est. Transit Latency:</span>
                    <span className="text-white/80">{Math.round(selectedNode.riskScore * 1.5 + 40)} ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-white/30 italic font-mono py-8 text-center">
                Select a routing marker node on the vector grid to view specific diagnostic logs and IP characteristics.
              </p>
            )}
          </div>

          {/* Running Network Streams Logs */}
          <div className="bg-black/60 rounded-3xl p-4 border border-white/5 h-32 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-1.5">
              <Database className="w-3 h-3 text-[#ff4e00]" />
              <span className="text-[8px] font-mono text-white/50 uppercase tracking-widest">
                Raw Intercepted Route Signal Header Stream
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[8px] text-green-400/80 space-y-1 custom-scrollbar">
              {routingStream.length > 0 ? (
                routingStream.map((log, i) => (
                  <div key={i} className="truncate">
                    <span className="text-green-500/30">❯</span> {log}
                  </div>
                ))
              ) : (
                <div className="text-white/20 italic">Awaiting routing packet handshake stream...</div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Structured Real-world Empathy Notice & Safe Grounding */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[9.5px] text-white/50 leading-relaxed font-sans">
          <strong>Simulation Disclaimer Notice:</strong> This interactive visual router acts as a telemetry mapping simulator designed to demonstrate how deceptive routing networks and proxy server vectors operate globally. Real-time individual IP intercepts, physical geolocation tracking, and dynamic state-level satellite camera access are not possible through web platforms. If you or a loved one are concerned about targeted fraud, elder scam activities, or emotional social engineering campaigns we encourage contacting direct counseling and reporting authorities like the <a className="text-[#ff4e00] hover:underline" href="https://www.ic3.gov" target="_blank" rel="noreferrer">FBI IC3 Division</a> or local support programs to ensure protective guidance.
        </div>
      </div>
    </div>
  );
};
