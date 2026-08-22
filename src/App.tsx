import React, { useState, useCallback, useEffect } from 'react';
import { Settings, History, X, RotateCcw } from 'lucide-react';

const LANG = {
  es: {
    title: 'CAL8BIT',
    ready: 'LISTO',
    mem: 'MEM',
    op: 'OP',
    settings: 'AJUSTES',
    theme: 'TEMA',
    display: 'PANTALLA',
    scanlines: 'SCANLINES',
    labels: 'ETIQUETAS',
    buttons: 'BOTONES',
    style: 'ESTILO',
    glow: 'BRILLO',
    intensity: 'INTENSIDAD',
    language: 'IDIOMA',
    mode: 'MODO',
    basic: 'BASICA',
    scientific: 'CIENTIFICA',
    version: 'CAL8BIT v1.0',
    square: 'CUADRA',
    soft: 'SUAVE',
    round: 'REDON',
    screenSize: 'TAMAÑO PANTALLA',
    small: 'CHICA',
    medium: 'MEDIA',
    large: 'GRANDE',
    memory: 'MEMORIA',
    noMemory: 'SIN OPERACIONES',
    clearMem: 'BORRAR',
    result: 'RESULTADO',
    sound: 'SONIDO',
    audio: 'AUDIO',
  },
  en: {
    title: 'CAL8BIT',
    ready: 'READY',
    mem: 'MEM',
    op: 'OP',
    settings: 'SETTINGS',
    theme: 'THEME',
    display: 'DISPLAY',
    scanlines: 'SCANLINES',
    labels: 'LABELS',
    buttons: 'BUTTONS',
    style: 'STYLE',
    glow: 'GLOW',
    intensity: 'INTENSITY',
    language: 'LANGUAGE',
    mode: 'MODE',
    basic: 'BASIC',
    scientific: 'SCIENTIFIC',
    version: 'CAL8BIT v1.0',
    square: 'SQ',
    soft: 'SOFT',
    round: 'ROUND',
    screenSize: 'SCREEN SIZE',
    small: 'SMALL',
    medium: 'MEDIUM',
    large: 'LARGE',
    memory: 'MEMORY',
    noMemory: 'NO OPERATIONS',
    clearMem: 'CLEAR',
    result: 'RESULT',
    sound: 'SOUND',
    audio: 'AUDIO',
  },
};

