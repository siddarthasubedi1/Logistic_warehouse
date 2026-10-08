
const fs = require('fs');
const path = require('path');

const PAGE_W = 842;
const PAGE_H = 595;
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logiware-company-logo.jpg');

function ascii(value) {
    return String(value || '').normalize('NFKD').replace(/[^\x20-\x7E]/g, '').replace(/[()\\]/g, m => `\\${m}`);
}

function text(x, y, size, value, font = 'F1', color = '0.09 0.13 0.20') {
    return `${color} rg BT /${font} ${size} Tf ${Number(x).toFixed(1)} ${Number(y).toFixed(1)} Td (${ascii(value)}) Tj ET\n`;
}

function approxTextWidth(value, size, weight = 0.52) {
    return ascii(value).length * size * weight;
}

function centerX(value, size, weight = 0.52) {
    return Math.max(40, (PAGE_W - approxTextWidth(value, size, weight)) / 2);
}

function fitText(value, maxWidth, preferredSize, minSize = 9, weight = 0.52) {
    let size = preferredSize;
    while (size > minSize && approxTextWidth(value, size, weight) > maxWidth) size -= 0.5;
    return size;
}

function jpegSize(buffer) {
    let offset = 2;
    while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) { offset += 1; continue; }
        const marker = buffer[offset + 1];
        const length = buffer.readUInt16BE(offset + 2);
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
            return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
        }
        offset += 2 + length;
    }
    return { width: 543, height: 542 };
}

function formatDuration(seconds) {
    const total = Math.max(0, Math.round(Number(seconds || 0)));
    if (!total) return 'Not available';
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    if (!minutes) return `${secs}s`;
    if (!secs) return `${minutes}m`;
    return `${minutes}m ${secs}s`;
}

function starPath(cx, cy, outer = 7.8, inner = 3.6) {
    const pts = [];
    for (let i = 0; i < 10; i += 1) {
        const radius = i % 2 === 0 ? outer : inner;
        const angle = -Math.PI / 2 + i * Math.PI / 5;
        pts.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
    }
    let result = `${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} m `;
    for (let i = 1; i < pts.length; i += 1) result += `${pts[i][0].toFixed(2)} ${pts[i][1].toFixed(2)} l `;
    return `${result}h`;
}

function starsGraphic(stars, startX, centerY, spacing = 22) {
    const value = Math.max(1, Math.min(5, Number(stars || 1)));
    let out = '';
    for (let i = 0; i < 5; i += 1) {
        const cx = startX + i * spacing;
        const fill = Math.max(0, Math.min(1, value - i));
        const pathData = starPath(cx, centerY);
        out += '0.82 0.58 0.02 RG 1 w\n';
        out += `${pathData} S\n`;
        if (fill >= 1) {
            out += `1 0.76 0.02 rg ${pathData} f\n`;
            out += `0.82 0.58 0.02 RG ${pathData} S\n`;
        } else if (fill >= 0.5) {
            out += `q ${cx - 8.5} ${centerY - 9} 8.5 18 re W n 1 0.76 0.02 rg ${pathData} f Q\n`;
            out += `0.82 0.58 0.02 RG ${pathData} S\n`;
        }
    }
    return out;
}

function buildPdf(objects) {
    const chunks = [Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary')];
    const offsets = [0];
    let position = chunks[0].length;
    objects.forEach((object, index) => {
        offsets[index + 1] = position;
        const head = Buffer.from(`${index + 1} 0 obj\n`, 'ascii');
        const body = Buffer.isBuffer(object) ? object : Buffer.from(object, 'binary');
        const tail = Buffer.from('\nendobj\n', 'ascii');
        chunks.push(head, body, tail);
        position += head.length + body.length + tail.length;
    });
    const xrefOffset = position;
    let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let i = 1; i <= objects.length; i += 1) xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
    xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    chunks.push(Buffer.from(xref, 'ascii'));
    return Buffer.concat(chunks);
}

function normalizeModules(modules, moduleName, rating) {
    if (Array.isArray(modules) && modules.length) return modules.slice(0, 3);
    return [{ key: 'training', name: moduleName || 'Workplace Safety Training', rating: rating || { stars: 1, assessmentAttempts: 1, totalAssessmentSeconds: 0 } }];
}

