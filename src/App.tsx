import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

// 🚉 画像インポート
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

// 50音データ
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

const STROKE_COLORS = ['#ff4757', '#2ed573', '#1e90ff', '#ffa500']; 
const CANVAS_SIZE = 500;

export default function App() {
  const [screenMode, setScreenMode] = useState<'GROUP' | 'SELECT' | 'TRAIN' | 'COLOR' | 'RESULT'>('GROUP');
  const [currentGroup, setCurrentGroup] = useState<string>('あ');
  const [selectedChar, setSelectedChar] = useState<CharData>(ALL_CHARS[0]);
  const [clearedChars, setClearedChars] = useState<string[]>([]);
  const [strokeIdx, setStrokeIdx] = useState<number>(0); 
  const [coverPercent, setCoverPercent] = useState<number>(0);
  const [showEpicCelebration, setShowEpicCelebration] = useState(false);

  // 🕒 タイマー
  const [timeLeft, setTimeLeft] = useState(180);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const userCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
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

  // 🕒 タイマーループ
  useEffect(() => {
    if (screenMode === 'COLOR' && timeLeft > 0) {
      timerRef.current = setInterval(() => { setTimeLeft(prev => prev - 1); }, 1000);
    } else if (timeLeft === 0 && screenMode === 'COLOR') {
      handleExitColoring();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screenMode, timeLeft]);

  const handleExitColoring = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const currentGroupCharIds = groupChars.map(c => c.id);
    setClearedChars(prev => prev.filter(id => !currentGroupCharIds.includes(id)));
    setTimeLeft(180);
    setScreenMode('RESULT');
  };

  // 💮 なぞり書きが完了した時の処理（自動ではなまる演出を起動）
  const triggerCelebrationAndSave = () => {
    setShowEpicCelebration(true);
    setTimeout(() => {
      setShowEpicCelebration(false);
      setClearedChars(prev => {
        if (!prev.includes(selectedChar.id)) {
          return [...prev, selectedChar.id];
        }
        return prev;
      });
      setScreenMode('SELECT');
    }, 2800); // 2.5秒〜3秒間じっくりはなまるを体験
  };

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

    const fontStr = "bold 310px 'UD Digital Kyokasho NK-R', 'Hiragino Maru Gothic ProN', sans-serif";
    mainCtx.font = fontStr; mainCtx.fillStyle = "#e2e8f0"; mainCtx.textAlign = "center"; mainCtx.textBaseline = "middle";
    mainCtx.fillText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);

    hitCtx.font = fontStr; hitCtx.strokeStyle = '#FF0000'; hitCtx.fillStyle = '#FF0000'; hitCtx.lineWidth = 45; // 🛠 判定を太く補強
    hitCtx.textAlign = "center"; hitCtx.textBaseline = "middle";
    hitCtx.strokeText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);
    hitCtx.fillText(selectedChar.name, CANVAS_SIZE/2, CANVAS_SIZE/2 + 15);

    if (force) { setCoverPercent(0); setStrokeIdx(0); isDrawingRef.current = false; }
  }, [selectedChar]);

  useEffect(() => { if (screenMode === 'TRAIN') setTimeout(() => initCanvases(true), 50); }, [screenMode, initCanvases]);

  // 🛠 【大修正】なぞり書き判定ロジックを完全に修復
  const calculateCoverage = () => {
    const hitCtx = hitCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    const userCtx = userCanvasRef.current?.getContext('2d', { willReadFrequently: true });
    if (!hitCtx || !userCtx) return;

    const w = hitCanvasRef.current!.width; const h = hitCanvasRef.current!.height;
    const hitData = hitCtx.getImageData(0, 0, w, h).data;
    const userData = userCtx.getImageData(0, 0, w, h).data;
    
    let targetCount = 0, coveredCount = 0;
    // 粗さを最適化して高速かつ正確にカウント
    for (let i = 0; i < hitData.length; i += 8) { 
      if (hitData[i + 3] > 0) { 
        targetCount++; 
        if (userData[i + 3] > 0) coveredCount++; 
      } 
    }

    if (targetCount > 0) {
      let rawPercent = (coveredCount / targetCount) * 100;
      let displayPercent = rawPercent * 2.2; // 幼児向けに少し甘めに進捗をのばす
      
      const current = strokeIdxRef.current;
      const total = selectedChar.nodes.length;
      const currentLimit = Math.min(100, ((current + 1) / total) * 100);
      
      let finalPercent = Math.min(currentLimit, Math.floor(displayPercent));
      
      // 最後の画数で一定以上塗れていたら、100%にして即はなまるを起動
      if (current === total - 1 && finalPercent >= 85) {
        finalPercent = 100;
      }

      setCoverPercent(finalPercent);

      if (finalPercent >= 100 && current === total - 1 && !isDrawingRef.current) {
        triggerCelebrationAndSave();
      }
    }
  };

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>, ref: React.RefObject<HTMLCanvasElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE, y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (coverPercent >= 100) return;
    isDrawingRef.current = true;
    const pt = getCoordinates(e, canvasRef);
    const mainCtx = canvasRef.current!.getContext('2d')!;
    const userCtx = userCanvasRef.current!.getContext('2d')!;
    
    mainCtx.beginPath(); mainCtx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
    mainCtx.fillStyle = STROKE_COLORS[strokeIdx % 4]; mainCtx.fill();
    
    userCtx.beginPath(); userCtx.arc(pt.x, pt.y, 28, 0, Math.PI * 2); 
    userCtx.fillStyle = '#00FF00'; userCtx.fill();
    
    // パスを繋ぐために開始点へ移動
    mainCtx.beginPath(); mainCtx.moveTo(pt.x, pt.y);
    userCtx.beginPath(); userCtx.moveTo(pt.x, pt.y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || coverPercent >= 100) return;
    const pt = getCoordinates(e, canvasRef);
    const mainCtx = canvasRef.current!.getContext('2d')!;
    const userCtx = userCanvasRef.current!.getContext('2d')!;
    
    mainCtx.lineWidth = 28; mainCtx.strokeStyle = STROKE_COLORS[strokeIdx % 4];
    mainCtx.lineTo(pt.x, pt.y); mainCtx.stroke();
    
    userCtx.lineWidth = 56; userCtx.strokeStyle = '#00FF00';
    userCtx.lineTo(pt.x, pt.y); userCtx.stroke();
    
    calculateCoverage();
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    
    const total = selectedChar.nodes.length;
    // その画数の目標値に達していたら次の画へ進む
    if (coverPercent >= Math.min(100, ((strokeIdx + 1) / total) * 100)) {
      if (strokeIdx < total - 1) {
        setStrokeIdx(prev => prev + 1);
      } else {
        // 最終画が完了
        setCoverPercent(100);
        triggerCelebrationAndSave();
      }
    }
  };

  const getTrainImage = (group: string) => {
    const mapping: Record<string, string> = { 'あ': trainA, 'か': trainKa, 'さ': trainSa, 'た': trainTa, 'な': trainNa, 'は': trainHa, 'ま': trainMa, 'や': trainYa, 'ら': trainRa, 'わ': trainWa };
    return mapping[group] || trainA;
  };

  const initColoringCanvas = useCallback(() => {
    const canvas = colorCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr; canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  const startPainting = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'touch' && !e.isPrimary) return; 
    if (e.cancelable) e.preventDefault();
    isPaintingRef.current = true;
    const pt = getCoordinates(e, colorCanvasRef);
    paintLastPointRef.current = pt;
    const ctx = colorCanvasRef.current!.getContext('2d')!;
    ctx.beginPath(); ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2); ctx.fillStyle = currentColor; ctx.fill();
  };

  const paint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current || (e.pointerType === 'touch' && !e.isPrimary)) return;
    if (e.cancelable) e.preventDefault();
    const pt = getCoordinates(e, colorCanvasRef);
    const ctx = colorCanvasRef.current!.getContext('2d')!;
    ctx.beginPath(); ctx.lineWidth = brushSize; ctx.strokeStyle = currentColor;
    ctx.moveTo(paintLastPointRef.current!.x, paintLastPointRef.current!.y);
    ctx.lineTo(pt.x, pt.y); ctx.stroke();
    paintLastPointRef.current = pt;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app-container">
      {/* 🌸 修正版：大迫力はなまるコンフェッティ演出 */}
      {showEpicCelebration && (
        <div className="celebration-overlay">
          <div className="hanamaru" style={{ transform: 'scale(1)', opacity: 1 }}>💮</div>
          <div className="perfect-text">すごすぎる！！</div>
          {[...Array(40)].map((_, i) => (
            <div key={i} className="confetti" style={{ 
              left: `${Math.random() * 100}vw`, 
              backgroundColor: STROKE_COLORS[i % 4],
              animationDelay: `${Math.random() * 1.5}s`,
              transform: `scale(${Math.random() * 1.5 + 0.5})`
            }} />
          ))}
        </div>
      )}

      {screenMode === 'GROUP' && (
        <div className="select-screen">
          <h1 className="title">🚉 路線をえらぼう</h1>
          <p className="subtitle">ぜんぶクリアすると3分間ぬりえができるよ！</p>
          <div className="group-grid">
            {['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'].map(g => (
              <button key={g} className={`group-button ${ALL_CHARS.filter(c => c.row === g).every(c => clearedChars.includes(c.id)) ? 'all-done' : ''}`} 
                onClick={() => { setCurrentGroup(g); setScreenMode('SELECT'); }}>
                {g}ぎょう
              </button>
            ))}
          </div>
        </div>
      )}

      {screenMode === 'SELECT' && (
        <div className="select-screen">
          <h1 className="title">🚉 {currentGroup}ぎょう</h1>
          <div className="train-assembly-line">
            <span className="locomotive">🚂</span>
            {groupChars.map(char => (
              <div key={char.id} className={`train-car ${clearedChars.includes(char.id) ? 'connected' : ''}`}>
                <div className="car-body">🚃</div>
              </div>
            ))}
          </div>
          <div className="station-list">
            {groupChars.map(char => (
              <button key={char.id} className={`station-button ${clearedChars.includes(char.id) ? 'done' : ''}`} onClick={() => { setSelectedChar(char); setScreenMode('TRAIN'); }}>
                {char.name}
              </button>
            ))}
          </div>
          <div className="reward-zone" style={{marginTop: '30px'}}>
            {isGroupCleared ? (
              <button className="reward-active-btn" onClick={() => { setScreenMode('COLOR'); setTimeout(() => initColoringCanvas(), 50); }}>🎉 しゅっぱつ進行！ぬりえへ（3分）</button>
            ) : (
              <div className="reward-locked">🔒 あと {groupChars.length - groupChars.filter(c => clearedChars.includes(c.id)).length} つでぬりえだよ！</div>
            )}
          </div>
          <button className="back-btn" onClick={() => setScreenMode('GROUP')} style={{marginTop:'20px'}}>もどる</button>
        </div>
      )}

      {screenMode === 'TRAIN' && (
        <div className="train-screen" style={{ textAlign: 'center' }}>
          <h1 className="main-instruction">「{selectedChar.name}」をなぞろう！</h1>
          <div className="train-workspace">
            {/* 🛠 ボタン立体デザイン用のクラス名を再適用 */}
            <div className="stroke-control-panel">
              <div className="progress-container">
                <div className="progress-label">
                  <span>{strokeIdx + 1}画目 / ぜんぶで {selectedChar.nodes.length}画</span>
                  <span>{coverPercent}%</span>
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${coverPercent}%` }}></div></div>
              </div>
              {Array.from({ length: selectedChar.nodes.length }).map((_, i) => (
                <button key={i} className={`stroke-select-btn ${strokeIdx === i ? 'active' : ''}`} style={{ backgroundColor: strokeIdx === i ? STROKE_COLORS[i % 4] : 'white' }} disabled={i > strokeIdx}>
                  🚃 {i+1}画目
                </button>
              ))}
            </div>
            <div className="canvas-wrapper" style={{ width: '500px', height: '500px' }}>
              <canvas ref={canvasRef} className="main-canvas" style={{ width: '100%', height: '100%' }} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} />
              <canvas ref={hitCanvasRef} style={{ display: 'none' }} />
              <canvas ref={userCanvasRef} style={{ display: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '15px' }}>
            <button className="back-btn" onClick={() => initCanvases(true)} style={{ background: '#ef4444' }}>けして最初から</button>
            <button className="back-btn" onClick={() => setScreenMode('SELECT')}>えきにもどる</button>
          </div>
        </div>
      )}

      {screenMode === 'COLOR' && (
        <div className="color-screen">
          <div className="timer-container">
            <span>⏱ 残り時間:</span>
            <span className={timeLeft < 30 ? 'timer-urgent' : ''}>{formatTime(timeLeft)}</span>
          </div>
          <div className="tool-bar">
            <div className="palette">
              {['#ff4757', '#2ed573', '#1e90ff', '#ffa500', '#cc5de8', '#adb5bd', '#ffffff'].map(c => (
                <button key={c} className={`color-dot ${currentColor === c ? 'active' : ''}`} style={{ backgroundColor: c }} onClick={() => setCurrentColor(c)} />
              ))}
            </div>
          </div>
          <div className="canvas-wrapper" style={{ margin: '0 auto', width: '500px', height: '500px', touchAction: 'pinch-zoom' }}>
            <canvas ref={colorCanvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '24px', zIndex: 10 }} onPointerDown={startPainting} onPointerMove={paint} onPointerUp={stopPainting} />
            <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', backgroundImage: `url(${getTrainImage(currentGroup)})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
          </div>
          <div className="button-group">
            <button className="reset-btn" onClick={() => initColoringCanvas()} style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', fontSize: '18px', fontWeight: 'bold'}}>ぜんぶけす</button>
            <button className="back-btn" onClick={handleExitColoring}>おわりにする</button>
          </div>
        </div>
      )}

      {screenMode === 'RESULT' && (
        <div className="select-screen">
          <h1 className="title">おつかれさまでした！🚂</h1>
          <p className="subtitle" style={{fontSize: '22px', color: '#166534', fontWeight: 'bold'}}>とってもじょうずにぬれたね！👏👏</p>
          <p style={{fontSize: '18px', margin: '20px 0'}}>またぬりえをするには、もういちどスタンプをあつめてね！</p>
          <button className="reward-active-btn" style={{marginTop:'20px'}} onClick={() => setScreenMode('GROUP')}>つぎの路線へ出発！ ➔</button>
        </div>
      )}
    </div>
  );
}
