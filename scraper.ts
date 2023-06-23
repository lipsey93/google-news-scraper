import puppeteer from "puppeteer";
import fs from "fs/promises";

export const googleNewsScraper = async (query: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const googleNewsRssPagePrefix =
    "https://news.google.com/rss/search?hl=he&gl=IL&ceid=IL:he&q=";
  await page.goto(googleNewsRssPagePrefix + query, {
    waitUntil: "domcontentloaded",
  });

  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("item")).map(({ children }) => {
      const [title, link, , date, , srcName] = (
        Array.from(children) as HTMLElement[]
      ).map((x) => x.textContent);
      return { title, link, date, srcName };
    });
  });
  console.log(data[99]);
  // fs.writeFile("index.html", JSON.stringify({ ...data }));
  await page.close();
  await browser.close();
};

googleNewsScraper("קריפטו");