function generateCertificatePdf({ traineeName, certificateNumber, issuedAt, modules, moduleName, issuedBy, rating }) {
    const completedModules = normalizeModules(modules, moduleName, rating);
    const dateLabel = new Date(issuedAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const nameSize = fitText(traineeName, 610, 29, 19, 0.54);
    const logo = fs.readFileSync(LOGO_PATH);
    const logoSize = jpegSize(logo);

    let stream = '';
    const navy = '0.027 0.133 0.275';
    const darkBlue = '0.027 0.22 0.39';
    const blue = '0.035 0.40 0.74';
    const brightBlue = '0.09 0.58 0.96';
    const white = '1 1 1';
    const softBlue = '0.95 0.977 1';
    const borderBlue = '0.72 0.85 0.97';
    const ink = '0.09 0.14 0.23';
    const rect = (x, y, w, h, fill, border = null, line = 0.7) => {
        let cmd = `${fill} rg ${x} ${y} ${w} ${h} re f\n`;
        if (border) cmd += `${border} RG ${line} w ${x} ${y} ${w} ${h} re S\n`;
        return cmd;
    };
    const line = (x1, y1, x2, y2, color = blue, width = 1) => `${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S\n`;
    const polygon = (points, fill) => `${fill} rg ${points.map((p, i) => `${p[0]} ${p[1]} ${i ? 'l' : 'm'}`).join(' ')} h f\n`;

    // Brand palette follows the project frontend: #073763, #0b4f87 and bright blue accents.
    stream += rect(0, 0, PAGE_W, PAGE_H, white);
    stream += rect(13, 13, 816, 569, blue);
    stream += rect(18, 18, 806, 559, white);
    stream += rect(27, 27, 788, 541, white, darkBlue, 0.9);
    stream += polygon([[680, 568], [815, 568], [815, 480]], navy);
    stream += polygon([[699, 568], [815, 568], [815, 497]], blue);
    stream += polygon([[733, 568], [815, 568], [815, 519]], brightBlue);
    stream += polygon([[27, 27], [27, 125], [130, 27]], navy);
    stream += polygon([[27, 27], [27, 89], [93, 27]], blue);
    stream += polygon([[27, 27], [27, 58], [60, 27]], brightBlue);

    // Large light-blue header band and original company logo.
    stream += rect(40, 461, 762, 89, softBlue);
    stream += 'q 58 0 0 58 61 474 cm /Im1 Do Q\n';
    stream += text(135, 509, 17, 'UK LogiWare Safety Training', 'F2', navy);
    stream += text(135, 488, 9.5, 'Workplace learning and assessment certification', 'F1', ink);
    stream += line(634, 479, 634, 526, borderBlue, 1);
    stream += text(652, 513, 8.5, 'ISSUED BY', 'F2', ink);
    stream += text(652, 493, 13, 'LOGIWARE', 'F2', navy);

    const heading = 'CERTIFICATE OF COMPLETION';
    const headingSize = fitText(heading, 720, 27, 21, 0.58);
    stream += text(centerX(heading, headingSize, 0.58), 427, headingSize, heading, 'F2', navy);
    stream += line(250, 412, 391, 412, blue, 1.5);
    stream += line(451, 412, 592, 412, blue, 1.5);

    // Blue verification shield mark below certificate heading.
    stream += polygon([[421, 424], [433, 418], [431, 402], [421, 395], [411, 402], [409, 418]], blue);
    stream += line(415, 411, 420, 406, white, 2.2);
    stream += line(420, 406, 428, 417, white, 2.2);
    stream += text(centerX('This certificate is proudly presented to', 11), 375, 11, 'This certificate is proudly presented to', 'F1', ink);
    stream += text(centerX(traineeName, nameSize, 0.54), 337, nameSize, traineeName, 'F2', navy);
    stream += line(241, 324, 601, 324, blue, 1.2);
    const contextLine = 'for successfully completing the required learning sections and assessments for';
    stream += text(centerX(contextLine, 10.5), 301, 10.5, contextLine, 'F1', ink);
    const moduleCountLabel = `${completedModules.length} training module${completedModules.length === 1 ? '' : 's'}`;
    stream += text(centerX(moduleCountLabel, 14), 279, 14, moduleCountLabel, 'F2', blue);

    // One to three real completed modules, each with its own performance evidence.
    const tableLeft = 48;
    const tableWidth = 746;
    const rowHeight = completedModules.length === 3 ? 30 : 39;
    const topY = 260;
    stream += rect(tableLeft, topY - 31, tableWidth, 31, darkBlue);
    stream += rect(48, topY - 31, 288, 31, navy);
    stream += rect(336, topY - 31, 228, 31, blue);
    stream += text(65, topY - 20, 9.5, 'COMPLETED TRAINING MODULES', 'F2', white);
    stream += text(350, topY - 20, 9.5, 'PERFORMANCE RATING', 'F2', white);
    stream += text(580, topY - 20, 9.5, 'ASSESSMENT EVIDENCE', 'F2', white);

    completedModules.forEach((module, index) => {
        const yTop = topY - 31 - index * rowHeight;
        const yBottom = yTop - rowHeight;
        const ratingValue = Math.max(1, Math.min(5, Number(module.rating?.stars || 1)));
        const moduleTitle = String(module.name || module.key || 'Training Module');
        const moduleSize = fitText(moduleTitle, 252, 12.5, 9.5, 0.55);
        const attempts = Number(module.rating?.assessmentAttempts || 1);
        const evidence = `${attempts} attempt${attempts === 1 ? '' : 's'} - ${formatDuration(module.rating?.totalAssessmentSeconds)}`;
        stream += rect(tableLeft, yBottom, tableWidth, rowHeight, index % 2 ? '0.98 0.991 1' : softBlue, borderBlue, 0.4);
        stream += line(336, yBottom + 2, 336, yTop - 2, borderBlue, 0.5);
        stream += line(564, yBottom + 2, 564, yTop - 2, borderBlue, 0.5);
        stream += text(65, yBottom + rowHeight - 12, 7.5, `MODULE ${index + 1}`, 'F2', blue);
        stream += text(65, yBottom + 6, moduleSize, moduleTitle, 'F2', navy);
        stream += starsGraphic(ratingValue, 352, yBottom + rowHeight / 2, 19);
        stream += text(458, yBottom + rowHeight / 2 - 4, 11, `${ratingValue.toFixed(ratingValue % 1 ? 1 : 0)}/5`, 'F2', navy);
        stream += text(581, yBottom + rowHeight / 2 - 3, fitText(evidence, 197, 10, 8.5), evidence, 'F1', ink);
    });

    // The details row is below even the 3-module certificate table.
    stream += rect(62, 68, 346, 51, softBlue, borderBlue, 0.7);
    stream += rect(434, 68, 346, 51, softBlue, borderBlue, 0.7);
    stream += rect(72, 81, 27, 27, white, borderBlue, 0.6);
    stream += rect(444, 81, 27, 27, white, borderBlue, 0.6);
    stream += text(80, 90, 15, '#', 'F2', blue);
    stream += text(452, 90, 13, '*', 'F2', blue);
    stream += text(110, 104, 9, 'CERTIFICATE DETAILS', 'F2', blue);
    stream += text(110, 88, fitText(`Certificate No: ${certificateNumber}`, 284, 8.6, 7), `Certificate No: ${certificateNumber}`, 'F1', ink);
    stream += text(110, 75, 8.5, `Issue date: ${dateLabel}`, 'F1', ink);
    stream += text(481, 104, 9, 'ISSUED BY', 'F2', blue);
    stream += text(481, 88, fitText(issuedBy, 278, 9.5, 8), issuedBy, 'F1', ink);
    stream += text(481, 75, 8.5, `${completedModules.length} completed module${completedModules.length === 1 ? '' : 's'} listed above`, 'F1', ink);
    stream += line(219, 53, 357, 53, borderBlue, 0.8);
    stream += text(centerX('LogiWare Company', 10.5), 49, 10.5, 'LogiWare Company', 'F2', navy);
    stream += line(485, 53, 623, 53, borderBlue, 0.8);
    const disclaimer = 'Learning sections and assessments determine certification; games and simulations are optional.';
    stream += text(centerX(disclaimer, 7.2), 35, 7.2, disclaimer, 'F1', ink);

    const content = Buffer.from(stream, 'ascii');
    const imageObject = Buffer.concat([
        Buffer.from(`<< /Type /XObject /Subtype /Image /Width ${logoSize.width} /Height ${logoSize.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.length} >>\nstream\n`, 'ascii'),
        logo,
        Buffer.from('\nendstream', 'ascii'),
    ]);

    const objects = [];
    objects.push('<< /Type /Catalog /Pages 2 0 R >>');
    objects.push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    objects.push('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> /XObject << /Im1 6 0 R >> >> /Contents 7 0 R >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
    objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
    objects.push(imageObject);
    objects.push(Buffer.concat([Buffer.from(`<< /Length ${content.length} >>\nstream\n`, 'ascii'), content, Buffer.from('endstream', 'ascii')]));
    return buildPdf(objects);
}

module.exports = { generateCertificatePdf, formatDuration };
