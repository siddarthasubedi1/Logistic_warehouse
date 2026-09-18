import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Trainee360Environment.css";
import { getAccessToken } from "../../utils/session";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SCENE_PANORAMAS = {
    entrance: "/panoramas/entrance-storage.png",
    security: "/panoramas/entrance-storage.png",
    receiving: "/panoramas/loading-transition.png",
    inbound: "/panoramas/loading-transition.png",
    "main-aisle": "/panoramas/main-logistics.png",
    "rack-a": "/panoramas/main-logistics.png",
    "rack-b": "/panoramas/logistics-indoor.png",
    "high-rack": "/panoramas/logistics-indoor.png",
    forklift: "/panoramas/main-logistics.png",
    charging: "/panoramas/logistics-indoor.png",
    picking: "/panoramas/main-logistics.png",
    packing: "/panoramas/logistics-indoor.png",
    quality: "/panoramas/logistics-indoor.png",
    dispatch: "/panoramas/loading-dispatch.png",
    loading: "/panoramas/loading-dispatch.png",
    manual: "/panoramas/main-logistics.png",
    height: "/panoramas/working-height.png",
    emergency: "/panoramas/loading-transition.png",
    office: "/panoramas/site-office.jpg",
    yard: "/panoramas/loading-dispatch.png",
    training: "/panoramas/training-room.jpg",
    canteen: "/panoramas/canteen.jpg",
    restroom: "/panoramas/restroom.jpg",
    "first-aid": "/panoramas/first-aid.jpg",
};
const localPanoramaFor = (sceneId) => `${SCENE_PANORAMAS[sceneId] || "/panoramas/main-logistics.png"}?v=20260916-multiscene`;

// A clean visitor-facing map: only meaningful areas are shown, not every internal checkpoint.
const MAP_LOCATION_IDS = [
    "entrance", "receiving", "main-aisle", "rack-a", "forklift", "picking",
    "packing", "dispatch", "loading", "yard", "office", "training", "canteen",
    "restroom", "first-aid"
];

// Street-View-style forward route. Repeated ↑/W presses continue deeper through the facility
// instead of choosing a random connected node based on the current camera yaw.
const FORWARD_ROUTE = [
    "entrance", "security", "receiving", "inbound", "main-aisle", "rack-a",
    "rack-b", "high-rack", "forklift", "charging", "picking", "packing",
    "quality", "dispatch", "loading", "yard", "emergency", "office",
    "training", "canteen", "restroom", "first-aid"
];



