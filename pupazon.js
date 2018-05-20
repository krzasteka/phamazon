const puppeteer = require('puppeteer');
const fs = require('fs');

let scrape = async (amt) => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://www.amazon.com/NoCry-Cut-Resistant-Gloves-Performance/product-reviews/B00IVM1TKO/ref=cm_cr_dp_d_hist_5?ie=UTF8&filterByStar=five_star&reviewerType=all_reviews#reviews-filter-bar');

    const getReviews = await page.evaluate(() => {
        let data = [];
        let elements  = document.querySelectorAll('div[id*="customer_review-"]');

        for (var element of elements){ // Loop through each proudct
            let title = element.childNodes[0].childNodes[2].innerText;
            let text = element.childNodes[3].childNodes[0].innerText;

            data.push({title, text});
        }
        return data;
    });

    let reviews = [];
    let nextButton = "#cm_cr-pagination_bar > ul > li.a-last > a";
    for (let i = 0; i < amt; i++) {
      reviews = reviews.concat(getReviews);
      await page.focus(nextButton);
      await page.waitFor(2000);
      await page.click(nextButton);
    } 
    browser.close();
    return reviews;
};
scrape(10).then((value) => {
    fs.writeFile("reviews.txt", JSON.stringify(value), (err) => {
      if (err) {
        console.log("File Write Error: ")
        console.log(err)
      }
    });
    console.log("Success!");
});

