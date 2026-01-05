"use client";

import { useEffect, useRef } from "react";

export interface FractalGlassProps {
  /** Number of glass stripes (higher = more refraction lines) */
  numStripes?: number;
  /** Displacement strength */
  strength?: number;
  /** Edge shadow intensity for 3D depth */
  shadowIntensity?: number;
  /** Film grain intensity */
  grainIntensity?: number;
  /** Animation duration in seconds (for gradient movement) */
  animationDuration?: number;
  /** Gradient colors array */
  gradientColors?: string[];
}

// Vertex shader - just passes through coordinates
const vertexShaderSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

// Fragment shader - dramatic fractal glass with depth shadows and grain
const fragmentShaderSource = `
  precision highp float;
  
  varying vec2 v_texCoord;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_numStripes;
  uniform float u_strength;
  uniform float u_shadowIntensity;
  uniform float u_grainIntensity;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform vec3 u_color4;
  
  // Pseudo-random function for grain
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Simplex-like noise for organic gradient shapes
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  // Fractal brownian motion for organic shapes
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  // Sawtooth wave for sharp ridge edges
  float sawtoothWave(float x, float frequency) {
    return fract(x * frequency);
  }
  
  // Create the vertical displacement with sharp edges
  float getDisplacement(float x, float y, float time) {
    float stripePhase = x * u_numStripes;
    
    // Sawtooth creates the sharp ridge look
    float saw = sawtoothWave(stripePhase, 1.0);
    
    // Add some variation along Y for organic feel
    float yVariation = sin(y * 3.0 + time * 0.5) * 0.1;
    
    // Create asymmetric displacement (more dramatic on one edge)
    float displacement = pow(saw, 0.5) * u_strength;
    displacement += yVariation * saw;
    
    return displacement;
  }
  
  // Calculate shadow for ridge edges (creates 3D depth)
  float getRidgeShadow(float x) {
    float stripePhase = fract(x * u_numStripes);
    
    // Dark shadow at the start of each ridge
    float shadow = smoothstep(0.0, 0.15, stripePhase);
    
    // Slight highlight at the peak
    float highlight = smoothstep(0.85, 1.0, stripePhase) * 0.3;
    
    return shadow - highlight;
  }
  
  // Create organic flowing gradient with blobs
  vec3 getOrganicGradient(vec2 uv, float time) {
    // Animate blob positions
    float t = time * 0.3;
    
    // Create multiple moving blob centers
    vec2 blob1 = vec2(0.3 + sin(t * 0.7) * 0.3, 0.3 + cos(t * 0.5) * 0.3);
    vec2 blob2 = vec2(0.7 + cos(t * 0.6) * 0.3, 0.6 + sin(t * 0.8) * 0.3);
    vec2 blob3 = vec2(0.5 + sin(t * 0.4) * 0.4, 0.8 + cos(t * 0.9) * 0.2);
    vec2 blob4 = vec2(0.2 + cos(t * 0.5) * 0.2, 0.7 + sin(t * 0.6) * 0.3);
    
    // Distance fields for each blob with noise distortion
    float noiseOffset = fbm(uv * 3.0 + t * 0.2) * 0.3;
    
    float d1 = length(uv - blob1 + noiseOffset) * 1.5;
    float d2 = length(uv - blob2 - noiseOffset) * 1.8;
    float d3 = length(uv - blob3 + noiseOffset * 0.5) * 1.3;
    float d4 = length(uv - blob4 - noiseOffset * 0.7) * 1.6;
    
    // Blend colors based on blob proximity
    float blend1 = 1.0 - smoothstep(0.0, 0.8, d1);
    float blend2 = 1.0 - smoothstep(0.0, 0.8, d2);
    float blend3 = 1.0 - smoothstep(0.0, 0.9, d3);
    float blend4 = 1.0 - smoothstep(0.0, 0.7, d4);
    
    // Dark base color
    vec3 baseColor = vec3(0.02, 0.02, 0.05);
    
    // Mix all colors
    vec3 color = baseColor;
    color = mix(color, u_color1, blend1);
    color = mix(color, u_color2, blend2 * 0.8);
    color = mix(color, u_color3, blend3 * 0.7);
    color = mix(color, u_color4, blend4 * 0.6);
    
    return color;
  }
  
  void main() {
    vec2 uv = v_texCoord;
    float time = u_time;
    
    // Get vertical displacement for this x position
    float displacement = getDisplacement(uv.x, uv.y, time);
    
    // Apply dramatic vertical stretching/smearing
    vec2 distortedUV = uv;
    distortedUV.y = uv.y - displacement * 0.4;
    
    // Add horizontal micro-displacement for extra detail
    float microDisp = sawtoothWave(uv.x * u_numStripes * 3.0, 1.0) * 0.01;
    distortedUV.x += microDisp;
    
    // Sample the organic gradient at distorted position
    vec3 color = getOrganicGradient(distortedUV, time);
    
    // Apply ridge shadows for 3D depth
    float shadow = getRidgeShadow(uv.x);
    float shadowMask = 1.0 - (1.0 - shadow) * u_shadowIntensity;
    color *= shadowMask;
    
    // Add bright highlights on ridge peaks
    float ridgeHighlight = 1.0 - sawtoothWave(uv.x * u_numStripes, 1.0);
    ridgeHighlight = pow(ridgeHighlight, 4.0);
    color += vec3(ridgeHighlight * 0.08);
    
    // Add film grain
    float grain = random(uv * u_resolution + time * 100.0);
    grain = (grain - 0.5) * u_grainIntensity;
    color += vec3(grain);
    
    // Slight overall contrast boost
    color = pow(color, vec3(0.95));
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ];
  }
  return [1, 0, 1]; // Magenta fallback
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export function FractalGlassBackground({
  numStripes = 50,
  strength = 1.5,
  shadowIntensity = 0.6,
  grainIntensity = 0.04,
  animationDuration = 12,
  gradientColors = ["#ec4899", "#fb7185", "#14b8a6", "#8b5cf6"],
}: FractalGlassProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: true });
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Create shaders
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    gl.useProgram(program);

    // Set up geometry - full screen quad
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    const texCoords = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

    // Position buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Texture coordinate buffer
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const numStripesLocation = gl.getUniformLocation(program, "u_numStripes");
    const strengthLocation = gl.getUniformLocation(program, "u_strength");
    const shadowIntensityLocation = gl.getUniformLocation(program, "u_shadowIntensity");
    const grainIntensityLocation = gl.getUniformLocation(program, "u_grainIntensity");
    const color1Location = gl.getUniformLocation(program, "u_color1");
    const color2Location = gl.getUniformLocation(program, "u_color2");
    const color3Location = gl.getUniformLocation(program, "u_color3");
    const color4Location = gl.getUniformLocation(program, "u_color4");

    // Parse colors
    const color1 = hexToRgb(gradientColors[0] || "#ec4899");
    const color2 = hexToRgb(gradientColors[1] || "#fb7185");
    const color3 = hexToRgb(gradientColors[2] || "#14b8a6");
    const color4 = hexToRgb(gradientColors[3] || "#8b5cf6");

    // Set static uniforms
    gl.uniform1f(numStripesLocation, numStripes);
    gl.uniform1f(strengthLocation, strength);
    gl.uniform1f(shadowIntensityLocation, shadowIntensity);
    gl.uniform1f(grainIntensityLocation, grainIntensity);
    gl.uniform3fv(color1Location, color1);
    gl.uniform3fv(color2Location, color2);
    gl.uniform3fv(color3Location, color3);
    gl.uniform3fv(color4Location, color4);

    // Handle resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Animation loop
    const startTime = performance.now();
    const animSpeed = (2 * Math.PI) / (animationDuration * 1000);

    const render = () => {
      const elapsed = performance.now() - startTime;
      gl.uniform1f(timeLocation, elapsed * animSpeed);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texCoordBuffer);
    };
  }, [
    numStripes,
    strength,
    shadowIntensity,
    grainIntensity,
    animationDuration,
    gradientColors,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