// These local scenes make the first version usable immediately. The API version uses
// the same shape, so replacing a placeholder with a real 2:1 equirectangular panorama
// only requires changing `panorama` in MongoDB.
const FALLBACK_SCENES = [
    { locationId: 'entrance', name: 'Warehouse Entrance', panorama: localPanoramaFor("entrance"), description: 'Explore the warehouse entrance inside the logistics warehouse.', mapX: 12, mapY: 52, connectedLocations: ["security", "receiving"], hotspots: [{ id: 'entrance-security', type: "navigation", label: 'Security & Check-in', yaw: 0, pitch: -8, targetLocationId: 'security' }, { id: 'entrance-receiving', type: "navigation", label: 'Receiving Dock', yaw: 70, pitch: -8, targetLocationId: 'receiving' }] },
    { locationId: 'security', name: 'Security & Check-in', panorama: localPanoramaFor("security"), description: 'Explore the security & check-in inside the logistics warehouse.', mapX: 20, mapY: 38, connectedLocations: ["entrance", "main-aisle", "office"], hotspots: [{ id: 'security-entrance', type: "navigation", label: 'Warehouse Entrance', yaw: 0, pitch: -8, targetLocationId: 'entrance' }, { id: 'security-main-aisle', type: "navigation", label: 'Main Warehouse Aisle', yaw: 70, pitch: -8, targetLocationId: 'main-aisle' }, { id: 'security-office', type: "navigation", label: 'Warehouse Control Office', yaw: -70, pitch: -8, targetLocationId: 'office' }] },
    { locationId: 'receiving', name: 'Receiving Dock', panorama: localPanoramaFor("receiving"), description: 'Explore the receiving dock inside the logistics warehouse.', mapX: 28, mapY: 70, connectedLocations: ["entrance", "inbound"], hotspots: [{ id: 'receiving-entrance', type: "navigation", label: 'Warehouse Entrance', yaw: 0, pitch: -8, targetLocationId: 'entrance' }, { id: 'receiving-inbound', type: "navigation", label: 'Inbound Staging', yaw: 70, pitch: -8, targetLocationId: 'inbound' }] },
    { locationId: 'inbound', name: 'Inbound Staging', panorama: localPanoramaFor("inbound"), description: 'Explore the inbound staging inside the logistics warehouse.', mapX: 37, mapY: 67, connectedLocations: ["receiving", "main-aisle", "manual"], hotspots: [{ id: 'inbound-receiving', type: "navigation", label: 'Receiving Dock', yaw: 0, pitch: -8, targetLocationId: 'receiving' }, { id: 'inbound-main-aisle', type: "navigation", label: 'Main Warehouse Aisle', yaw: 70, pitch: -8, targetLocationId: 'main-aisle' }, { id: 'inbound-manual', type: "navigation", label: 'Manual Handling Area', yaw: -70, pitch: -8, targetLocationId: 'manual' }] },
    { locationId: 'main-aisle', name: 'Main Warehouse Aisle', panorama: localPanoramaFor("main-aisle"), description: 'Explore the main warehouse aisle inside the logistics warehouse.', mapX: 48, mapY: 52, connectedLocations: ["security", "inbound", "rack-a", "forklift", "manual"], hotspots: [{ id: 'main-aisle-security', type: "navigation", label: 'Security & Check-in', yaw: 0, pitch: -8, targetLocationId: 'security' }, { id: 'main-aisle-inbound', type: "navigation", label: 'Inbound Staging', yaw: 70, pitch: -8, targetLocationId: 'inbound' }, { id: 'main-aisle-rack-a', type: "navigation", label: 'Storage Racks A', yaw: -70, pitch: -8, targetLocationId: 'rack-a' }, { id: 'main-aisle-forklift', type: "navigation", label: 'Forklift Zone', yaw: 145, pitch: -8, targetLocationId: 'forklift' }, { id: 'main-aisle-manual', type: "navigation", label: 'Manual Handling Area', yaw: -145, pitch: -8, targetLocationId: 'manual' }] },
    { locationId: 'rack-a', name: 'Storage Racks A', panorama: localPanoramaFor("rack-a"), description: 'Explore the storage racks a inside the logistics warehouse.', mapX: 59, mapY: 42, connectedLocations: ["main-aisle", "rack-b", "picking"], hotspots: [{ id: 'rack-a-main-aisle', type: "navigation", label: 'Main Warehouse Aisle', yaw: 0, pitch: -8, targetLocationId: 'main-aisle' }, { id: 'rack-a-rack-b', type: "navigation", label: 'Storage Racks B', yaw: 70, pitch: -8, targetLocationId: 'rack-b' }, { id: 'rack-a-picking', type: "navigation", label: 'Order Picking', yaw: -70, pitch: -8, targetLocationId: 'picking' }] },
    { locationId: 'rack-b', name: 'Storage Racks B', panorama: localPanoramaFor("rack-b"), description: 'Explore the storage racks b inside the logistics warehouse.', mapX: 70, mapY: 42, connectedLocations: ["rack-a", "high-rack", "picking"], hotspots: [{ id: 'rack-b-rack-a', type: "navigation", label: 'Storage Racks A', yaw: 0, pitch: -8, targetLocationId: 'rack-a' }, { id: 'rack-b-high-rack', type: "navigation", label: 'High-Rack Storage', yaw: 70, pitch: -8, targetLocationId: 'high-rack' }, { id: 'rack-b-picking', type: "navigation", label: 'Order Picking', yaw: -70, pitch: -8, targetLocationId: 'picking' }] },
    { locationId: 'high-rack', name: 'High-Rack Storage', panorama: localPanoramaFor("high-rack"), description: 'Explore the high-rack storage inside the logistics warehouse.', mapX: 80, mapY: 34, connectedLocations: ["rack-b", "height", "yard"], hotspots: [{ id: 'high-rack-rack-b', type: "navigation", label: 'Storage Racks B', yaw: 0, pitch: -8, targetLocationId: 'rack-b' }, { id: 'high-rack-height', type: "navigation", label: 'Working at Height Area', yaw: 70, pitch: -8, targetLocationId: 'height' }, { id: 'high-rack-yard', type: "navigation", label: 'Transport Yard', yaw: -70, pitch: -8, targetLocationId: 'yard' }] },
    { locationId: 'forklift', name: 'Forklift Zone', panorama: localPanoramaFor("forklift"), description: 'Explore the forklift zone inside the logistics warehouse.', mapX: 58, mapY: 25, connectedLocations: ["main-aisle", "charging", "picking"], hotspots: [{ id: 'forklift-main-aisle', type: "navigation", label: 'Main Warehouse Aisle', yaw: 0, pitch: -8, targetLocationId: 'main-aisle' }, { id: 'forklift-charging', type: "navigation", label: 'Forklift Charging', yaw: 70, pitch: -8, targetLocationId: 'charging' }, { id: 'forklift-picking', type: "navigation", label: 'Order Picking', yaw: -70, pitch: -8, targetLocationId: 'picking' }] },
    { locationId: 'charging', name: 'Forklift Charging', panorama: localPanoramaFor("charging"), description: 'Explore the forklift charging inside the logistics warehouse.', mapX: 45, mapY: 20, connectedLocations: ["forklift", "office"], hotspots: [{ id: 'charging-forklift', type: "navigation", label: 'Forklift Zone', yaw: 0, pitch: -8, targetLocationId: 'forklift' }, { id: 'charging-office', type: "navigation", label: 'Warehouse Control Office', yaw: 70, pitch: -8, targetLocationId: 'office' }] },
    { locationId: 'picking', name: 'Order Picking', panorama: localPanoramaFor("picking"), description: 'Explore the order picking inside the logistics warehouse.', mapX: 70, mapY: 58, connectedLocations: ["rack-a", "rack-b", "forklift", "packing"], hotspots: [{ id: 'picking-rack-a', type: "navigation", label: 'Storage Racks A', yaw: 0, pitch: -8, targetLocationId: 'rack-a' }, { id: 'picking-rack-b', type: "navigation", label: 'Storage Racks B', yaw: 70, pitch: -8, targetLocationId: 'rack-b' }, { id: 'picking-forklift', type: "navigation", label: 'Forklift Zone', yaw: -70, pitch: -8, targetLocationId: 'forklift' }, { id: 'picking-packing', type: "navigation", label: 'Packing Area', yaw: 145, pitch: -8, targetLocationId: 'packing' }] },
    { locationId: 'packing', name: 'Packing Area', panorama: localPanoramaFor("packing"), description: 'Explore the packing area inside the logistics warehouse.', mapX: 79, mapY: 65, connectedLocations: ["picking", "quality"], hotspots: [{ id: 'packing-picking', type: "navigation", label: 'Order Picking', yaw: 0, pitch: -8, targetLocationId: 'picking' }, { id: 'packing-quality', type: "navigation", label: 'Quality Check', yaw: 70, pitch: -8, targetLocationId: 'quality' }] },
    { locationId: 'quality', name: 'Quality Check', panorama: localPanoramaFor("quality"), description: 'Explore the quality check inside the logistics warehouse.', mapX: 65, mapY: 75, connectedLocations: ["packing", "dispatch"], hotspots: [{ id: 'quality-packing', type: "navigation", label: 'Packing Area', yaw: 0, pitch: -8, targetLocationId: 'packing' }, { id: 'quality-dispatch', type: "navigation", label: 'Dispatch Staging', yaw: 70, pitch: -8, targetLocationId: 'dispatch' }] },
    { locationId: 'dispatch', name: 'Dispatch Staging', panorama: localPanoramaFor("dispatch"), description: 'Explore the dispatch staging inside the logistics warehouse.', mapX: 83, mapY: 77, connectedLocations: ["quality", "loading"], hotspots: [{ id: 'dispatch-quality', type: "navigation", label: 'Quality Check', yaw: 0, pitch: -8, targetLocationId: 'quality' }, { id: 'dispatch-loading', type: "navigation", label: 'Loading Dock', yaw: 70, pitch: -8, targetLocationId: 'loading' }] },
    { locationId: 'loading', name: 'Loading Dock', panorama: localPanoramaFor("loading"), description: 'Explore the loading dock inside the logistics warehouse.', mapX: 92, mapY: 65, connectedLocations: ["dispatch", "yard"], hotspots: [{ id: 'loading-dispatch', type: "navigation", label: 'Dispatch Staging', yaw: 0, pitch: -8, targetLocationId: 'dispatch' }, { id: 'loading-yard', type: "navigation", label: 'Transport Yard', yaw: 70, pitch: -8, targetLocationId: 'yard' }] },
    { locationId: 'manual', name: 'Manual Handling Area', panorama: localPanoramaFor("manual"), description: 'Explore the manual handling area inside the logistics warehouse.', mapX: 48, mapY: 77, connectedLocations: ["inbound", "main-aisle", "height"], hotspots: [{ id: 'manual-inbound', type: "navigation", label: 'Inbound Staging', yaw: 0, pitch: -8, targetLocationId: 'inbound' }, { id: 'manual-main-aisle', type: "navigation", label: 'Main Warehouse Aisle', yaw: 70, pitch: -8, targetLocationId: 'main-aisle' }, { id: 'manual-height', type: "navigation", label: 'Working at Height Area', yaw: -70, pitch: -8, targetLocationId: 'height' }] },
    { locationId: 'height', name: 'Working at Height Area', panorama: localPanoramaFor("height"), description: 'Explore the working at height area inside the logistics warehouse.', mapX: 34, mapY: 84, connectedLocations: ["manual", "high-rack", "emergency"], hotspots: [{ id: 'height-manual', type: "navigation", label: 'Manual Handling Area', yaw: 0, pitch: -8, targetLocationId: 'manual' }, { id: 'height-high-rack', type: "navigation", label: 'High-Rack Storage', yaw: 70, pitch: -8, targetLocationId: 'high-rack' }, { id: 'height-emergency', type: "navigation", label: 'Emergency Exit', yaw: -70, pitch: -8, targetLocationId: 'emergency' }] },
    { locationId: 'emergency', name: 'Emergency Exit', panorama: localPanoramaFor("emergency"), description: 'Explore the emergency exit inside the logistics warehouse.', mapX: 20, mapY: 84, connectedLocations: ["height", "office"], hotspots: [{ id: 'emergency-height', type: "navigation", label: 'Working at Height Area', yaw: 0, pitch: -8, targetLocationId: 'height' }, { id: 'emergency-office', type: "navigation", label: 'Warehouse Control Office', yaw: 70, pitch: -8, targetLocationId: 'office' }] },
    { locationId: 'office', name: 'Warehouse Control Office', panorama: localPanoramaFor("office"), description: 'Explore the warehouse control office inside the logistics warehouse.', mapX: 12, mapY: 22, connectedLocations: ["security", "charging", "emergency", "training", "first-aid"], hotspots: [{ id: 'office-security', type: "navigation", label: 'Security & Check-in', yaw: 0, pitch: -8, targetLocationId: 'security' }, { id: 'office-charging', type: "navigation", label: 'Forklift Charging', yaw: 70, pitch: -8, targetLocationId: 'charging' }, { id: 'office-emergency', type: "navigation", label: 'Emergency Exit', yaw: -70, pitch: -8, targetLocationId: 'emergency' }] },
    { locationId: 'yard', name: 'Transport Yard', panorama: localPanoramaFor("yard"), description: 'Explore the transport yard inside the logistics warehouse.', mapX: 92, mapY: 28, connectedLocations: ["loading", "high-rack"], hotspots: [{ id: 'yard-loading', type: "navigation", label: 'Loading Dock', yaw: 0, pitch: -8, targetLocationId: 'loading' }, { id: 'yard-high-rack', type: "navigation", label: 'High-Rack Storage', yaw: 70, pitch: -8, targetLocationId: 'high-rack' }] },
    { locationId: 'training', name: 'Meeting & Training Room', panorama: localPanoramaFor("training"), description: 'Meeting and safety briefing room for warehouse staff.', mapX: 18, mapY: 18, connectedLocations: ["office", "canteen"], hotspots: [{ id: 'training-office', type: "navigation", label: 'Site Office', yaw: 0, pitch: -8, targetLocationId: 'office' }, { id: 'training-canteen', type: "navigation", label: 'Break Room / Canteen', yaw: 70, pitch: -8, targetLocationId: 'canteen' }] },
    { locationId: 'canteen', name: 'Break Room / Canteen', panorama: localPanoramaFor("canteen"), description: 'Staff welfare and break area connected to the office facilities.', mapX: 9, mapY: 24, connectedLocations: ["training", "restroom"], hotspots: [{ id: 'canteen-training', type: "navigation", label: 'Training Room', yaw: 0, pitch: -8, targetLocationId: 'training' }, { id: 'canteen-restroom', type: "navigation", label: 'Restroom', yaw: 70, pitch: -8, targetLocationId: 'restroom' }] },
    { locationId: 'restroom', name: 'Restroom', panorama: localPanoramaFor("restroom"), description: 'Staff restroom and wash facilities.', mapX: 8, mapY: 34, connectedLocations: ["canteen", "first-aid"], hotspots: [{ id: 'restroom-canteen', type: "navigation", label: 'Canteen', yaw: 0, pitch: -8, targetLocationId: 'canteen' }, { id: 'restroom-first-aid', type: "navigation", label: 'First Aid & Welfare', yaw: 70, pitch: -8, targetLocationId: 'first-aid' }] },
    { locationId: 'first-aid', name: 'First Aid & Welfare Room', panorama: localPanoramaFor("first-aid"), description: 'First-aid treatment and staff welfare room.', mapX: 10, mapY: 44, connectedLocations: ["restroom", "office", "emergency"], hotspots: [{ id: 'firstaid-restroom', type: "navigation", label: 'Restroom', yaw: 0, pitch: -8, targetLocationId: 'restroom' }, { id: 'firstaid-office', type: "navigation", label: 'Site Office', yaw: 70, pitch: -8, targetLocationId: 'office' }, { id: 'firstaid-emergency', type: "navigation", label: 'Emergency Exit', yaw: -70, pitch: -8, targetLocationId: 'emergency' }] },
];

