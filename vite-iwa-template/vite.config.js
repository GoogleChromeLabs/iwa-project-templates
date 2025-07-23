/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineConfig } from "vite";
import injectHTML from "vite-plugin-html-inject";
import fs from "fs";

import wbn from "rollup-plugin-webbundle";
import * as wbnSign from "wbn-sign";
import dotenv from "dotenv";

dotenv.config();
const plugins = [injectHTML()];

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const PRIVATE_KEY_PASSWORD = process.env.PRIVATE_KEY_PASSWORD;
const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;

if (!PRIVATE_KEY_PATH && NODE_ENV == "production") {
    throw Error("Build Failed: Specify PRIVATE_KEY_PATH in your .env file");
}

if (NODE_ENV === "production") {
    //Get key and decrypt it

    const key = wbnSign.parsePemKey(
        fs.readFileSync(PRIVATE_KEY_PATH),
        PRIVATE_KEY_PASSWORD || (await wbnSign.readPassphrase(PRIVATE_KEY_PATH)),
    );

    plugins.push({
        ...wbn({
            // Ensures the web bundle is signed as an isolated web app
            baseURL: new wbnSign.WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
            // Ensure that all content in the `public` directory is included in the web bundle
            static: {
                dir: "public",
            },
            // The name of the output web bundle
            output: "iwa-template.swbn",
            // This ensures the web bundle is signed with the key
            integrityBlockSign: {
                strategy: new wbnSign.NodeCryptoSigningStrategy(key),
            },
        }),
        enforce: "post",
    });
}

export default defineConfig({
    plugins,
    server: {
        // Fallback to 4321, if PORT is not specified in .env
        port: PORT || 4321,
        hmr: {
            protocol: "ws",
            host: "localhost",
            clientPort: PORT || 4321,
        },
    },

    build: {
        rollupOptions: {
            input: {
                main: "./index.html",
            },
        },
    },
});
