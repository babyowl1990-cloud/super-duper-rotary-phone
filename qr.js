// Minimal QR Code encoder: Byte mode, ECC level M, versions 1-6 only.
// (versions 1-6 avoid needing the "version information" blocks required for v7+,
//  which keeps this compact and easier to verify. Capacity: up to 106 bytes.)
const QR = (() => {
  // ---- GF(256) tables (primitive poly 0x11d, generator 2) ----
  const EXP = new Array(256);
  const LOG = new Array(256);
  (() => {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 256; i++) EXP[i] = EXP[i - 255];
  })();
  const gmul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[(LOG[a] + LOG[b]) % 255];

  function polyMul(p, q) {
    const r = new Array(p.length + q.length - 1).fill(0);
    for (let j = 0; j < q.length; j++)
      for (let i = 0; i < p.length; i++)
        r[i + j] ^= gmul(p[i], q[j]);
    return r;
  }
  function rsGeneratorPoly(nsym) {
    let g = [1];
    for (let i = 0; i < nsym; i++) g = polyMul(g, [1, EXP[i % 255]]);
    return g;
  }
  function rsEncode(msg, nsym) {
    const gen = rsGeneratorPoly(nsym);
    const out = msg.concat(new Array(nsym).fill(0));
    for (let i = 0; i < msg.length; i++) {
      const coef = out[i];
      if (coef !== 0) {
        for (let j = 0; j < gen.length; j++) out[i + j] ^= gmul(gen[j], coef);
      }
    }
    return out.slice(msg.length);
  }

  // version: [totalCodewords, ecPerBlock, blocks], blocks = [[count,dataLen], ...]
  const VERSION_TABLE = {
    1: { total: 26, ec: 10, blocks: [[1, 16]] },
    2: { total: 44, ec: 16, blocks: [[1, 28]] },
    3: { total: 70, ec: 26, blocks: [[1, 44]] },
    4: { total: 100, ec: 18, blocks: [[2, 32]] },
    5: { total: 134, ec: 24, blocks: [[2, 43]] },
    6: { total: 172, ec: 16, blocks: [[4, 27]] },
  };
  const REMAINDER_BITS = { 1: 0, 2: 7, 3: 7, 4: 7, 5: 7, 6: 7 };
  const ALIGNMENT_POS = { 1: null, 2: 18, 3: 22, 4: 26, 5: 30, 6: 34 };

  function pickVersion(byteLen) {
    for (let v = 1; v <= 6; v++) {
      const t = VERSION_TABLE[v];
      const dataTotal = t.blocks.reduce((s, b) => s + b[0] * b[1], 0);
      const capacity = dataTotal - 2; // mode(4b)+count(8b) header = 2 bytes for v1-9
      if (byteLen <= capacity) return v;
    }
    return null;
  }

  function encodeDataCodewords(bytes, version) {
    const t = VERSION_TABLE[version];
    const dataTotal = t.blocks.reduce((s, b) => s + b[0] * b[1], 0);
    const bits = [];
    const pushBits = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
    pushBits(0b0100, 4); // byte mode
    pushBits(bytes.length, 8);
    for (const b of bytes) pushBits(b, 8);
    const totalBits = dataTotal * 8;
    for (let i = 0; i < 4 && bits.length < totalBits; i++) bits.push(0); // terminator
    while (bits.length % 8 !== 0) bits.push(0);
    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      codewords.push(byte);
    }
    const pad = [0xec, 0x11];
    let p = 0;
    while (codewords.length < dataTotal) codewords.push(pad[p++ % 2]);
    return codewords;
  }

  function buildFinalCodewords(dataCodewords, version) {
    const t = VERSION_TABLE[version];
    let idx = 0;
    const blocks = [];
    for (const [count, len] of t.blocks) {
      for (let i = 0; i < count; i++) {
        const dblock = dataCodewords.slice(idx, idx + len);
        idx += len;
        const eblock = rsEncode(dblock, t.ec);
        blocks.push({ d: dblock, e: eblock });
      }
    }
    const maxD = Math.max(...blocks.map((b) => b.d.length));
    const out = [];
    for (let i = 0; i < maxD; i++)
      for (const b of blocks) if (i < b.d.length) out.push(b.d[i]);
    const maxE = Math.max(...blocks.map((b) => b.e.length));
    for (let i = 0; i < maxE; i++)
      for (const b of blocks) if (i < b.e.length) out.push(b.e[i]);
    return out;
  }

  function codewordsToBits(codewords, version) {
    const bits = [];
    for (const cw of codewords) for (let i = 7; i >= 0; i--) bits.push((cw >> i) & 1);
    for (let i = 0; i < REMAINDER_BITS[version]; i++) bits.push(0);
    return bits;
  }

  function makeMatrix(version) {
    const size = version * 4 + 17;
    const mat = Array.from({ length: size }, () => new Array(size).fill(0));
    const fn = Array.from({ length: size }, () => new Array(size).fill(false));
    const setFn = (r, c, v) => { if (r >= 0 && r < size && c >= 0 && c < size) { mat[r][c] = v; fn[r][c] = true; } };

    function placeFinder(r0, c0) {
      for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
        const rr = r0 + r, cc = c0 + c;
        if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
        let v = 0;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          const onRing = (r === 0 || r === 6 || c === 0 || c === 6);
          const inCenter = (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          v = (onRing || inCenter) ? 1 : 0;
        }
        setFn(rr, cc, v);
      }
    }
    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    for (let i = 0; i < size; i++) {
      if (!fn[6][i]) setFn(6, i, i % 2 === 0 ? 1 : 0);
      if (!fn[i][6]) setFn(i, 6, i % 2 === 0 ? 1 : 0);
    }

    const ap = ALIGNMENT_POS[version];
    if (ap) {
      for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
        const onRing = (r === -2 || r === 2 || c === -2 || c === 2);
        setFn(ap + r, ap + c, onRing || (r === 0 && c === 0) ? 1 : 0);
      }
    }

    setFn(size - 8, 8, 1); // dark module

    // reserve format info areas (values filled in later)
    for (let i = 0; i < 9; i++) { if (!fn[8][i]) setFn(8, i, 0); if (!fn[i][8]) setFn(i, 8, 0); }
    for (let i = 0; i < 8; i++) setFn(8, size - 1 - i, 0);       // horizontal copy2: cols size-1..size-8
    for (let i = 0; i < 7; i++) setFn(size - 7 + i, 8, 0);       // vertical copy2: rows size-7..size-1 (must not touch the dark module row)

    return { size, mat, fn };
  }

  function placeData(mm, bits, orderOut) {
    const { size, mat, fn } = mm;
    let bitIndex = 0;
    let dir = -1;
    let col = size - 1;
    while (col > 0) {
      if (col === 6) col--;
      let row = dir === -1 ? size - 1 : 0;
      for (;;) {
        for (let c = 0; c < 2; c++) {
          const x = col - c;
          if (!fn[row][x]) {
            mat[row][x] = bitIndex < bits.length ? bits[bitIndex] : 0;
            if (orderOut) orderOut.push([row, x]);
            bitIndex++;
          }
        }
        row += dir;
        if (row < 0 || row >= size) break;
      }
      dir = -dir;
      col -= 2;
    }
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r, c) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];

  function applyMask(mm, maskIdx, dataBitAt) {
    const { size, fn } = mm;
    const out = Array.from({ length: size }, () => new Array(size).fill(0));
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      let v = mm.mat[r][c];
      if (!fn[r][c]) {
        if (MASKS[maskIdx](r, c)) v ^= 1;
      }
      out[r][c] = v;
    }
    return out;
  }

  function penalty(mat) {
    const size = mat.length;
    let score = 0;
    // rule 1: runs
    for (let r = 0; r < size; r++) {
      let run = 1;
      for (let c = 1; c < size; c++) {
        if (mat[r][c] === mat[r][c - 1]) run++;
        else { if (run >= 5) score += run - 2; run = 1; }
      }
      if (run >= 5) score += run - 2;
    }
    for (let c = 0; c < size; c++) {
      let run = 1;
      for (let r = 1; r < size; r++) {
        if (mat[r][c] === mat[r - 1][c]) run++;
        else { if (run >= 5) score += run - 2; run = 1; }
      }
      if (run >= 5) score += run - 2;
    }
    // rule 2: 2x2 blocks
    for (let r = 0; r < size - 1; r++) for (let c = 0; c < size - 1; c++) {
      const v = mat[r][c];
      if (v === mat[r][c + 1] && v === mat[r + 1][c] && v === mat[r + 1][c + 1]) score += 3;
    }
    // rule 3: finder-like pattern 1:1:3:1:1 with 4 light on either side
    const pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
    const pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    function matchAt(arr, startIdx, pat) {
      for (let k = 0; k < pat.length; k++) if (arr[startIdx + k] !== pat[k]) return false;
      return true;
    }
    for (let r = 0; r < size; r++) {
      const row = mat[r];
      for (let c = 0; c <= size - 11; c++) {
        if (matchAt(row, c, pat1) || matchAt(row, c, pat2)) score += 40;
      }
    }
    for (let c = 0; c < size; c++) {
      const col = mat.map((row) => row[c]);
      for (let r = 0; r <= size - 11; r++) {
        if (matchAt(col, r, pat1) || matchAt(col, r, pat2)) score += 40;
      }
    }
    // rule 4: dark ratio
    let dark = 0;
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += mat[r][c];
    const percent = (dark * 100) / (size * size);
    const prev5 = Math.abs(Math.floor(percent / 5) * 5 - 50) / 5;
    const next5 = Math.abs(Math.ceil(percent / 5) * 5 - 50) / 5;
    score += Math.min(prev5, next5) * 10;
    return score;
  }

  // Correct ECC indicator bits per spec: L=01 M=00 Q=11 H=10
  function bchFormat(data5) {
    // data5: 5-bit value (2 ecc bits + 3 mask bits), compute 10-bit BCH remainder, generator 0x537
    let d = data5 << 10;
    const g = 0x537;
    for (let i = 14; i >= 10; i--) {
      if (d & (1 << i)) d ^= g << (i - 10);
    }
    const full = (data5 << 10) | d;
    return full ^ 0x5412;
  }

  function placeFormatInfo(mm, maskIdx) {
    const { size, mat } = mm;
    const eccIndicator = 0b00; // M
    const data5 = (eccIndicator << 3) | maskIdx;
    const bits15 = bchFormat(data5); // 15-bit value, bit14..bit0
    const bit = (i) => (bits15 >> i) & 1;

    // copy 1 (around top-left finder)
    const copy1 = [
      [8, 0, 14], [8, 1, 13], [8, 2, 12], [8, 3, 11], [8, 4, 10], [8, 5, 9],
      [8, 7, 8], [8, 8, 7], [7, 8, 6],
      [5, 8, 5], [4, 8, 4], [3, 8, 3], [2, 8, 2], [1, 8, 1], [0, 8, 0],
    ];
    for (const [r, c, b] of copy1) mat[r][c] = bit(b);

    // copy 2 (split across top-right and bottom-left finders)
    for (let i = 0; i < 8; i++) mat[8][size - 1 - i] = bit(i);
    for (let i = 0; i < 7; i++) mat[size - 7 + i][8] = bit(8 + i);
  }

  function generate(text, forceMask) {
    const bytes = Array.from(new TextEncoder().encode(text));
    const version = pickVersion(bytes.length);
    if (!version) return null;
    const dataCw = encodeDataCodewords(bytes, version);
    const finalCw = buildFinalCodewords(dataCw, version);
    const bits = codewordsToBits(finalCw, version);
    const mm = makeMatrix(version);
    placeData(mm, bits);

    if (forceMask !== undefined) {
      const masked = applyMask(mm, forceMask);
      placeFormatInfo({ size: mm.size, mat: masked }, forceMask);
      return { size: mm.size, matrix: masked, version, mask: forceMask };
    }

    let best = null, bestScore = Infinity, bestIdx = 0;
    for (let m = 0; m < 8; m++) {
      const masked = applyMask(mm, m);
      placeFormatInfo({ size: mm.size, mat: masked }, m);
      const s = penalty(masked);
      if (s < bestScore) { bestScore = s; best = masked; bestIdx = m; }
    }
    return { size: mm.size, matrix: best, version, mask: bestIdx };
  }

  return { generate };
})();

if (typeof module !== "undefined") module.exports = QR;