function wrapAngle(a) { return ((a + 180) % 360 + 360) % 360 - 180; }
function projectHotspot(h, yaw, pitch, fov, width, height) {
    const dx = wrapAngle(h.yaw - yaw); const dy = h.pitch - pitch;
    const hfov = fov; const vfov = fov * (height / Math.max(width, 1));
    if (Math.abs(dx) > hfov * .62 || Math.abs(dy) > Math.max(vfov * .75, 35)) return null;
    return { left: 50 + (dx / hfov) * 100, top: 50 - (dy / Math.max(vfov, 35)) * 100 };
}

export function PanoramaCanvas({ src, yaw, pitch, fov, onViewChange, onImageError }) {
    const ref = useRef(null); const drag = useRef(null); const viewRef = useRef({ yaw, pitch, fov });
    useEffect(() => { viewRef.current = { yaw, pitch, fov }; }, [yaw, pitch, fov]);
    useEffect(() => {
        const canvas = ref.current; const gl = canvas?.getContext("webgl", { antialias: true }); if (!gl) return;
        const vs = `attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`;
        const fs = `precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform vec2 res;uniform vec3 view;const float PI=3.14159265359;void main(){float aspect=res.x/res.y;float t=tan(radians(view.z)*.5);vec2 q=(uv*2.-1.);q.x*=aspect*t;q.y*=t;vec3 d=normalize(vec3(q.x,q.y,-1.));float ya=radians(view.x),pa=radians(view.y);mat3 ry=mat3(cos(ya),0.,-sin(ya),0.,1.,0.,sin(ya),0.,cos(ya));mat3 rx=mat3(1.,0.,0.,0.,cos(pa),sin(pa),0.,-sin(pa),cos(pa));d=ry*rx*d;float lon=atan(d.x,-d.z);float lat=asin(clamp(d.y,-1.,1.));vec2 tuv=vec2(fract(lon/(2.*PI)+.5),clamp(.5-lat/PI,0.,1.));gl_FragColor=texture2D(tex,tuv);}`;
        const shader = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); return s };
        const program = gl.createProgram(); gl.attachShader(program, shader(gl.VERTEX_SHADER, vs)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(program); gl.useProgram(program);
        const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW); const loc = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        const img = new Image(); img.onload = () => { gl.bindTexture(gl.TEXTURE_2D, texture); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img); draw(); }; img.onerror = () => onImageError?.(); img.src = src;
        const draw = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.floor(canvas.clientWidth * dpr), h = Math.floor(canvas.clientHeight * dpr); if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h } gl.viewport(0, 0, w, h); const v = viewRef.current; gl.uniform2f(gl.getUniformLocation(program, "res"), w, h); gl.uniform3f(gl.getUniformLocation(program, "view"), v.yaw, v.pitch, v.fov); gl.drawArrays(gl.TRIANGLES, 0, 6) };
        const ro = new ResizeObserver(draw); ro.observe(canvas); canvas._draw360 = draw; return () => { ro.disconnect(); delete canvas._draw360; };
    }, [src]);
    useEffect(() => { ref.current?._draw360?.(); }, [yaw, pitch, fov]);
    const down = e => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, yaw, pitch }; };
    const move = e => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; onViewChange(wrapAngle(drag.current.yaw - dx * .16), Math.max(-75, Math.min(75, drag.current.pitch + dy * .12)), fov) };
    const up = () => { drag.current = null };
    return <canvas ref={ref} className="tour360__canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={e => { e.preventDefault(); onViewChange(yaw, pitch, Math.max(45, Math.min(105, fov + e.deltaY * .04))) }} />;
}

