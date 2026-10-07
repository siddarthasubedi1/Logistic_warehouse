const fs = require('fs');
const path = require('path');

const PAGE_W = 842;
const PAGE_H = 595;
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'bug-busters-logo.jpg');

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
    // Framing and header band.
    stream += '0.03 0.22 0.39 RG 3 w 24 24 794 547 re S\n';
    stream += '0.10 0.42 0.67 RG 1.2 w 34 34 774 527 re S\n';
    stream += '0.96 0.98 1 rg 46 466 750 74 re f\n';
    stream += '0.03 0.22 0.39 RG 0.8 w 46 466 750 74 re S\n';

    stream += 'q 62 0 0 62 62 472 cm /Im1 Do Q\n';
    stream += text(142, 510, 17, 'UK LogiWare Safety Training', 'F2');
    stream += text(142, 487, 10, 'Workplace learning and assessment certification');
    stream += text(665, 510, 8.5, 'DESIGNED BY', 'F2');
    stream += text(665, 491, 12, 'BUG BUSTERS', 'F2');

    stream += text(centerX('CERTIFICATE OF COMPLETION', 28, 0.55), 431, 28, 'CERTIFICATE OF COMPLETION', 'F2');
    stream += text(centerX('This certificate is proudly presented to', 12), 400, 12, 'This certificate is proudly presented to');
    stream += text(centerX(traineeName, nameSize, 0.54), 361, nameSize, traineeName, 'F2');
    stream += '0.10 0.42 0.67 RG 1 w 190 349 m 652 349 l S\n';
    stream += text(centerX('for successfully completing the required learning sections and assessments for', 11), 326, 11, 'for successfully completing the required learning sections and assessments for');
    stream += text(centerX(`${completedModules.length} training module${completedModules.length === 1 ? '' : 's'}`, 15), 304, 15, `${completedModules.length} training module${completedModules.length === 1 ? '' : 's'}`, 'F2');

    stream += text(72, 278, 9.5, 'COMPLETED TRAINING MODULES', 'F2', '0.03 0.22 0.39');
    stream += text(370, 278, 9.5, 'PERFORMANCE RATING', 'F2', '0.03 0.22 0.39');
    stream += text(604, 278, 9.5, 'ASSESSMENT EVIDENCE', 'F2', '0.03 0.22 0.39');

    const rowYs = [244, 196, 148];
    completedModules.forEach((module, index) => {
        const y = rowYs[index];
        const ratingValue = Math.max(1, Math.min(5, Number(module.rating?.stars || 1)));
        const moduleTitle = String(module.name || module.key || 'Training Module');
        const moduleSize = fitText(moduleTitle, 260, 14, 10.5, 0.53);
        const attempts = Number(module.rating?.assessmentAttempts || 1);
        const evidence = `${attempts} attempt${attempts === 1 ? '' : 's'} - ${formatDuration(module.rating?.totalAssessmentSeconds)}`;

        stream += index % 2 === 0 ? `0.97 0.985 1 rg 58 ${y - 18} 726 42 re f\n` : `0.94 0.97 1 rg 58 ${y - 18} 726 42 re f\n`;
        stream += `0.82 0.88 0.94 RG 0.6 w 58 ${y - 18} 726 42 re S\n`;
        stream += text(74, y + 3, 8, `MODULE ${index + 1}`, 'F2', '0.10 0.42 0.67');
        stream += text(74, y - 10, moduleSize, moduleTitle, 'F2');
        stream += starsGraphic(ratingValue, 386, y - 1, 21);
        stream += text(500, y - 5, 11, `${ratingValue.toFixed(ratingValue % 1 ? 1 : 0)}/5`, 'F2');
        stream += text(604, y - 5, fitText(evidence, 165, 10, 8.5), evidence);
    });

    // Certificate details below the module rows.
    stream += '0.96 0.98 1 rg 58 70 334 58 re f 0.78 0.86 0.94 RG 0.7 w 58 70 334 58 re S\n';
    stream += text(74, 109, 8.5, 'CERTIFICATE DETAILS', 'F2');
    stream += text(74, 91, 8.5, `Certificate No: ${certificateNumber}`);
    stream += text(74, 76, 8.5, `Issue date: ${dateLabel}`);
    stream += '0.96 0.98 1 rg 450 70 334 58 re f 0.78 0.86 0.94 RG 0.7 w 450 70 334 58 re S\n';
    stream += text(466, 109, 8.5, 'ISSUED BY', 'F2');
    stream += text(466, 91, fitText(issuedBy, 280, 10, 8.5), issuedBy);
    stream += text(466, 76, 8.5, `${completedModules.length} completed module${completedModules.length === 1 ? '' : 's'} listed above`);

    stream += text(centerX('Designed by Bug Busters', 10), 52, 10, 'Designed by Bug Busters', 'F2');
    stream += text(centerX('Learning sections and assessments determine certification; games and simulations are optional.', 7.2), 39, 7.2, 'Learning sections and assessments determine certification; games and simulations are optional.');

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
