const puppeteer = require('puppeteer');
const fs = require('fs');

//tor --RunAsDaemon 1
const tr = require('tor-request');
tr.TorControlPort.password = "password";

const req = async (url) => {  
  return new Promise((resolve, reject) => {
    tr.request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body);
      } else {
        console.log("*******************************")
        console.log(err)
        console.log("*******************************")
        reject(err);
      }
    });
  });
};
  
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

(async function() {

})();

let scrape = async (amt) => {
    // const browser = await puppeteer.launch({
    //   headless: false,
    //   args: ['--proxy-server=socks5://127.0.0.1:9050']
    // });
    // const page = await browser.newPage();
    // await page.setRequestInterception(true);
    // page.on("request", async interceptedRequest => {
    //   console.log(interceptedRequest.url());
    //   return await req(interceptedRequest.url());
    //   // interceptedRequest.abort()
    // });
    // await page.goto('https://www.amazon.com/NoCry-Cut-Resistant-Gloves-Performance/product-reviews/B00IVM1TKO/ref=cm_cr_dp_d_hist_5?ie=UTF8&filterByStar=five_star&reviewerType=all_reviews#reviews-filter-bar');
    // const getReviews = await page.evaluate(() => {
    //     let data = [];
    //     let elements  = document.querySelectorAll('div[id*="customer_review-"]');

    //     for (var element of elements){ // Loop through each proudct
    //         let title = element.childNodes[0].childNodes[2].innerText;
    //         let text = element.childNodes[3].childNodes[0].innerText;

    //         data.push({title, text});
    //     }
    //     return data;
    // });

    // let reviews = [];
    // let nextButton = "#cm_cr-pagination_bar > ul > li.a-last > a";
    // for (let i = 0; i < amt; i++) {
    //   reviews = reviews.concat(getReviews);
    //   await page.focus(nextButton);
    //   await page.waitFor(2000);
    //   await page.click(nextButton);
    // }
    let finalHtml = "";
    for (let i = 0; i < amt; i++) {
      let browser = await puppeteer.launch({
        headless: false,
        args: ['--proxy-server=socks5://127.0.0.1:9050']
      });
      let page = await browser.newPage();
      await page.goto("http://api.ipify.org");
      let bodyHandle = await page.$("body");
      let html = await page.evaluate(body => body.innerHTML, bodyHandle);
      await bodyHandle.dispose();
      finalHtml += html + "\n";
      await newSess();
      browser.close();
    }
    return finalHtml;
    // return reviews;
};
scrape(2).then((value) => {
    fs.writeFile("reviews.txt", JSON.stringify(value), (err) => {
      if (err) {
        console.log("File Write Error: ")
        console.log(err)
      }
    });
    console.log("Success!");
});

