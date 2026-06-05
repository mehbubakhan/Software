/**
 * Parses an LRC string and interpolates word-level timestamps, 
 * replicating the exact logic from the Java AOOPProject.
 */
export function parseLrc(lrcContent) {
  const lineRegex = /^\[(\d{2}):(\d{2}(?:\.\d+)?)\]\s*(.*)$/;
  const lines = [];

  // 1. Extract lines and their start times
  const rawLines = lrcContent.split('\n');
  for (const rawLine of rawLines) {
    const match = rawLine.trim().match(lineRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseFloat(match[2]);
      const timeMs = (minutes * 60 + seconds) * 1000;
      const text = match[3];
      lines.push({ startMs: timeMs, raw: text });
    }
  }

  // Sort by time just in case
  lines.sort((a, b) => a.startMs - b.startMs);

  const tokens = [];

  // Helper to split string keeping delimiters (spaces) attached to chunks or separate
  // We'll just split by spaces but include the space so it renders correctly
  const splitKeepDelims = (str) => {
    const out = [];
    if (!str) return out;
    let buf = '';
    let lastSpace = /\s/.test(str[0]);
    
    for (let i = 0; i < str.length; i++) {
      const c = str[i];
      const isSpace = /\s/.test(c);
      if (isSpace === lastSpace) {
        buf += c;
      } else {
        out.push(buf);
        buf = c;
        lastSpace = isSpace;
      }
    }
    if (buf.length > 0) out.push(buf);
    return out;
  };

  // 2. Interpolate word-level timestamps
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStart = line.startMs;
    const lineEnd = i + 1 < lines.length ? lines[i + 1].startMs : NaN;

    const pieces = splitKeepDelims(line.raw);
    const wordCount = pieces.filter(s => s.trim() !== '').length;

    if (wordCount === 0) {
      tokens.push({ text: '\n', startMs: lineStart });
    } else {
      const span = isNaN(lineEnd) ? 800 : Math.max(400, lineEnd - lineStart);
      const step = span / wordCount;
      let wIndex = 0;
      
      for (const piece of pieces) {
        tokens.push({ text: piece, startMs: lineStart + step * wIndex });
        if (piece.trim() !== '') wIndex++;
      }
    }
    tokens.push({ text: '\n', startMs: isNaN(lineEnd) ? lineStart + 50 : lineEnd });
  }

  // Assign end times
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    t.endMs = i + 1 < tokens.length ? tokens[i + 1].startMs : Infinity;
  }

  return tokens;
}
