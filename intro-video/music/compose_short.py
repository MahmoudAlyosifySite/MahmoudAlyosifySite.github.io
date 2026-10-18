"""30-second short score (website version of the introduction film).

Same instruments, hall and mastering as compose.py (imported, not modified).
80 BPM, 4/4, 1 bar = 3.0 s, 10 bars = 30.0 s, D major.

  bars 1-4  (0-12 s)   the original intro: pad from silence, low D + chime at 3.0,
                       low B + chime + swell at 6.0, Asus4 in bar 4
  bars 5-6  (12-18 s)  intimate breath on black: one piano dyad on each word
                       at 13.5 / 15.0 / 16.5 (Gmaj7 -> Em7 -> Asus4), no pulse
  bar 7     (18-21 s)  warm bloom: D/F# -> Gmaj7, cello rising, strings grow
  bar 8     (21.0 s)   final rolled D(add9) lands exactly at 21.0 with a D6 chime
  bars 9-10 (24-30 s)  rings, a soft high note at 24.0, fades to silence by 29.85

Run:  py -3.13 compose_short.py  -> score_short.wav, score_short.m4a,
                                    score_short_spectrogram.png
"""
import os
import subprocess
import numpy as np
import scipy.signal as sg
from scipy.io import wavfile

import compose as C

HERE = os.path.dirname(os.path.abspath(__file__))
SR = C.SR
NBARS = 10
DUR = NBARS * C.BAR                    # 30.0 s
N = int(round(DUR * SR))               # 1 440 000 samples

# retarget the shared engine to the short length (module globals are read at call time)
C.NBARS, C.DUR, C.N, C.NT = NBARS, DUR, N, N + 12 * SR
C.rng = np.random.default_rng(20261018)
C.CHORDS = {1: 'Dadd9', 2: 'Gmaj7/D', 3: 'Bm', 4: 'Asus4',
            5: 'Asus4|Gmaj7', 6: 'Em7|Asus4', 7: 'D/F#|Gmaj7',
            8: 'Dfin', 9: 'Dfin', 10: 'Dfin'}

bt, nm, Bus = C.bt, C.nm, C.Bus
piano_note, bell, ensemble_note = C.piano_note, C.bell, C.ensemble_note