export default function Trainee360Environment({ embedded = false }) {
    const [scenes, setScenes] = useState(FALLBACK_SCENES), [sceneId, setSceneId] = useState("entrance"), [yaw, setYaw] = useState(0), [pitch, setPitch] = useState(0), [fov, setFov] = useState(78), [panel, setPanel] = useState(null), [apiNote, setApiNote] = useState(""), [imageFailed, setImageFailed] = useState(false);
    const stageRef = useRef(null); const historyRef = useRef([]); const [size, setSize] = useState({ w: 1200, h: 700 });
    useEffect(() => { fetch(`${API_BASE}/warehouse-tour/locations`, { headers: { Authorization: `Bearer ${getAccessToken()}` } }).then(r => r.ok ? r.json() : Promise.reject()).then(data => { if (data.locations?.length) { const byId = new Map(data.locations.map(x => [x.locationId, x])); const merged = FALLBACK_SCENES.map(base => { const remote = byId.get(base.locationId) || {}; return { ...base, name: remote.name || base.name, description: remote.description || base.description, panorama: localPanoramaFor(base.locationId) }; }); setScenes(merged); setSceneId("entrance") } }).catch(() => setApiNote("Using the built-in 20-location warehouse environment.")); }, []);
    useEffect(() => { const el = stageRef.current; if (!el) return; const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height })); ro.observe(el); return () => ro.disconnect() }, []);
    const scene = useMemo(() => scenes.find(s => s.locationId === sceneId) || scenes[0], [scenes, sceneId]);
    const go = useCallback((id, { remember = true } = {}) => { if (!scenes.some(s => s.locationId === id) || id === sceneId) return; if (remember) historyRef.current.push(sceneId); setSceneId(id); setYaw(0); setPitch(0); setFov(78); setPanel(null); setImageFailed(false) }, [scenes, sceneId]);
    const goBack = useCallback(() => { const id = historyRef.current.pop(); if (id) go(id, { remember: false }); }, [go]);
    const goForward = useCallback(() => {
        const index = FORWARD_ROUTE.indexOf(sceneId);
        if (index >= 0 && index < FORWARD_ROUTE.length - 1) {
            const nextId = FORWARD_ROUTE[index + 1];
            if (scenes.some(s => s.locationId === nextId)) { go(nextId); return; }
        }
        const current = scenes.find(s => s.locationId === sceneId);
        const nextId = current?.connectedLocations?.find(id => id !== historyRef.current.at(-1));
        if (nextId) go(nextId);
    }, [scenes, sceneId, go]);
    useEffect(() => { const key = e => { if (e.target?.matches?.('input,textarea,select,[contenteditable=true]')) return; const k = e.key.toLowerCase(); if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) e.preventDefault(); if (k === 'arrowup' || k === 'w') goForward(); else if (k === 'arrowdown' || k === 's') goBack(); else if (k === 'arrowleft' || k === 'a') setYaw(v => wrapAngle(v - 18)); else if (k === 'arrowright' || k === 'd') setYaw(v => wrapAngle(v + 18)); }; window.addEventListener('keydown', key, { passive: false }); return () => window.removeEventListener('keydown', key) }, [goForward, goBack]);
    const visible = (scene?.hotspots || []).map(h => ({ h, pos: projectHotspot(h, yaw, pitch, fov, size.w, size.h) })).filter(x => x.pos);
    const toggleFullscreen = () => { if (!document.fullscreenElement) stageRef.current?.requestFullscreen?.(); else document.exitFullscreen?.() };
    const mapScenes = scenes.filter(s => MAP_LOCATION_IDS.includes(s.locationId));
    const mapLines = [];
    for (let i = 0; i < mapScenes.length - 1; i++) {
        const a = mapScenes[i], b = mapScenes[i + 1];
        const dx = b.mapX - a.mapX, dy = b.mapY - a.mapY, len = Math.hypot(dx, dy), angle = Math.atan2(dy, dx) * 180 / Math.PI;
        mapLines.push(<span key={`${a.locationId}-${b.locationId}`} className="tour360__map-line" style={{ left: `${a.mapX}%`, top: `${a.mapY}%`, width: `${len}%`, transform: `rotate(${angle}deg)` }} />);
    }
    return <div className={`tour360 ${embedded ? "tour360--embedded" : ""}`}>

        <main className="tour360__stage" ref={stageRef}>
            <PanoramaCanvas src={scene.panorama} yaw={yaw} pitch={pitch} fov={fov} onImageError={() => setImageFailed(true)} onViewChange={(a, b, c) => { setYaw(a); setPitch(b); setFov(c) }} />
            <div className="tour360__shade" />{imageFailed && <div className="tour360__image-fallback"><strong>Panorama unavailable</strong><span>This checkpoint failed to load. Use ↑ to continue or the map to choose another warehouse area.</span><button onClick={goForward}>Move to next area</button></div>}<div className="tour360__dashboard-badge">LOGI WAREHOUSE <span>TRAINEE DASHBOARD</span></div><div className="tour360__location"><small>Current location</small><strong>{scene.name}</strong></div>
            {visible.map(({ h, pos }) => <button key={h.id} className="tour360__hotspot tour360__hotspot--navigation" style={{ left: `${pos.left}%`, top: `${pos.top}%` }} onClick={() => go(h.targetLocationId)}><span className="tour360__hotspot-icon">➜</span>{h.label}</button>)}
            <div className="tour360__controls"><button className="tour360__control" title="Return to entrance" onClick={() => go("entrance")}>⌂</button><button className="tour360__control" title="Zoom in" onClick={() => setFov(v => Math.max(45, v - 8))}>+</button><button className="tour360__control" title="Zoom out" onClick={() => setFov(v => Math.min(105, v + 8))}>−</button><button className="tour360__control" title="Fullscreen" onClick={toggleFullscreen}>⛶</button><button className="tour360__control" title="Help" onClick={() => setPanel({ title: "How to use the 360° tour", type: "training", content: "Game-style controls: press ↑ or W repeatedly to continue forward through the warehouse route, ↓ or S to return to the previous checkpoint, and ←/A or →/D to turn. You can also drag to look around, use the mouse wheel to zoom, click blue navigation arrows, or click a point on the warehouse map." })}>?</button></div>
            <div className="tour360__hint">Mouse drag = look • ↑/W = continue forward • ↓/S = move back • ←/A and →/D = turn • Scroll = zoom</div><div className="tour360__gamepad" aria-label="Keyboard navigation"><button title="Move forward (↑ / W)" onClick={goForward}>↑</button><button title="Turn left (← / A)" onClick={() => setYaw(v => wrapAngle(v - 18))}>←</button><button title="Move backward (↓ / S)" onClick={goBack}>↓</button><button title="Turn right (→ / D)" onClick={() => setYaw(v => wrapAngle(v + 18))}>→</button></div>
            <div className="tour360__map"><div className="tour360__map-title">WAREHOUSE MAP</div><div className="tour360__map-box">{mapLines}{mapScenes.map(s => <span key={s.locationId}><button aria-label={`Go to ${s.name}`} title={`Go to ${s.name}`} onClick={() => go(s.locationId)} className={`tour360__map-node ${s.locationId === scene.locationId ? "active" : ""}`} style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }} /><button className={`tour360__map-label ${s.locationId === scene.locationId ? "active" : ""}`} style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }} onClick={() => go(s.locationId)}>{s.locationId === scene.locationId ? `You are here · ${s.name}` : s.name}</button></span>)}</div></div>
            {apiNote && <div className="tour360__error">{apiNote}</div>}
            {panel && <div className="tour360__panel-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setPanel(null) }}><aside className="tour360__panel"><div className="tour360__panel-head"><div><div className="tour360__panel-kicker">Interactive Logistics Warehouse</div><h2>{panel.title || panel.label}</h2></div><button className="tour360__close" onClick={() => setPanel(null)}>×</button></div><p>{panel.content}</p>{panel.activityType && <button className="tour360__action" onClick={() => setPanel({ ...panel, title: "Activity ready", content: `This warehouse tour is for navigation only. Training scenarios remain inside the relevant training programme.` })}>Start training activity</button>}</aside></div>}
        </main>
    </div>;
}


// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";

// import "./Trainee360Environment.css";
// import { getAccessToken } from "../../utils/session";

// const API_BASE =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

// /* =========================================================
//    HELPERS
// ========================================================= */

// function wrapAngle(value) {
//   let angle = value;

//   while (angle > 180) angle -= 360;
//   while (angle < -180) angle += 360;

//   return angle;
// }

// function assetUrl(url) {
//   if (!url) return "";

//   if (
//     url.startsWith("http://") ||
//     url.startsWith("https://") ||
//     url.startsWith("blob:") ||
//     url.startsWith("data:")
//   ) {
//     return url;
//   }

//   if (url.startsWith("/api/")) {
//     return `${BACKEND_ORIGIN}${url}`;
//   }

//   if (url.startsWith("/uploads/")) {
//     return `${BACKEND_ORIGIN}${url}`;
//   }

//   return url;
// }

// /*
//   Converts the API record into the format required by
//   the Trainee 360 viewer.
// */
// function normalizeScene(scene, index) {
//   const hotspots = Array.isArray(scene.hotspots)
//     ? scene.hotspots.map((hotspot, hotspotIndex) => ({
//       id:
//         hotspot.id ||
//         `${scene.locationId}-hotspot-${hotspotIndex}`,

//       type: hotspot.type || "navigation",

//       label:
//         hotspot.label ||
//         "Go to next area",

//       targetLocationId:
//         hotspot.targetLocationId ||
//         hotspot.targetId ||
//         "",

//       yaw: Number(hotspot.yaw ?? 0),
//       pitch: Number(hotspot.pitch ?? -5),

//       title: hotspot.title || "",
//       content: hotspot.content || "",
//       activityType: hotspot.activityType || "",
//     }))
//     : [];

//   return {
//     ...scene,

//     locationId: scene.locationId,
//     name: scene.name || scene.locationId,
//     description: scene.description || "",

//     panorama: assetUrl(scene.panorama),

//     order: Number(scene.order ?? index + 1),

//     active: scene.active !== false,

//     hotspots,

//     connectedLocations: hotspots
//       .filter(
//         (hotspot) =>
//           hotspot.type === "navigation" &&
//           hotspot.targetLocationId
//       )
//       .map((hotspot) => hotspot.targetLocationId),
//   };
// }

// /* =========================================================
//    HOTSPOT POSITION
// ========================================================= */

// function projectHotspot(
//   hotspot,
//   cameraYaw,
//   cameraPitch,
//   fov,
//   width,
//   height
// ) {
//   if (!width || !height) return null;

//   const horizontalDifference = wrapAngle(
//     Number(hotspot.yaw || 0) - cameraYaw
//   );

//   const verticalDifference =
//     Number(hotspot.pitch || 0) - cameraPitch;

//   const horizontalFov = fov;

//   const verticalFov =
//     fov * (height / width);

//   /*
//     Hide hotspots that are currently behind the camera.
//   */
//   if (
//     Math.abs(horizontalDifference) >
//     horizontalFov * 0.65 ||
//     Math.abs(verticalDifference) >
//     verticalFov * 0.8
//   ) {
//     return null;
//   }

//   const left =
//     50 +
//     (horizontalDifference / horizontalFov) * 100;

//   const top =
//     50 -
//     (verticalDifference / verticalFov) * 100;

//   return {
//     left,
//     top,
//   };
// }

// /* =========================================================
//    WEBGL PANORAMA VIEWER
// ========================================================= */

// export function PanoramaCanvas({
//   src,
//   yaw,
//   pitch,
//   fov,
//   onViewChange,
//   onImageError,
// }) {
//   const canvasRef = useRef(null);
//   const dragRef = useRef(null);

//   const viewRef = useRef({
//     yaw,
//     pitch,
//     fov,
//   });

//   useEffect(() => {
//     viewRef.current = {
//       yaw,
//       pitch,
//       fov,
//     };

//     canvasRef.current?._draw360?.();
//   }, [yaw, pitch, fov]);

//   useEffect(() => {
//     const canvas = canvasRef.current;

//     if (!canvas || !src) return undefined;

//     const gl = canvas.getContext("webgl", {
//       antialias: true,
//     });

//     if (!gl) {
//       onImageError?.();
//       return undefined;
//     }

//     const vertexShaderSource = `
//       attribute vec2 p;

//       void main() {
//         gl_Position = vec4(p, 0.0, 1.0);
//       }
//     `;

//     const fragmentShaderSource = `
//       precision highp float;

//       uniform vec2 res;
//       uniform vec3 view;
//       uniform sampler2D tex;

//       const float PI = 3.141592653589793;

//       mat3 rotX(float a) {
//         float c = cos(a);
//         float s = sin(a);

//         return mat3(
//           1.0, 0.0, 0.0,
//           0.0, c, -s,
//           0.0, s, c
//         );
//       }

//       mat3 rotY(float a) {
//         float c = cos(a);
//         float s = sin(a);

//         return mat3(
//           c, 0.0, s,
//           0.0, 1.0, 0.0,
//           -s, 0.0, c
//         );
//       }

//       void main() {
//         vec2 uv =
//           (gl_FragCoord.xy * 2.0 - res.xy) /
//           min(res.x, res.y);

//         float f =
//           1.0 /
//           tan(radians(view.z) * 0.5);

//         vec3 direction =
//           normalize(vec3(uv.x, uv.y, -f));

//         mat3 yawRotation =
//           rotY(radians(view.x));

//         mat3 pitchRotation =
//           rotX(radians(view.y));

//         direction =
//           yawRotation *
//           pitchRotation *
//           direction;

//         float longitude =
//           atan(direction.x, -direction.z);

//         float latitude =
//           asin(clamp(direction.y, -1.0, 1.0));

//         vec2 textureUv = vec2(
//           fract(longitude / (2.0 * PI) + 0.5),
//           clamp(0.5 - latitude / PI, 0.0, 1.0)
//         );

//         gl_FragColor =
//           texture2D(tex, textureUv);
//       }
//     `;

//     function createShader(type, source) {
//       const shader = gl.createShader(type);

//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);

//       return shader;
//     }

//     const program = gl.createProgram();

//     gl.attachShader(
//       program,
//       createShader(
//         gl.VERTEX_SHADER,
//         vertexShaderSource
//       )
//     );

//     gl.attachShader(
//       program,
//       createShader(
//         gl.FRAGMENT_SHADER,
//         fragmentShaderSource
//       )
//     );

