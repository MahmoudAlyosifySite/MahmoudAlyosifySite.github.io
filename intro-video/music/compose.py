"""Procedural score for the 90-second introduction film.

80 BPM, 4/4, 1 bar = 3.0 s, 30 bars = 90.0 s, D major.
Everything is synthesised from scratch (additive piano, PolyBLEP supersaw
strings and pad, bowed cello / violin lines, felt pulse, noise swells) and
placed in a synthetic convolution hall.

Run:  py -3.13 compose.py      -> score.wav, score.m4a, score_spectrogram.png
"""
import os
import subprocess
import numpy as np
import scipy.signal as sg
from scipy.ndimage import minimum_filter1d, uniform_filter1d
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
BPM = 80
BEAT = 60.0 / BPM            # 0.75 s
BAR = 4 * BEAT               # 3.0 s
NBARS = 30
DUR = NBARS * BAR            # 90.0 s
N = int(round(DUR * SR))     # 4 320 000 samples
NT = N + 12 * SR             # working length (tails), trimmed at the end
rng = np.random.default_rng(20261018)

NOTE = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6,
        'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11}


def nm(s):
    return 12 * (int(s[-1]) + 1) + NOTE[s[:-1]]


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12.0)


def bt(bar, beat=0.0):
    """Time in seconds of (1-based bar, beat offset)."""
    return (bar - 1) * BAR + beat * BEAT


def human(t, amt=0.008):
    return max(0.0, t + float(np.clip(rng.normal(0, amt / 2), -amt, amt)))


def hvel(v, amt=0.06):
    return float(np.clip(v * (1 + rng.normal(0, amt)), 0.02, 1.0))


def pan_gains(p):
    th = (np.clip(p, -1, 1) + 1) * np.pi / 4
    return np.cos(th), np.sin(th)


def lp(x, fc, order=2):
    return sg.sosfilt(sg.butter(order, fc, 'low', fs=SR, output='sos'), x, axis=-1)


def hp(x, fc, order=2):
    return sg.sosfilt(sg.butter(order, fc, 'high', fs=SR, output='sos'), x, axis=-1)


def bp(x, f1, f2, order=2):
    return sg.sosfilt(sg.butter(order, [f1, f2], 'band', fs=SR, output='sos'), x, axis=-1)


def lp0(x, fc, order=2):   # zero-phase
    return sg.sosfiltfilt(sg.butter(order, fc, 'low', fs=SR, output='sos'), x, axis=-1)


def peq(x, f0, gain_db, q):
    """RBJ peaking EQ."""
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / (2 * q)
    b = [1 + al * A, -2 * np.cos(w), 1 - al * A]
    a = [1 + al / A, -2 * np.cos(w), 1 - al / A]
    return sg.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=-1)


def shelf_hi(x, f0, gain_db):
    A = 10 ** (gain_db / 40)
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / 2 * np.sqrt(2)
    c = np.cos(w)
    b = [A * ((A + 1) + (A - 1) * c + 2 * np.sqrt(A) * al),
         -2 * A * ((A - 1) + (A + 1) * c),
         A * ((A + 1) + (A - 1) * c - 2 * np.sqrt(A) * al)]
    a = [(A + 1) - (A - 1) * c + 2 * np.sqrt(A) * al,
         2 * ((A - 1) - (A + 1) * c),
         (A + 1) - (A - 1) * c - 2 * np.sqrt(A) * al]
    return sg.lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=-1)


def edge_fade(sig, fin=0.002, fout=0.02):
    L = sig.shape[-1]
    a = min(int(fin * SR), L // 2)
    b = min(int(fout * SR), L // 2)
    if a > 0:
        sig[..., :a] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    if b > 0:
        sig[..., L - b:] *= 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, b))
    return sig


class Bus:
    def __init__(self, name, send):
        self.name = name
        self.send = send
        self.x = np.zeros((2, NT))

    def add(self, sig, t):
        s = int(round(max(0.0, t) * SR))
        if s >= NT:
            return
        e = min(s + sig.shape[-1], NT)
        self.x[:, s:e] += sig[:, :e - s]


def automation(points, smooth=True):
    ts = np.array([p[0] for p in points], float)
    vs = np.array([p[1] for p in points], float)
    t = np.arange(NT) / SR
    g = np.interp(t, ts, vs)
    if smooth:
        g = uniform_filter1d(g, int(0.25 * SR))
    return g


