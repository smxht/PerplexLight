const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

async function encryptExe() {
    const inputPath = path.join(__dirname, 'PerplexLight.exe');
    const outputPath = path.join(__dirname, 'encrypted.bin');

    const key = crypto.createHash('sha256').update('peitanove').digest();
    const iv = Buffer.alloc(16, 0);

    try {
        const exeBuffer = await fs.readFile(inputPath);

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        const encrypted = Buffer.concat([cipher.update(exeBuffer), cipher.final()]);

        await fs.writeFile(outputPath, encrypted);
        console.log('✅ Arquivo encriptado salvo como:', outputPath);
        console.log('🚀 So enviar esse arquivo para sua URL pública (ex.: GitHub)');
    } catch (err) {
        console.error('❌ Erro ao encriptar:', err);
    }
}

encryptExe();
