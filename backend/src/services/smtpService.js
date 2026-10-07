const net = require('net');
const tls = require('tls');

const cleanHeader = value => String(value || '').replace(/[\r\n]+/g, ' ').trim();
const wrapBase64 = buffer => Buffer.from(buffer).toString('base64').replace(/(.{76})/g, '$1\r\n');

function configured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && (process.env.CERTIFICATE_FROM_EMAIL || process.env.SMTP_USER));
}

class SMTPConnection {
    constructor(socket) {
        this.socket = socket;
        this.buffer = '';
        this.waiters = [];
        this._bind();
    }

    _bind() {
        this.socket.setEncoding('utf8');
        this.socket.on('data', chunk => {
            this.buffer += chunk;
            this._drain();
        });
        this.socket.on('error', error => this._fail(error));
        this.socket.on('close', () => this._fail(new Error('SMTP connection closed unexpectedly.')));
    }

    _fail(error) {
        while (this.waiters.length) this.waiters.shift().reject(error);
    }

    _drain() {
        while (this.waiters.length) {
            const lines = this.buffer.split(/\r?\n/);
            if (lines.length < 2) return;
            let consumed = 0;
            let code = null;
            let finalIndex = -1;
            for (let i = 0; i < lines.length - 1; i += 1) {
                const match = lines[i].match(/^(\d{3})([ -])/);
                if (!match) continue;
                if (code === null) code = match[1];
                if (match[1] === code && match[2] === ' ') { finalIndex = i; break; }
            }
            if (finalIndex < 0) return;
            const responseLines = lines.slice(0, finalIndex + 1);
            consumed = responseLines.join('\r\n').length + 2;
            this.buffer = this.buffer.slice(consumed);
            const waiter = this.waiters.shift();
            waiter.resolve({ code: Number(code), message: responseLines.join('\n') });
        }
    }

    read() {
        return new Promise((resolve, reject) => {
            this.waiters.push({ resolve, reject });
            this._drain();
        });
    }

    async command(line, expected = [250]) {
        this.socket.write(`${line}\r\n`);
        const response = await this.read();
        if (!expected.includes(response.code)) throw new Error(`SMTP command failed (${response.code}): ${response.message}`);
        return response;
    }

    detach() {
        this.socket.removeAllListeners('data');
        this.socket.removeAllListeners('error');
        this.socket.removeAllListeners('close');
        this.socket.setEncoding(null);
        return this.socket;
    }
}

async function connectSocket(host, port, secure) {
    const socket = secure
        ? tls.connect({ host, port, servername: host, rejectUnauthorized: true })
        : net.createConnection({ host, port });
    await new Promise((resolve, reject) => {
        const event = secure ? 'secureConnect' : 'connect';
        socket.once(event, resolve);
        socket.once('error', reject);
        socket.setTimeout(15000, () => reject(new Error('SMTP connection timed out.')));
    });
    socket.setTimeout(0);
    return socket;
}

async function openSession() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
    let socket = await connectSocket(host, port, secure);
    let session = new SMTPConnection(socket);
    const greeting = await session.read();
    if (greeting.code !== 220) throw new Error(`SMTP server rejected connection: ${greeting.message}`);

    let ehlo = await session.command(`EHLO ${process.env.SMTP_HELO || 'localhost'}`, [250]);
    if (!secure && /STARTTLS/i.test(ehlo.message)) {
        await session.command('STARTTLS', [220]);
        const raw = session.detach();
        socket = tls.connect({ socket: raw, servername: host, rejectUnauthorized: true });
        await new Promise((resolve, reject) => {
            socket.once('secureConnect', resolve);
            socket.once('error', reject);
        });
        session = new SMTPConnection(socket);
        ehlo = await session.command(`EHLO ${process.env.SMTP_HELO || 'localhost'}`, [250]);
    } else if (!secure && String(process.env.SMTP_ALLOW_INSECURE || '').toLowerCase() !== 'true') {
        throw new Error('SMTP server does not advertise STARTTLS. Refusing to send credentials over an unencrypted connection.');
    }

    await session.command('AUTH LOGIN', [334]);
    await session.command(Buffer.from(process.env.SMTP_USER).toString('base64'), [334]);
    await session.command(Buffer.from(process.env.SMTP_PASS).toString('base64'), [235]);
    return session;
}

function buildMessage({ to, subject, text, html, attachments = [] }) {
    const fromEmail = cleanHeader(process.env.CERTIFICATE_FROM_EMAIL || process.env.SMTP_USER);
    const fromName = cleanHeader(process.env.CERTIFICATE_FROM_NAME || 'UK LogiWare Safety Training');
    const mixed = `mixed_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const alt = `alt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const headers = [
        `From: ${fromName} <${fromEmail}>`,
        `To: ${cleanHeader(to)}`,
        `Subject: ${cleanHeader(subject)}`,
        'MIME-Version: 1.0',
        `Content-Type: multipart/mixed; boundary="${mixed}"`,
        '',
    ];
    const parts = [
        `--${mixed}`,
        `Content-Type: multipart/alternative; boundary="${alt}"`,
        '',
        `--${alt}`,
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        String(text || ''),
        `--${alt}`,
        'Content-Type: text/html; charset="UTF-8"',
        'Content-Transfer-Encoding: 8bit',
        '',
        String(html || ''),
        `--${alt}--`,
    ];
    for (const attachment of attachments) {
        parts.push(
            `--${mixed}`,
            `Content-Type: ${cleanHeader(attachment.contentType || 'application/octet-stream')}; name="${cleanHeader(attachment.filename)}"`,
            'Content-Transfer-Encoding: base64',
            `Content-Disposition: attachment; filename="${cleanHeader(attachment.filename)}"`,
            '',
            wrapBase64(attachment.content),
        );
    }
    parts.push(`--${mixed}--`, '');
    return [...headers, ...parts].join('\r\n').replace(/\r\n\.\r\n/g, '\r\n..\r\n');
}

async function sendMail(options) {
    if (!configured()) {
        const error = new Error('Certificate email is not configured. Add SMTP_HOST, SMTP_USER, SMTP_PASS and CERTIFICATE_FROM_EMAIL to backend/.env.');
        error.code = 'EMAIL_NOT_CONFIGURED';
        throw error;
    }
    const fromEmail = process.env.CERTIFICATE_FROM_EMAIL || process.env.SMTP_USER;
    const session = await openSession();
    try {
        await session.command(`MAIL FROM:<${cleanHeader(fromEmail)}>`, [250]);
        await session.command(`RCPT TO:<${cleanHeader(options.to)}>`, [250, 251]);
        await session.command('DATA', [354]);
        const message = buildMessage(options).replace(/\r\n\./g, '\r\n..');
        session.socket.write(`${message}\r\n.\r\n`);
        const result = await session.read();
        if (result.code !== 250) throw new Error(`SMTP delivery failed (${result.code}): ${result.message}`);
        await session.command('QUIT', [221]).catch(() => {});
        session.socket.end();
        return { accepted: true };
    } catch (error) {
        session.socket.destroy();
        throw error;
    }
}

module.exports = { sendMail, configured };
