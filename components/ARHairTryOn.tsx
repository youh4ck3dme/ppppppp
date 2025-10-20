import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useNotification } from '../hooks/useNotification';
import { useAuth } from '../context/AuthContext';
import { useSavedLooks } from '../context/SavedLooksContext';
import { Icon } from './Icons';
import { arHairColors } from '../constants';

declare const faceapi: any;

type CameraState = 'idle' | 'requesting' | 'active' | 'error';

const ARHairTryOn: React.FC = () => {
    const { t } = useTranslation();
    const { addNotification } = useNotification();
    const { isAuthenticated } = useAuth();
    const { saveLook } = useSavedLooks();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [isModelsLoaded, setIsModelsLoaded] = useState(false);
    const [cameraState, setCameraState] = useState<CameraState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<number[] | null>(arHairColors[4].value); // Default to blonde
    const [colorIntensity, setColorIntensity] = useState(0.7);

    useEffect(() => {
        const loadModels = async () => {
            if (typeof faceapi === 'undefined') {
                setTimeout(loadModels, 100); return;
            }
            try {
                const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                ]);
                setIsModelsLoaded(true);
            } catch (err) {
                console.error("Error loading face-api models:", err);
                setError(t('vto_face_api_error_message'));
                setCameraState('error'); // If models fail, camera can't work
            }
        };
        loadModels();
    }, [t]);

    const startCamera = useCallback(async () => {
        setError(null);
        setCameraState('requesting');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play().catch(playErr => {
                        console.error("Video play failed:", playErr);
                        setError(t('vto_ar_camera_error_message_generic'));
                        setCameraState('error');
                    });
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                if (err instanceof DOMException) {
                    switch (err.name) {
                        case 'NotAllowedError':
                            setError(t('vto_ar_camera_error_message_denied'));
                            break;
                        case 'NotFoundError':
                            setError(t('vto_ar_camera_error_message_not_found'));
                            break;
                        case 'NotReadableError':
                            setError(t('vto_ar_camera_error_message_in_use'));
                            break;
                        default:
                            setError(t('vto_ar_camera_error_message_generic'));
                    }
                } else {
                    setError(t('vto_ar_camera_error_message_generic'));
                }
                setCameraState('error');
            }
        } else {
            setError(t('vto_ar_camera_error_unsupported'));
            setCameraState('error');
        }
    }, [t]);

    useEffect(() => {
        // Cleanup function to stop camera and animation when component unmounts
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const drawHair = useCallback((landmarks: any, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        if (!selectedColor || selectedColor.length === 0) return;
        ctx.save();
        const jaw = landmarks.getJawOutline();
        const nose = landmarks.getNose();
        const leftEyebrow = landmarks.getLeftEyebrow();
        const rightEyebrow = landmarks.getRightEyebrow();
        
        const facePath = new Path2D();
        facePath.moveTo(jaw[0].x, jaw[0].y);
        for (let i = 1; i < jaw.length; i++) { facePath.lineTo(jaw[i].x, jaw[i].y); }
        const rightEyebrowUpper = rightEyebrow.slice(0, 5).reverse();
        const leftEyebrowUpper = leftEyebrow.slice(0, 5).reverse();
        facePath.lineTo(rightEyebrowUpper[0].x, rightEyebrowUpper[0].y);
        for (let i = 1; i < rightEyebrowUpper.length; i++) { facePath.lineTo(rightEyebrowUpper[i].x, rightEyebrowUpper[i].y); }
        for (let i = 0; i < leftEyebrowUpper.length; i++) { facePath.lineTo(leftEyebrowUpper[i].x, leftEyebrowUpper[i].y); }
        facePath.closePath();

        const headPath = new Path2D();
        const headTopY = Math.min(...leftEyebrow.map((p: any) => p.y), ...rightEyebrow.map((p: any) => p.y)) - (jaw[16].x - jaw[0].x) * 0.9;
        const headCenterX = nose[3].x;
        const headWidth = (jaw[16].x - jaw[0].x) * 1.2;
        const headHeight = (jaw[8].y - headTopY) * 1.1;
        headPath.ellipse(headCenterX, headTopY + headHeight / 2, headWidth / 2, headHeight / 2, 0, 0, 2 * Math.PI);
        
        ctx.clip(headPath);
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = `rgba(${selectedColor[0] * 255}, ${selectedColor[1] * 255}, ${selectedColor[2] * 255}, ${colorIntensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fill(facePath);
        
        ctx.restore();
    }, [selectedColor, colorIntensity]);

    // This unified effect now correctly handles camera state and animation loop.
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if (!isModelsLoaded || !video || !canvas) {
            return;
        }
    
        const processFrame = async () => {
            // Ensure the loop stops if the video is no longer playing
            if (!videoRef.current || video.paused || video.ended) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
                return;
            }
    
            const detections = await faceapi.detectSingleFace(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 })).withFaceLandmarks();
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
    
            // Ensure canvas dimensions match video dimensions
            if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
                canvas.width = displaySize.width;
                canvas.height = displaySize.height;
            }
    
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.save();
                context.scale(-1, 1); // Mirror the video feed
                context.translate(-canvas.width, 0);
                context.drawImage(video, 0, 0, displaySize.width, displaySize.height);
                context.restore();
    
                if (detections) {
                    const mirroredDetections = faceapi.resizeResults(detections, { width: canvas.width, height: canvas.height });
                    mirroredDetections.landmarks.positions.forEach((p: any) => { p.x = canvas.width - p.x; });
                    drawHair(mirroredDetections.landmarks, context, canvas);
                }
            }
    
            animationFrameRef.current = requestAnimationFrame(processFrame);
        };
    
        const handleVideoPlay = () => {
            setCameraState('active');
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(processFrame);
        };
    
        video.addEventListener('playing', handleVideoPlay);
    
        // Cleanup function for this effect
        return () => {
            video.removeEventListener('playing', handleVideoPlay);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isModelsLoaded, drawHair]);


    const handleTakeSnapshot = () => {
        if (canvasRef.current) {
            const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
            saveLook(imageDataUrl);
            addNotification({ type: 'success', title: t('vto_lookSaved_title'), message: t('vto_lookSaved_message') });
        }
    };
    
    const renderContent = () => {
        if (!isModelsLoaded && cameraState !== 'error') {
            return (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <Icon id="loader" className="w-12 h-12 text-gray-500 animate-spin" />
                    <p className="mt-4 text-white">{t('vto_face_api_loading_models')}</p>
                </div>
            );
        }

        switch (cameraState) {
            case 'idle':
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                        <Icon id="camera" className="w-16 h-16 text-gray-500 mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">{t('vto_ar_idle_title')}</h3>
                        <p className="text-gray-400 mb-6 max-w-sm">{t('vto_ar_idle_description')}</p>
                        <button onClick={startCamera} className="btn-primary">
                            <span>{t('vto_ar_start_camera_button')}</span>
                        </button>
                    </div>
                );
            case 'requesting':
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                        <Icon id="loader" className="w-12 h-12 text-gray-500 animate-spin" />
                        <p className="mt-4 text-white">Spúšťam kameru...</p>
                    </div>
                );
            case 'error':
                return (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-red-400 p-8">
                        <Icon id="alert-triangle" className="w-12 h-12 mb-4" />
                        <p>{error || t('api_unexpectedError')}</p>
                        <button onClick={startCamera} className="vto-action-btn mt-6 !text-white !border-white hover:!bg-white/10">
                            {t('vto_ar_retry_camera_button')}
                        </button>
                    </div>
                );
            case 'active':
                return (
                    <div className="relative w-full max-w-lg mx-auto aspect-[4/5] rounded-lg overflow-hidden bg-[var(--color-input-bg)]">
                        <video ref={videoRef} autoPlay playsInline muted className="absolute opacity-0 pointer-events-none" />
                        <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                );
        }
    };

    return (
        <div className="p-4 sm:p-6 flex flex-col items-center gap-8 animate-fade-in-up">
            {renderContent()}
            {cameraState === 'active' && (
                <>
                    <div className="flex flex-wrap justify-center gap-3">
                        {arHairColors.map(color => (
                            <button
                                key={t(color.nameId)}
                                onClick={() => setSelectedColor(color.value.length === 0 ? null : color.value)}
                                className={`ar-color-swatch ${JSON.stringify(selectedColor) === JSON.stringify(color.value) ? 'active' : 'inactive'}`}
                                style={{
                                    backgroundColor: color.value.length > 0 ? `rgb(${color.value[0]*255}, ${color.value[1]*255}, ${color.value[2]*255})` : 'transparent',
                                    backgroundImage: color.value.length === 0 ? 'linear-gradient(to top right, transparent 48%, red 48%, red 52%, transparent 52%)' : 'none',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '100% 100%'
                                }}
                                aria-label={t(color.nameId)}
                            />
                        ))}
                    </div>
                    <div className="w-full max-w-xs px-4">
                        <label htmlFor="intensity-slider" className="text-sm font-medium text-white">{t('vto_ar_intensity_label')}</label>
                        <input
                            id="intensity-slider"
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={colorIntensity}
                            onChange={(e) => setColorIntensity(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                            disabled={!selectedColor}
                            aria-label={t('vto_ar_intensity_label')}
                        />
                    </div>
                    {isAuthenticated && (
                        <div className="vto-actions">
                            <button onClick={handleTakeSnapshot} className="vto-action-btn">
                                <Icon id="camera" className="w-5 h-5"/>
                                {t('vto_button_takeSnapshot')}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ARHairTryOn;
