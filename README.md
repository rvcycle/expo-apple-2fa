# expo-apple-2fa

Wires serivces together to allow Expo to publish iOS builds, especially with Apple two-factor authentication enabled

## Usage

1. [Generate an app-specific password](https://support.apple.com/en-us/HT204397). Unfortunately, some pieces of Fastlane use this, but others use the standard Apple ID password.

2. Use Github Secrets to store at least:
    * Your Apple password (`EXPO_APPLE_PASSWORD`)
    * Your app-specific password (`EXPO_APP_SPECIFIC_PASSWORD`)

    It's up to you if you want to store your phone number or Apple ID itself in the secrets.

3. Create a workflow file in your repository.

    ```
    publish:
      runs-on: macos-latest  # REQUIRED.
      steps:
        - uses: jakemwood/expo-apple-2fa@main
          with:
            expo_apple_id: "my-apple-id-here@me.com"
            expo_apple_password: ${{ secrets.EXPO_APPLE_PASSWORD }}
            app_specific_password: ${{ secrets.EXPO_APP_SPECIFIC_PASSWORD }}
            tfa_phone_number: "+1 (800) 555-1234"
    ```

    **NOTE:** the format of the `tfa_phone_number` must match exactly what is offered to you by the Expo client / Fastlane when choosing how to receive your 2FA code.

## How it works

Once the action runs, it will provide you with a link to an ngrok tunnel where you can enter your 2FA code once you receive it. You have two choices:

1. Use the provided web interface

2. Send a `POST` request to the tunnel with a JSON body:
   ```
   {"code": "123456"}
   ```

## Alternatives?

If there are, I'd love to hear about them and abandon this project.

## License

MIT