#!/usr/bin/env bash
# Turn a side-by-side 3D source (left eye | right eye) into a "wiggle" loop:
# the two views alternate with a short eased cross-fade, which reads as depth
# on any flat screen. Used for the product media on /browser.
#
#   scripts/make-wiggle.sh <sbs.(png|jpg|webp|mp4|webm)> <out-basename> [width] [hold] [fade]
#
# Writes <out>.mp4 (H.264), <out>.webm (VP9) and <out>.jpg (poster = left eye).
# width: output width in px (default 960); hold: seconds on each eye (0.30);
# fade: cross-fade seconds (0.18). For a video source, each frame alternates
# eyes at the same cadence. Use ONLY sources we own or are cleared to publish.
set -euo pipefail
SRC="$1"; OUT="$2"; W="${3:-960}"; HOLD="${4:-0.30}"; FADE="${5:-0.18}"
command -v ffmpeg >/dev/null || { echo "needs ffmpeg"; exit 1; }
case "$(printf %s "$SRC" | tr "[:upper:]" "[:lower:]")" in
  *.mp4|*.webm|*.mov) VIDEO=1 ;;
  *) VIDEO=0 ;;
esac
SEG=$(python3 -c "print($HOLD+$FADE)")
if [ "$VIDEO" = 0 ]; then
  # Still: L -> R -> L, one cycle, then loop the file.
  IN=(-loop 1 -t "$SEG" -i "$SRC" -loop 1 -t "$SEG" -i "$SRC" -loop 1 -t "$SEG" -i "$SRC")
  OFF1=$HOLD; OFF2=$(python3 -c "print(2*$HOLD+$FADE)")
  FC="[0:v]crop=iw/2:ih:0:0,scale=${W}:-2,setsar=1,format=yuv420p,fps=30[l0];
      [1:v]crop=iw/2:ih:iw/2:0,scale=${W}:-2,setsar=1,format=yuv420p,fps=30[r];
      [2:v]crop=iw/2:ih:0:0,scale=${W}:-2,setsar=1,format=yuv420p,fps=30[l1];
      [l0][r]xfade=transition=fade:duration=${FADE}:offset=${OFF1}[a];
      [a][l1]xfade=transition=fade:duration=${FADE}:offset=${OFF2},trim=0:$(python3 -c "print(2*$HOLD+2*$FADE)")[v]"
else
  # Video: blend between the eyes on a triangle wave of period 2*(hold+fade).
  IN=(-i "$SRC")
  P=$(python3 -c "print(2*($HOLD+$FADE))")
  FC="[0:v]split[a][b];[a]crop=iw/2:ih:0:0[l];[b]crop=iw/2:ih:iw/2:0[r];
      [l][r]blend=all_expr='A*(1-clip((abs(mod(T,$P)-$P/2)-$HOLD/2)/$FADE,0,1))+B*clip((abs(mod(T,$P)-$P/2)-$HOLD/2)/$FADE,0,1)',scale=${W}:-2,setsar=1,format=yuv420p[v]"
fi
ffmpeg -loglevel error -y "${IN[@]}" -filter_complex "$FC" -map "[v]" -an -c:v libx264 -crf 22 -movflags +faststart "$OUT.mp4"
ffmpeg -loglevel error -y -i "$OUT.mp4" -an -c:v libvpx-vp9 -b:v 0 -crf 34 "$OUT.webm"
ffmpeg -loglevel error -y -i "$SRC" -frames:v 1 -vf "crop=iw/2:ih:0:0,scale=${W}:-2" -q:v 3 "$OUT.jpg"
echo "wrote $OUT.mp4 $OUT.webm $OUT.jpg"