def compose_short():
    buses = {k: Bus(k, s) for k, s in [('piano', 0.30), ('pad', 0.55), ('strings', 0.42),
                                         ('cello', 0.32), ('violin', 0.50), ('chime', 0.85),
                                         ('pulse', 0.12), ('fx', 0.55)]}
    P, PAD, STR, VC, CH, FX = (buses[k] for k in ['piano', 'pad', 'strings', 'cello', 'chime', 'fx'])

    # ---------------- PAD (identical voicing / engine to the long score) ---
    seg = C.segments(1, NBARS)
    for vi in range(1, 4):
        for t, d, m in C.merge_line(seg, lambda c, vi=vi: C.SV[c][vi]):
            last = t + d >= DUR - 1e-6
            PAD.add(ensemble_note(m, d, 0.16, voices=7, detune=13, cutoff=1500,
                                  attack=2.2 if t < 1 else 1.4, release=2.6 if not last else 1.0,
                                  width=0.95, vib=2.0, vib_rate=4.2), t)
            PAD.add(ensemble_note(m + 12, d, 0.055, voices=5, detune=16, cutoff=2600,
                                  attack=2.8, release=2.6 if not last else 1.0,
                                  width=1.0, vib=3.0, vib_rate=3.7), t)

    # ---------------- INTRO bars 1-4: the original material ----------------
    intro = [(0.9, [69], 0.16), (2.1, [76], 0.14),
             (3.0, [38, 50], 0.36),                 # emblem
             (4.5, [66], 0.17), (5.25, [71], 0.15),
             (6.0, [35, 47, 78], 0.38),             # portrait
             (7.5, [74], 0.17), (8.25, [73], 0.15),
             (9.0, [33, 45], 0.27), (9.75, [64], 0.16), (10.5, [74], 0.18), (11.25, [76], 0.15)]
    for t, ms, v in intro:
        for i, m in enumerate(ms):
            tt = t if t in (3.0, 6.0) else C.human(t)
            P.add(piano_note(m, C.hvel(v), 4.5 if m < 50 else 3.0), tt + 0.012 * i)
    CH.add(bell(nm('D6'), 0.55, pan=0.25), 3.0)
    CH.add(bell(nm('A6'), 0.25, pan=-0.3), 3.02)
    CH.add(bell(nm('F#6'), 0.6, pan=-0.2), 6.0)
    CH.add(bell(nm('C#7'), 0.22, pan=0.35), 6.03)
    sw, ts = C.noise_swell(6.0, 1.6, 0.05, lo=1200, hi=6000, decay=0.25)
    FX.add(sw, ts)

    # ---------------- bars 5-6: three words, one dyad each, exactly on cue --
    # rising top line B4 -> D5 -> E5 (learns / builds / teaches)
    words = [(13.5, 55, 71), (15.0, 52, 74), (16.5, 57, 76)]
    for t, lo, hi in words:
        P.add(piano_note(lo, 0.22, 1.5), t + 0.012)
        P.add(piano_note(hi, 0.34, 1.5), t)
    # a breath of low support under the words (pedal tones, very soft)
    P.add(piano_note(43, 0.16, 1.4), 13.5 + 0.03)
    P.add(piano_note(40, 0.16, 1.4), 15.0 + 0.03)
    P.add(piano_note(33, 0.15, 1.4), 16.5 + 0.03)

    # ---------------- bar 7: bloom (D/F# -> Gmaj7), slow broken chord ------
    for i, m in enumerate([42, 57, 64, 69]):
        t = bt(7, i * 0.5)
        P.add(piano_note(m, C.hvel(0.25 + 0.015 * i), bt(7, 2) - t + 0.1), C.human(t))
    for i, m in enumerate([43, 59, 66, 71]):
        t = bt(7, 2 + i * 0.5)
        P.add(piano_note(m, C.hvel(0.29 + 0.015 * i), bt(8) - t + 0.1), C.human(t))

    # strings grow from the bloom into the final chord
    for vi, amp, cut, att, wid in [(0, 0.12, 750, 1.6, 0.35), (1, 0.13, 2200, 1.6, 0.6),
                                   (2, 0.09, 2600, 1.8, 0.7), (3, 0.07, 3200, 2.0, 0.9)]:
        for t, d, m in C.merge_line(C.segments(7, NBARS), lambda c, vi=vi: C.SV[c][vi]):
            if abs(t - bt(8)) < 1e-6:          # final chord lands on 21.0
                t, d, att_ = t - 0.15, d + 0.15, 0.4
            else:
                att_ = att
            STR.add(ensemble_note(m, d, amp, voices=6 if vi < 3 else 7, detune=8, cutoff=cut,
                                  attack=att_, release=2.0, width=wid, vib=6, vib_rate=5.1), t)

    # cello: short rising phrase into the resolution, holding A4 over the chord
    cel = [(bt(6, 3), 1, 'D4'), (bt(7), 2, 'F#4'), (bt(7, 2), 1, 'G4'), (bt(7, 3), 1, 'B4'),
           (bt(8), 4, 'A4')]
    notes = []
    for i, (t, d, name) in enumerate(cel):
        v = [0.42, 0.50, 0.56, 0.62, 0.58][i]
        notes.append([C.human(t, 0.005) if i < 4 else t, d * C.BEAT, nm(name), v])
    for i in range(len(notes) - 1):
        notes[i][1] = notes[i + 1][0] - notes[i][0]
    notes[-1][1] += 0.6
    sig, t0 = C.bowed_phrase([tuple(n) for n in notes], 0.25, voices=((-3.0, -0.25), (3.5, -0.05)),
                             cutoff=2300, formants=((470, 2.2, 0.8), (1150, 3.0, 0.45),
                                                    (2600, 4.0, 0.18)),
                             vib=17.0, vib_rate=5.2, glide=0.1, attack=0.45, release=2.2, hpf=75)
    VC.add(sig, t0)

    # soft swell leading into 21.0
    sw, ts = C.noise_swell(bt(8), 2.0, 0.022)
    FX.add(sw, ts)

    # ---------------- bar 8: final rolled D(add9) at exactly 21.0 ----------
    final = [38, 45, 50, 57, 64, 66, 69, 74]
    for i, m in enumerate(final):
        P.add(piano_note(m, 0.50 - 0.015 * i, 8.9 - 0.04 * i), bt(8) + 0.035 * i)
    CH.add(bell(nm('D6'), 0.32, length=7.0, pan=0.2), bt(8) + 0.3)
    # contact details: one soft high note at 24.0
    P.add(piano_note(nm('A5'), 0.17, 4.0), bt(9))

    # ---------------- automation --------------------------------------------
    PAD.x *= C.automation([(0, 0), (0.5, 0.02), (3, 0.28), (6, 0.58), (10, 0.75), (12, 0.62),
                           (15, 0.5), (17.5, 0.5), (20.6, 0.62), (21.3, 1.05), (30, 1.05)])
    STR.x *= C.automation([(0, 0), (17.5, 0), (18.5, 0.4), (20.7, 0.55), (21.4, 1.15),
                           (23.5, 0.95), (26.5, 0.15), (28, 0.0), (30, 0.0)])
    w = C.automation([(0, 0.3), (20, 0.45), (21.5, 0.7), (24, 0.5), (30, 0.3)])
    STR.x = C.lp0(STR.x, 1400) * (1 - w) + C.lp0(STR.x, 5500) * w
    STR.x = C.peq(C.peq(STR.x, 330, -2.5, 0.9), 260, -2.0, 1.0)
    PAD.x = C.peq(C.peq(C.lp0(PAD.x, 4500), 300, -4.0, 0.8), 240, -2.0, 1.0)
    return buses


def finish(mix):
    """End fade: the final chord rings, then reaches true silence at 29.85 s."""
    t = np.arange(N) / SR
    fade = np.ones(N)
    a, b = 24.6, 29.85
    m = t >= a
    fade[m] = np.clip(1 - (t[m] - a) / (b - a), 0, 1) ** 2.2
    return mix * fade


def analyse(mix):
    print(f'  duration: {mix.shape[1] / SR:.6f} s  ({mix.shape[1]} samples)')
    print(f'  NaN/Inf: {bool(np.isnan(mix).any() or np.isinf(mix).any())}')
    pk = np.max(np.abs(mix))
    print(f'  peak: {20 * np.log10(pk):.2f} dBFS   clipped samples: {int((np.abs(mix) >= 1.0).sum())}')
    print(f'  DC offset: L {mix[0].mean():.2e}  R {mix[1].mean():.2e}')
    print(f'  first/last sample: {np.abs(mix[:, 0]).max():.1e} / {np.abs(mix[:, -1]).max():.1e}'
          f'   level after 29.85 s: {20 * np.log10(np.abs(mix[:, int(29.85 * SR):]).max() + 1e-12):.0f} dBFS')
    d = np.abs(np.diff(mix, axis=1)).max()
    print(f'  max sample-to-sample step: {d:.3f}')
    secs = [('intro', 0, 12), ('words', 12, 18), ('bloom', 18, 21), ('final', 21, 24), ('ring', 24, 30)]
    for name, a, b in secs:
        x = mix[:, int(a * SR):int(b * SR)]
        rms = 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12)
        f, Pw = sg.welch(x.mean(axis=0), SR, nperseg=8192)
        tot = Pw.sum()
        print(f'  {name:6s} {a:2d}-{b:2d}s  RMS {rms:6.1f} dBFS   >8k {100 * Pw[f > 8000].sum() / tot:6.3f}%'
              f'  200-400 {100 * Pw[(f > 200) & (f < 400)].sum() / tot:5.1f}%'
              f'  <120 {100 * Pw[f < 120].sum() / tot:5.1f}%')
    for c in (2.9, 3.0, 5.9, 6.0, 13.4, 13.5, 14.9, 15.0, 16.4, 16.5, 20.8, 21.0, 23.9, 24.0, 27.0, 29.2):
        x = mix[:, int(c * SR):int((c + 0.1) * SR)]
        print(f'    {c:5.2f}s  {20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12):6.1f} dBFS')


def spectrogram_png(mix, path):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    f, tt, S = sg.spectrogram(mix.mean(axis=0), SR, nperseg=4096, noverlap=3584)
    S = 10 * np.log10(S + 1e-14)
    fig, ax = plt.subplots(figsize=(14, 6), dpi=100)
    ax.pcolormesh(tt, f, S, shading='auto', cmap='magma', vmin=S.max() - 100, vmax=S.max())
    ax.set_yscale('symlog', linthresh=200)
    ax.set_ylim(30, 20000)
    for s in (3, 6, 12, 13.5, 15, 16.5, 18, 21, 24, 29.2):
        ax.axvline(s, color='w', lw=0.6, alpha=0.6)
    ax.set_xlabel('time (s)')
    ax.set_ylabel('Hz')
    ax.set_title('score_short — intro | words | bloom | final chord 21.0 | ring')
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)


def main():
    print('composing (short)...')
    buses = compose_short()
    print('mixing...')
    mix = finish(C.master(buses))       # same hall, EQ, compressor, limiter at -1 dBFS
    analyse(mix)
    wav = os.path.join(HERE, 'score_short.wav')
    wavfile.write(wav, SR, mix.T.astype(np.float32))
    spectrogram_png(mix, os.path.join(HERE, 'score_short_spectrogram.png'))
    import imageio_ffmpeg
    m4a = os.path.join(HERE, 'score_short.m4a')
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-loglevel', 'error', '-i', wav,
                    '-c:a', 'aac', '-b:a', '256k', '-ar', str(SR), m4a], check=True)
    print('wrote', wav, m4a)


if __name__ == '__main__':
    main()
