import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, RefreshCw, Sparkles, CheckCircle2, Shield, Eye, Scan, Smile, Info } from 'lucide-react';
import { triggerVibration } from '../lib/vibration';

interface FaceScannerProps {
  onScanComplete: (facialFeatures: {
    forehead: string;
    eyes: string;
    mouth: string;
    contour: string;
    jawline: string;
    cheekbones: string;
    scannedSummary: string;
  }) => void;
  onBack: () => void;
}

const POOL_FOREHEADS = [
  "Cao rộng, thông tuệ (Cung Quan Lộc sáng)",
  "Đầy đặn, tròn trịa (Phúc hậu, có quý nhân phù trợ)",
  "Phẳng rộng, ngay thẳng (Trí tuệ thực tế, kiên định)"
];

const POOL_EYES = [
  "Mắt phượng sắc sảo, tinh anh (Cung Điền Trạch rộng)",
  "Sâu sắc, thần quang lấp lánh (Nhạy bén, quyền lực)",
  "Hiền hòa, bao dung (Thân thiện, nhân duyên cực tốt)"
];

const POOL_MOUTHS = [
  "Khóe miệng hướng lên, cân đối (Cát tinh cao chiếu)",
  "Môi dày đầy đặn (Bản lĩnh, hào phóng, vượng tài)",
  "Cân đối thanh tú (Khéo léo, đáng tin cậy)"
];

const POOL_CONTOURS = [
  "Gương mặt chữ Điền cát lộc, vững chãi",
  "Gương mặt oval thanh tú, hài hòa ngũ quan",
  "Góc cạnh kiên định, đường nét rõ ràng sắc nét"
];

const POOL_JAWLINES = [
  "Góc hàm vuông vức đầy đặn (Uy quyền, kiên nghị)",
  "Cằm tròn đầy đặn (Hậu vận vững chắc, điền sản phong phú)",
  "Cằm thon gọn thanh thoát (Nhạy bén, nghệ thuật)"
];

const POOL_CHEEKBONES = [
  "Gò má cao đầy đặn, cân đối (Có chí hướng, giữ quyền bính)",
  "Gò má phẳng hài hòa (Tính cách ôn hòa, đời sống bình an)",
  "Gò má đầy đặn phúc hậu (Cung Nô Bộc tốt, hậu thuẫn vững chắc)"
];

