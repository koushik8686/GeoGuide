const puppeteer = require('puppeteer');

async function scrapeGoogleFlights(origin, destination, date) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/flights?hl=en#flt=${origin}.${destination}.${date}`);

  // Wait for the results to load
  await page.waitForSelector('.gws-flights-results__cheapest-price');

  // Extract flight data
  const flights = await page.evaluate(() => {
    const results = [];
    document.querySelectorAll('.gws-flights-results__result-item').forEach((item) => {
      const airline = item.querySelector('.gws-flights-results__carrier').innerText;
      const price = item.querySelector('.gws-flights-results__cheapest-price').innerText;
      results.push({ airline, price });
    });
    return results;
  });

  await browser.close();
  return flights;
}

// Usage
scrapeGoogleFlights('JFK', 'LAX', '2023-12-25').then(console.log);