//     gl.linkProgram(program);
//     gl.useProgram(program);

//     const buffer = gl.createBuffer();

//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([
//         -1, -1,
//         1, -1,
//         -1, 1,

//         -1, 1,
//         1, -1,
//         1, 1,
//       ]),
//       gl.STATIC_DRAW
//     );

//     const positionLocation =
//       gl.getAttribLocation(program, "p");

//     gl.enableVertexAttribArray(positionLocation);

//     gl.vertexAttribPointer(
//       positionLocation,
//       2,
//       gl.FLOAT,
//       false,
//       0,
//       0
//     );

//     const texture = gl.createTexture();

//     gl.bindTexture(
//       gl.TEXTURE_2D,
//       texture
//     );

//     gl.texParameteri(
//       gl.TEXTURE_2D,
//       gl.TEXTURE_WRAP_S,
//       gl.CLAMP_TO_EDGE
//     );

//     gl.texParameteri(
//       gl.TEXTURE_2D,
//       gl.TEXTURE_WRAP_T,
//       gl.CLAMP_TO_EDGE
//     );

//     gl.texParameteri(
//       gl.TEXTURE_2D,
//       gl.TEXTURE_MIN_FILTER,
//       gl.LINEAR
//     );

//     gl.texParameteri(
//       gl.TEXTURE_2D,
//       gl.TEXTURE_MAG_FILTER,
//       gl.LINEAR
//     );

//     function draw() {
//       const devicePixelRatio = Math.min(
//         window.devicePixelRatio || 1,
//         2
//       );

//       const width = Math.floor(
//         canvas.clientWidth *
//         devicePixelRatio
//       );

//       const height = Math.floor(
//         canvas.clientHeight *
//         devicePixelRatio
//       );

//       if (
//         canvas.width !== width ||
//         canvas.height !== height
//       ) {
//         canvas.width = width;
//         canvas.height = height;
//       }

//       gl.viewport(
//         0,
//         0,
//         width,
//         height
//       );

//       const currentView =
//         viewRef.current;

//       gl.uniform2f(
//         gl.getUniformLocation(
//           program,
//           "res"
//         ),
//         width,
//         height
//       );

//       gl.uniform3f(
//         gl.getUniformLocation(
//           program,
//           "view"
//         ),
//         currentView.yaw,
//         currentView.pitch,
//         currentView.fov
//       );

//       gl.drawArrays(
//         gl.TRIANGLES,
//         0,
//         6
//       );
//     }

//     const image = new Image();

//     /*
//       Required because the image is served by
//       localhost:5000 while React runs on 5173.
//     */
//     image.crossOrigin = "anonymous";

//     image.onload = () => {
//       gl.bindTexture(
//         gl.TEXTURE_2D,
//         texture
//       );

//       gl.pixelStorei(
//         gl.UNPACK_FLIP_Y_WEBGL,
//         false
//       );

//       gl.texImage2D(
//         gl.TEXTURE_2D,
//         0,
//         gl.RGBA,
//         gl.RGBA,
//         gl.UNSIGNED_BYTE,
//         image
//       );

//       draw();
//     };

//     image.onerror = () => {
//       onImageError?.();
//     };

//     image.src = src;

//     const resizeObserver =
//       new ResizeObserver(draw);

//     resizeObserver.observe(canvas);

//     canvas._draw360 = draw;

//     return () => {
//       resizeObserver.disconnect();

//       delete canvas._draw360;

//       gl.deleteTexture(texture);
//       gl.deleteBuffer(buffer);
//       gl.deleteProgram(program);
//     };
//   }, [src, onImageError]);

//   function handlePointerDown(event) {
//     event.currentTarget.setPointerCapture(
//       event.pointerId
//     );

//     dragRef.current = {
//       x: event.clientX,
//       y: event.clientY,
//       yaw,
//       pitch,
//     };
//   }

//   function handlePointerMove(event) {
//     if (!dragRef.current) return;

//     const deltaX =
//       event.clientX -
//       dragRef.current.x;

//     const deltaY =
//       event.clientY -
//       dragRef.current.y;

//     const newYaw = wrapAngle(
//       dragRef.current.yaw -
//       deltaX * 0.16
//     );

//     const newPitch = Math.max(
//       -75,
//       Math.min(
//         75,
//         dragRef.current.pitch +
//         deltaY * 0.12
//       )
//     );

//     onViewChange(
//       newYaw,
//       newPitch,
//       fov
//     );
//   }

//   function handlePointerUp() {
//     dragRef.current = null;
//   }

//   function handleWheel(event) {
//     event.preventDefault();

//     const newFov = Math.max(
//       45,
//       Math.min(
//         105,
//         fov + event.deltaY * 0.04
//       )
//     );

//     onViewChange(
//       yaw,
//       pitch,
//       newFov
//     );
//   }

//   return (
//     <canvas
//       ref={canvasRef}
//       className="tour360__canvas"
//       onPointerDown={
//         handlePointerDown
//       }
//       onPointerMove={
//         handlePointerMove
//       }
//       onPointerUp={
//         handlePointerUp
//       }
//       onPointerCancel={
//         handlePointerUp
//       }
//       onWheel={
//         handleWheel
//       }
//     />
//   );
// }

// /* =========================================================
//    MAIN TRAINEE WAREHOUSE TOUR
// ========================================================= */

// export default function Trainee360Environment({
//   embedded = false,
// }) {
//   const [scenes, setScenes] =
//     useState([]);

//   const [sceneId, setSceneId] =
//     useState("");

//   const [yaw, setYaw] =
//     useState(0);

//   const [pitch, setPitch] =
//     useState(0);

//   const [fov, setFov] =
//     useState(78);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [imageFailed, setImageFailed] =
//     useState(false);

//   const [panel, setPanel] =
//     useState(null);

//   const stageRef = useRef(null);

//   const historyRef = useRef([]);

//   const [size, setSize] =
//     useState({
//       w: 1200,
//       h: 700,
//     });

//   /* =======================================================
//      LOAD ADMIN-CREATED SCENES FROM MONGODB
//   ======================================================= */

//   useEffect(() => {
//     let cancelled = false;

//     async function loadWarehouseTour() {
//       setLoading(true);
//       setError("");

//       try {
//         const token =
//           getAccessToken();

//         const response = await fetch(
//           `${API_BASE}/warehouse-tour/locations`,
//           {
//             headers: {
//               Authorization:
//                 `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           const result =
//             await response
//               .json()
//               .catch(() => ({}));

//           throw new Error(
//             result.message ||
//             `Unable to load warehouse tour (${response.status}).`
//           );
//         }

//         const result =
//           await response.json();

//         const locations =
//           Array.isArray(result.locations)
//             ? result.locations
//             : [];

//         const normalized =
//           locations
//             .map(normalizeScene)
//             .filter(
//               (scene) =>
//                 scene.active !== false
//             )
//             .sort(
//               (a, b) =>
//                 Number(a.order || 0) -
//                 Number(b.order || 0)
//             );

//         if (!normalized.length) {
//           throw new Error(
//             "No active Warehouse Tour scenes are available. Ask an administrator to create and activate panorama scenes."
//           );
//         }

//         if (cancelled) return;

//         setScenes(normalized);

//         /*
//           Prefer Warehouse Entrance.
//           Otherwise use the first active scene.
//         */
//         const entrance =
//           normalized.find(
//             (scene) =>
//               scene.locationId ===
//               "warehouse-entrance"
//           ) || normalized[0];

