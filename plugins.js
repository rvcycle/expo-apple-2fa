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

function handlePlugins(url) {
    // First, load the plugins, if any
    const configPath = path.join(process.cwd(), '2fa.config.json');
    const exists = fs.existsSync(configPath);
    if (!exists) {
        return;
    }

    const pluginConfig = require(configPath);

    const pluginNames = pluginConfig.map(pn => pn.name);

    // Install the plug-ins...
    const { status } = cp.spawnSync('npm', ['install', ...pluginNames], { stdio: 'pipe' });
}
module.exports = handlePlugins;
