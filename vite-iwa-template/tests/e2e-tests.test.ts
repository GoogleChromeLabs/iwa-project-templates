import * as puppeteer from 'puppeteer-core';
import * as path from 'path';
import * as wbnSign from 'wbn-sign';
import * as fs from 'fs';

/*
  If you want to debug E2E tests, you will need to either create a custom debug launch configuration
  https://code.visualstudio.com/docs/debugtest/debugging-configuration

  Alternatively, you can use a test runner extension. 
  https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner
*/
describe('E2E Tests', () => {
  let browser: puppeteer.Browser;
  let session: puppeteer.CDPSession;
  let manifestID: string;

  const bundlePath = path.join(process.cwd(), 'dist', 'iwa-template.swbn');
  const flags = "--enable-features=IsolatedWebApps,IsolatedWebAppDevMode";
  test("IWA Should be installed and launched correctly",async ()   => {
    const bundleContent = new Uint8Array(await fs.promises.readFile(bundlePath));
    manifestID = wbnSign.getBundleId(bundleContent);

    browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome',
      headless: false,
      pipe: true,
      args: [flags]
    });

    session = await browser.target().createCDPSession();

    await session.send("PWA.install", {
      manifestId: `isolated-app://${manifestID}`,
      installUrlOrBundleUrl: `file://${bundlePath}`
    });

    await session.send("PWA.launch", {
      manifestId: `isolated-app://${manifestID}`
    })

    await browser.close();

  }, 300000 );

});
