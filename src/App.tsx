import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

// 🚉 画像インポート (ご自身の環境に合わせてください)
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

interface NodePoint { x: number; y: number; }
interface CharData { id: string; name: string; row: string; nodes: NodePoint[][]; hitWidth?: number; }

const ALL_CHARS: CharData[] = [
  { id: 'a', name: 'あ', row: 'あ', hitWidth: 100, nodes: [[{x:140,y:180},{x:340,y:170}], [{x:245,y:110},{x:240,y:250},{x:235,y:390}], [{x:290,y:220},{x:160,y:310},{x:180,y:400},{x:320,y:360},{x:270,y:240},{x:240,y:350}]] },
  { id: 'i', name: 'い', row: 'あ', hitWidth: 70, nodes: [[{x:160,y:160},{x:150,y:280},{x:180,y:350}], [{x:310,y:190},{x:330,y:290}]] },
  { id: 'u', name: 'う', row: 'あ', hitWidth: 85, nodes: [[{x:220,y:130},{x:280,y:160}], [{x:180,y:220},{x:310,y:230},{x:280,y:350},{x:200,y:410}]] },
  { id: 'e', name: 'え', row: 'あ', hitWidth: 90, nodes: [[{x:230,y:110},{x:270,y:140}], [{x:160,y:220},{x:330,y:210},{x:170,y:370},{x:300,y:340},{x:340,y:390}]] },
  { id: 'o', name: 'お', row: 'あ', hitWidth: 100, nodes: [[{x:140,y:190},{x:310,y:180}], [{x:230,y:120},{x:225,y:280},{x:150,y:300},{x:200,y:250},{x:320,y:290},{x:250,y:400}], [{x:315,y:130},{x:345,y:185}]] },
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

const getTrainImage = (group: string) => {
  const mapping: Record<string, string> = { 
    'あ': trainA, 'か': trainKa, 'さ': trainSa, 'た': trainTa, 'な': trainNa, 
    'は': trainHa, 'ま': trainMa, 'や': trainYa, 'ら': trainRa, 'わ': trainWa 
  };
  return mapping[group] || trainA;
};

export default function App() {
  const [screenMode, setScreenMode] = useState<'GROUP' | 'SELECT' | 'TRAIN' | 'COLOR' | 'RESULT' | 'SETTINGS'>('GROUP');
  const [currentGroup, setCurrentGroup] = useState<string>('あ');
  const [selectedChar, setSelectedChar] = useState<CharData>(ALL_CHARS[0]);
  const [clearedChars, setClearedChars] = useState<string[]>([]);
  const [strokeIdx, setStrokeIdx] = useState<number>(0); 
  const [coverPercent, setCoverPercent] = useState<number>(0);
  const [showEpicCelebration, setShowEpicCelebration] = useState(false);

  // 💡支援者用設定（シェイピング用）
  const [targetClearCount, setTargetClearCount] = useState<number>(5); // デフォルトは5文字でクリア
  const [coloringTimeLimit, setColoringTimeLimit] = useState<number>(180); // デフォルトは3分(180秒)

  const [timeLeft, setTimeLeft] = useState(coloringTimeLimit);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hitCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const userCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{x: number, y: number, time: number} | null>(null);
  const hitDistanceRef = useRef(0);
  const lastCalcTimeRef = useRef(0);
  const strokeIdxRef =
