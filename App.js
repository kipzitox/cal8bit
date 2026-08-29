import { StatusBar } from 'expo-status-bar';
import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer, setAudioModeAsync } from 'expo-audio';

const PIXEL_FONT = Platform.OS === 'web' ? 'Courier New, monospace' : 'monospace';

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
  },
};

const THEMES = {
  retro: {
    bg: '#0d0d0d', screenBg: '#1a1a00',
    btnNum: '#2a2a2a', btnNumBorder: '#444444',
    btnOp: '#3a1a00', btnOpBorder: '#ff6600',
    btnFn: '#001a3a', btnFnBorder: '#3399ff',
    btnEq: '#003a00', btnEqBorder: '#33ff33',
    btnSci: '#1a0033', btnSciBorder: '#9933ff',
    green: '#33ff33', greenDim: '#1a8a1a', greenDark: '#0d4d0d',
    orange: '#ff6600', blue: '#3399ff', purple: '#9933ff',
    scanline: 'rgba(0,0,0,0.15)', label: '#0d4d0d',
  },
  amber: {
    bg: '#0d0800', screenBg: '#1a1000',
    btnNum: '#2a2000', btnNumBorder: '#554400',
    btnOp: '#3a2000', btnOpBorder: '#ffaa00',
    btnFn: '#1a1a00', btnFnBorder: '#ccaa44',
    btnEq: '#3a3000', btnEqBorder: '#ffcc00',
    btnSci: '#2a1500', btnSciBorder: '#cc8844',
    green: '#ffaa00', greenDim: '#8a6600', greenDark: '#4d3500',
    orange: '#ff8800', blue: '#ccaa44', purple: '#cc8844',
    scanline: 'rgba(0,0,0,0.15)', label: '#4d3500',
  },
  cyber: {
    bg: '#000510', screenBg: '#000a1a',
    btnNum: '#001133', btnNumBorder: '#003366',
    btnOp: '#1a0033', btnOpBorder: '#ff00ff',
    btnFn: '#001a1a', btnFnBorder: '#00ffff',
    btnEq: '#001a33', btnEqBorder: '#00ffff',
    btnSci: '#1a001a', btnSciBorder: '#ff00ff',
    green: '#00ffff', greenDim: '#007788', greenDark: '#003344',
    orange: '#ff00ff', blue: '#00ffff', purple: '#ff00ff',
    scanline: 'rgba(0,10,30,0.2)', label: '#003344',
  },
  blood: {
    bg: '#0d0000', screenBg: '#1a0000',
    btnNum: '#2a0808', btnNumBorder: '#551111',
    btnOp: '#3a0000', btnOpBorder: '#ff3333',
    btnFn: '#1a0010', btnFnBorder: '#ff6688',
    btnEq: '#3a0000', btnEqBorder: '#ff0000',
    btnSci: '#2a0020', btnSciBorder: '#ff66ff',
    green: '#ff3333', greenDim: '#881111', greenDark: '#440808',
    orange: '#ff6633', blue: '#ff6688', purple: '#ff66ff',
    scanline: 'rgba(0,0,0,0.15)', label: '#440808',
  },
  mono: {
    bg: '#0a0a0a', screenBg: '#1a1a1a',
    btnNum: '#2a2a2a', btnNumBorder: '#555555',
    btnOp: '#333333', btnOpBorder: '#888888',
    btnFn: '#1a1a1a', btnFnBorder: '#666666',
    btnEq: '#3a3a3a', btnEqBorder: '#ffffff',
    btnSci: '#252525', btnSciBorder: '#777777',
    green: '#ffffff', greenDim: '#999999', greenDark: '#444444',
    orange: '#cccccc', blue: '#bbbbbb', purple: '#aaaaaa',
    scanline: 'rgba(0,0,0,0.12)', label: '#333333',
  },
};

const SCREEN_FLEX = { small: 1.5, medium: 2.2, large: 3.2 };

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