const THEMES = {
  retro: {
    bg: 'bg-[#0d0d0d]', screenBg: 'bg-[#1a1a00]',
    btnNum: 'bg-[#2a2a2a] border-[#444444]', btnNumText: 'text-[#1a8a1a]',
    btnOp: 'bg-[#3a1a00] border-[#ff6600]', btnOpText: 'text-[#ff6600]',
    btnFn: 'bg-[#001a3a] border-[#3399ff]', btnFnText: 'text-[#3399ff]',
    btnEq: 'bg-[#003a00] border-[#33ff33]', btnEqText: 'text-[#33ff33]',
    btnSci: 'bg-[#1a0033] border-[#9933ff]', btnSciText: 'text-[#9933ff]',
    green: 'text-[#33ff33]', greenDim: 'text-[#1a8a1a]', greenDark: 'text-[#0d4d0d]',
    borderPrimary: 'border-[#0d4d0d]', screenBorder: 'border-[#1a8a1a]',
    scanline: 'bg-black/15', label: 'text-[#0d4d0d]',
    titleBarBg: 'bg-[#111]',
  },
  amber: {
    bg: 'bg-[#0d0800]', screenBg: 'bg-[#1a1000]',
    btnNum: 'bg-[#2a2000] border-[#554400]', btnNumText: 'text-[#8a6600]',
    btnOp: 'bg-[#3a2000] border-[#ffaa00]', btnOpText: 'text-[#ffaa00]',
    btnFn: 'bg-[#1a1a00] border-[#ccaa44]', btnFnText: 'text-[#ccaa44]',
    btnEq: 'bg-[#3a3000] border-[#ffcc00]', btnEqText: 'text-[#ffcc00]',
    btnSci: 'bg-[#2a1500] border-[#cc8844]', btnSciText: 'text-[#cc8844]',
    green: 'text-[#ffaa00]', greenDim: 'text-[#8a6600]', greenDark: 'text-[#4d3500]',
    borderPrimary: 'border-[#4d3500]', screenBorder: 'border-[#8a6600]',
    scanline: 'bg-black/15', label: 'text-[#4d3500]',
    titleBarBg: 'bg-[#1a1000]',
  },
  cyber: {
    bg: 'bg-[#000510]', screenBg: 'bg-[#000a1a]',
    btnNum: 'bg-[#001133] border-[#003366]', btnNumText: 'text-[#007788]',
    btnOp: 'bg-[#1a0033] border-[#ff00ff]', btnOpText: 'text-[#ff00ff]',
    btnFn: 'bg-[#001a1a] border-[#00ffff]', btnFnText: 'text-[#00ffff]',
    btnEq: 'bg-[#001a33] border-[#00ffff]', btnEqText: 'text-[#00ffff]',
    btnSci: 'bg-[#1a001a] border-[#ff00ff]', btnSciText: 'text-[#ff00ff]',
    green: 'text-[#00ffff]', greenDim: 'text-[#007788]', greenDark: 'text-[#003344]',
    borderPrimary: 'border-[#003344]', screenBorder: 'border-[#007788]',
    scanline: 'bg-[#000a1a]/20', label: 'text-[#003344]',
    titleBarBg: 'bg-[#000a1a]',
  },
  blood: {
    bg: 'bg-[#0d0000]', screenBg: 'bg-[#1a0000]',
    btnNum: 'bg-[#2a0808] border-[#551111]', btnNumText: 'text-[#881111]',
    btnOp: 'bg-[#3a0000] border-[#ff3333]', btnOpText: 'text-[#ff3333]',
    btnFn: 'bg-[#1a0010] border-[#ff6688]', btnFnText: 'text-[#ff6688]',
    btnEq: 'bg-[#3a0000] border-[#ff0000]', btnEqText: 'text-[#ff0000]',
    btnSci: 'bg-[#2a0020] border-[#ff66ff]', btnSciText: 'text-[#ff66ff]',
    green: 'text-[#ff3333]', greenDim: 'text-[#881111]', greenDark: 'text-[#440808]',
    borderPrimary: 'border-[#440808]', screenBorder: 'border-[#881111]',
    scanline: 'bg-black/15', label: 'text-[#440808]',
    titleBarBg: 'bg-[#1a0000]',
  },
  mono: {
    bg: 'bg-[#0a0a0a]', screenBg: 'bg-[#1a1a1a]',
    btnNum: 'bg-[#2a2a2a] border-[#555555]', btnNumText: 'text-[#999999]',
    btnOp: 'bg-[#333333] border-[#888888]', btnOpText: 'text-[#cccccc]',
    btnFn: 'bg-[#1a1a1a] border-[#666666]', btnFnText: 'text-[#bbbbbb]',
    btnEq: 'bg-[#3a3a3a] border-[#ffffff]', btnEqText: 'text-[#ffffff]',
    btnSci: 'bg-[#252525] border-[#777777]', btnSciText: 'text-[#aaaaaa]',
    green: 'text-[#ffffff]', greenDim: 'text-[#999999]', greenDark: 'text-[#444444]',
    borderPrimary: 'border-[#444444]', screenBorder: 'border-[#999999]',
    scanline: 'bg-black/12', label: 'text-[#444444]',
    titleBarBg: 'bg-[#1a1a1a]',
  },
};

