## Prerequisites

- Google Chrome 120+
- openssl
- npm

## Using this repository

Clone this repository:

    git clone ADD_LINK_HERE
    cd iwa_vite_template
    npm install

Open Google Chrome, go to `chrome://flags` and enable

    chrome://flags/#enable-isolated-web-app-dev-mode
    chrome://flags/#enable-isolated-web-apps

Once enabled, and chrome is restarted, go to `chrome://web-app-internals`, the web app internals page. This page shows you the web apps you have installed, including Isolated Web Apps and Progressive Web Apps, with details for each.
You'll know everything is correct if you see the "Isolated Web Apps" section at the top of the page.

### Installing the IWA through the dev proxy

Run:
`npm run dev`

Then, navigate to:

    chrome://web-app-internals

Look for a field called "Install IWA via Dev Mode Proxy", type in your localhost url, then click Install
If everything installed correctly, you should see

    Installing IWA: http://localhost:PORT/ successfully installed

Congratulations! You have installed your very own isolated web app
_Note: If your development server shuts down or is unreachable, you won't be able to access or install your Isolated Web App_

### Installing the IWA through a Signed Web Bundle

If you want to install your IWA through a .swbn file, you will need to generate a signing key, use openssl to generate and encrypt a Ed25519 or ECDSA P-256 key

    # Generate an unencrypted Ed25519 key
    openssl genpkey -algorithm Ed25519 -out private_key.pem

    # Or Generate an unencrypted ECDSA P-256 key
    openssl ecparam -name prime256v1 -genkey -noout -out private_key.pem

    # Encrypt the generated key, this will ask you for a passphrase, you
    # can skip it, but it is not recommended, use a strong passphrase.

    openssl pkcs8 -in private_key.pem -topk8 -out encrypted_key.pem

    # Remove the unencrypted key

    rm private_key.pem

Next, you need to build your IWA by running

    npm run build

Then bundle it:

    npx wbn --dir dist

Then sign it:

    npx wbn-sign -i out.wbn -k encrypted_key.pem -o signed_bundle.swbn

This will generate a .swbn file called signed_bundle.swbn.
Once signed, the command will output the Web Bundle ID, which is used to identify your IWA in the browser.

Navigate to `chrome://web-app-internals`, look for "Install IWA from Signed Web Bundle" field, click "Select File", upload your .swbn file.
If everything went correctly, you should see a field:

    Installing IWA: successfully installed (Web Bundle ID: slu74sbybztfypa43w7f7rd34cbhautjcrfegz5lbow7vmwjojbqaaic).

_Note: Your web bundle ID might look differently, this is just an example_

Since IWA are using a different schema `isolated-app://` instead of `https://`, you can access it by pasting `isolated-app://your-web-bundle-id` in Chrome, or by running it like any other app on your computer.
