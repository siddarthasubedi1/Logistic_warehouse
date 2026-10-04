import { useEffect, useRef, useState } from "react";
import { resolvePanoramaSource } from "../../utils/panoramaSource";

const wrapAngle = value => ((value + 180) % 360 + 360) % 360 - 180;
const clampFov = value => Math.max(45, Math.min(105, value));

export default function PanoramaCanvas(props) {
    const source = resolvePanoramaSource(props.src);
    return <PanoramaView key={source} {...props} src={source} />;
}

function PanoramaView({ src, yaw, pitch, fov, onViewChange, onImageError }) {
    const canvasRef = useRef(null);
    const drawRef = useRef(null);
    const viewRef = useRef({ yaw, pitch, fov });
    const callbacksRef = useRef({ onViewChange, onImageError });
    const dragRef = useRef(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => { callbacksRef.current = { onViewChange, onImageError }; }, [onViewChange, onImageError]);
    useEffect(() => {
        viewRef.current = { yaw, pitch, fov };
        drawRef.current?.();
    }, [yaw, pitch, fov]);

    useEffect(() => {
        const canvas = canvasRef.current;
        let disposed = false;
        let observer;
        let gl;
        const resources = [];
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.onload = () => {
            if (disposed) return;
            try {
                gl = canvas.getContext("webgl", { antialias: true });
                if (!gl) throw new Error("WebGL unavailable");
                const shader = (type, source) => {
                    const value = gl.createShader(type);
                    resources.push(() => gl.deleteShader(value));
                    gl.shaderSource(value, source);
                    gl.compileShader(value);
                    if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) throw new Error("Shader compilation failed");
                    return value;
                };
                const program = gl.createProgram();
                resources.push(() => gl.deleteProgram(program));
                gl.attachShader(program, shader(gl.VERTEX_SHADER, `attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}`));
                gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `precision mediump float;varying vec2 uv;uniform sampler2D tex;uniform vec2 res;uniform vec3 view;const float PI=3.14159265359;void main(){float aspect=res.x/res.y;float t=tan(radians(view.z)*.5);vec2 q=(uv*2.-1.);q.x*=aspect*t;q.y*=t;vec3 d=normalize(vec3(q.x,q.y,-1.));float ya=radians(view.x),pa=radians(view.y);mat3 ry=mat3(cos(ya),0.,-sin(ya),0.,1.,0.,sin(ya),0.,cos(ya));mat3 rx=mat3(1.,0.,0.,0.,cos(pa),sin(pa),0.,-sin(pa),cos(pa));d=ry*rx*d;float lon=atan(d.x,-d.z);float lat=asin(clamp(d.y,-1.,1.));vec2 tuv=vec2(fract(lon/(2.*PI)+.5),clamp(.5-lat/PI,0.,1.));gl_FragColor=texture2D(tex,tuv);}`));
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader linking failed");
                gl.useProgram(program);
                const buffer = gl.createBuffer();
                resources.push(() => gl.deleteBuffer(buffer));
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
                const position = gl.getAttribLocation(program, "p");
                gl.enableVertexAttribArray(position);
                gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
                const texture = gl.createTexture();
                resources.push(() => gl.deleteTexture(texture));
                gl.bindTexture(gl.TEXTURE_2D, texture);
                for (const parameter of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, parameter, gl.CLAMP_TO_EDGE);
                for (const parameter of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, parameter, gl.LINEAR);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                const resolution = gl.getUniformLocation(program, "res");
                const view = gl.getUniformLocation(program, "view");
                const draw = () => {
                    if (disposed) return;
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
                    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
                    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
                    gl.viewport(0, 0, width, height);
                    gl.uniform2f(resolution, width, height);
                    const current = viewRef.current;
                    gl.uniform3f(view, current.yaw, current.pitch, current.fov);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                };
                drawRef.current = draw;
                observer = new ResizeObserver(draw);
                observer.observe(canvas);
                draw();
                setStatus("ready");
            } catch {
                // Keep area navigation usable even when the device cannot render WebGL.
                setStatus("static");
            }
        };
        image.onerror = () => {
            if (disposed) return;
            setStatus("error");
            callbacksRef.current.onImageError?.();
        };
        image.src = src;
        const wheel = event => {
            event.preventDefault();
            const current = viewRef.current;
            callbacksRef.current.onViewChange?.(current.yaw, current.pitch, clampFov(current.fov + event.deltaY * .04));
        };
        canvas.addEventListener("wheel", wheel, { passive: false });
        return () => {
            disposed = true;
            image.onload = null;
            image.onerror = null;
            observer?.disconnect();
            canvas.removeEventListener("wheel", wheel);
            drawRef.current = null;
            for (const dispose of resources.reverse()) dispose();
        };
    }, [src]);

    const pointerDown = event => {
        event.currentTarget.focus({ preventScroll: true });
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { x: event.clientX, y: event.clientY, yaw, pitch };
    };
    const pointerMove = event => {
        const start = dragRef.current;
        if (!start) return;
        onViewChange?.(wrapAngle(start.yaw - (event.clientX - start.x) * .16), Math.max(-75, Math.min(75, start.pitch + (event.clientY - start.y) * .12)), fov);
    };
    const keyDown = event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (!["ArrowLeft", "ArrowRight", "+", "=", "-"].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        onViewChange?.(wrapAngle(yaw + (event.key === "ArrowLeft" ? -18 : event.key === "ArrowRight" ? 18 : 0)), pitch, clampFov(fov + (["+", "="].includes(event.key) ? -8 : event.key === "-" ? 8 : 0)));
    };
    return <>
        {status === "static" && <img className="tour360__canvas tour360__canvas--static" src={src} alt="Training area" />}
        <canvas ref={canvasRef} className="tour360__canvas" hidden={status === "static" || status === "error"}
            tabIndex={0} aria-label="360 degree training view. Drag to look around, use left and right arrows to turn, plus and minus to zoom."
            onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { dragRef.current = null; }}
            onPointerCancel={() => { dragRef.current = null; }} onLostPointerCapture={() => { dragRef.current = null; }} onKeyDown={keyDown} />
        {status === "static" && <div className="panorama-render-notice" role="status">360° rendering is unavailable on this device. You can still choose areas and training activities.</div>}
        {status === "error" && <div className="panorama-render-notice" role="alert">Area image unavailable. Use the area controls to continue.</div>}
    </>;
}
