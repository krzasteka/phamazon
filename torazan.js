const puppeteer = require('puppeteer');
const fs = require('fs');

//tor --RunAsDaemon 1
const tr = require('tor-request');
tr.TorControlPort.password = "password";
  
const newSess = async () => {
  return new Promise((resolve, reject) => {
    tr.newTorSession((status, msg) => {
      if (!status) {
        console.log(msg)
        resolve(msg);
      } else {
        reject(msg);
      }
    });
  }); 
}

// await page.goto(`https://www.amazon.com/`);
// var searchAmazon = function (searchTerm) {
//   const searchBox = document.getElementById("twotabsearchtextbox");
//   searchBox.value = searchTerm;
//   const searchButton = document.getElementById("nav-search-submit-text").parentNode.getElementsByTagName("input")[0];
//   searchButton.click();
// }
//page.url(); return the url of the page

let scrape = async (amt) => {
    let reviews = [];
    
    let browser = await puppeteer.launch({
      headless: false,
      args: ['--proxy-server=socks5://127.0.0.1:9050']
    });

    let page = await browser.newPage();
    
    await page.goto(`https://www.amazon.com/NoCry-Cut-Resistant-Gloves-Performance/product-reviews/B00IVM1TKO/ref=cm_cr_dp_d_hist_5?ie=UTF8&filterByStar=${stars}_star&reviewerType=all_reviews#reviews-filter-bar`);
    
    let getReviews = await page.evaluate(() => {
        let data = [];
        let elements  = document.querySelectorAll('div[id*="customer_review-"]');

        for (var element of elements){ // Loop through each proudct
            let title = element.childNodes[0].childNodes[2].innerText;
            let text = element.childNodes[3].childNodes[0].innerText;
            data.push({title, text});
        }
        return data;
    });

    let nextButton = "#cm_cr-pagination_bar > ul > li.a-last > a";
    
     for (let i = 0; i < amt; i++) {
      reviews = reviews.concat(getReviews);
      await page.focus(nextButton);
      await page.waitFor(2000);
      await page.click(nextButton);
    }

    browser.close();
    await newSess();
    return reviews;
};
scrape(5).then((value) => {
    fs.writeFile("reviews.txt", JSON.stringify(value), (err) => {
      if (err) {
        console.log("File Write Error: ")
        console.log(err)
      }
    });
    console.log("Success!");
});