const buildButtons = () => [
  ['C', '⌫', '%', '+/-', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

const buildSciButtons = () => [
  ['sin', 'cos', 'tan', 'π'],
  ['ln', 'log', '√', 'e'],
  ['x²', 'xⁿ', 'n!', '|x|'],
  ['(', ')', '10ˣ', 'eˣ'],
];

const factorial = (n: number): number => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<string | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [pressed, setPressed] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState<Array<{ expr: string; result: string; ts: number }>>([]);
  const [pendingFn, setPendingFn] = useState<string | null>(null);

  const [themeKey, setThemeKey] = useState<keyof typeof THEMES>('retro');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [showScanlines, setShowScanlines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [btnRadius, setBtnRadius] = useState<number>(4);
  const [glowIntensity, setGlowIntensity] = useState<number>(8);
  const [sciMode, setSciMode] = useState(false);
  const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const T = THEMES[themeKey];
  const L = LANG[lang];

  const playSound = (type: 'num' | 'op' | 'eq' | 'clear' | 'sci') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      let freq = 523.25;
      let duration = 0.04;

      if (type === 'num') {
        freq = 523.25;
        duration = 0.03;
      } else if (type === 'op') {
        freq = 659.25;
        duration = 0.05;
      } else if (type === 'eq') {
        freq = 783.99;
        duration = 0.1;
      } else if (type === 'clear') {
        freq = 329.63;
        duration = 0.06;
      } else if (type === 'sci') {
        freq = 880;
        duration = 0.06;
      }

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio error if unsupported or locked before user interaction
    }
  };

  const displayFontSize = (() => {
    const m = screenSize === 'small' ? 0.8 : screenSize === 'large' ? 1.2 : 1;
    if (display.length > 10) return `${Math.floor(22 * m)}px`;
    if (display.length > 7) return `${Math.floor(28 * m)}px`;
    return `${Math.floor(40 * m)}px`;
  })();

  const formatNumber = (num: any) => {
    if (num === 'Error' || isNaN(num)) return 'ERR0R';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    const n = parseFloat(String(num));
    if (isNaN(n)) return '0';
    if (Math.abs(n) >= 1e12) return n.toExponential(4);
    return Number.isInteger(n) ? String(n) : parseFloat(n.toPrecision(10)).toString();
  };

  const calculate = useCallback((a: string, b: string, operator: string) => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (operator) {
      case '+': return x + y;
      case '-': return x - y;
      case '×': return x * y;
      case '÷': return y === 0 ? 'Error' : x / y;
      case '^': return Math.pow(x, y);
      default: return y;
    }
  }, []);

  const applyScientific = (fn: string, val: string) => {
    const x = parseFloat(val);
    switch (fn) {
      case 'sin': return Math.sin(x * Math.PI / 180);
      case 'cos': return Math.cos(x * Math.PI / 180);
      case 'tan': { const c = Math.cos(x * Math.PI / 180); return c === 0 ? NaN : Math.tan(x * Math.PI / 180); }
      case 'ln': return x <= 0 ? NaN : Math.log(x);
      case 'log': return x <= 0 ? NaN : Math.log10(x);
      case '√': return x < 0 ? NaN : Math.sqrt(x);
      case 'x²': return x * x;
      case 'n!': return x < 0 || x > 170 || !Number.isInteger(x) ? NaN : factorial(x);
      case '|x|': return Math.abs(x);
      case '10ˣ': return Math.pow(10, x);
      case 'eˣ': return Math.exp(x);
      case 'π': return Math.PI;
      case 'e': return Math.E;
      default: return x;
    }
  };

  const handlePress = (value: string) => {
    setPressed(value);
    setTimeout(() => setPressed(null), 100);

    const sciFns = ['sin', 'cos', 'tan', 'ln', 'log', '√', 'x²', 'n!', '|x|', '10ˣ', 'eˣ'];
    if (sciFns.includes(value)) {
      playSound('sci');
      setPendingFn(value);
      setHistory(`${value}(`);
      setFresh(true);
      return;
    }
    if (value === 'π' || value === 'e') {
      playSound('sci');
      setDisplay(formatNumber(value === 'π' ? Math.PI : Math.E));
      setHistory('');
      setFresh(true);
      return;
    }
    if (value === '(' || value === ')') return;

    switch (value) {
      case 'C':
        playSound('clear');
        setDisplay('0'); setPrev(null); setOp(null); setHistory(''); setFresh(true); setPendingFn(null);
        break;
      case '⌫':
        playSound('clear');
        if (display !== 'ERR0R' && display.length > 1) setDisplay((d) => d.slice(0, -1));
        else setDisplay('0');
        break;
      case '+/-':
        playSound('clear');
        if (display !== '0' && display !== 'ERR0R') setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d));
        break;
      case '%':
        playSound('op');
        if (display !== 'ERR0R') {
          const r = formatNumber(parseFloat(display) / 100);
          const expr = `${display}% = ${r}`;
          setHistory(`${display}% =`);
          setMemory((m) => [{ expr, result: r, ts: Date.now() }, ...m]);
          setDisplay(r); setFresh(true);
        }
        break;
      case '+': case '-': case '×': case '÷': case 'xⁿ':
        playSound('op');
        setPendingFn(null);
        if (display === 'ERR0R' || display === '∞' || display === '-∞') break;
        if (prev !== null && op && !fresh) {
          const r = formatNumber(calculate(prev, display, op));
          setHistory(`${prev} ${op} ${display} =`);
          setDisplay(r); setPrev(r);
        } else {
          setPrev(display); setHistory(`${display} ${value}`);
        }
        setOp(value); setFresh(true);
        break;
      case '=':
        playSound('eq');
        if (pendingFn && display !== 'ERR0R') {
          const result = applyScientific(pendingFn, display);
          const expr = `${pendingFn}(${display}) = ${formatNumber(result)}`;
          setHistory(`${pendingFn}(${display}) =`);
          setMemory((m) => [{ expr, result: formatNumber(result), ts: Date.now() }, ...m]);
          setDisplay(formatNumber(result));
          setPendingFn(null);
          setFresh(true);
        } else if (prev !== null && op) {
          const r = formatNumber(calculate(prev, display, op));
          const expr = `${prev} ${op} ${display} = ${r}`;
          setHistory(`${prev} ${op} ${display} =`);
          setMemory((m) => [{ expr, result: r, ts: Date.now() }, ...m]);
          setDisplay(r); setPrev(null); setOp(null); setFresh(true);
        }
        break;
      case '.':
        playSound('num');
        if (fresh) { setDisplay('0.'); setFresh(false); }
        else if (!display.includes('.')) setDisplay((d) => d + '.');
        break;
      default:
        playSound('num');
        if (fresh) { setDisplay(value); setFresh(false); }
        else setDisplay((d) => (d === '0' ? value : d + value));
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSettings || showMemory) {
        if (e.key === 'Escape') {
          setShowSettings(false);
          setShowMemory(false);
        }
        return;
      }
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        handlePress(e.key);
      } else if (e.key === '+') {
        handlePress('+');
      } else if (e.key === '-') {
        handlePress('-');
      } else if (e.key === '*') {
        handlePress('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handlePress('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        handlePress('=');
      } else if (e.key === 'Backspace') {
        handlePress('⌫');
      } else if (e.key.toLowerCase() === 'c') {
        handlePress('C');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prev, op, fresh, pendingFn, showSettings, showMemory]);

  const isOperator = (v: string) => ['+', '-', '×', '÷'].includes(v);
  const isSpecial = (v: string) => ['C', '+/-', '%', '⌫'].includes(v);
  const isEquals = (v: string) => v === '=';
  const isSciBtn = (v: string) => !['+','-','×','÷','=','0','1','2','3','4','5','6','7','8','9','.','⌫'].includes(v);

  const getBtnClass = (value: string) => {
    if (isEquals(value)) return `bg-[#003a00] border-[#33ff33] ${T.btnEqText}`;
    if (isSpecial(value)) return `bg-[#001a3a] border-[#3399ff] ${T.btnFnText}`;
    if (isOperator(value)) return `bg-[#3a1a00] border-[#ff6600] ${T.btnOpText}`;
    if (isSciBtn(value) && sciMode) return `bg-[#1a0033] border-[#9933ff] ${T.btnSciText}`;
    return `bg-[#2a2a2a] border-[#444444] ${T.greenDim}`;
  };

  const getGlowStyle = () => {
    if (glowIntensity === 0) return {};
    const color = themeKey === 'amber' ? '#ffaa00' : themeKey === 'cyber' ? '#00ffff' : themeKey === 'blood' ? '#ff3333' : themeKey === 'mono' ? '#ffffff' : '#33ff33';
    return {
      textShadow: `0 0 ${glowIntensity}px ${color}`,
    };
  };

  return (
    <div className={`min-h-screen ${T.bg} flex flex-col items-center justify-center p-2 sm:p-4 select-none font-pixel`}>
      <div className="w-full max-w-md mx-auto flex flex-col h-[92vh] max-h-[850px] border-4 border-[#222] shadow-2xl rounded-lg overflow-hidden bg-black/40">
        
        {/* Title Bar */}
        <div className={`flex items-center justify-between border-2 ${T.borderPrimary} ${T.titleBarBg} px-3 py-2 m-2`}>
          <span className={`text-xs tracking-widest ${T.greenDim} truncate`}>
            {sciMode ? '▸ CAL8BIT SCI ◂' : `▸ ${L.title} ◂`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { playSound('sci'); setShowMemory(true); }}
              className={`border-2 ${T.borderPrimary} px-2 py-0.5 text-xs font-bold hover:opacity-80 transition-opacity ${memory.length > 0 ? T.green : T.greenDim}`}
              title="Memory / History"
            >
              [{memory.length}]
            </button>
            <button
              onClick={() => { playSound('sci'); setShowSettings(true); }}
              className={`border-2 ${T.borderPrimary} px-2 py-0.5 text-xs font-bold ${T.greenDim} hover:opacity-80 transition-opacity`}
              title="Settings"
            >
              [::]
            </button>
          </div>
        </div>

        {/* Screen Frame */}
        <div className={`border-4 ${T.borderPrimary} mx-2 mb-2 p-1 relative overflow-hidden flex flex-col ${
          screenSize === 'small' ? 'flex-[1]' : screenSize === 'large' ? 'flex-[2.5]' : 'flex-[1.6]'
        }`}>
          <div className={`border-2 ${T.screenBorder} ${T.screenBg} p-3 flex-1 flex flex-col justify-end relative overflow-hidden`}>
            {showScanlines && <div className={`absolute inset-0 pointer-events-none ${T.scanline} scanline-overlay`} />}
            
            <div className="flex flex-col items-end z-10 w-full">
              <span className={`text-[11px] tracking-wider ${T.greenDark} mb-1 truncate max-w-full`}>
                {history || L.ready}
              </span>
              <div className={`border-b-2 ${T.screenBorder} pb-1 w-full flex justify-end overflow-hidden`}>
                <span
                  className={`font-bold tracking-wider truncate max-w-full ${T.green}`}
                  style={{ fontSize: displayFontSize, ...getGlowStyle() }}
                >
                  {display}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Labels row */}
        {showLabels && !sciMode && (
          <div className="flex justify-between items-center px-3.5 mb-1 h-5 text-[10px] tracking-widest">
            <span className={T.label}>{L.mem}: {display}</span>
            <span className={T.label}>{L.op}: {op || '---'}</span>
          </div>
        )}

        {/* Buttons Area */}
        <div className="flex-1 px-2 pb-2 flex flex-col justify-end gap-1">
          {sciMode && (
            <div className="grid grid-cols-4 gap-1.5 mb-1.5">
              {buildSciButtons().flat().map((btn) => (
                <button
                  key={btn}
                  onClick={() => handlePress(btn)}
                  className={`border-2 flex items-center justify-center py-2.5 text-[11px] font-bold transition-all active:translate-y-0.5 active:border-b-1 ${getBtnClass(btn)}`}
                  style={{ borderRadius: `${btnRadius}px` }}
                >
                  {btn}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5 flex-1 justify-end">
            {buildButtons().map((row, ri) => (
              <div key={`std-${ri}`} className="flex gap-1.5 w-full">
                {row.map((btn) => {
                  const wide = btn === '0';
                  return (
                    <button
                      key={btn}
                      onClick={() => handlePress(btn)}
                      className={`border-2 flex items-center justify-center py-3.5 text-lg font-bold transition-all active:translate-y-0.5 active:border-b-1 ${getBtnClass(btn)} ${
                        wide ? 'flex-[2]' : 'flex-[1]'
                      }`}
                      style={{ borderRadius: `${btnRadius}px` }}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md max-h-[85vh] border-4 border-green-500 ${T.bg} flex flex-col rounded-lg overflow-hidden shadow-2xl`}>
              <div className={`flex items-center justify-between border-b-2 ${T.borderPrimary} px-4 py-3`}>
                <span className={`text-sm tracking-widest ${T.green}`}>[ {L.settings.toUpperCase()} ]</span>
                <button onClick={() => { playSound('clear'); setShowSettings(false); }} className="text-orange-500 hover:text-orange-400 font-bold text-lg">
                  [X]
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4 text-xs">
                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.language.toUpperCase()}</div>
                  <div className="flex gap-2">
                    {[{ label: 'ES', value: 'es' }, { label: 'EN', value: 'en' }].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { playSound('num'); setLang(opt.value as any); }}
                        className={`border-2 px-3 py-1.5 font-bold ${lang === opt.value ? 'bg-green-500 text-black border-green-500' : `${T.borderPrimary} ${T.greenDim}`}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.mode.toUpperCase()}</div>
                  <div className="flex items-center justify-between py-1">
                    <span className={T.greenDim}>{sciMode ? L.scientific.toUpperCase() : L.basic.toUpperCase()}</span>
                    <button
                      onClick={() => setSciMode(!sciMode)}
                      className={`w-12 h-6 border-2 flex items-center px-0.5 transition-colors ${sciMode ? 'bg-green-500 border-green-500 justify-end' : 'bg-zinc-800 border-zinc-600 justify-start'}`}
                    >
                      <div className={`w-4 h-4 ${sciMode ? 'bg-black' : 'bg-zinc-400'}`} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.screenSize.toUpperCase()}</div>
                  <div className="flex gap-2">
                    {[
                      { label: L.small.toUpperCase(), value: 'small' },
                      { label: L.medium.toUpperCase(), value: 'medium' },
                      { label: L.large.toUpperCase(), value: 'large' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setScreenSize(opt.value as any)}
                        className={`border-2 px-3 py-1.5 font-bold flex-1 ${screenSize === opt.value ? 'bg-green-500 text-black border-green-500' : `${T.borderPrimary} ${T.greenDim}`}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.theme.toUpperCase()}</div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(THEMES).map((key) => {
                      const th = THEMES[key as keyof typeof THEMES];
                      const active = themeKey === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setThemeKey(key as any)}
                          className={`border-2 p-2 text-left ${th.bg} ${active ? 'border-green-500 ring-2 ring-green-500' : th.borderPrimary}`}
                        >
                          <div className={`text-[9px] font-bold mb-1 ${th.green}`}>{key.toUpperCase()}</div>
                          <div className={`flex gap-1 p-1 ${th.screenBg}`}>
                            <div className={`w-2.5 h-2.5 ${th.btnNum}`} />
                            <div className={`w-2.5 h-2.5 ${th.btnOp}`} />
                            <div className={`w-2.5 h-2.5 ${th.btnEq}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.display.toUpperCase()}</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1">
                      <span className={T.greenDim}>{L.scanlines.toUpperCase()}</span>
                      <button
                        onClick={() => setShowScanlines(!showScanlines)}
                        className={`w-12 h-6 border-2 flex items-center px-0.5 transition-colors ${showScanlines ? 'bg-green-500 border-green-500 justify-end' : 'bg-zinc-800 border-zinc-600 justify-start'}`}
                      >
                        <div className={`w-4 h-4 ${showScanlines ? 'bg-black' : 'bg-zinc-400'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className={T.greenDim}>{L.labels.toUpperCase()}</span>
                      <button
                        onClick={() => setShowLabels(!showLabels)}
                        className={`w-12 h-6 border-2 flex items-center px-0.5 transition-colors ${showLabels ? 'bg-green-500 border-green-500 justify-end' : 'bg-zinc-800 border-zinc-600 justify-start'}`}
                      >
                        <div className={`w-4 h-4 ${showLabels ? 'bg-black' : 'bg-zinc-400'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className={T.greenDim}>{L.sound.toUpperCase()}</span>
                      <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`w-12 h-6 border-2 flex items-center px-0.5 transition-colors ${soundEnabled ? 'bg-green-500 border-green-500 justify-end' : 'bg-zinc-800 border-zinc-600 justify-start'}`}
                      >
                        <div className={`w-4 h-4 ${soundEnabled ? 'bg-black' : 'bg-zinc-400'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.buttons.toUpperCase()} ({L.style.toUpperCase()})</div>
                  <div className="flex gap-2">
                    {[
                      { label: L.square.toUpperCase(), value: 2 },
                      { label: L.soft.toUpperCase(), value: 8 },
                      { label: L.round.toUpperCase(), value: 20 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setBtnRadius(opt.value)}
                        className={`border-2 px-3 py-1.5 font-bold flex-1 ${btnRadius === opt.value ? 'bg-green-500 text-black border-green-500' : `${T.borderPrimary} ${T.greenDim}`}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={`text-[11px] tracking-wider ${T.greenDim} mb-1.5`}>▸ {L.glow.toUpperCase()} ({L.intensity.toUpperCase()})</div>
                  <div className="flex gap-2">
                    {[
                      { label: 'OFF', value: 0 },
                      { label: 'LOW', value: 4 },
                      { label: 'MED', value: 8 },
                      { label: 'HIGH', value: 16 },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setGlowIntensity(opt.value)}
                        className={`border-2 px-2 py-1.5 font-bold flex-1 text-[10px] ${glowIntensity === opt.value ? 'bg-green-500 text-black border-green-500' : `${T.borderPrimary} ${T.greenDim}`}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`border-t-2 ${T.borderPrimary} py-2 text-center text-[9px] ${T.greenDark}`}>
                {L.version}
              </div>
            </div>
          </div>
        )}

        {/* Memory / History Modal */}
        {showMemory && (
          <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md max-h-[85vh] border-4 border-green-500 ${T.bg} flex flex-col rounded-lg overflow-hidden shadow-2xl`}>
              <div className={`flex items-center justify-between border-b-2 ${T.borderPrimary} px-4 py-3`}>
                <span className={`text-sm tracking-widest ${T.green}`}>[ {L.memory.toUpperCase()} ]</span>
                <div className="flex items-center gap-3">
                  {memory.length > 0 && (
                    <button onClick={() => setMemory([])} className="text-orange-500 hover:text-orange-400 font-bold text-xs">
                      {L.clearMem.toUpperCase()}
                    </button>
                  )}
                  <button onClick={() => setShowMemory(false)} className="text-orange-500 hover:text-orange-400 font-bold text-lg">
                    [X]
                  </button>
                </div>
              </div>

              <div className="p-4 overflow-y-auto space-y-2 flex-1">
                {memory.length === 0 ? (
                  <div className={`text-center py-16 text-xs tracking-wider ${T.greenDark}`}>
                    {L.noMemory}
                  </div>
                ) : (
                  memory.map((item, i) => (
                    <button
                      key={`${item.ts}-${i}`}
                      onClick={() => { setDisplay(item.result); setShowMemory(false); setFresh(true); }}
                      className={`w-full text-left border-b ${T.borderPrimary} py-2.5 px-2 hover:bg-white/5 transition-colors`}
                    >
                      <div className={`text-[11px] tracking-wider ${T.greenDim} mb-0.5 truncate`}>{item.expr}</div>
                      <div className={`text-base font-bold tracking-wider ${T.green} truncate`}>= {item.result}</div>
                    </button>
                  ))
                )}
              </div>

              <div className={`border-t-2 ${T.borderPrimary} py-2 text-center text-[9px] ${T.greenDark}`}>
                {memory.length} {L.result.toLowerCase()}(s)
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