const factorial = (n) => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const [pressed, setPressed] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState([]);
  const [pendingFn, setPendingFn] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [themeKey, setThemeKey] = useState('retro');
  const [lang, setLang] = useState('es');
  const [showScanlines, setShowScanlines] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [btnRadius, setBtnRadius] = useState(4);
  const [glowIntensity, setGlowIntensity] = useState(8);
  const [sciMode, setSciMode] = useState(false);
  const [screenSize, setScreenSize] = useState('medium');

  const T = THEMES[themeKey];
  const L = LANG[lang];

  const numPlayer = useAudioPlayer(require('./assets/sounds/num.wav'));
  const opPlayer = useAudioPlayer(require('./assets/sounds/op.wav'));
  const eqPlayer = useAudioPlayer(require('./assets/sounds/eq.wav'));
  const clearPlayer = useAudioPlayer(require('./assets/sounds/clear.wav'));
  const sciPlayer = useAudioPlayer(require('./assets/sounds/sci.wav'));

  useEffect(() => {
    (async () => {
      try {
        await setAudioModeAsync({ playsInSilentModeIOS: false, staysActiveInBackground: false, interruptionMode: 'duckOthers' });
      } catch (e) {}
    })();
  }, []);

  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const p = { num: numPlayer, op: opPlayer, eq: eqPlayer, clear: clearPlayer, sci: sciPlayer }[type];
      if (!p) return;
      p.seekTo(0);
      p.play();
    } catch (e) {}
  };

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const PADDING = isTablet ? 32 : 10;
  const GAP = sciMode ? 3 : 5;

  const displayFontSize = (() => {
    const m = screenSize === 'small' ? 0.75 : screenSize === 'large' ? 1.15 : 1;
    if (display.length > 10) return Math.floor(24 * m);
    if (display.length > 7) return Math.floor(32 * m);
    return Math.floor(46 * m);
  })();

  const formatNumber = (num) => {
    if (num === 'Error' || isNaN(num)) return 'ERR0R';
    if (!isFinite(num)) return num > 0 ? '∞' : '-∞';
    const n = parseFloat(String(num));
    if (isNaN(n)) return '0';
    if (Math.abs(n) >= 1e12) return n.toExponential(4);
    return Number.isInteger(n) ? String(n) : parseFloat(n.toPrecision(10)).toString();
  };

  const calculate = useCallback((a, b, operator) => {
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

  const applyScientific = (fn, val) => {
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

  const handlePress = (value) => {
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
    if (value === '(' || value === ')') { playSound('num'); return; }

    if (sciFns.includes(value)) playSound('sci');
    else if (value === 'C' || value === '⌫') playSound('clear');
    else if (value === '=') playSound('eq');
    else if (['+', '-', '×', '÷', 'xⁿ', '%', '+/-'].includes(value)) playSound('op');
    else playSound('num');

    switch (value) {
      case 'C':
        setDisplay('0'); setPrev(null); setOp(null); setHistory(''); setFresh(true); setPendingFn(null);
        break;
      case '⌫':
        if (display !== 'ERR0R' && display.length > 1) setDisplay((d) => d.slice(0, -1));
        else setDisplay('0');
        break;
      case '+/-':
        if (display !== '0' && display !== 'ERR0R') setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d));
        break;
      case '%':
        if (display !== 'ERR0R') {
          const r = formatNumber(parseFloat(display) / 100);
          const expr = `${display}% = ${r}`;
          setHistory(`${display}% =`);
          setMemory((m) => [{ expr, result: r, ts: Date.now() }, ...m]);
          setDisplay(r); setFresh(true);
        }
        break;
      case '+': case '-': case '×': case '÷': case 'xⁿ':
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
        if (fresh) { setDisplay('0.'); setFresh(false); }
        else if (!display.includes('.')) setDisplay((d) => d + '.');
        break;
      default:
        if (fresh) { setDisplay(value); setFresh(false); }
        else setDisplay((d) => (d === '0' ? value : d + value));
    }
  };

  const isOperator = (v) => ['+', '-', '×', '÷'].includes(v);
  const isSpecial = (v) => ['C', '+/-', '%', '⌫'].includes(v);
  const isEquals = (v) => v === '=';
  const isSciBtn = (v) => !['+','-','×','÷','=','0','1','2','3','4','5','6','7','8','9','.','⌫'].includes(v);

  const getBtnStyle = (value) => {
    if (isEquals(value)) return { backgroundColor: T.btnEq, borderColor: T.btnEqBorder };
    if (isSpecial(value)) return { backgroundColor: T.btnFn, borderColor: T.btnFnBorder };
    if (isOperator(value)) return { backgroundColor: T.btnOp, borderColor: T.btnOpBorder };
    if (isSciBtn(value) && sciMode) return { backgroundColor: T.btnSci, borderColor: T.btnSciBorder };
    return { backgroundColor: T.btnNum, borderColor: T.btnNumBorder };
  };

  const getBtnTextColor = (value) => {
    if (isEquals(value)) return T.green;
    if (isSpecial(value)) return T.blue;
    if (isOperator(value)) return T.orange;
    if (isSciBtn(value) && sciMode) return T.purple;
    return T.greenDim;
  };

  const SettingToggle = ({ label, value: val, onToggle }) => (
    <TouchableOpacity style={styles.settingRow} onPress={onToggle} activeOpacity={0.7}>
      <Text style={[styles.settingLabel, { color: T.greenDim }]}>{label}</Text>
      <View style={[styles.toggle, { backgroundColor: val ? T.green : '#222', borderColor: T.greenDim }]}>
        <View style={[styles.toggleKnob, { transform: [{ translateX: val ? 18 : 0 }], backgroundColor: val ? '#000' : '#555' }]} />
      </View>
    </TouchableOpacity>
  );

  const OptionSelector = ({ label, options, value: val, onSelect }) => (
    <View style={styles.settingRow}>
      {label ? <Text style={[styles.settingLabel, { color: T.greenDim }]}>{label}</Text> : <View />}
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <TouchableOpacity key={opt.value} style={[styles.optionBtn, { borderColor: T.greenDim }, val === opt.value && { backgroundColor: T.green, borderColor: T.green }]} onPress={() => onSelect(opt.value)} activeOpacity={0.7}>
            <Text style={[styles.optionText, { color: val === opt.value ? '#000' : T.greenDim }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.root, { backgroundColor: T.bg }]} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="light" />

      <View style={[styles.titleBar, { borderColor: T.greenDark }]}>
        <Text style={[styles.titleText, { color: T.greenDim, fontSize: sciMode ? 11 : 13 }]} numberOfLines={1}>
          {sciMode ? '▸ CAL8BIT SCI ◂' : `▸ ${L.title} ◂`}
        </Text>
        <TouchableOpacity style={[styles.memBtn, { borderColor: T.greenDark }]} onPress={() => { playSound('sci'); setShowMemory(true); }} activeOpacity={0.7}>
          <Text style={[styles.memBtnText, { color: memory.length > 0 ? T.green : T.greenDim }]}>
            [{memory.length}]
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingsBtn, { borderColor: T.greenDark }]} onPress={() => { playSound('sci'); setShowSettings(true); }} activeOpacity={0.7}>
          <Text style={[styles.settingsBtnText, { color: T.greenDim }]}>[::]</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.screenFrame, { borderColor: T.greenDark, marginHorizontal: isTablet ? 32 : 10, flex: SCREEN_FLEX[screenSize] }]}>
        <View style={[styles.screenInner, { backgroundColor: T.screenBg, borderColor: T.greenDim }]}>
          {showScanlines && <View style={[styles.scanlines, { backgroundColor: T.scanline }]} />}
          <View style={styles.displayArea}>
            <Text style={[styles.prevText, { color: T.greenDark, fontSize: 11 }]} numberOfLines={1}>
              {history || L.ready}
            </Text>
            <View style={[styles.displayUnderline, { borderBottomColor: T.greenDim }]}>
              <Text style={[styles.displayText, { fontSize: displayFontSize, color: T.green }, glowIntensity > 0 && { textShadow: { radius: glowIntensity, color: T.green } }]} numberOfLines={1}>
                {display}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {showLabels && !sciMode && (
        <View style={[styles.labelRow, { marginHorizontal: isTablet ? 36 : 14 }]}>
          <Text style={[styles.labelText, { color: T.label }]}>{L.mem}: {display}</Text>
          <Text style={[styles.labelText, { color: T.label }]}>{L.op}: {op || '---'}</Text>
        </View>
      )}

      <View style={styles.buttonsArea}>
        {sciMode && (
          <View style={styles.sciGrid}>
            {buildSciButtons().map((row, ri) => (
              <View key={`sci-${ri}`} style={[styles.row, { gap: GAP, marginBottom: GAP }]}>
                {row.map((btn) => (
                  <TouchableOpacity key={btn} activeOpacity={0.6}
                    style={[styles.btn, getBtnStyle(btn), { flex: 1, aspectRatio: 2.2, borderRadius: btnRadius, borderWidth: 2,
                      transform: pressed === btn ? [{ translateY: 2 }] : [], borderBottomWidth: pressed === btn ? 1 : 2 }]}
                    onPress={() => handlePress(btn)}>
                    <Text style={[styles.btnText, { color: getBtnTextColor(btn), fontSize: 11 }, pressed === btn && styles.btnTextPressed]}>{btn}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}

        <View style={styles.stdGrid}>
          {buildButtons().map((row, ri) => (
            <View key={`std-${ri}`} style={[styles.row, { gap: GAP, marginBottom: GAP, flex: 1 }]}>
              {row.map((btn) => {
                const wide = btn === '0';
                return (
                  <TouchableOpacity key={btn} activeOpacity={0.6}
                    style={[styles.btn, getBtnStyle(btn), { flex: wide ? 2 : 1, borderRadius: btnRadius,
                      transform: pressed === btn ? [{ translateY: 2 }] : [], borderBottomWidth: pressed === btn ? 1 : 3 }]}
                    onPress={() => handlePress(btn)}>
                    <Text style={[styles.btnText, { color: getBtnTextColor(btn) }, pressed === btn && styles.btnTextPressed]}>
                      {btn === '+/-' ? '+/-' : btn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <Modal visible={showSettings} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: T.bg, borderColor: T.green }]}>
            <View style={[styles.modalHeader, { borderBottomColor: T.greenDark }]}>
              <Text style={[styles.modalTitle, { color: T.green }]}>[ {L.settings.toUpperCase()} ]</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)} activeOpacity={0.7}>
                <Text style={[styles.modalClose, { color: T.orange }]}>[X]</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.language.toUpperCase()}</Text>
              <OptionSelector label="" options={[{ label: 'ES', value: 'es' }, { label: 'EN', value: 'en' }]} value={lang} onSelect={setLang} />

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.mode.toUpperCase()}</Text>
              <SettingToggle label={sciMode ? L.scientific.toUpperCase() : L.basic.toUpperCase()} value={sciMode} onToggle={() => setSciMode(!sciMode)} />

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.screenSize.toUpperCase()}</Text>
              <OptionSelector label="" options={[{ label: L.small.toUpperCase(), value: 'small' }, { label: L.medium.toUpperCase(), value: 'medium' }, { label: L.large.toUpperCase(), value: 'large' }]} value={screenSize} onSelect={setScreenSize} />

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.theme.toUpperCase()}</Text>
              <View style={styles.themeGrid}>
                {Object.keys(THEMES).map((key) => (
                  <TouchableOpacity key={key} activeOpacity={0.7}
                    style={[styles.themeBtn, { backgroundColor: THEMES[key].bg, borderColor: themeKey === key ? THEMES[key].green : THEMES[key].greenDark }, themeKey === key && { borderWidth: 3 }]}
                    onPress={() => setThemeKey(key)}>
                    <Text style={[styles.themeBtnLabel, { color: THEMES[key].green }]}>{key.toUpperCase()}</Text>
                    <View style={[styles.themePreview, { backgroundColor: THEMES[key].screenBg }]}>
                      <View style={[styles.themePreviewBtn, { backgroundColor: THEMES[key].btnNum }]} />
                      <View style={[styles.themePreviewBtn, { backgroundColor: THEMES[key].btnOp }]} />
                      <View style={[styles.themePreviewBtn, { backgroundColor: THEMES[key].btnEq }]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.display.toUpperCase()}</Text>
              <SettingToggle label={L.scanlines.toUpperCase()} value={showScanlines} onToggle={() => setShowScanlines(!showScanlines)} />
              <SettingToggle label={L.labels.toUpperCase()} value={showLabels} onToggle={() => setShowLabels(!showLabels)} />
              <SettingToggle label={L.sound.toUpperCase()} value={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.buttons.toUpperCase()}</Text>
              <OptionSelector label={L.style.toUpperCase()} options={[{ label: L.square.toUpperCase(), value: 2 }, { label: L.soft.toUpperCase(), value: 8 }, { label: L.round.toUpperCase(), value: 20 }]} value={btnRadius} onSelect={setBtnRadius} />

              <Text style={[styles.sectionTitle, { color: T.greenDim }]}>▸ {L.glow.toUpperCase()}</Text>
              <OptionSelector label={L.intensity.toUpperCase()} options={[{ label: 'OFF', value: 0 }, { label: 'LOW', value: 4 }, { label: 'MED', value: 8 }, { label: 'HIGH', value: 16 }]} value={glowIntensity} onSelect={setGlowIntensity} />
            </ScrollView>
            <View style={[styles.modalFooter, { borderTopColor: T.greenDark }]}>
              <Text style={[styles.footerText, { color: T.greenDark }]}>{L.version}</Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showMemory} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: T.bg, borderColor: T.green }]}>
            <View style={[styles.modalHeader, { borderBottomColor: T.greenDark }]}>
              <Text style={[styles.modalTitle, { color: T.green }]}>[ {L.memory.toUpperCase()} ]</Text>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                {memory.length > 0 && (
                  <TouchableOpacity onPress={() => setMemory([])} activeOpacity={0.7}>
                    <Text style={[styles.modalClose, { color: T.orange, fontSize: 14 }]}>{L.clearMem.toUpperCase()}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShowMemory(false)} activeOpacity={0.7}>
                  <Text style={[styles.modalClose, { color: T.orange }]}>[X]</Text>
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView style={styles.modalScroll}>
              {memory.length === 0 ? (
                <Text style={[styles.emptyMemText, { color: T.greenDark }]}>{L.noMemory}</Text>
              ) : (
                memory.map((item, i) => (
                  <TouchableOpacity key={`${item.ts}-${i}`} style={[styles.memItem, { borderBottomColor: T.greenDark }]} activeOpacity={0.7}
                    onPress={() => { playSound('sci'); setDisplay(item.result); setShowMemory(false); setFresh(true); }}>
                    <Text style={[styles.memExpr, { color: T.greenDim }]} numberOfLines={1}>{item.expr}</Text>
                    <Text style={[styles.memResult, { color: T.green }]} numberOfLines={1}>= {item.result}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <View style={[styles.modalFooter, { borderTopColor: T.greenDark }]}>
              <Text style={[styles.footerText, { color: T.greenDark }]}>{memory.length} {L.result.toLowerCase()}(s)</Text>
            </View>
          </View>
        </View>
      </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111',
    borderWidth: 2,
    marginHorizontal: 10,
    marginBottom: 4,
    paddingHorizontal: 10,
    height: 36,
  },
  titleText: {
    fontFamily: PIXEL_FONT,
    letterSpacing: 3,
    flex: 1,
  },
  settingsBtn: {
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  settingsBtnText: {
    fontFamily: PIXEL_FONT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  memBtn: {
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  memBtnText: {
    fontFamily: PIXEL_FONT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  screenFrame: {
    borderWidth: 3,
    padding: 3,
    marginBottom: 2,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  screenInner: {
    borderWidth: 2,
    padding: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  displayArea: {
    alignItems: 'flex-end',
  },
  prevText: {
    fontFamily: PIXEL_FONT,
    marginBottom: 2,
    alignSelf: 'flex-end',
    letterSpacing: 1,
  },
  displayUnderline: {
    borderBottomWidth: 2,
    paddingBottom: 2,
    alignSelf: 'stretch',
    alignItems: 'flex-end',
  },
  displayText: {
    fontFamily: PIXEL_FONT,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginBottom: 2,
    height: 20,
    alignItems: 'center',
  },
  labelText: {
    fontFamily: PIXEL_FONT,
    fontSize: 10,
    letterSpacing: 1,
  },
  buttonsArea: {
    flex: 3,
    paddingHorizontal: 10,
    justifyContent: 'flex-end',
  },
  sciGrid: {},
  stdGrid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  btnText: {
    fontFamily: PIXEL_FONT,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
  btnTextPressed: {
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '92%',
    maxWidth: 420,
    maxHeight: '85%',
    borderWidth: 3,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  modalClose: {
    fontFamily: PIXEL_FONT,
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontFamily: PIXEL_FONT,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
    marginTop: 10,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeBtn: {
    width: '31%',
    borderWidth: 2,
    padding: 6,
    marginBottom: 6,
  },
  themeBtnLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  themePreview: {
    flexDirection: 'row',
    gap: 2,
    padding: 3,
  },
  themePreviewBtn: {
    width: 12,
    height: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingLabel: {
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    letterSpacing: 1,
  },
  toggle: {
    width: 42,
    height: 22,
    borderWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleKnob: {
    width: 16,
    height: 16,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 4,
  },
  optionBtn: {
    borderWidth: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionText: {
    fontFamily: PIXEL_FONT,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalFooter: {
    borderTopWidth: 2,
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontFamily: PIXEL_FONT,
    fontSize: 9,
    letterSpacing: 2,
  },
  emptyMemText: {
    fontFamily: PIXEL_FONT,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 40,
    letterSpacing: 2,
  },
  memItem: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  memExpr: {
    fontFamily: PIXEL_FONT,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 2,
  },
  memResult: {
    fontFamily: PIXEL_FONT,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
