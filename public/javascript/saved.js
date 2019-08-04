/* global bootbox */
$(document).ready(function() {
  // Getting a reference to the article container div we will be rendering all articles inside of
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  $(".clear").on("click", handleArticleClear);

  function renderNotesList(data) {
    // This function handles rendering note list items to our notes modal
    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {
      // If we have no notes, just display a message explaining this
      currentNote = $(
        "<li class='list-group-item'>No notes for this article yet.</li>"
      );
      notesToRender.push(currentNote);
    } else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
        currentNote = $("<li class='list-group-item note'>")
          .text(data.notes[i].noteText)
          .append($("<button class='btn btn-danger note-delete'>x</button>"));
        // Store the note id on the delete button for easy access when trying to delete
        currentNote.children("button").data("_id", data.notes[i]._id);
        // Adding our currentNote to the notesToRender array
        notesToRender.push(currentNote);
      }
    }
    // Now append the notesToRender to the note-container inside the note modal
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    // This function handles deleting articles/headlines
    // We grab the id of the article to delete from the card element the delete button sits inside
    var articleToDelete = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();
    // Using a delete method here just to be semantic since we are deleting an article/headline
    $.ajax({
      method: "DELETE",
      url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {
      // If this works out, run initPage again which will re-render our list of saved articles
      if (data) {
        location.reload();
      }
    });
  }
  function handleArticleNotes(event) {
    // This function handles opening the notes modal and displaying our notes
    // We grab the id of the article to get notes for from the card element the delete button sits inside
    var currentArticle = $(this)
      .parents(".card")
      .data();
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
      // Constructing our initial HTML to add to the notes modal
      var modalText = $("<div class='container-fluid text-center'>").append(
        $("<h4>").text("Article Notes"),
        $("<hr>"),
        $("<ul class='list-group note-container'>"),
        $("<textarea placeholder='New Note' rows='4' cols='60'>"),
        $("<button class='btn btn-success save'>Save Note</button>")
      );
      // Adding the formatted HTML to the note modal
      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        _id: currentArticle._id,
        notes: data || []
      };
      // Adding some information about the article and article notes to the save button for easy access
      // When trying to add a new note
      $(".btn.save").data("article", noteData);
      // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note,
    // grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea")
      .val()
      .trim();
    if (newNote) {
      noteData = {
        _headlineId: $(this).data("article")._id,
        noteText: newNote
      };
      $.post("/api/notes", noteData).then(function() {
        //   // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    // This function handles the deletion of notes
    var noteToDelete = $(this).data("_id");
    // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

  function handleArticleClear() {
    $.get("/api/clearsaved").then(function(data) {
      articleContainer.empty();
      location.reload();
    });
  }
});