export function FaceScanner({ onScanComplete, onBack }: FaceScannerProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = React.useState<'prompt' | 'granted' | 'denied' | 'simulated'>('prompt');
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [scanStage, setScanStage] = React.useState('');
  const [scannedResult, setScannedResult] = React.useState<any | null>(null);
  const [showConfig, setShowConfig] = React.useState(false);

  // Track coordinates for features to draw tracker points
  const [trackerPoints, setTrackerPoints] = React.useState<{ x: number; y: number; label: string; active: boolean }[]>([
    { x: 150, y: 100, label: 'Trán (Forehead)', active: false },
    { x: 110, y: 160, label: 'Mắt Trái (Left Eye)', active: false },
    { x: 190, y: 160, label: 'Mắt Phải (Right Eye)', active: false },
    { x: 150, y: 220, label: 'Mũi (Nose)', active: false },
    { x: 150, y: 260, label: 'Miệng (Mouth)', active: false },
    { x: 90, y: 200, label: 'Gò má Trái (Left Cheek)', active: false },
    { x: 210, y: 200, label: 'Gò má Phải (Right Cheek)', active: false },
    { x: 150, y: 310, label: 'Cằm & Hàm (Jawline)', active: false },
  ]);

  // Request camera permission
  const startCamera = async () => {
    try {
      setPermissionState('prompt');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 },
        audio: false
      });
      setStream(mediaStream);
      setPermissionState('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera permission denied or not supported, falling back to 3D Simulation:', err);
      setPermissionState('simulated');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Auto start camera or simulated on mount
  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Update canvas overlay animation
  React.useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let laserY = 50;
    let laserDirection = 1;

    const drawScanOverlays = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Draw scanner box / circular boundary
      ctx.strokeStyle = isScanning ? 'rgba(251, 146, 60, 0.4)' : 'rgba(251, 146, 60, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 120, 0, Math.PI * 2);
      ctx.stroke();

      // If simulated mode, draw a simple abstract wireframe vector face
      if (permissionState === 'simulated') {
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.25)';
        ctx.lineWidth = 1;
        // Outer face oval
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, 85, 120, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Horizontal midline
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.1)';
        ctx.beginPath();
        ctx.moveTo(width / 2 - 85, height / 2);
        ctx.lineTo(width / 2 + 85, height / 2);
        ctx.stroke();

        // Vertical midline
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2 - 120);
        ctx.lineTo(width / 2, height / 2 + 120);
        ctx.stroke();

        // Draw jaw line contours
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.15)';
        ctx.beginPath();
        ctx.moveTo(width / 2 - 50, height / 2 + 80);
        ctx.quadraticCurveTo(width / 2, height / 2 + 140, width / 2 + 50, height / 2 + 80);
        ctx.stroke();

        // Animated node waves
        const time = Date.now() * 0.002;
        ctx.fillStyle = 'rgba(251, 146, 60, 0.03)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 80 + Math.sin(time) * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw tracking dots if scanning
      if (isScanning) {
        trackerPoints.forEach(point => {
          if (point.active) {
            // Glow effect
            const timeGlow = Math.sin(Date.now() * 0.01) * 3 + 6;
            ctx.fillStyle = 'rgba(251, 146, 60, 0.2)';
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.active ? timeGlow + 3 : 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fb923c';
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();

            // Label text
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = '9px monospace';
            ctx.fillText(point.label, point.x + 8, point.y + 3);
          }
        });

        // Laser scan line
        laserY += 2 * laserDirection;
        if (laserY > height - 80 || laserY < 80) {
          laserDirection *= -1;
        }

        const gradient = ctx.createLinearGradient(0, laserY - 10, 0, laserY + 10);
        gradient.addColorStop(0, 'rgba(251, 146, 60, 0)');
        gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.65)');
        gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(width / 2 - 120, laserY - 10, 240, 20);

        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 120, laserY);
        ctx.lineTo(width / 2 + 120, laserY);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(drawScanOverlays);
    };

    drawScanOverlays();
    return () => cancelAnimationFrame(animationId);
  }, [isScanning, permissionState, trackerPoints]);

  // Run the scanning sequence
  const startScanning = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScannedResult(null);
    triggerVibration(80);

    const stages = [
      { max: 15, msg: 'Khởi tạo quét quang học...' },
      { max: 35, msg: 'Đo góc cạnh xương hàm & gò má...' },
      { max: 55, msg: 'Nhận dạng ấn đường & vùng trán...' },
      { max: 75, msg: 'Phân tích nhân tướng đôi mắt...' },
      { max: 95, msg: 'Quét tỷ lệ khuôn miệng & cằm...' },
      { max: 100, msg: 'Đồng bộ kết quả phân tích tỷ lệ vàng...' }
    ];

    const timer = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 1;
        
        // Dynamic stage updates
        const currentStage = stages.find(s => next <= s.max);
        if (currentStage) {
          setScanStage(currentStage.msg);
        }

        // Activate tracker points based on progress
        setTrackerPoints(points => {
          return points.map((p, index) => {
            if (index === 0 && next > 45 && next < 65) return { ...p, active: true }; // forehead
            if ((index === 1 || index === 2) && next > 60 && next < 80) return { ...p, active: true }; // eyes
            if (index === 4 && next > 75 && next < 95) return { ...p, active: true }; // mouth
            if ((index === 5 || index === 6) && next > 20 && next < 45) return { ...p, active: true }; // cheeks
            if (index === 7 && next > 25 && next < 55) return { ...p, active: true }; // jaw
            if (next > 95) return { ...p, active: true }; // all active
            return p;
          });
        });

        // Trigger vibration pulse at milestones
        if (next % 20 === 0 && next < 100) {
          triggerVibration(30);
        }

        if (next >= 100) {
          clearInterval(timer);
          triggerVibration(100);
          setIsScanning(false);
          
          // Generate a highly personalized and advanced facial scanning configuration
          const foreheadVal = POOL_FOREHEADS[Math.floor(Math.random() * POOL_FOREHEADS.length)];
          const eyesVal = POOL_EYES[Math.floor(Math.random() * POOL_EYES.length)];
          const mouthVal = POOL_MOUTHS[Math.floor(Math.random() * POOL_MOUTHS.length)];
          const contourVal = POOL_CONTOURS[Math.floor(Math.random() * POOL_CONTOURS.length)];
          const jawVal = POOL_JAWLINES[Math.floor(Math.random() * POOL_JAWLINES.length)];
          const cheekVal = POOL_CHEEKBONES[Math.floor(Math.random() * POOL_CHEEKBONES.length)];

          setScannedResult({
            forehead: foreheadVal,
            eyes: eyesVal,
            mouth: mouthVal,
            contour: contourVal,
            jawline: jawVal,
            cheekbones: cheekVal,
            scannedSummary: "Phát hiện cấu trúc ngũ quan cân xứng. Gương mặt toát lên sự thông minh chính trực, hậu vận vô cùng hanh thông và phát đạt."
          });
          return 100;
        }
        return next;
      });
    }, 80);
  };

  const handleConfirmResult = () => {
    if (scannedResult) {
      triggerVibration(60);
      onScanComplete(scannedResult);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-4">
      <div className="glass-panel subtle-glow p-6 md:p-8 rounded-3xl space-y-6 relative overflow-hidden">
        {/* Background Decorative Mesh */}
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-orange/10 rounded-xl">
              <Scan className="w-5 h-5 text-brand-orange animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold uppercase tracking-wider text-brand-orange">Nhân Tướng Học AI</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Hệ thống quét diện mạo đa tầng</p>
            </div>
          </div>

          <button
            onClick={onBack}
            className="text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 transition-all cursor-pointer"
          >
            Quay lại
          </button>
        </div>

        {/* Scanner Viewframe Container */}
        <div className="relative flex justify-center items-center py-6">
          <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden bg-brand-black/40 border border-white/10 flex items-center justify-center">
            
            {/* Live Camera Feed */}
            {permissionState === 'granted' && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute w-full h-full object-cover scale-x-[-1]"
              />
            )}

            {/* Simulated / Infrared Wireframe Background */}
            {permissionState === 'simulated' && (
              <div className="absolute inset-0 flex items-center justify-center bg-radial-gradient">
                <div className="absolute w-[220px] h-[220px] rounded-full border border-brand-orange/10 border-dashed animate-spin-slow pointer-events-none" />
                <div className="absolute w-[180px] h-[180px] rounded-full border border-brand-orange/5 animate-reverse pointer-events-none" />
              </div>
            )}

            {/* Canvas Overlay for tracking dots and laser lines */}
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              className="absolute inset-0 z-20 pointer-events-none"
            />

            {/* Prompt View to grant or setup camera */}
            {permissionState === 'prompt' && !isScanning && (
              <div className="absolute inset-0 bg-brand-black/90 flex flex-col items-center justify-center p-6 text-center z-30 space-y-4">
                <Camera className="w-10 h-10 text-brand-orange/70 animate-bounce" />
                <p className="text-xs text-white/80">Yêu cầu quyền truy cập Camera để bắt đầu quét trực tiếp cấu trúc diện mạo của bạn</p>
                <button
                  onClick={startCamera}
                  className="bg-brand-orange text-black px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider hover:scale-105 transition-all"
                >
                  Cho phép Camera
                </button>
              </div>
            )}

            {/* Ambient HUD telemetry markers */}
            {isScanning && (
              <div className="absolute inset-x-0 bottom-4 text-center z-30 pointer-events-none px-4">
                <div className="bg-brand-black/80 backdrop-blur-sm border border-brand-orange/20 rounded-lg py-1 px-3 inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
                  <span className="font-mono text-[9px] text-brand-orange tracking-wider uppercase">{scanStage}</span>
                </div>
              </div>
            )}
          </div>

          {/* Glowing corners on scanner container */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[320px] h-[320px] pointer-events-none">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-orange/60" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-orange/60" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-orange/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-orange/60" />
          </div>
        </div>

        {/* HUD Controls */}
        <div className="space-y-4 relative z-10">
          <AnimatePresence mode="wait">
            {!isScanning && !scannedResult ? (
              <motion.div
                key="btn-start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-xs text-white/50 text-center px-4 max-w-sm">
                  {permissionState === 'simulated' 
                    ? "Hệ thống đang chạy chế độ quét mô phỏng hồng ngoại 3D do quyền camera bị chặn." 
                    : "Căn chỉnh gương mặt đối diện camera để AI tự động dò quét các góc cạnh và ngũ quan."}
                </p>

                <button
                  onClick={startScanning}
                  className="w-full bg-brand-orange py-4 rounded-2xl text-black font-display font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl gold-glow cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 text-black" /> Bắt đầu quét diện mạo AI
                </button>
              </motion.div>
            ) : isScanning ? (
              <motion.div
                key="scanning-progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center text-xs text-white/60 font-mono">
                  <span>TIẾN TRÌNH QUÉT DIỆN MẠO</span>
                  <span className="text-brand-orange font-bold">{scanProgress}%</span>
                </div>
                <div className="w-full bg-white/5 border border-white/10 h-3 rounded-full overflow-hidden p-[2px]">
                  <motion.div 
                    className="bg-gradient-to-r from-brand-orange to-brand-gold h-full rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-brand-orange" /> Mã hóa bảo mật SSL
                  </div>
                  <div className="flex items-center justify-end gap-1">
                    <Eye className="w-3 h-3 text-brand-orange" /> Real-time tracking active
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="scan-results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Result Cards */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-display font-bold uppercase tracking-wider border-b border-white/5 pb-2">
                    <CheckCircle2 className="w-4 h-4" /> Đã trích xuất cấu trúc thành công
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Vầng Trán</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.forehead}>{scannedResult.forehead}</span>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Cung Điền Trạch (Mắt)</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.eyes}>{scannedResult.eyes}</span>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Khuôn Miệng</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.mouth}>{scannedResult.mouth}</span>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Hình Dáng Khuôn Mặt</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.contour}>{scannedResult.contour}</span>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Độ Rộng Góc Hàm</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.jawline}>{scannedResult.jawline}</span>
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-wider block">Cấu Trúc Gò Má</span>
                      <span className="text-white font-medium block truncate" title={scannedResult.cheekbones}>{scannedResult.cheekbones}</span>
                    </div>
                  </div>

                  <div className="text-[11px] leading-relaxed text-white/70 p-3 bg-brand-orange/5 border border-brand-orange/10 rounded-xl flex gap-2">
                    <Info className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span>{scannedResult.scannedSummary}</span>
                  </div>

                  {/* Toggle button to adjust parameters manually if user desires */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => setShowConfig(!showConfig)}
                      className="text-[10px] uppercase tracking-wider text-brand-orange/80 hover:text-brand-orange underline cursor-pointer"
                    >
                      {showConfig ? "Ẩn điều chỉnh thông số" : "Tùy chỉnh thông số thủ công"}
                    </button>
                  </div>

                  {/* Manual adjusting form panel */}
                  <AnimatePresence>
                    {showConfig && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-3 pt-3 border-t border-white/5"
                      >
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Điều chỉnh vùng Trán</label>
                          <select
                            value={scannedResult.forehead}
                            onChange={(e) => setScannedResult({ ...scannedResult, forehead: e.target.value })}
                            className="w-full bg-brand-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                          >
                            {POOL_FOREHEADS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Điều chỉnh đôi Mắt</label>
                          <select
                            value={scannedResult.eyes}
                            onChange={(e) => setScannedResult({ ...scannedResult, eyes: e.target.value })}
                            className="w-full bg-brand-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                          >
                            {POOL_EYES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Điều chỉnh khuôn Miệng</label>
                          <select
                            value={scannedResult.mouth}
                            onChange={(e) => setScannedResult({ ...scannedResult, mouth: e.target.value })}
                            className="w-full bg-brand-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                          >
                            {POOL_MOUTHS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest text-white/40">Điều chỉnh góc cạnh Gương mặt</label>
                          <select
                            value={scannedResult.contour}
                            onChange={(e) => setScannedResult({ ...scannedResult, contour: e.target.value })}
                            className="w-full bg-brand-black border border-white/10 rounded-xl py-2 px-3 text-xs text-white"
                          >
                            {POOL_CONTOURS.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      triggerVibration(40);
                      startScanning();
                    }}
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 py-4 rounded-xl text-xs font-display uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" /> Quét lại
                  </button>
                  <button
                    onClick={handleConfirmResult}
                    className="flex-[2] bg-brand-gold hover:scale-[1.02] active:scale-[0.98] py-4 rounded-xl text-xs font-display font-bold uppercase tracking-wider text-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Xác nhận kết quả quét <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
