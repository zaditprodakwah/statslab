// useSUSAudio — Web Audio API synth sounds (zero external files)
// pop: short 80Hz → 200Hz blip (<80ms)
// chime: success chord using 3-oscillator stack

let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

export function playPop() {
  try {
    const ac = getCtx()
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.connect(g)
    g.connect(ac.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(180, ac.currentTime)
    o.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.06)
    g.gain.setValueAtTime(0.18, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
    o.start(ac.currentTime)
    o.stop(ac.currentTime + 0.09)
  } catch (_) { /* fail silently on blocked AudioContext */ }
}

export function playChime() {
  try {
    const ac = getCtx()
    const freqs = [523, 659, 784] // C5–E5–G5 major chord
    freqs.forEach((freq, i) => {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.connect(g)
      g.connect(ac.destination)
      o.type = 'triangle'
      o.frequency.value = freq
      const t = ac.currentTime + i * 0.08
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.15, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.6)
      o.start(t)
      o.stop(t + 0.7)
    })
  } catch (_) {}
}