# ----------------------------------------------------------------- instruments
def piano_note(midi, vel, dur, pan=None):
    """Additive piano: inharmonic partials, two detuned strings per partial,
    velocity-dependent brightness, two-stage exponential decay, felt hammer."""
    f0 = mtof(midi)
    T0 = float(np.interp(midi, [21, 40, 60, 80, 108], [9.0, 6.5, 4.0, 2.0, 0.7]))
    B = 1.1e-4 * 2 ** ((midi - 48) / 18.0)
    fc = 800 + 5200 * vel ** 1.4                       # brightness
    hammer_pos = 0.118 + rng.uniform(-0.01, 0.01)
    rel = 0.22
    Lmax = int((dur + 1.4) * SR)
    out = np.zeros(Lmax)
    det = rng.uniform(0.4, 1.3) * 5.78e-4                 # cents -> ratio
    amps, specs = [], []
    for k in range(1, 48):
        fk = k * f0 * np.sqrt(1 + B * k * k)
        if fk > 11500:
            break
        a = (1.0 / k ** 0.9) * (0.25 + abs(np.sin(np.pi * k * hammer_pos))) * np.exp(-fk / fc)
        if fk < 120:
            a *= (fk / 120.0) ** 1.5                       # tiny soundboard
        Tk = T0 / (1 + 0.18 * (k - 1) + fk / 2600.0)
        amps.append(a)
        specs.append((fk, Tk))
    amps = np.array(amps)
    amps /= amps.sum() + 1e-9
    for a, (fk, Tk) in zip(amps, specs):
        Lk = min(Lmax, int(min(dur + 1.4, Tk * 9.5) * SR))
        if Lk < 64:
            continue
        t = np.arange(Lk) / SR
        env = 0.62 * np.exp(-t / (0.28 * Tk)) + 0.38 * np.exp(-t / Tk)
        p1, p2 = rng.uniform(0, 2 * np.pi, 2)
        s = np.sin(2 * np.pi * fk * (1 + det) * t + p1) + np.sin(2 * np.pi * fk * (1 - det) * t + p2)
        out[:Lk] += 0.5 * a * env * s
    # damper / pedal release
    t = np.arange(Lmax) / SR
    dmp = np.ones(Lmax)
    m = t > dur
    dmp[m] = np.exp(-(t[m] - dur) / rel)
    out *= dmp
    # soft felt hammer noise
    hl = int(0.05 * SR)
    hn = rng.normal(0, 1, hl) * np.exp(-np.arange(hl) / SR / 0.009)
    hn = lp(hn, 900 + 2500 * vel)
    out[:hl] += hn * 0.035 * vel
    out *= vel ** 1.5 * 0.9
    out = edge_fade(out, 0.003, 0.03)
    if pan is None:
        pan = np.clip((midi - 62) / 40.0, -0.45, 0.45)
    gl, gr = pan_gains(pan)
    return np.vstack([out * gl, out * gr])


def bell(midi, amp, length=6.0, pan=0.0):
    """Soft shimmer chime (inharmonic, slow-ish attack)."""
    f0 = mtof(midi)
    L = int(length * SR)
    t = np.arange(L) / SR
    out = np.zeros(L)
    for r, a, T in [(1.0, 1.0, 2.6), (2.0, 0.35, 1.6), (2.76, 0.22, 1.1),
                    (4.07, 0.10, 0.7), (5.43, 0.05, 0.45)]:
        f = f0 * r
        if f > 9000:
            continue
        out += a * np.exp(-t / T) * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28))
    out *= np.clip(t / 0.012, 0, 1) * amp * 0.25
    out = edge_fade(out, 0.005, 0.1)
    gl, gr = pan_gains(pan)
    sp = np.vstack([out * gl, out * gr])
    # slight decorrelated widening
    d = int(0.011 * SR)
    sp[1, d:] = 0.85 * sp[1, d:] + 0.15 * sp[1, :-d]
    return sp


def blep_saw(freq, phase0=0.0):
    dt = freq / SR
    ph = (phase0 + np.cumsum(dt)) % 1.0
    y = 2.0 * ph - 1.0
    m = ph < dt
    x = ph[m] / dt[m]
    y[m] -= x + x - x * x - 1.0
    m = ph > 1.0 - dt
    x = (ph[m] - 1.0) / dt[m]
    y[m] -= x * x + x + x + 1.0
    return y


def ensemble_note(midi, dur, amp, voices=6, detune=9.0, cutoff=4000, attack=1.2,
                  release=1.8, width=0.7, vib=5.0, vib_rate=5.0, center=0.0):
    """Supersaw section: detuned PolyBLEP saws, delayed vibrato, stereo spread,
    slow raised-cosine envelope."""
    f0 = mtof(midi)
    L = int((dur + release) * SR)
    t = np.arange(L) / SR
    outL = np.zeros(L)
    outR = np.zeros(L)
    pans = np.linspace(-width, width, voices) + center
    rng.shuffle(pans)
    vibenv = np.clip((t - 0.35) / 1.2, 0, 1)
    for v in range(voices):
        c = detune * (2 * v / max(1, voices - 1) - 1) + rng.normal(0, 1.2)
        r = vib_rate * (1 + rng.uniform(-0.18, 0.18))
        cents = (c + vib * vibenv * np.sin(2 * np.pi * r * t + rng.uniform(0, 6.28))
                 + 1.5 * np.sin(2 * np.pi * rng.uniform(0.07, 0.2) * t + rng.uniform(0, 6.28)))
        y = blep_saw(f0 * 2 ** (cents / 1200.0), rng.random())
        gl, gr = pan_gains(pans[v])
        outL += y * gl
        outR += y * gr
    sig = np.vstack([outL, outR]) / np.sqrt(voices)
    sig = lp(sig, min(cutoff, 0.45 * SR), 2)
    env = np.ones(L)
    a = max(1, int(attack * SR))
    env[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    s = int(dur * SR)
    r_ = L - s
    if r_ > 0:
        env[s:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r_))
    return sig * env * amp


