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

Once enabled, and chrome is restarted, go to `chrome://web-app-internals`, the web app internals
page. This page shows you the web apps you have installed, including Isolated Web Apps and
Progressive Web Apps, with details for each.

You'll know everything is correct if you see the "Isolated Web Apps" section at the top of the page.

### Installing the IWA through the dev proxy

Run:

`npm run dev`

Then, navigate to:

`chrome://web-app-internals`

Look for a field called "Install IWA via Dev Mode Proxy", type in your localhost url, then click
Install

If everything installed correctly, you should see

Installing IWA: http://localhost:PORT/ successfully installed

Congratulations! You have installed your very own isolated web app

_Note: If your development server shuts down or is unreachable, you won't be able to access or
install your Isolated Web App_

### Installing the IWA through a Signed Web Bundle

If you want to install your IWA through a .swbn file, you will need to generate a signing key, use
openssl to generate and encrypt a Ed25519 or ECDSA P-256 key

    #Generate an unencrypted Ed25519 key

    openssl genpkey -algorithm Ed25519 -out private_key.pem

    #Or Generate an unencrypted ECDSA P-256 key

    openssl ecparam -name prime256v1 -genkey -noout -out private_key.pem

    #Encrypt the private key. Using a strong passphrase (which you will be
    #prompted for) is highly recommended to protect the key from unauthorized
    #use if the file is ever compromised.

    openssl pkcs8 -in private_key.pem -topk8 -out encrypted_key.pem

    #Remove the unencrypted key

    rm private_key.pem

Next, create a .env file containing:

    PRIVATE_KEY_PATH='PATH_TO_YOUR_ENCRYPTED_KEY'
    PRIVATE_KEY_PASSWORD='YOUR_KEY_PASSWORD'
    NODE_ENV='YOUR_ENVIROMENT_MODE'
    PORT=YOUR_PORT

_Note: NODE_ENV must be set to 'production' to make the build run._

_Note: If you don't specify PORT, the app will fall back to default value (4321)_

Next, you need to build your IWA by running

    npm run build

This process will generate:

- A .swbn file named iwa-template.swbn in the /dist folder.
- Your Web Bundle ID, displayed in the terminal

Navigate to `chrome://web-app-internals`, look for "Install IWA from Signed Web Bundle" field, click
"Select File", upload your .swbn file.

If everything went correctly, you should see a field:

Installing IWA: successfully installed (Web Bundle ID:
slu74sbybztfypa43w7f7rd34cbhautjcrfegz5lbow7vmwjojbqaaic).

_Note: Your web bundle ID will look differently, this is just an example_

Since IWA are using a different schema `isolated-app://` instead of `https://`, you can access it by
pasting `isolated-app://your-web-bundle-id` in Chrome, or by running it like any other app on your
computer.

### Personalizing this template

- How do I change the icon?

Navigate to /public/images/, change icon file, and update /public/.well-known/manifest.webmanifest
"icons" field accordingly.

_Note: Isolated Web Apps require at least one icon of 144x144px size._

Related information:
[Define your app icons - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons)

- Updating the Manifest

Isolated Web Apps share the same
[Manifest Properties](https://web.dev/articles/add-manifest#manifest-properties) as Progressive Web
Apps, with some slight variations, see:
[Isolated Web Apps explainer - Web App manifest section](https://chromeos.dev/en/web/isolated-web-apps)

There are two fields that should be included, `version` and `update_manifest_url`

1. `version` - Required for Isolated Web Apps. A string consisting of one or more integers separated
   by a dot (.). Your version can be something simple like 1, 2, 3, etc…, or something complex like
   [SemVer](https://semver.org/)⁠ (1.2.3).

2. `update_manifest_url` - Optional, but recommended field that points to an HTTPS URL (or localhost
   for testing) where a Web Application Update Manifest can be retrieved.

- How to add API Permissions?

By default, Chrome blocks all permission requests from IWAs. You can opt-in to permission policies you need by specifying
a `permissions_policy` field in your manifest.

_Note: Adding a permission here does not automatically grant it, it just makes it avaliable to be
granted, when a request for that capacity is made._

    #permission policy example
    "permissions_policy": {
        "geolocation": [ "self", "https://map.example.com" ],
        "direct-sockets": ["self"],
        "controlled-frame": ["self"]
    }

Related Information

- [Permissions Policy - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Permissions_Policy#allowlists)
- [Permissions Policy header - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Permissions_Policy#allowlists)
- [Web Application Manifest - MDN Docs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)

### Related Information

- [Isolated Web Apps Explainer](https://chromeos.dev/en/web/isolated-web-apps)
- [IWA Kitchen Sink](https://github.com/chromeos/iwa-sink)
- [IWA Telnet Client](https://github.com/GoogleChromeLabs/telnet-client/tree/main)
- [IWA Smartcard Demo](https://github.com/GoogleChromeLabs/web-smartcard-demo/tree/main)
