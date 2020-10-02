const fs = require('fs');
const cp = require('child_process');

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

export default function handlePlugins(url) {
    // First, load the plugins, if any
    const exists = fs.existsSync('./2fa.config.json');
    if (!exists) {
        return;
    }

    const pluginConfig = require('./2fa.config.json');

    const pluginNames = pluginConfig.map(pn => pn.name);

    // Install the plug-ins...
    const { status } = cp.spawnSync('npm', ['install', ...pluginNames], { stdio: 'pipe' });
}
