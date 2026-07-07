import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

// 🚉 10行分のでんしゃ画像をインポート
import trainA from './train_a.png';
import trainKa from './train_ka.png';
import trainSa from './train_sa.png';
import trainTa from './train_ta.png';
import trainNa from './train_na.png';
import trainHa from './train_ha.png';
import trainMa from './train_ma.png';
import trainYa from './train_ya.png';
import trainRa from './train_ra.png';
import trainWa from './train_wa.png';

// ==========================================
// 🚉 50音完全データ
// ==========================================
interface NodePoint { x: number; y: number; }
interface CharData { id: string; name: string; row: string; nodes: NodePoint[][]; }

const ALL_CHARS: CharData[] = [
  { id: 'a', name: 'あ', row: 'あ', nodes: [[{x:140,y:180},{x:340,y:170}], [{x:245,y:110},{x:240,y:250},{x:235,y:390}], [{x:290,y:220},{x:160,y:310},{x:180,y:400},{x:320,y:360},{x:270,y:240},{x:240,y:350}]] },
  { id: 'i', name: 'い', row: 'あ', nodes: [[{x:160,y:160},{x:150,y:280},{x:180,y:350}], [{x:310,y:190},{x:330,y:290}]] },
  { id: 'u', name: 'う', row: 'あ', nodes: [[{x:220,y:130},{x:280,y:160}], [{x:180,y:220},{x:310,y:230},{x:280,y:350},{x:200,y:410}]] },
  { id: 'e', name: 'え', row: 'あ', nodes: [[{x:230,y:110},{x:270,y:140}], [{x:160,y:220},{x:330,y:210},{x:170,y:370},{x:300,y:340},{x:340,y:390}]] },
  { id: 'o', name: 'お', row: 'あ', nodes: [[{x:140,y:190},{x:310,y:180}], [{x:230,y:120},{x:225,y:280},{x:150,y:300},{x:200,y:250},{x:320,y:290},{x:250,y:400}], [{x:315,y:130},{x:345,y:185}]] },
  { id: 'ka', name: 'か', row: 'か', nodes: [[{x:160,y:180},{x:280,y:160},{x:330,y:240}], [{x:260,y:110},{x:220,y:380}], [{x:330,y:140},{x:360,y:210}]] },
  { id: 'ki', name: 'き', row: 'か', nodes: [[{x:160,y:170},{x:320,y:160}], [{x:150,y:230},{x:330,y:220}], [{x:250,y:110},{x:210,y:340}], [{x:180,y:350},{x:280,y:380}]] },
  { id: 'ku', name: 'く', row: 'か', nodes: [[{x:160,y:180},{x:330,y:260},{x:160,y:340}]] },
  { id: 'ke', name: 'け', row: 'か', nodes: [[{x:160,y:140},{x:140,y:360}], [{x:210,y:180},{x:340,y:170}], [{x:280,y:120},{x:310,y:380}]] },
  { id: 'ko', name: 'こ', row: 'か', nodes: [[{x:160,y:200},{x:320,y:190}], [{x:160,y:320},{x:320,y:340}]] },
  { id: 'sa', name: 'さ', row: 'さ', nodes: [[{x:150,y:170},{x:330,y:150}], [{x:240,y:110},{x:200,y:340}], [{x:180,y:350},{x:280,y:380}]] },
  { id: 'shi', name: 'し', row: 'さ', nodes: [[{x:210,y:130},{x:210,y:320},{x:340,y:310}]] },
  { id: 'su', name: 'す', row: 'さ', nodes: [[{x:140,y:190},{x:340,y:180}], [{x:250,y:110},{x:250,y:250},{x:180,y:280},{x:250,y:300},{x:230,y:410}]] },
  { id: 'se', name: 'せ', row: 'さ', nodes: [[{x:140,y:220},{x:340,y:200}], [{x:300,y:120},{x:310,y:340}], [{x:210,y:140},{x:180,y:330}]] },
  { id: 'so', name: 'そ', row: 'さ', nodes: [[{x:160,y:160},{x:320,y:160},{x:160,y:290},{x:320,y:280},{x:200,y:390}]] },
  { id: 'ta', name: 'た', row: 'た', nodes: [[{x:140,y:190},{x:270,y:180}], [{x:220,y:110},{x:190,y:320}], [{x:280,y:220},{x:350,y:210}], [{x:280,y:310},{x:350,y:290}]] },
  { id: 'chi', name: 'ち', row: 'た', nodes: [[{x:140,y:170},{x:330,y:160}], [{x:230,y:110},{x:170,y:260},{x:330,y:260},{x:260,y:380}]] },
  { id: 'tsu', name: 'つ', row: 'た', nodes: [[{x:150,y:180},{x:340,y:190},{x:310,y:320},{x:220,y:390}]] },
  { id: 'te', name: 'て', row: 'た', nodes: [[{x:140,y:170},{x:330,y:165},{x:180,y:280},{x:310,y:370}]] },
  { id: 'to', name: 'と', row: 'た', nodes: [[{x:260,y:140},{x:220,y:240}], [{x:160,y:270},{x:330,y:290},{x:330,y:340}]] },
  { id: 'na', name: 'な', row: 'な', nodes: [[{x:140,y:180},{x:260,y:170}], [{x:210,y:110},{x:180,y:310}], [{x:300,y:140},{x:330,y:190}], [{x:250,y:270},{x:340,y:400}]] },
  { id: 'ni', name: 'に', row: 'な', nodes: [[{x:160,y:150},{x:145,y:350}], [{x:240,y:190},{x:350,y:180}], [{x:250,y:290},{x:340,y:280}]] },
  { id: 'nu', name: 'ぬ', row: 'な', nodes: [[{x:160,y:160},{x:250,y:320},{x:180,y:360},{x:340,y:320},{x:300,y:400}]] },
  { id: 'ne', name: 'ね', row: 'な', nodes: [[{x:170,y:140},{x:170,y:380}], [{x:140,y:210},{x:320,y:190},{x:180,y:350},{x:280,y:280},{x:300,y:380}]] },
  { id: 'no', name: 'の', row: 'な', nodes: [[{x:270,y:230},{x:170,y:310},{x:240,y:400},{x:370,y:300},{x:210,y:160}]] },
  { id: 'ha', name: 'は', row: 'は', nodes: [[{x:160,y:150},{x:145,y:350}], [{x:220,y:180},{x:340,y:170}], [{x:280,y:120},{x:280,y:300},{x:230,y:350},{x:310,y:380}]] },
  { id: 'hi', name: 'ひ', row: 'は', nodes: [[{x:130,y:180},{x:250,y:140},{x:340,y:180},{x:190,y:330},{x:350,y:250}]] },
  { id: 'fu', name: 'ふ', row: 'は', nodes: [[{x:250,y:110},{x:230,y:160}], [{x:160,y:220},{x:130,y:320}], [{x:190,y:340},{x:250,y:400}], [{x:320,y:260},{x:370,y:340}]] },
  { id: 'he', name: 'へ', row: 'は', nodes: [[{x:130,y:320},{x:230,y:170},{x:380,y:340}]] },
  { id: 'ho', name: 'ほ', row: 'は', nodes: [[{x:140,y:140},{x:130,y:360}], [{x:210,y:150},{x:340,y:140}], [{x:210,y:220},{x:340,y:210}], [{x:280,y:100},{x:280,y:300},{x:220,y:340},{x:320,y:390}]] },
  { id: 'ma', name: 'ま', row: 'ま', nodes: [[{x:150,y:160},{x:340,y:155}], [{x:150,y:230},{x:340,y:220}], [{x:250,y:100},{x:250,y:310},{x:190,y:350},{x:290,y:390}]] },
  { id: 'mi', name: 'み', row: 'ま', nodes: [[{x:130,y:160},{x:330,y:150},{x:170,y:340},{x:270,y:320}], [{x:290,y:110},{x:270,y:390}]] },
  { id: 'mu', name: 'む', row: 'ま', nodes: [[{x:130,y:180},{x:330,y:170}], [{x:230,y:110},{x:230,y:310},{x:170,y:350},{x:330,y:350}], [{x:330,y:120},{x:370,y:180}]] },
  { id: 'me', name: 'め', row: 'ま', nodes: [[{x:170,y:150},{x:220,y:360}], [{x:250,y:110},{x:170,y:270},{x:270,y:380},{x:360,y:260}]] },
  { id: 'mo', name: 'も', row: 'ま', nodes: [[{x:250,y:110},{x:250,y:330},{x:330,y:320}], [{x:160,y:170},{x:330,y:160}], [{x:160,y:240},{x:330,y:230}]] },
  { id: 'ya', name: 'や', row: 'や', nodes: [[{x:150,y:220},{x:330,y:190},{x:290,y:380}], [{x:260,y:110},{x:280,y:160}], [{x:320,y:120},{x:230,y:400}]] },
  { id: 'yu', name: 'ゆ', row: 'や', nodes: [[{x:160,y:180},{x:140,y:320},{x:270,y:320},{x:260,y:140}], [{x:300,y:120},{x:300,y:400}]] },
  { id: 'yo', name: 'よ', row: 'や', nodes: [[{x:140,y:190},{x:310,y:180}], [{x:260,y:110},{x:260,y:300},{x:200,y:340},{x:290,y:380}]] },
  { id: 'ra', name: 'ら', row: 'ら', nodes: [[{x:210,y:120},{x:270,y:140}], [{x:170,y:230},{x:290,y:230},{x:290,y:340},{x:190,y:400}]] },
  { id: 'ri', name: 'り', row: 'ら', nodes: [[{x:180,y:150},{x:170,y:300}], [{x:310,y:130},{x:320,y:390}]] },
  { id: 'ru', name: 'る', row: 'ら', nodes: [[{x:150,y:160},{x:340,y:155},{x:170,y:310},{x:290,y:320},{x:230,y:400}]] },
  { id: 're', name: 'れ', row: 'ら', nodes: [[{x:160,y:140},{x:160,y:390}], [{x:130,y:210},{x:340,y:200},{x:170,y:370},{x:280,y:330},{x:370,y:390}]] },
  { id: 'ro', name: 'ろ', row: 'ら', nodes: [[{x:150,y:160},{x:340,y:155},{x:170,y:310},{x:330,y:330}]] },
  { id: 'wa', name: 'わ', row: 'わ', nodes: [[{x:160,y:140},{x:160,y:390}], [{x:130,y:210},{x:340,y:200},{x:170,y:370},{x:290,y:330},{x:330,y:400}]] },
  { id: 'wo', name: 'を', row: 'わ', nodes: [[{x:130,y:170},{x:350,y:160}], [{x:250,y:110},{x:180,y:320}], [{x:180,y:260},{x:340,y:260},{x:260,y:400}]] },
  { id: 'n',  name: 'ん', row: 'わ', nodes: [[{x:150,y:220},{x:270,y:390},{x:210,y:140},{x:370,y:320}]] }
];