//         setSceneId(
//           entrance.locationId
//         );
//       } catch (loadError) {
//         if (cancelled) return;

//         console.error(
//           "Warehouse Tour load error:",
//           loadError
//         );

//         setScenes([]);

//         setError(
//           loadError.message ||
//           "Unable to load the Warehouse Tour."
//         );
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadWarehouseTour();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /* =======================================================
//      VIEWER SIZE
//   ======================================================= */

//   useEffect(() => {
//     const element =
//       stageRef.current;

//     if (!element) return undefined;

//     const observer =
//       new ResizeObserver(
//         ([entry]) => {
//           setSize({
//             w:
//               entry.contentRect.width,
//             h:
//               entry.contentRect.height,
//           });
//         }
//       );

//     observer.observe(element);

//     return () =>
//       observer.disconnect();
//   }, []);

//   /* =======================================================
//      CURRENT SCENE
//   ======================================================= */

//   const scene = useMemo(() => {
//     return (
//       scenes.find(
//         (item) =>
//           item.locationId === sceneId
//       ) ||
//       scenes[0] ||
//       null
//     );
//   }, [scenes, sceneId]);

//   /* =======================================================
//      MOVE TO ANOTHER ADMIN-CREATED SCENE
//   ======================================================= */

//   const goToScene = useCallback(
//     (
//       targetId,
//       {
//         remember = true,
//       } = {}
//     ) => {
//       if (!targetId) return;

//       const targetScene =
//         scenes.find(
//           (item) =>
//             item.locationId ===
//             targetId
//         );

//       if (!targetScene) {
//         setError(
//           `The destination "${targetId}" does not exist or is inactive. Check the Target ID in Admin → Panorama & Scenes.`
//         );

//         return;
//       }

//       if (
//         targetId === sceneId
//       ) {
//         return;
//       }

//       if (
//         remember &&
//         sceneId
//       ) {
//         historyRef.current.push(
//           sceneId
//         );
//       }

//       setError("");

//       setSceneId(targetId);

//       setYaw(0);
//       setPitch(0);
//       setFov(78);

//       setImageFailed(false);
//       setPanel(null);
//     },
//     [scenes, sceneId]
//   );

//   /* =======================================================
//      BACK
//   ======================================================= */

//   const goBack = useCallback(() => {
//     const previousScene =
//       historyRef.current.pop();

//     if (previousScene) {
//       goToScene(
//         previousScene,
//         {
//           remember: false,
//         }
//       );
//     }
//   }, [goToScene]);

//   /* =======================================================
//      FIRST NAVIGATION HOTSPOT = FORWARD
//   ======================================================= */

//   const goForward =
//     useCallback(() => {
//       const firstNavigationHotspot =
//         scene?.hotspots?.find(
//           (hotspot) =>
//             hotspot.type ===
//             "navigation" &&
//             hotspot.targetLocationId
//         );

//       if (
//         firstNavigationHotspot
//       ) {
//         goToScene(
//           firstNavigationHotspot.targetLocationId
//         );
//       }
//     }, [scene, goToScene]);

//   /* =======================================================
//      KEYBOARD CONTROLS
//   ======================================================= */

//   useEffect(() => {
//     function handleKeyDown(event) {
//       if (
//         event.target?.matches?.(
//           "input, textarea, select, [contenteditable=true]"
//         )
//       ) {
//         return;
//       }

//       const key =
//         event.key.toLowerCase();

//       if (
//         [
//           "arrowup",
//           "arrowdown",
//           "arrowleft",
//           "arrowright",
//           "w",
//           "a",
//           "s",
//           "d",
//         ].includes(key)
//       ) {
//         event.preventDefault();
//       }

//       if (
//         key === "arrowup" ||
//         key === "w"
//       ) {
//         goForward();
//       } else if (
//         key === "arrowdown" ||
//         key === "s"
//       ) {
//         goBack();
//       } else if (
//         key === "arrowleft" ||
//         key === "a"
//       ) {
//         setYaw((value) =>
//           wrapAngle(value - 18)
//         );
//       } else if (
//         key === "arrowright" ||
//         key === "d"
//       ) {
//         setYaw((value) =>
//           wrapAngle(value + 18)
//         );
//       }
//     }

//     window.addEventListener(
//       "keydown",
//       handleKeyDown,
//       {
//         passive: false,
//       }
//     );

//     return () => {
//       window.removeEventListener(
//         "keydown",
//         handleKeyDown
//       );
//     };
//   }, [goForward, goBack]);

//   /* =======================================================
//      HOTSPOTS CURRENTLY INSIDE CAMERA VIEW
//   ======================================================= */

//   const visibleHotspots =
//     useMemo(() => {
//       if (!scene) return [];

//       return (
//         scene.hotspots || []
//       )
//         .map((hotspot) => ({
//           hotspot,

//           position:
//             projectHotspot(
//               hotspot,
//               yaw,
//               pitch,
//               fov,
//               size.w,
//               size.h
//             ),
//         }))
//         .filter(
//           (item) =>
//             item.position
//         );
//     }, [
//       scene,
//       yaw,
//       pitch,
//       fov,
//       size,
//     ]);

//   /* =======================================================
//      FULLSCREEN
//   ======================================================= */

//   function toggleFullscreen() {
//     if (
//       !document.fullscreenElement
//     ) {
//       stageRef.current
//         ?.requestFullscreen?.();
//     } else {
//       document.exitFullscreen?.();
//     }
//   }

//   /* =======================================================
//      RESET
//   ======================================================= */

//   function resetView() {
//     setYaw(0);
//     setPitch(0);
//     setFov(78);
//   }

//   /* =======================================================
//      LOADING
//   ======================================================= */

//   if (loading) {
//     return (
//       <div
//         className={`tour360 ${embedded
//           ? "tour360--embedded"
//           : ""
//           }`}
//       >
//         <main className="tour360__stage">
//           <div className="tour360__image-fallback">
//             <strong>
//               Loading Warehouse Tour...
//             </strong>

//             <span>
//               Loading Admin-created
//               panorama scenes from
//               MongoDB.
//             </span>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   /* =======================================================
//      NO SCENES
//   ======================================================= */

//   if (!scene) {
//     return (
//       <div
//         className={`tour360 ${embedded
//           ? "tour360--embedded"
//           : ""
//           }`}
//       >
//         <main className="tour360__stage">
//           <div className="tour360__image-fallback">
//             <strong>
//               Warehouse Tour unavailable
//             </strong>

//             <span>
//               {error ||
//                 "No active panorama scenes were found."}
//             </span>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div
//       className={`tour360 ${embedded
//         ? "tour360--embedded"
//         : ""
//         }`}
//     >
//       <main
//         className="tour360__stage"
//         ref={stageRef}
//       >
//         {/* 360 PANORAMA */}

//         <PanoramaCanvas
//           key={`${scene.locationId}-${scene.panorama}`}
//           src={scene.panorama}
//           yaw={yaw}
//           pitch={pitch}
//           fov={fov}
//           onImageError={() =>
//             setImageFailed(true)
//           }
//           onViewChange={(
//             newYaw,
//             newPitch,
//             newFov
//           ) => {
//             setYaw(newYaw);
//             setPitch(newPitch);
//             setFov(newFov);
//           }}
//         />

//         <div className="tour360__shade" />

//         {/* IMAGE ERROR */}