def bowed_phrase(notes, amp, voices=((0.0, 0.0),), cutoff=2400, formants=(),
                 vib=16.0, vib_rate=5.3, glide=0.09, attack=0.3, release=0.9,
                 hpf=70.0):
    """Legato bowed line. notes = [(t_start, dur, midi, vel)], contiguous.
    Portamento between notes, vibrato fading in per note, bow-change dips,
    formant resonances. voices = [(detune_cents, pan)]."""
    t0 = notes[0][0]
    t_end = notes[-1][0] + notes[-1][1]
    L = int((t_end - t0 + release) * SR)
    t = np.arange(L) / SR
    pitch = np.full(L, float(notes[0][2]))
    vibd = np.zeros(L)
    lev = np.zeros(L)
    dip = np.ones(L)
    for i, (ts, d, m, v) in enumerate(notes):
        s = int((ts - t0) * SR)
        pitch[s:] = m
        if i > 0 and notes[i - 1][2] != m:
            g = int(glide * SR)
            prev = notes[i - 1][2]
            seg = min(g, L - s)
            w = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, seg))
            pitch[s:s + seg] = prev + (m - prev) * w
        tn = t[s:] - (ts - t0)
        vibd[s:] = vib * np.clip((tn - 0.18) / 0.6, 0, 1)
        # per-note level: gentle swell over the note
        e = int((ts + d - t0) * SR)
        e = min(e, L)
        tt = np.arange(e - s) / SR
        lev[s:e] = v * (0.88 + 0.12 * np.sin(np.pi * np.clip(tt / max(d, 0.3), 0, 1)))
        if i > 0:
            dip[s:] *= 1 - 0.22 * np.exp(-((tn - 0.02) / 0.07) ** 2)
    lev[int((t_end - t0) * SR):] = notes[-1][3]
    lev = uniform_filter1d(lev, int(0.12 * SR))
    env = np.ones(L)
    a = int(attack * SR)
    env[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    s = int((t_end - t0) * SR)
    env[s:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, L - s))
    outL = np.zeros(L)
    outR = np.zeros(L)
    for dc, pn in voices:
        r = vib_rate * (1 + rng.uniform(-0.06, 0.06))
        vt = np.sin(2 * np.pi * r * t + rng.uniform(0, 6.28)) \
            + 0.15 * np.sin(2 * np.pi * r * 0.37 * t)
        f = mtof(pitch + (dc + vibd * vt) / 100.0)
        y = blep_saw(f, rng.random())
        gl, gr = pan_gains(pn)
        outL += y * gl
        outR += y * gr
    sig = np.vstack([outL, outR]) / np.sqrt(len(voices))
    base = lp(sig, cutoff, 2)
    res = 0.55 * base
    for fc, q, g in formants:
        b, a_ = sg.iirpeak(fc, q, fs=SR)
        res = res + g * sg.lfilter(b, a_, base, axis=-1)
    res = hp(res, hpf, 2)
    # faint bow noise riding the level
    bn = bp(rng.normal(0, 1, (2, L)), 1500, 4500) * 0.012
    res = res + bn
    out = res * lev * dip * env * amp
    return edge_fade(out, 0.005, 0.05), t0


def felt_kick(vel):
    L = int(0.9 * SR)
    t = np.arange(L) / SR
    f = 50 + 62 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * (0.7 * np.exp(-t / 0.16) + 0.3 * np.exp(-t / 0.4))
    body += 0.18 * np.sin(ph * 1.5) * np.exp(-t / 0.07)
    click = lp(rng.normal(0, 1, L), 700) * np.exp(-t / 0.006) * 0.25
    out = lp(body + click, 260, 2) * np.clip(t / 0.003, 0, 1) * vel
    out = edge_fade(out, 0.002, 0.08)
    return np.vstack([out, out]) * 0.6


def noise_swell(t_peak, length, amp, lo=2500, hi=8500, decay=0.18):
    """Reversed-cymbal style swell that peaks at t_peak."""
    L = int((length + 1.2) * SR)
    t = np.arange(L) / SR
    nz = rng.normal(0, 1, (2, L))
    bright = bp(nz, lo, hi, 2) + 0.45 * bp(nz, lo * 0.4, lo, 2)
    dark = lp(nz, lo * 0.6, 2)
    x = np.clip(t / length, 0, 1)
    rise = x ** 3
    env = np.where(t <= length, rise, np.exp(-(t - length) / decay))
    sweep = np.where(t <= length, x ** 1.5, 1.0)
    sig = (dark * (1 - sweep) + bright * sweep) * env * amp
    sig = lp(sig, 9500, 2)
    return edge_fade(sig, 0.05, 0.1), t_peak - length


