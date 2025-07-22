/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may not use a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "./style.css";

const parent_container: HTMLDivElement | null = document.querySelector("#app");

function deleteChildNodes(container: HTMLDivElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

/**
 * Loads images and other content when the app is online.
 * It first clears the container to prevent duplicate content.
 */
function loadOnlineContent() {
  if (!parent_container) {
    console.error("App container not found!");
    return;
  }

  deleteChildNodes(parent_container);

  const image_urls: string[] = [
    "https://raw.githubusercontent.com/webpack/media/90b54d02fa1cfc8aa864a8322202f74ac000f5d2/logo/icon-square-big.svg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/250px-Typescript_logo_2020.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg",
  ];

  const href_urls: string[] = [
    "https://webpack.js.org/",
    "https://www.typescriptlang.org/docs/",
    "https://chromeos.dev/en/web/isolated-web-apps",
  ];

  for (let i = 0; i < image_urls.length; i++) {
    const href_element: HTMLAnchorElement = document.createElement("a");
    href_element.href = href_urls[i];
    const img_element: HTMLImageElement = document.createElement("img");
    img_element.crossOrigin = "anonymous";
    img_element.classList.add("logo");
    img_element.src = image_urls[i];

    href_element.appendChild(img_element);
    parent_container.appendChild(href_element);
  }

  const title = document.createElement("h1");
  title.textContent = "Isolated Web App built with Webpack and Typescript.";

  parent_container?.appendChild(title);

  const p_docs = document.createElement("p");
  p_docs.classList.add("read-the-docs");
  p_docs.textContent = "Learn more by clicking the logos.";
  parent_container.appendChild(p_docs);
}

/**
 * Displays an offline message in the app container.
 */
function showOfflineMessage() {
  if (!parent_container) return;
  deleteChildNodes(parent_container);
  const p_offline = document.createElement("p");

  const title = document.createElement("h1");
  title.textContent = "Isolated Web App built with Webpack and Typescript.";

  parent_container?.appendChild(title);

  p_offline.classList.add("read-the-docs");
  p_offline.textContent = "You are offline. Please check your connection.";
  parent_container.appendChild(p_offline);
}

window.addEventListener("online", () => {
  loadOnlineContent();
});

window.addEventListener("offline", () => {
  showOfflineMessage();
});

if (navigator.onLine) {
  loadOnlineContent();
} else {
  showOfflineMessage();
}
