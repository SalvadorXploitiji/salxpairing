
   const { makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const figlet = require('figlet');

console.log(chalk.blue(figlet.textSync('SALX', { horizontalLayout: 'full' })));
console.log(chalk.green('Salxpairing v.1.0'));
console.log(chalk.yellow('Follow me on GitHub: https://github.com/SalvadorXploitiji\n'));

// Input dari pengguna
const targetNumber = prompt(chalk.cyan('Nombor target (dengan kode negara, contoh: +60123456789): '));
const pairingCount = parseInt(prompt(chalk.cyan('Jumlah pairing: ')), 10);

// Validasi input
if (!targetNumber.startsWith('+') || isNaN(pairingCount) || pairingCount <= 0) {
    console.log(chalk.red('Input tidak valid! Pastikan nombor target memiliki kode negara dan jumlah pairing adalah angka positif.'));
    process.exit(1);
}

(async () => {
    for (let i = 1; i <= pairingCount; i++) {
        console.log(chalk.yellow(`\n[PAIRING ${i}] Menjalankan sesi pairing...`));

        const { state, saveCreds } = await useMultiFileAuthState(`./session-salx-${i}`);
        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: false // Matikan QR karena kita menggunakan pairing code
        });

        sock.ev.on('creds.update', saveCreds);

        // Tunggu hingga bot siap untuk pairing
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, pairingCode } = update;

            if (connection === 'open') {
                console.log(chalk.green(`[PAIRING ${i}] Pairing sukses untuk nomor ${targetNumber}!`));
            } else if (pairingCode) {
                console.log(chalk.blue(`[PAIRING ${i}] Kode Pairing untuk nomor ${targetNumber}: ${pairingCode}`));
                console.log(chalk.magenta('Gunakan kode ini untuk login di WhatsApp Web target.'));
            } else if (connection === 'close') {
                console.log(chalk.red(`[PAIRING ${i}] Pairing gagal!`));
                if (lastDisconnect?.error) console.log(chalk.red(lastDisconnect.error));
            }
        });
    }
})();