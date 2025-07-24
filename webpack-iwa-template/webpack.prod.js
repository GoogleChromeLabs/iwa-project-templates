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

import { merge } from "webpack-merge";
import common from "./webpack.common.js";
import WebBundlePlugin from "webbundle-webpack-plugin";
import { parsePemKey, NodeCryptoSigningStrategy, readPassphrase } from "wbn-sign";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH;
const PRIVATE_KEY_PASSWORD = process.env.PRIVATE_KEY_PASSWORD;

if (!PRIVATE_KEY_PATH) {
    throw Error("Build Failed: Specify PRIVATE_KEY_PATH in your .env file");
}

//Get the key and decrypt it
const privateKey = parsePemKey(
    fs.readFileSync(PRIVATE_KEY_PATH),
    PRIVATE_KEY_PASSWORD || (await readPassphrase(PRIVATE_KEY_PATH)),
);

export default merge(common, {
    mode: "production",
    plugins: [
        new WebBundlePlugin({
            output: "iwa-template.swbn",
            integrityBlockSign: {
                strategy: new NodeCryptoSigningStrategy(privateKey),
            },
        }),
    ],
});
