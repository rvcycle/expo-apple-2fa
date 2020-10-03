//
//
// WARNING: file not used yet...
//
//
const core = require('@actions/core');

async function runExpo() {
    // Start work on our Expo project.
    const expoArguments = core.getInput('expo_arguments');
    console.log(chalk.blueBright(`===> Running: expo upload:ios ${expoArguments}`));

    expoCli = cp.spawn('script', ['-r', '-q', '/dev/null', `expo upload:ios ${expoArguments}`], {
        env: {
            ...process.env,
            EXPO_APPLE_ID: core.getInput('expo_apple_id'),
            EXPO_APPLE_PASSWORD: core.getInput('expo_apple_password'),
            SPACESHIP_2FA_SMS_DEFAULT_PHONE_NUMBER: core.getInput('tfa_phone_number'),
            FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD: core.getInput('app_specific_password'),
        },
        shell: 'zsh',
    });

    console.log(`pid: ${expoCli.pid}`);

    // Basic piping experiment
    expoCli.stdout.pipe(process.stdout, { end: false });
    expoCli.stderr.pipe(process.stdout, { end: false });

    const onOutput = (data) => {
        expoOut += data;
    }
    expoCli.stdout.on('data', onOutput);
    expoCli.stderr.on('data', onOutput);

    const onExit = (code) => {
        console.log('===> Expo-cli exited with code', code);

        // It seems like the expo-cli is kind of buggy, so as long as we see
        // the success message from Fastlane anywhere in the output, we can
        // successfully exit with a code of zero
        if (expoOut.includes(successMessage)) {
            process.exit(0);
        }
        else {
            process.exit(code);
        }
    }
    expoCli.on('exit', onExit);
    expoCli.on('close', onExit);
}

module.exports = runExpo;