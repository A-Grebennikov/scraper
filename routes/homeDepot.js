import { Router } from 'express';
import puppeteer from 'puppeteer';
import useProxy from 'puppeteer-page-proxy';
import { proxyRequest } from 'puppeteer-proxy';

const router = Router();

const PUPPETEER_OPTIONS = {
  headless: true,
  args: ['--disable-setuid-sandbox', '--no-sandbox'],
};

const openConnection = async () => {
  const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(60000);

  return { browser, page };
};

const closeConnection = async (page, browser) => {
  page && (await page.close());
  browser && (await browser.close());
};

router.post('/', async (req, res) => {
  const { link } = req.body;

  let { browser, page } = await openConnection();

  await page.setRequestInterception(true);
  try {
    console.log('----------process.env.PROXY', process.env.PROXY);
    // await useProxy(page, process.env.PROXY);

    console.log('----------useProxy', link);

    page.on('request', async (request) => {
      await proxyRequest({
        page,
        proxyUrl: process.env.PROXY,
        request,
      });
    });

    await page.goto(link, { waitUntil: 'domcontentloaded' });

    console.log('----------goto');

    page.on('response', async (response) => {
      if (response.url().includes('productClientOnlyProduct')) {
        console.log('----------needed response');
        if (!response.ok()) {
          const error = await response.text();

          await closeConnection(page, browser);

          res.status(500).json(error);
        } else {
          const data = await response.json();

          await closeConnection(page, browser);

          res.status(200).send(data);
        }
      }
    });

    await page.waitForTimeout(5000);
    await page.reload();
  } catch (err) {
    console.log('err.message------->', err.message ?? err);
    await closeConnection(page, browser);
    res.status(500).send(err.message ?? err);
  }
});

export default router;
