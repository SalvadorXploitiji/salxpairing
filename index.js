const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline-sync');
const chalk = require('chalk');

// Tampilan console
console.clear();
console.log(chalk.blueBright.bold(`  
███████╗ █████╗ ██╗     ██╗  ██╗    ██████╗  █████╗ ██╗██████╗     
██╔════╝██╔══██╗██║     ██║  ██║    ██╔══██╗██╔══██╗██║██╔══██╗    
█████╗  ███████║██║     ███████║    ██████╔╝███████║██║██████╔╝    
██╔══╝  ██╔══██║██║     ██╔══██║    ██╔═══╝ ██╔══██║██║██╔═══╝     
███████╗██║  ██║███████╗██║  ██║    ██║     ██║  ██║██║██║         
╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝        
`));
console.log(chalk.greenBright.bold('SALX PAIR TOOLS'));
console.log(chalk.white('Description:'), chalk.yellow('Official Pairing Whatsapp By Salvador'));
console.log(chalk.white('Follow me on GitHub:'), chalk.cyan('https://github.com/SalvadorXploitiji\n'));

// Input dari pengguna
const targetNumber = readline.question(chalk.greenBright('📌 Nombor Target: '));
const pairingCount = readline.questionInt(chalk.greenBright('🔢 Pairing Nominal: '));

console.log(chalk.yellow(`\n🚀 Memulai proses pairing ke ${targetNumber} sebanyak ${pairingCount} kali...\n`));

let pairIndex = 0;

// Fungsi untuk melakukan pairing
async function startPairing() {
    if (pairIndex >= pairingCount) {
        console.log(chalk.green('✅ Semua proses pairing selesai!'));
        process.exit();
    }

    console.log(chalk.blue(`🔄 Pairing ke-${pairIndex + 1}...`));

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: `pair-${pairIndex}` }), // ID unik untuk setiap pairing
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2411.5.html'
        }
    });

    client.on('qr', qr => {
        console.log(chalk.cyan(`\n🔑 Pairing Code untuk ${targetNumber} (ke-${pairIndex + 1}):`));
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log(chalk.green(`✅ Pairing ke-${pairIndex + 1} berhasil!`));
        client.destroy(); // Hapus session setelah berhasil
        pairIndex++;
        startPairing(); // Lanjutkan pairing berikutnya
    });

    client.initialize();
}

startPairing();