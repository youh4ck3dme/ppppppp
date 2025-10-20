import React, { useRef, useEffect } from 'react';

interface LiquidTextProps {
  text: string;
}

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;

  // 2D Simplex Noise function by Ashima Arts
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    // Fix: Initialize vector 'g' to prevent potential GLSL compiler errors on some platforms.
    vec3 g = vec3(0.0, 0.0, 0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = v_uv;
    
    // Mouse interaction
    float distance = length(uv - u_mouse);
    float force = smoothstep(0.3, 0.0, distance) * 0.1;

    // Noise for watery effect
    float noise_val = snoise(uv * 4.0 + u_time * 0.1) * 0.005;

    // Apply distortion
    uv.x += noise_val + force * (u_mouse.x - uv.x);
    uv.y += noise_val + force * (u_mouse.y - uv.y);

    vec4 color = texture2D(u_texture, uv);

    gl_FragColor = color;
  }
`;

const LiquidText: React.FC<LiquidTextProps> = ({ text }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  // FIX: Initialize useRef with null to provide an argument and correctly type the ref.
  const requestRef = useRef<number | null>(null);

  const createTextTexture = (gl: WebGLRenderingContext, text: string, canvasWidth: number) => {
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    if (!textCtx) return null;

    const dpr = window.devicePixelRatio || 1;
    const padding = 20;
    const baseFontSize = Math.min(canvasWidth / (text.length * 0.7), 100);
    const font = `700 ${baseFontSize * dpr}px -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif`;

    textCtx.font = font;
    textCanvas.width = textCtx.measureText(text).width + padding * 2;
    textCanvas.height = baseFontSize * 1.5 * dpr;
    
    // Re-apply font after resize
    textCtx.font = font;
    textCtx.fillStyle = '#FFFFFF';
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';
    textCtx.fillText(text, textCanvas.width / 2, textCanvas.height / 2);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    return texture;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      time: gl.getUniformLocation(program, "u_time"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      texture: gl.getUniformLocation(program, "u_texture"),
    };

    const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement!.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

        textureRef.current = createTextTexture(gl, text, canvas.width / dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    let startTime = Date.now();
    const render = () => {
      if (!gl || !program) return;
      
      const currentTime = (Date.now() - startTime) / 1000;
      gl.uniform1f(uniforms.time, currentTime);
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(uniforms.resolution, gl.drawingBufferWidth, gl.drawingBufferHeight);
      
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      gl.uniform1i(uniforms.texture, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      requestRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      // FIX: Safely cancel animation frame to prevent errors on unmount.
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [text]);

  return <canvas ref={canvasRef} className="w-full h-24 md:h-32 lg:h-40" />;
};

export default LiquidText;