# ----------------------------------------------------------------- harmony
# bar -> chord (half-bar split "X|Y" for sus resolutions)
CHORDS = {1: 'Dadd9', 2: 'Gmaj7/D', 3: 'Bm', 4: 'Asus4',
          5: 'Bm', 6: 'G', 7: 'D', 8: 'A', 9: 'Bm', 10: 'G', 11: 'D', 12: 'Asus4|A',
          13: 'G', 14: 'D/F#', 15: 'Em7', 16: 'Bm', 17: 'G', 18: 'D/F#', 19: 'Em7', 20: 'Asus4|A',
          21: 'D', 22: 'A/C#', 23: 'Bm', 24: 'G', 25: 'Em7|D/F#', 26: 'Asus4|A',
          27: 'Gmaj7', 28: 'Dfin', 29: 'Dfin', 30: 'Dfin'}

# strings: bass, tenor, alto, soprano
SV = {'Dadd9': (38, 50, 57, 64), 'Gmaj7/D': (38, 55, 59, 66), 'Bm': (35, 54, 59, 62),
      'G': (31, 55, 59, 62), 'D': (38, 54, 57, 62), 'A': (33, 52, 57, 61),
      'Asus4': (33, 52, 57, 62), 'Em7': (40, 55, 59, 62), 'D/F#': (42, 54, 57, 62),
      'A/C#': (37, 52, 57, 61), 'Gmaj7': (31, 54, 59, 62), 'Dfin': (38, 57, 66, 69)}

# piano arpeggio voicings (5 notes, low -> high)
PV = {'Bm': (47, 54, 62, 66, 73), 'G': (43, 50, 59, 62, 69), 'D': (50, 57, 64, 66, 69),
      'A': (45, 52, 61, 64, 69), 'Asus4': (45, 52, 62, 64, 69), 'Em7': (40, 47, 55, 62, 66),
      'D/F#': (42, 50, 57, 62, 66), 'A/C#': (49, 52, 57, 61, 64), 'Gmaj7': (43, 50, 59, 66, 69)}


def segments(b0, b1):
    """[(t_start, dur, chord)] for bars b0..b1 inclusive (half-bar splits)."""
    out = []
    for b in range(b0, b1 + 1):
        c = CHORDS[b]
        if '|' in c:
            c1, c2 = c.split('|')
            out += [(bt(b), BAR / 2, c1), (bt(b, 2), BAR / 2, c2)]
        else:
            out.append((bt(b), BAR, c))
    return out


def merge_line(seg, pick):
    """Turn a chord-segment list into tied notes for one voice."""
    notes = []
    for t, d, c in seg:
        m = pick(c)
        if m is None:
            continue
        if notes and notes[-1][2] == m and abs(notes[-1][0] + notes[-1][1] - t) < 1e-6:
            notes[-1][1] += d
        else:
            notes.append([t, d, m])
    return notes