const GROUPS = ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'];
const STROKE_COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa500']; 
const CANVAS_SIZE = 500;

const getTrainImage = (group: string) => {
  switch (group) {
    case 'あ': return trainA;
    case 'か': return trainKa;
    case 'さ': return trainSa;
    case 'た': return trainTa;
    case 'な': return trainNa;
    case 'は': return trainHa;
    case 'ま': return trainMa;
    case 'や': return trainYa;
    case 'ら': return trainRa;
    case 'わ': return trainWa;
    default: return trainA;
  }
};

export default function App() {
  const [screenMode, setScreenMode] = useState<'GROUP' | 'SELECT' | 'TRAIN' | 'COLOR'>('GROUP');
  const [currentGroup, setCurrentGroup] = useState<string>('あ');
  const [selectedChar, setSelectedChar] = useState<CharData>(ALL_CHARS[0]);
  const [clearedChars, setClearedChars] = useState<string[]>([]);
  
  const [strokeIdx, setStrokeIdx] = useState<number>(0); 
  const [coverPercent, setCoverPercent] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const userCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{x: number, y: number, time: number} | null>(null);
  const hitDistanceRef = useRef(0);
  const lastCalcTimeRef = useRef(0);
  const strokeIdxRef = useRef(0); 

  // ぬりえ用
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentColor, setCurrentColor] = useState('#ff4757');
  const [brushSize, setBrushSize] = useState(24); 
  const isPaintingRef = useRef(false);
  const paintLastPointRef = useRef<{x: number, y: number} | null>(null);

  const groupChars = ALL_CHARS.filter(c => c.row === currentGroup);
  const isGroupCleared = groupChars.every(c => clearedChars.includes(c.id));

  useEffect(() => { strokeIdxRef.current = strokeIdx; }, [strokeIdx]);

  // --- なぞり書き用キャンバス初期化 ---
  const initCanvases = useCallback((force = false) => {
    const mainCtx = canvasRef.current?.getContext('2d');
    const hitCtx = hitCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    const userCtx = userCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    
    if (!mainCtx || !hitCtx || !userCtx) return;

    const dpr = window.devicePixelRatio || 1;
    [canvasRef.current!, hitCanvasRef.current!, userCanvasRef.current!].forEach(c => {
      c.width = CANVAS_SIZE * dpr; c.height = CANVAS_SIZE * dpr;
    });

    mainCtx.setTransform(1, 0, 0, 1, 0, 0); hitCtx.setTransform(1, 0, 0, 1, 0, 0); userCtx.setTransform(1, 0, 0, 1, 0, 0);
    mainCtx.scale(dpr, dpr); hitCtx.scale(dpr, dpr); userCtx.scale(dpr, dpr);
    mainCtx.lineCap = 'round'; mainCtx.lineJoin = 'round';
    userCtx.lineCap = 'round'; userCtx.lineJoin = 'round';

    mainCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    hitCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    userCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    mainCtx.strokeStyle = '#cbd5e1'; mainCtx.lineWidth = 1; mainCtx.strokeRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    mainCtx.strokeStyle = '#e2e8f0'; mainCtx.lineWidth = 2; mainCtx.setLineDash([10, 8]);
    mainCtx.beginPath(); mainCtx.moveTo(CANVAS_SIZE/2, 0); mainCtx.lineTo(CANVAS_SIZE/2, CANVAS_SIZE); mainCtx.moveTo(0, CANVAS_SIZE/2); mainCtx.lineTo(CANVAS_SIZE, CANVAS_SIZE/2); mainCtx.stroke(); mainCtx.setLineDash([]);

    const fontStr = "bold 310px 'UD Digital Kyokasho NK-R', 'UD Digi Kyokasho NP-R', 'Hiragino Maru Gothic ProN', sans-serif";
    
    mainCtx.font = fontStr; mainCtx.fillStyle = "#e2e8f0"; mainCtx.textAlign = "center"; mainCtx.textBaseline = "middle";
    mainCtx.fillText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);

    hitCtx.font = fontStr; hitCtx.strokeStyle = '#FF0000'; hitCtx.fillStyle = '#FF0000'; hitCtx.lineWidth = 35;
    hitCtx.textAlign = "center"; hitCtx.textBaseline = "middle";
    hitCtx.strokeText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);
    hitCtx.fillText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);

    if (force) {
      setCoverPercent(0); setStrokeIdx(0);
      isDrawingRef.current = false;
    }
  }, [selectedChar]);

  useEffect(() => {
    if (screenMode === 'TRAIN') setTimeout(() => initCanvases(true), 50);
  }, [screenMode, initCanvases]);

  const checkHit = (x: number, y: number) => {
    const hitCtx = hitCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!hitCtx) return false;
    try {
      const dpr = window.devicePixelRatio || 1;
      const safeX = Math.floor(Math.max(0, Math.min(hitCanvasRef.current!.width - 1, x * dpr)));
      const safeY = Math.floor(Math.max(0, Math.min(hitCanvasRef.current!.height - 1, y * dpr)));
      return hitCtx.getImageData(safeX, safeY, 1, 1).data[3] > 0;
    } catch(err) { return false; }
  };

  const calculateCoverage = () => {
    const hitCtx = hitCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    const userCtx = userCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!hitCtx || !userCtx) return;

    try {
      const w = hitCanvasRef.current!.width; const h = hitCanvasRef.current!.height;
      const hitData = hitCtx.getImageData(0, 0, w, h).data;
      const userData = userCtx.getImageData(0, 0, w, h).data;
      
      let targetPixels = 0, coveredPixels = 0;
      for (let i = 0; i < hitData.length; i += 16) {
        if (hitData[i + 3] > 0) {
          targetPixels++;
          if (userData[i + 3] > 0) coveredPixels++;
        }
      }
      
      if (targetPixels > 0) {
        let rawPercent = (coveredPixels / targetPixels) * 100;
        let displayPercent = rawPercent * 1.5; 
        
        const currentStroke = strokeIdxRef.current;
        const totalStrokes = selectedChar.nodes.length;
        const currentLimit = Math.min(100, ((currentStroke + 1) / totalStrokes) * 100);
        
        if (displayPercent > currentLimit) displayPercent = currentLimit;

        if (isDrawingRef.current && currentStroke === totalStrokes - 1) {
          if (displayPercent > 96) displayPercent = 96;
        }

        if (!isDrawingRef.current && currentStroke === totalStrokes - 1 && rawPercent * 1.5 >= 85) {
          displayPercent = 100;
        }
        
        setCoverPercent(Math.min(100, Math.floor(displayPercent)));
      }
    } catch (err) {}
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>, targetCanvas: React.RefObject<HTMLCanvasElement>) => {
    if (!targetCanvas.current) return { x: 0, y: 0, time: Date.now() };
    const rect = targetCanvas.current.getBoundingClientRect();
    return { 
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE, 
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
      time: Date.now()
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (coverPercent >= 100) return;
    const pt = getCoordinates(e, canvasRef);
    
    isDrawingRef.current = true; lastPointRef.current = pt; hitDistanceRef.current = 0; 

    const hit = checkHit(pt.x, pt.y);
    const mainCtx = canvasRef.current!.getContext('2d')!;
    const userCtx = userCanvasRef.current!.getContext('2d')!;

    mainCtx.beginPath();
    if (hit) {
      mainCtx.arc(pt.x, pt.y, 12, 0, Math.PI * 2); 
      mainCtx.fillStyle = STROKE_COLORS[strokeIdxRef.current % STROKE_COLORS.length]; mainCtx.fill(); 
      userCtx.beginPath(); userCtx.arc(pt.x, pt.y, 24, 0, Math.PI * 2); userCtx.fillStyle = '#00FF00'; userCtx.fill();
    } else {
      mainCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); mainCtx.fillStyle = `rgba(150, 150, 150, 0.4)`; mainCtx.fill(); 
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current || coverPercent >= 100) return;
    const pt = getCoordinates(e, canvasRef);
    const last = lastPointRef.current;
    
    const dt = pt.time - last.time;
    const distance = Math.hypot(pt.x - last.x, pt.y - last.y);
    
    const mainCtx = canvasRef.current!.getContext('2d')!;
    const userCtx = userCanvasRef.current!.getContext('2d')!;

    if (dt > 0) {
      const speed = distance / dt;
      const isGoodSpeed = speed > 0.001 && speed < 1.2; 
      const hit = checkHit(pt.x, pt.y);

      mainCtx.beginPath(); mainCtx.moveTo(last.x, last.y); mainCtx.lineTo(pt.x, pt.y); 

      if (isGoodSpeed && hit) {
        mainCtx.strokeStyle = STROKE_COLORS[strokeIdxRef.current % STROKE_COLORS.length]; mainCtx.lineWidth = 24; mainCtx.stroke();
        userCtx.beginPath(); userCtx.moveTo(last.x, last.y); userCtx.lineTo(pt.x, pt.y); 
        userCtx.strokeStyle = '#00FF00'; userCtx.lineWidth = 48; userCtx.stroke();
        hitDistanceRef.current += distance; 
      } else {
        mainCtx.strokeStyle = `rgba(150, 150, 150, 0.4)`; mainCtx.lineWidth = 8; mainCtx.stroke();
      }
    }
    
    lastPointRef.current = pt;
    if (pt.time - lastCalcTimeRef.current > 150) {
      calculateCoverage(); lastCalcTimeRef.current = pt.time;
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (hitDistanceRef.current > 30) {
      if (strokeIdxRef.current < selectedChar.nodes.length - 1) setStrokeIdx(prev => prev + 1);
    }
    calculateCoverage();
  };

  const handleClearChar = () => {
    if (!clearedChars.includes(selectedChar.id)) {
      const newCleared = [...clearedChars, selectedChar.id];
      setClearedChars(newCleared);
      setTimeout(() => {
        if (groupChars.every(c => newCleared.includes(c.id))) setScreenMode('COLOR');
        else setScreenMode('SELECT');
      }, 500);
    } else {
      setScreenMode('SELECT');
    }
  };

  // キャンバスサイズを確定
  const initColoringCanvas = useCallback((force = false) => {
    const canvas = colorCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr; 
    canvas.height = CANVAS_SIZE * dpr;
    
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.scale(dpr, dpr); 
    ctx.lineCap = 'round'; 
    ctx.lineJoin = 'round'; 
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  useEffect(() => {
    if (screenMode === 'COLOR') {
      const timer = setTimeout(() => {
        initColoringCanvas(true);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [screenMode, initColoringCanvas]);

  // 🛠 【修正ポイント】ぬりえ画面で1本指の時だけ色を塗り、2本指（ピンチ）の時はブラウザの拡大縮小に処理を譲る
  const startPainting = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // 指1本（またはスタイラスペン1本）のときだけお絵描きを有効にする
    if (e.pointerType === 'touch' && !e.isPrimary) return; 
    if (e.cancelable) e.preventDefault(); 
    
    const pt = getCoordinates(e, colorCanvasRef);
    isPaintingRef.current = true; 
    paintLastPointRef.current = pt;
    
    const ctx = colorCanvasRef.current?.getContext('2d');
    if (ctx) { 
      ctx.beginPath(); 
      ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2); 
      ctx.fillStyle = currentColor; 
      ctx.fill(); 
    }
  };

  const paint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current || !paintLastPointRef.current) return;
    if (e.pointerType === 'touch' && !e.isPrimary) return; 
    if (e.cancelable) e.preventDefault(); 
    
    const pt = getCoordinates(e, colorCanvasRef);
    const last = paintLastPointRef.current;

    const ctx = colorCanvasRef.current?.getContext('2d');
    if (ctx) { 
      ctx.beginPath(); 
      ctx.moveTo(last.x, last.y); 
      ctx.lineTo(pt.x, pt.y); 
      ctx.strokeStyle = currentColor; 
      ctx.lineWidth = brushSize; 
      ctx.stroke(); 
    }
    paintLastPointRef.current = pt;
  };

  const stopPainting = () => { 
    isPaintingRef.current = false; 
  };

  const handleResetAllAll = () => {
    if (window.confirm("これまでのスタンプラリーの記録をぜんぶ消して、はじめからやり直しますか？")) {
      setClearedChars([]);
      setScreenMode('GROUP');
    }
  };

  return (
    <div className="app-container">
      {screenMode === 'GROUP' && (
        <div className="select-screen">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="title" style={{ margin: 0 }}>🚉 路線をえらぼう</h1>
            <button onClick={handleResetAllAll} style={{ background: '#ef4444', color: 'white', fontSize: '14px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
              🔄 ぜんぶリセット
            </button>
          </div>
          <p className="subtitle" style={{ textAlign: 'left', maxWidth: '600px', margin: '10px auto 30px auto' }}>すきな行をえらんで、駅のスタンプラリーに挑戦しよう！</p>
          <div className="group-grid">
            {GROUPS.map((g: string) => {
              const chars = ALL_CHARS.filter(c => c.row === g);
              const isDone = chars.every(c => clearedChars.includes(c.id));
              return (
                <button key={g} className={`group-button ${isDone ? 'all-done' : ''}`} onClick={() => { setCurrentGroup(g); setScreenMode('SELECT'); }}>
                  {g}ぎょう {isDone ? '🟢クリア' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {screenMode === 'SELECT' && (
        <div className="select-screen">
          <h1 className="title">🚉 {currentGroup}ぎょうの れっしゃを つなごう！</h1>
          <p className="subtitle">文字のせんろを塗りつぶすと、でんしゃが1両連結されるよ！</p>
          <div className="train-assembly-line">
            <span className="locomotive">🚂</span>
            {groupChars.map((char) => {
              const isConnected = clearedChars.includes(char.id);
              return (
                <div key={char.id} className={`train-car ${isConnected ? 'connected' : ''}`}>
                  <span className="car-label">{char.name} えき</span>
                  <div className="car-body">🚃</div>
                </div>
              );
            })}
          </div>
          <div className="station-list">
            {groupChars.map((char) => (
              <button key={char.id} className={`station-button ${clearedChars.includes(char.id) ? 'done' : ''}`} onClick={() => { setSelectedChar(char); setScreenMode('TRAIN'); }}>
                {char.name} のせんろ
              </button>
            ))}
          </div>
          <div className="reward-zone">
            {isGroupCleared ? (
              <button className="reward-active-btn" onClick={() => setScreenMode('COLOR')}>🎉 {currentGroup}ぎょう完成！ごほうびぬりえを開く ➔</button>
            ) : (
              <div className="reward-locked">🔒 あと {groupChars.length - groupChars.filter(c => clearedChars.includes(c.id)).length} 両あつめると、本格ぬりえへ出発できるよ！</div>
            )}
          </div>
          <button className="back-btn" onClick={() => setScreenMode('GROUP')} style={{marginTop:'30px'}}>路線えらびにもどる</button>
        </div>
      )}

      {screenMode === 'TRAIN' && (
        <div className="train-screen" style={{ textAlign: 'center' }}>
          <h1 className="main-instruction">「{selectedChar.name}」の せんろを つなごう！</h1>
          <p className="sub-instruction">早く書きすぎると線路がかすれちゃうよ。ゆっくり丁寧に色をぬろう！</p>
          
          <div className="train-workspace">
            <div className="stroke-control-panel">
              <div className="progress-container">
                <div className="progress-label">
                  <span>{strokeIdx + 1}画目 / ぜんぶで {selectedChar.nodes.length}画</span>
                  <span style={{ color: coverPercent >= 100 ? '#22c55e' : '#64748b', transform: coverPercent >= 100 ? 'scale(1.2)' : 'none', transition: 'transform 0.2s' }}>
                    {coverPercent >= 100 ? "OK!!" : `${coverPercent}%`}
                  </span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${coverPercent}%` }}></div>
                </div>
              </div>

              {Array.from({ length: selectedChar.nodes.length }).map((_, i) => (
                <button key={i} className={`stroke-select-btn ${strokeIdx === i ? 'active' : ''}`} style={{ backgroundColor: strokeIdx === i ? STROKE_COLORS[i] : 'white' }} disabled={i > strokeIdx} onClick={() => setStrokeIdx(i)}>
                  <span style={{ fontSize: '24px' }}>🚃</span> {i+1}画目のせんろ
                </button>
              ))}
            </div>
            
            <div className="canvas-wrapper">
              <canvas ref={canvasRef} className="main-canvas" style={{ width: '100%', height: '100%' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp} />
              <canvas ref={hitCanvasRef} style={{ display: 'none' }} />
              <canvas ref={userCanvasRef} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button className="back-btn" onClick={() => initCanvases(true)} style={{ background: '#ef4444' }}>もういちど けして最初から</button>
            <button className="back-btn" onClick={() => setScreenMode('SELECT')}>えきにもどる</button>
            {coverPercent >= 100 && (
              <button className="clear-trigger-btn" onClick={handleClearChar}>🏁 できた！駅にスタンプをおしにいく</button>
            )}
          </div>
        </div>
      )}

      {screenMode === 'COLOR' && (
        <div className="color-screen">
          <h1 className="title">🎨 出発進行！【{currentGroup}ぎょう】のごほうびぬりえ</h1>
          <p className="subtitle">はみ出しても線が消えないよ！2本指で広げると大きく拡大できるよ！</p>
          <div className="tool-bar">
            <div className="size-selector">
              <span className="size-label">ペンの太さ：</span>
              <button className={`size-btn ${brushSize === 10 ? 'active' : ''}`} onClick={() => setBrushSize(10)}>ほそい</button>
              <button className={`size-btn ${brushSize === 24 ? 'active' : ''}`} onClick={() => setBrushSize(24)}>ふつう</button>
              <button className={`size-btn ${brushSize === 48 ? 'active' : ''}`} onClick={() => setBrushSize(48)}>ぶとい</button>
            </div>
            <div className="palette">
              {['#ff4757', '#2ed573', '#1e90ff', '#ffa500', '#cc5de8', '#adb5bd', '#ffffff'].map((c) => (
                <button key={c} className={`color-dot ${currentColor === c ? 'active' : ''}`} style={{ backgroundColor: c, border: c === '#ffffff' ? '4px solid #e2e8f0' : '4px solid white' }} onClick={() => setCurrentColor(c)} />
              ))}
            </div>
          </div>

          {/* 🛠 【修正ポイント】ぬりえのキャンバス枠枠について、
              touchAction: 'pinch-zoom' を設定。これにより、1本指なら色塗り、2本指ピンチアウトなら
              iPad標準の動きで安全に「ぬりえ枠ごと大きく拡大・縮小・移動」ができるようになり、細かい車輪なども超スムーズに塗れます。 */}
          <div className="canvas-wrapper" style={{ margin: '0 auto', position: 'relative', width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px`, background: '#ffffff', touchAction: 'pinch-zoom' }}>
            {/* 白紙（インクを受けるレイヤー） */}
            <canvas 
              ref={colorCanvasRef} 
              style={{ 
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', display: 'block', borderRadius: '24px', 
                cursor: 'crosshair', zIndex: 10
              }} 
              onPointerDown={startPainting} 
              onPointerMove={paint} 
              onPointerUp={stopPainting} 
              onPointerCancel={stopPainting} 
            />
            {/* 透過でんしゃ画像（最前面） */}
            <div 
              style={{ 
                position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
                backgroundImage: `url(${getTrainImage(currentGroup)})`,
                backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'
              }} 
            />
          </div>

          <div className="button-group">
            <button className="reset-btn" onClick={() => initColoringCanvas(true)}>ぜんぶけす</button>
            <button className="finish-btn" onClick={() => setScreenMode('GROUP')}>つぎの路線へ出発！ ➔</button>
          </div>
        </div>
      )}
    </div>
  );
}
