/* global bootbox */
$(document).ready(function() {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  function handleArticleSave() {
    // This function is triggered when the user wants to save an article
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    // Using a patch method to be semantic since this is an update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/headlines/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      // If the data was saved successfully
      if (data.saved) {
        location.reload();
      }
    });
  }

  function handleArticleScrape() {
    // This function handles the user clicking any "scrape new article" buttons
    $.get("/api/scrape").then(function(data) {
      window.location.href = "/";
    });
  }

  function handleArticleClear() {
    $.get("/api/clear").then(function() {
      articleContainer.empty();
      location.reload();
    });
  }
});
