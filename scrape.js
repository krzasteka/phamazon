
var searchAmazon = function (searchTerm) {
	const searchBox = document.getElementById("twotabsearchtextbox");
	searchBox.value = searchTerm;
	const searchButton = document.getElementById("nav-search-submit-text").parentNode.getElementsByTagName("input")[0];
	searchButton.click();
}

var reviewLinks = Array.from(document.querySelectorAll('a[href$="customerReviews"]'));
var reviewLinksUrls = reviewLinks.map(review => review.getAttribute("href"));

var reviewsWithXStars = function(amount) {
  document.querySelector(`a[aria-label*="${amount} star"]`);  
}

var reviews = Array.from(document.querySelectorAll('div[id*="customer_review-"]')).map(function(review) {
  var titleNode = review.getElementsByClassName("review-title").item(0);
  var titleText = titleNode.innerHTML;

  var reviewTextNode = review.getElementsByClassName("review-text").item(0);
  var reviewText = reviewTextNode.innerHTML;
  return {
    "title": titleText,
    "text": reviewText
  }
});
