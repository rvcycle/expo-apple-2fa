const fs = require('fs');
const cp = require('child_process');
const path = require('path');

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
 * Plug-ins must be a standard npm module that will
 * export a method called "tfaExec" which accepts
 * only one parameter: the ngrok url.
 * 
 */

async function installPlugins(pluginNames) {
    return new Promise((resolve, reject) => {
        // Install the plug-ins...
        const npm = cp.spawn('npm', ['install', ...pluginNames], { stdio: 'pipe' });
        npm.stdout.pipe(process.stdout, { end: false });
        npm.stderr.pipe(process.stdout, { end: false });

        const onExit = () => {
            console.log('npm exited!');
            resolve();
        };

        npm.on('exit', onExit);
        npm.on('close', onExit);
    });
}

async function handlePlugins(url) {
    // First, load the plugins, if any
    const configPath = path.join(process.cwd(), '2fa.config.json');
    const exists = fs.existsSync(configPath);
    if (!exists) {
        return;
    }

    const pluginConfig = require(configPath);

    // First, install our plug-ins...
    const pluginNames = pluginConfig.map(pn => pn.name);
    await installPlugins(pluginNames);
}
module.exports = handlePlugins;