//         {imageFailed && (
//           <div className="tour360__image-fallback">
//             <strong>
//               Panorama unavailable
//             </strong>

//             <span>
//               The panorama for{" "}
//               {scene.name} could not be
//               loaded. Check the image in
//               Admin → Panorama & Scenes.
//             </span>
//           </div>
//         )}

//         {/* TOP BADGE */}

//         <div className="tour360__dashboard-badge">
//           LOGI WAREHOUSE{" "}
//           <span>
//             TRAINEE DASHBOARD
//           </span>
//         </div>

//         {/* CURRENT LOCATION */}

//         <div className="tour360__location">
//           <small>
//             Current location
//           </small>

//           <strong>
//             {scene.name}
//           </strong>
//         </div>

//         {/* ADMIN-CREATED HOTSPOTS */}

//         {visibleHotspots.map(
//           ({
//             hotspot,
//             position,
//           }) => {
//             if (
//               hotspot.type ===
//               "navigation" &&
//               hotspot.targetLocationId
//             ) {
//               return (
//                 <button
//                   key={hotspot.id}
//                   className="tour360__hotspot tour360__hotspot--navigation"
//                   style={{
//                     left: `${position.left}%`,
//                     top: `${position.top}%`,
//                   }}
//                   onClick={() =>
//                     goToScene(
//                       hotspot.targetLocationId
//                     )
//                   }
//                   title={
//                     hotspot.label
//                   }
//                 >
//                   <span className="tour360__hotspot-icon">
//                     ➜
//                   </span>

//                   {hotspot.label}
//                 </button>
//               );
//             }

//             return null;
//           }
//         )}

//         {/* VIEWER CONTROLS */}

//         <div className="tour360__controls">
//           <button
//             className="tour360__control"
//             title="Warehouse Entrance"
//             onClick={() => {
//               const entrance =
//                 scenes.find(
//                   (item) =>
//                     item.locationId ===
//                     "warehouse-entrance"
//                 );

//               if (entrance) {
//                 goToScene(
//                   entrance.locationId
//                 );
//               }
//             }}
//           >
//             ⌂
//           </button>

//           <button
//             className="tour360__control"
//             title="Zoom in"
//             onClick={() =>
//               setFov((value) =>
//                 Math.max(
//                   45,
//                   value - 8
//                 )
//               )
//             }
//           >
//             +
//           </button>

//           <button
//             className="tour360__control"
//             title="Zoom out"
//             onClick={() =>
//               setFov((value) =>
//                 Math.min(
//                   105,
//                   value + 8
//                 )
//               )
//             }
//           >
//             −
//           </button>

//           <button
//             className="tour360__control"
//             title="Reset view"
//             onClick={resetView}
//           >
//             ↻
//           </button>

//           <button
//             className="tour360__control"
//             title="Fullscreen"
//             onClick={
//               toggleFullscreen
//             }
//           >
//             ⛶
//           </button>

//           <button
//             className="tour360__control"
//             title="Help"
//             onClick={() =>
//               setPanel({
//                 title:
//                   "How to use the 360° Warehouse Tour",

//                 content:
//                   "Drag the panorama to look around. Use the mouse wheel or + and − buttons to zoom. Click the blue navigation hotspots created by the administrator to move between warehouse areas. Use W or ↑ for the first available route and S or ↓ to return to your previous location.",
//               })
//             }
//           >
//             ?
//           </button>
//         </div>

//         {/* KEYBOARD HINT */}

//         <div className="tour360__hint">
//           Mouse drag = look • Click
//           blue hotspot = move •
//           ↑/W = first available route
//           • ↓/S = back • ←/A and
//           →/D = turn • Scroll = zoom
//         </div>

//         {/* GAMEPAD */}

//         <div
//           className="tour360__gamepad"
//           aria-label="Warehouse navigation"
//         >
//           <button
//             title="Move using first available hotspot"
//             onClick={goForward}
//           >
//             ↑
//           </button>

//           <button
//             title="Turn left"
//             onClick={() =>
//               setYaw((value) =>
//                 wrapAngle(
//                   value - 18
//                 )
//               )
//             }
//           >
//             ←
//           </button>

//           <button
//             title="Go back"
//             onClick={goBack}
//           >
//             ↓
//           </button>

//           <button
//             title="Turn right"
//             onClick={() =>
//               setYaw((value) =>
//                 wrapAngle(
//                   value + 18
//                 )
//               )
//             }
//           >
//             →
//           </button>
//         </div>

//         {/* SIMPLE DATABASE SCENE NAVIGATOR */}

//         <div className="tour360__map">
//           <div className="tour360__map-title">
//             WAREHOUSE TOUR
//           </div>

//           <div className="tour360__map-box">
//             {scenes.map(
//               (
//                 mapScene,
//                 index
//               ) => {
//                 const total =
//                   Math.max(
//                     scenes.length,
//                     1
//                   );

//                 /*
//                   Dynamically place the
//                   Admin-created scenes.
//                   No old hard-coded map.
//                 */
//                 const columns = 3;

//                 const row =
//                   Math.floor(
//                     index / columns
//                   );

//                 const column =
//                   index % columns;

//                 const left =
//                   18 +
//                   column * 32;

//                 const top =
//                   25 +
//                   row * 38;

//                 return (
//                   <span
//                     key={
//                       mapScene.locationId
//                     }
//                   >
//                     <button
//                       aria-label={`Go to ${mapScene.name}`}
//                       title={`Go to ${mapScene.name}`}
//                       onClick={() =>
//                         goToScene(
//                           mapScene.locationId
//                         )
//                       }
//                       className={`tour360__map-node ${mapScene.locationId ===
//                         scene.locationId
//                         ? "active"
//                         : ""
//                         }`}
//                       style={{
//                         left: `${left}%`,
//                         top: `${top}%`,
//                       }}
//                     />

//                     <button
//                       className={`tour360__map-label ${mapScene.locationId ===
//                         scene.locationId
//                         ? "active"
//                         : ""
//                         }`}
//                       style={{
//                         left: `${left}%`,
//                         top: `${top}%`,
//                       }}
//                       onClick={() =>
//                         goToScene(
//                           mapScene.locationId
//                         )
//                       }
//                     >
//                       {mapScene.locationId ===
//                         scene.locationId
//                         ? `You are here · ${mapScene.name}`
//                         : mapScene.name}
//                     </button>
//                   </span>
//                 );
//               }
//             )}
//           </div>
//         </div>

//         {/* API / TARGET ERROR */}

//         {error && (
//           <div className="tour360__error">
//             {error}
//           </div>
//         )}

//         {/* HELP PANEL */}

//         {panel && (
//           <div
//             className="tour360__panel-backdrop"
//             onMouseDown={(event) => {
//               if (
//                 event.target ===
//                 event.currentTarget
//               ) {
//                 setPanel(null);
//               }
//             }}
//           >
//             <aside className="tour360__panel">
//               <div className="tour360__panel-head">
//                 <div>
//                   <div className="tour360__panel-kicker">
//                     Interactive Logistics
//                     Warehouse
//                   </div>

//                   <h2>
//                     {panel.title}
//                   </h2>
//                 </div>

//                 <button
//                   className="tour360__close"
//                   onClick={() =>
//                     setPanel(null)
//                   }
//                 >
//                   ×
//                 </button>
//               </div>

//               <p>
//                 {panel.content}
//               </p>
//             </aside>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }