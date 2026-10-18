#!/bin/sh
# join the silent render with the score: full-quality master + a lighter copy for sharing
cd "$(dirname "$0")/.."
FF=$(py -3.13 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())")
"$FF" -y -loglevel error -i out/film_silent.mp4 -i music/score.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest -movflags +faststart -metadata title="Mahmoud Alyosify — Introduction" Mahmoud-Alyosify-Introduction.mp4
"$FF" -y -loglevel error -i out/film_silent.mp4 -i music/score.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart -metadata title="Mahmoud Alyosify — Introduction" Mahmoud-Alyosify-Introduction-share.mp4
ls -la *.mp4
