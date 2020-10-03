const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const chalk = require('chalk');

/***********************************************
 * Plug-ins!!
 * 
 * The 2fa.config.json format will be...
 * 
 * [
 *  {
 *    "name": "@expo-apple-2fa/google-cloud",
 *    "async": false,
 *    "config": {}
 *  }
 * ]
 * 
 * Plug-ins must be a standard npm module, with
 * a default export, that accept the url as an
 * argument, and return a Promise.
 * 
 */

async function installPlugins(pluginNames) {
    return new Promise((resolve, reject) => {
        // Install the plug-ins...
        const npm = cp.spawn('npm', ['install', ...pluginNames], { stdio: 'pipe', cwd: path.join(__dirname, '..') });
        npm.stdout.pipe(process.stdout, { end: false });
        npm.stderr.pipe(process.stdout, { end: false });

        const onExit = (code) => {
            console.log('npm exited with code', code);
            if (code == 0) {
                resolve();
            }
            else {
                reject();
            }
        };

        npm.on('close', onExit);
    });
}

async function handlePlugins(url) {
    // First, load the plugins, if any
    const configPath = path.join(process.cwd(), '2fa.config.json');
    const exists = fs.existsSync(configPath);
    if (!exists) {
        console.log('===> Did not find any plug-ins to run');
        return;
    }

    // Load our configuration
    const pluginConfig = require(configPath);

    // First, install our plug-ins...
    console.log(chalk.greenBright('===> Installing plug-ins...'));
    const pluginNames = pluginConfig.map(pn => pn.name);
    await installPlugins(pluginNames);

    // Now, load/run our plug-ins!
    console.log(chalk.greenBright('===> Running plug-ins...'));

    let syncPlugins = [];
    pluginConfig.forEach(pn => {
        const plugin = require(pn.name);
        if ('async' in pn) {
            if (pn.async) {
                plugin(url);
            }
            else {
                syncPlugins.push(plugin(url));
            }
        }
        else {
            // If no async defined, assume it's synchronous
            syncPlugins.push(plugin(url));
        }
    });

    // Trigger our async plugins, and wait for our sync plugins
    await Promise.all(syncPlugins);
}
module.exports = handlePlugins;
