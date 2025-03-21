
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