# ----------------------------------------------------------------- score
def compose():
    buses = {k: Bus(k, s) for k, s in [('piano', 0.30), ('pad', 0.55), ('strings', 0.42),
                                         ('cello', 0.32), ('violin', 0.50), ('chime', 0.85),
                                         ('pulse', 0.12), ('fx', 0.55)]}
    P, PAD, STR, VC, VN, CH, PU, FX = (buses[k] for k in
                                       ['piano', 'pad', 'strings', 'cello', 'violin', 'chime', 'pulse', 'fx'])

    # ---------------- PAD (whole piece, automation shapes it) -------------
    seg = segments(1, 30)
    for vi in range(1, 4):
        for t, d, m in merge_line(seg, lambda c, vi=vi: SV[c][vi]):
            last = t + d >= DUR - 1e-6
            dd = d + (0.0 if not last else 0.0)
            PAD.add(ensemble_note(m, dd, 0.16, voices=7, detune=13, cutoff=1500,
                                  attack=2.2 if t < 1 else 1.4, release=2.6 if not last else 1.0,
                                  width=0.95, vib=2.0, vib_rate=4.2), t)
            # airy octave layer, darker and quieter
            PAD.add(ensemble_note(m + 12, dd, 0.055, voices=5, detune=16, cutoff=2600,
                                  attack=2.8, release=2.6 if not last else 1.0,
                                  width=1.0, vib=3.0, vib_rate=3.7), t)

    # ---------------- STRINGS (bars 5-27) --------------------------------
    # notes entering on the 60.0 s climax downbeat (and the 73.5 s held chord)
    # get a short attack that starts a hair early so the chord lands on the cut
    def str_note(m, d, amp, t, **kw):
        for hit, att, pre in ((bt(21), 0.30, 0.12), (bt(25, 2), 0.55, 0.20)):
            if abs(t - hit) < 1e-6:
                kw['attack'] = min(kw['attack'], att)
                t -= pre
                d += pre
        STR.add(ensemble_note(m, d, amp, **kw), t)
    seg = segments(5, 27)
    # bass (cello/bass section)
    for t, d, m in merge_line(seg, lambda c: SV[c][0]):
        str_note(m, d, 0.15, t, voices=6, detune=7, cutoff=750, attack=1.0,
                 release=1.6, width=0.35, vib=4, vib_rate=4.8)
    # tenor
    for t, d, m in merge_line(seg, lambda c: SV[c][1]):
        str_note(m, d, 0.17, t, voices=6, detune=8, cutoff=2200, attack=1.1,
                 release=1.8, width=0.6, vib=6, vib_rate=5.1, center=-0.1)
    # alto (build onwards)
    for t, d, m in merge_line(segments(13, 27), lambda c: SV[c][2]):
        str_note(m, d, 0.11, t, voices=6, detune=8, cutoff=2600, attack=1.3,
                 release=1.8, width=0.7, vib=7, vib_rate=5.3, center=0.1)
    # bass octave doubling (build/climax)
    for t, d, m in merge_line(segments(13, 26), lambda c: SV[c][0] + 12):
        str_note(m, d, 0.07, t, voices=6, detune=8, cutoff=1600, attack=1.4,
                 release=1.8, width=0.5, vib=5, vib_rate=5.0)
    # climax: soprano + wide high octave
    for t, d, m in merge_line(segments(21, 26), lambda c: SV[c][3]):
        str_note(m, d, 0.11, t, voices=7, detune=10, cutoff=3200, attack=1.2,
                 release=2.2, width=0.9, vib=8, vib_rate=5.4)
    for t, d, m in merge_line(segments(21, 26), lambda c: SV[c][2] + 12):
        str_note(m, d, 0.065, t, voices=8, detune=11, cutoff=4200, attack=1.6,
                 release=2.4, width=1.0, vib=9, vib_rate=5.6)
    for t, d, m in merge_line(segments(21, 26), lambda c: SV[c][3] + 12):
        str_note(m, d, 0.05, t, voices=8, detune=12, cutoff=4500, attack=1.8,
                 release=2.4, width=1.0, vib=9, vib_rate=5.7)

    # ---------------- PIANO ---------------------------------------------
    # intro: sparse notes + the two reveal moments
    intro = [(0.9, [69], 0.16), (2.1, [76], 0.14),
             (3.0, [38, 50], 0.36),                 # logo reveal
             (4.5, [66], 0.17), (5.25, [71], 0.15),
             (6.0, [35, 47, 78], 0.38),             # name reveal
             (7.5, [74], 0.17), (8.25, [73], 0.15),
             (9.0, [33, 45], 0.27), (9.75, [64], 0.16), (10.5, [74], 0.18), (11.25, [76], 0.15)]
    for t, ms, v in intro:
        for i, m in enumerate(ms):
            tt = t if t in (3.0, 6.0) else human(t)
            P.add(piano_note(m, hvel(v), 4.5 if m < 50 else 3.0), tt + 0.012 * i)
    CH.add(bell(nm('D6'), 0.55, pan=0.25), 3.0)
    CH.add(bell(nm('A6'), 0.25, pan=-0.3), 3.02)
    CH.add(bell(nm('F#6'), 0.6, pan=-0.2), 6.0)
    CH.add(bell(nm('C#7'), 0.22, pan=0.35), 6.03)
    sw, ts = noise_swell(6.0, 1.6, 0.05, lo=1200, hi=6000, decay=0.25)
    FX.add(sw, ts)

    # arpeggios bars 5-26
    pats = {'verse': [0, 1, 2, 3, 4, 3, 2, 1], 'verse2': [0, 1, 2, 3, 4, 2, 3, 1],
            'build': [0, 1, 2, 3, 4, 3, 2, 3]}
    for b in range(5, 27):
        c = CHORDS[b]
        halves = c.split('|') if '|' in c else [c, c]
        if b <= 8:
            pat, v0 = pats['verse'], 0.30 + 0.012 * (b - 5)
        elif b <= 12:
            pat, v0 = pats['verse2'], 0.34 + 0.01 * (b - 9)
        elif b <= 20:
            pat, v0 = pats['build'], 0.38 + 0.017 * (b - 13)
        else:
            pat, v0 = pats['build'], 0.52 + 0.01 * min(b - 21, 3) - 0.015 * max(0, b - 24)
        for i in range(8):
            if (b == 21 and i == 0) or (b == 25 and i >= 4):
                continue          # replaced by the landing chords below
            ch = halves[0] if i < 4 else halves[1]
            vo = PV[ch]
            m = vo[pat[i]]
            t = bt(b, i * 0.5)
            acc = 0.06 if i == 0 else (0.03 if i == 4 else 0.0)
            seg_end = bt(b, 2) if (i < 4 and halves[0] != halves[1]) else bt(b + 1)
            P.add(piano_note(m, hvel(v0 + acc), seg_end - t + 0.1), human(t))
        if b >= 21:   # brighter climax: octave dyad on beats 1 and 3
            for half, beat in ((0, 0), (1, 2)):
                if b == 25 and beat == 2:
                    continue
                vo = PV[halves[half]]
                for k, m in enumerate((vo[3] + 12, vo[4] + 12)):
                    tb = bt(b, beat) if b == 21 and beat == 0 else human(bt(b, beat))
                    P.add(piano_note(m, hvel(0.36 if beat == 0 else 0.30),
                                     1.4), tb + 0.008 * k)
        elif b >= 17:  # build: a single high answering note on beat 3
            vo = PV[halves[1]]
            P.add(piano_note(vo[4] + 12, hvel(0.24), 1.3), human(bt(b, 2.5)))

    # 60.0 s: the strongest chord of the piece lands exactly on the cut
    for i, m in enumerate([38, 45, 50, 57, 66, 69, 74]):
        P.add(piano_note(m, 0.60 - 0.02 * i, BAR + 0.1), bt(21) + 0.010 * i)
    # 73.5 s: the emotional peak, a held, resolving D/F# (picture empties)
    for i, m in enumerate([42, 50, 57, 66, 69, 74, 78]):
        P.add(piano_note(m, 0.46 - 0.018 * i, 1.6), bt(25, 2) + 0.028 * i)
    CH.add(bell(nm('A6'), 0.22, length=5.0, pan=-0.2), bt(25, 2) + 0.2)

    # outro: bar 27 slow broken Gmaj7, bar 28 final rolled Dadd9
    for i, m in enumerate([43, 50, 59, 66, 69, 66]):
        t = bt(27, i * 0.5 if i < 4 else 2 + (i - 3) * 0.5)
        P.add(piano_note(m, hvel(0.34 - 0.025 * i), bt(28) - t + 0.1), human(t))
    final = [38, 45, 50, 57, 64, 66, 69, 74]
    for i, m in enumerate(final):
        P.add(piano_note(m, 0.40 - 0.015 * i, 8.9 - 0.04 * i), bt(28) + 0.035 * i)
    P.add(piano_note(nm('F#5'), 0.17, 6.0), bt(28, 2))
    P.add(piano_note(nm('A5'), 0.14, 4.5), bt(29, 0.5))
    CH.add(bell(nm('D6'), 0.30, length=7.0, pan=0.2), bt(28) + 0.3)

    # ---------------- PULSE (bars 13-26, beats 1 and 3, lub-dub) --------
    for b in range(13, 27):
        v = 0.30 + 0.035 * (b - 13) if b <= 20 else 0.58 + 0.01 * (b - 21)
        for beat in (0, 2):
            t = bt(b, beat)
            if t >= bt(25, 2) - 1e-6:
                continue
            if b == 21 and beat == 0:
                PU.add(felt_kick(0.95), t)
                PU.add(felt_kick(0.35), t + 0.24)
                continue
            PU.add(felt_kick(hvel(v, 0.04)), human(t, 0.004))
            PU.add(felt_kick(hvel(v * 0.38, 0.04)), human(t + 0.24, 0.004))

    # ---------------- CYMBAL SWELLS -------------------------------------
    sw, ts = noise_swell(bt(13), 2.2, 0.022)
    FX.add(sw, ts)
    sw, ts = noise_swell(bt(21), 3.2, 0.07)   # peaks exactly at 60.0 s
    FX.add(sw, ts)

    # ---------------- CELLO MELODY (bars 13-27) ------------------------
    mel = {13: [('D4', 3), ('E4', 1)], 14: [('F#4', 2), ('E4', 1), ('D4', 1)],
           15: [('E4', 2), ('G4', 1), ('F#4', 1)], 16: [('F#4', 3), ('D4', 1)],
           17: [('B4', 2), ('A4', 1), ('G4', 1)], 18: [('A4', 2), ('F#4', 1), ('D4', 1)],
           19: [('G4', 2), ('F#4', 1), ('E4', 1)], 20: [('E4', 2), ('F#4', 1), ('G4', 1)],
           21: [('A4', 3), ('F#4', 1)], 22: [('E4', 2), ('A4', 2)],
           23: [('B4', 3), ('A4', 1)], 24: [('G4', 2), ('F#4', 1), ('E4', 1)],
           25: [('E4', 2), ('F#4', 2)], 26: [('A4', 2), ('E4', 2)], 27: [('D4', 4)]}

    def line(bars, vel_fn, gap_end=0.12, src=mel):
        notes = []
        for b in bars:
            beat = 0.0
            for name, d in src[b]:
                t = human(bt(b, beat), 0.006)
                notes.append([t, d * BEAT, nm(name), vel_fn(b)])
                beat += d
        for i in range(len(notes) - 1):       # contiguous legato
            notes[i][1] = notes[i + 1][0] - notes[i][0]
        notes[-1][1] -= gap_end
        return [tuple(n) for n in notes]

    cello_kw = dict(voices=((-3.0, -0.25), (3.5, -0.05)), cutoff=2300,
                    formants=((470, 2.2, 0.8), (1150, 3.0, 0.45), (2600, 4.0, 0.18)),
                    vib=17.0, vib_rate=5.2, glide=0.1, hpf=75)
    for bars, vf in [(range(13, 17), lambda b: 0.50 + 0.03 * (b - 13)),
                     (range(17, 21), lambda b: 0.62 + 0.035 * (b - 17)),
                     (range(21, 28), lambda b: 0.85 if b < 27 else 0.55)]:
        notes = line(list(bars), vf, gap_end=0.12 if 27 not in bars else -1.2)
        sig, t0 = bowed_phrase(notes, 0.30, attack=0.35, release=1.2 if 27 not in bars else 1.8,
                               **cello_kw)
        VC.add(sig, t0)

    # ---------------- HIGH COUNTERMELODY (bars 21-27) ------------------
    cm = {21: [('F#5', 4)], 22: [('E5', 4)], 23: [('F#5', 2), ('D5', 2)],
          24: [('D5', 2), ('G5', 2)], 25: [('G5', 2), ('A5', 2)], 26: [('E5', 2), ('C#5', 2)],
          27: [('D5', 4)]}
    notes = line(list(range(21, 28)), lambda b: 0.8 if b < 27 else 0.5, gap_end=-1.0, src=cm)
    sig, t0 = bowed_phrase(notes, 0.10, voices=((-7, 0.55), (-2, 0.3), (2.5, 0.1), (6, 0.4)),
                           cutoff=3800, formants=((900, 2.0, 0.5), (2400, 3.0, 0.3)),
                           vib=13.0, vib_rate=5.6, glide=0.12, attack=1.2, release=2.0, hpf=200)
    VN.add(sig, t0)

    # ---------------- bus automation -------------------------------------
    PAD.x *= automation([(0, 0), (0.5, 0.02), (3, 0.28), (6, 0.58), (10, 0.75), (12, 0.75),
                         (24, 0.6), (36, 0.55), (58, 0.7), (60, 0.85), (78, 0.95), (81, 1.15), (90, 1.15)])
    STR.x *= automation([(0, 0), (12, 0.75), (24, 0.85), (36, 0.85), (58, 1.0), (60, 1.15),
                         (76, 1.1), (78, 0.9), (81, 0.25), (84, 0.0), (90, 0.0)])
    w = automation([(0, 0.15), (36, 0.25), (57, 0.5), (61, 0.95), (77, 0.85), (81, 0.3), (90, 0.3)])
    STR.x = lp0(STR.x, 1400) * (1 - w) + lp0(STR.x, 5500) * w
    STR.x = peq(STR.x, 330, -2.5, 0.9)
    PAD.x = peq(lp0(PAD.x, 4500), 300, -4.0, 0.8)
    return buses


