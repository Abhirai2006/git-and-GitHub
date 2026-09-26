// Renders a branded, shareable "result card" image on an offscreen canvas
// and returns a PNG data URL. No server involved, everything happens in
// the visitor's own browser.
export function renderScoreCard(opts: {
  title: string;
  score: number;
  total: number;
  subtitle: string;
}): string | null {
  const { title, score, total, subtitle } = opts;
  const W = 1000;
  const H = 1000;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // background
  ctx.fillStyle = "#1b1f23";
  ctx.fillRect(0, 0, W, H);

  // soft glow
  const grad = ctx.createRadialGradient(W * 0.75, H * 0.25, 0, W * 0.75, H * 0.25, 520);
  grad.addColorStop(0, "rgba(31,111,235,0.45)");
  grad.addColorStop(0.5, "rgba(11,61,145,0.2)");
  grad.addColorStop(1, "rgba(27,31,35,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // faint grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // eyebrow
  ctx.fillStyle = "#58a6ff";
  ctx.font = "700 26px Arial, Helvetica, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("VIVA.PREP  ·  BAIL308C", 70, 110);

  // title
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px Georgia, 'Times New Roman', serif";
  wrapText(ctx, title, 70, 190, 860, 58);

  // big score
  ctx.fillStyle = "#1f6feb";
  ctx.font = "700 220px Georgia, 'Times New Roman', serif";
  ctx.fillText(`${score}`, 70, 560);
  const scoreWidth = ctx.measureText(`${score}`).width;
  ctx.fillStyle = "#6a737d";
  ctx.font = "700 90px Georgia, 'Times New Roman', serif";
  ctx.fillText(`/${total}`, 70 + scoreWidth + 14, 560);

  // subtitle
  ctx.fillStyle = "#c9d1d9";
  ctx.font = "400 30px Arial, Helvetica, sans-serif";
  wrapText(ctx, subtitle, 70, 640, 860, 40);

  // node-graph motif, bottom right, echoing the homepage sculpture
  const nodes: [number, number][] = [
    [780, 800], [860, 760], [930, 830], [820, 890], [900, 920],
  ];
  ctx.strokeStyle = "rgba(88,166,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(nodes[0][0], nodes[0][1]);
  for (let i = 1; i < nodes.length; i++) ctx.lineTo(nodes[i][0], nodes[i][1]);
  ctx.stroke();
  nodes.forEach(([x, y], i) => {
    ctx.fillStyle = i === 0 ? "#58a6ff" : "#1f6feb";
    ctx.beginPath();
    ctx.arc(x, y, i === 0 ? 9 : 7, 0, Math.PI * 2);
    ctx.fill();
  });

  // footer line
  ctx.fillStyle = "#6a737d";
  ctx.font = "400 22px Arial, Helvetica, sans-serif";
  ctx.fillText("git-github-by-abhirai2006.netlify.app", 70, 940);

  return canvas.toDataURL("image/png");
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, cursorY);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