# ----------------------------------------------------------------- reverb
def make_ir(length=3.8, pre=0.022):
    L = int(length * SR)
    t = np.arange(L) / SR
    ir = np.zeros((2, L))
    bands = [(None, 350, 3.4), (350, 2500, 3.0), (2500, 6000, 2.0), (6000, None, 1.1)]
    for ch in range(2):
        nz = rng.normal(0, 1, L)
        acc = np.zeros(L)
        for lo_, hi_, rt in bands:
            if lo_ is None:
                x = lp(nz, hi_, 4)
            elif hi_ is None:
                x = hp(nz, lo_, 4)
            else:
                x = bp(nz, lo_, hi_, 2)
            acc += x * np.exp(-6.91 * t / rt)
        # sparse early reflections
        for _ in range(14):
            k = int(rng.uniform(0.004, 0.075) * SR)
            acc[k] += rng.uniform(-1, 1) * 3.0
        acc *= np.clip(t / 0.03, 0, 1)            # soft onset
        acc = edge_fade(acc, 0.0, 0.4)
        ir[ch] = acc
    ir = np.concatenate([np.zeros((2, int(pre * SR))), ir], axis=1)
    ir /= np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
    return ir


# ----------------------------------------------------------------- master
def master(buses):
    dry = np.zeros((2, NT))
    send = np.zeros((2, NT))
    gains = {'piano': 1.0, 'pad': 0.85, 'strings': 0.95, 'cello': 1.0, 'violin': 0.9,
             'chime': 0.8, 'pulse': 0.9, 'fx': 1.0}
    for k, b in buses.items():
        dry += b.x * gains[k]
        send += b.x * gains[k] * b.send
    send = lp(hp(send, 180, 2), 8000, 2)
    ir = make_ir()
    wet = np.vstack([sg.oaconvolve(send[0], ir[0])[:NT], sg.oaconvolve(send[1], ir[1])[:NT]])
    wet *= 0.9
    mix = dry + wet
    print(f'  wet/dry RMS ratio: {np.sqrt((wet**2).mean() / (dry**2).mean()):.2f}')

    # EQ: rumble, low-mid tidy, gentle top
    mix = sg.sosfiltfilt(sg.butter(4, 30, 'high', fs=SR, output='sos'), mix, axis=-1)
    mix = peq(mix, 290, -1.5, 0.8)
    mix = peq(mix, 3500, 1.2, 0.7)
    mix = shelf_hi(mix, 10000, -1.5)
    mix = lp(mix, 16000, 2)
    mix = mix[:, :N]

    # gentle RMS compressor (2:1, slow)
    mono = 0.5 * (mix[0] ** 2 + mix[1] ** 2)
    a = np.exp(-1 / (0.12 * SR))
    pw = sg.lfilter([1 - a], [1, -a], mono)
    lvl = 10 * np.log10(pw + 1e-12)
    thr = np.percentile(lvl[N // 2:], 60)
    gr = np.where(lvl > thr, -(lvl - thr) * 0.5, 0.0)
    a2 = np.exp(-1 / (0.3 * SR))
    gr = sg.lfilter([1 - a2], [1, -a2], gr)
    mix *= 10 ** (gr / 20)

    # brickwall-ish look-ahead limiter at -1 dBFS
    ceil = 10 ** (-1 / 20)
    pk = np.max(np.abs(mix), axis=0)
    mix *= ceil / np.percentile(pk, 99.995) * 1.0
    pk = np.max(np.abs(mix), axis=0)
    g = np.minimum(1.0, ceil / np.maximum(pk, 1e-9))
    W = int(0.02 * SR) | 1
    g = minimum_filter1d(g, W)
    g = uniform_filter1d(g, W)
    mix *= g
    mix *= ceil / np.max(np.abs(mix))

    # global fades: gentle open, final chord fades to true silence by 90.0 s
    t = np.arange(N) / SR
    fade = np.ones(N)
    m = t >= 83.5
    x = (t[m] - 83.5) / (89.85 - 83.5)
    fade[m] = np.clip(1 - x, 0, 1) ** 2.2
    fade[:int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix *= fade
    mix -= mix.mean(axis=1, keepdims=True) * 0  # DC handled by HPF (kept explicit)
    return mix


def analyse(mix):
    t = DUR
    assert mix.shape[1] == N
    print(f'  duration: {mix.shape[1] / SR:.6f} s  ({mix.shape[1]} samples)')
    print(f'  NaN/Inf: {bool(np.isnan(mix).any() or np.isinf(mix).any())}')
    print(f'  peak: {20 * np.log10(np.max(np.abs(mix))):.2f} dBFS')
    print(f'  DC offset: L {mix[0].mean():.2e}  R {mix[1].mean():.2e}')
    print(f'  last 50 ms peak: {20 * np.log10(np.max(np.abs(mix[:, -2400:])) + 1e-12):.1f} dBFS')
    secs = [('intro', 0, 12), ('verse', 12, 36), ('build', 36, 60), ('climax', 60, 78), ('outro', 78, 90)]
    for name, a, b in secs:
        x = mix[:, int(a * SR):int(b * SR)]
        rms = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
        f, P = sg.welch(x.mean(axis=0), SR, nperseg=8192)
        tot = P.sum()
        hi = P[f > 8000].sum() / tot
        mud = P[(f > 200) & (f < 400)].sum() / tot
        low = P[f < 120].sum() / tot
        pres = P[(f > 2000) & (f < 8000)].sum() / tot
        print(f'  {name:6s} {a:2d}-{b:2d}s  RMS {rms:6.1f} dBFS   >8k {100*hi:6.3f}%  2-8k {100*pres:5.2f}%  200-400 {100*mud:5.1f}%  <120 {100*low:5.1f}%')


def spectrogram_png(mix, path):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    x = mix.mean(axis=0)
    f, tt, S = sg.spectrogram(x, SR, nperseg=4096, noverlap=3072)
    S = 10 * np.log10(S + 1e-14)
    fig, ax = plt.subplots(figsize=(16, 6), dpi=100)
    ax.pcolormesh(tt, f, S, shading='auto', cmap='magma', vmin=S.max() - 100, vmax=S.max())
    ax.set_yscale('symlog', linthresh=200)
    ax.set_ylim(30, 20000)
    for s in (12, 36, 60, 78, 81):
        ax.axvline(s, color='w', lw=0.6, alpha=0.6)
    ax.set_xlabel('time (s)')
    ax.set_ylabel('Hz')
    ax.set_title('score — intro | verse | build | climax | outro')
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def main():
    print('composing...')
    buses = compose()
    print('mixing...')
    mix = master(buses)
    analyse(mix)
    wav = os.path.join(HERE, 'score.wav')
    wavfile.write(wav, SR, mix.T.astype(np.float32))
    spectrogram_png(mix, os.path.join(HERE, 'score_spectrogram.png'))
    import imageio_ffmpeg
    ff = imageio_ffmpeg.get_ffmpeg_exe()
    m4a = os.path.join(HERE, 'score.m4a')
    subprocess.run([ff, '-y', '-loglevel', 'error', '-i', wav, '-c:a', 'aac', '-b:a', '256k',
                    '-ar', str(SR), m4a], check=True)
    print('wrote', wav, m4a)


if __name__ == '__main__':
    main()
