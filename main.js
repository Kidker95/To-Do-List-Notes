const noteForm = document.getElementById("noteForm");
const headlineBox = document.getElementById("headlineBox");
const contentBox = document.getElementById("contentBox");
const deadlineBox = document.getElementById("deadlineBox");
const boardDiv = document.getElementById("boardDiv");
const noNotesP = document.getElementById("noNotesMSG");

let allNotes = [];

// Get info from user, validate, push to allNotes
function getNote() {
  const headline = headlineBox.value;
  const content = contentBox.value;
  const dateTimeFormatted = formatDateTime(deadlineBox.value);
  if (!validation()) return;

  const note = { headline, content, dateTimeFormatted };
  allNotes.push(note);
  displayNotes(allNotes);
  saveNotes();
  noteForm.reset(); // Reset form fields after submission
}

// Time format dd/mm/yy hh:mm
function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  // The english format is hh:mm dd/mm/yyyy
  const formattedDate = date.toLocaleDateString("en-GB");
  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedTime}, ${formattedDate}`;
}

// Splice specific note from allNotes, deletes it, reshow allNotes, save current notes
function deleteNote(index) {
  const sure = confirm("Are you sure you want to delete the note?");
  if (!sure) return;
  allNotes.splice(index, 1);
  displayNotes(allNotes);
  saveNotes();
}

// Create div for every note and inject content
function displayNotes(allNotes) {
  let html = ``;
  for (let i = 0; i < allNotes.length; i++) {
    html += `<div class='note'>
    <div class="noteHeadline">
      <p>${allNotes[i].headline}<p>
    </div>
    <div class="noteContent">
     <p>${allNotes[i].content}</p>
    </div>
    <div class="noteBottom">
      <div title="Deadline" class="noteDeadline">
        <p>${allNotes[i].dateTimeFormatted}</p>
      </div>
      <div class='deleteButtonDiv'>
      <button title="Delete Note" class='deleteNoteBtn btn btn-outline-danger' onclick='deleteNote(${i})'><img src='assets/xIcon.png'></button>
      </div>
    </div>
    </div>`;
  }
  boardDiv.innerHTML = html;
  // If arr allNotes is empty, un-display the board
  boardDiv.style.display = allNotes.length > 0 ? "flex" : "none";
  // if the board has notes, hide empty notes msg
  noNotesP.style.display = allNotes.length > 0 ? "none" : "block";
}

// Empties Fields
function resetNote() {
  headlineBox.value = ``;
  contentBox.value = ``;
  deadlineBox.value = ``;
}

// User must type in a headline, content, and a deadline
function validation() {
  if (!headlineBox.value && !contentBox.value && !deadlineBox.value) {
    alert("Can't post an empty note!");
    return false;
  }
  if (!headlineBox.value) {
    alert(`Can't post a note without a headline!`);
    return false;
  }
  if (!contentBox.value) {
    alert(`Can't post a note without content!`);
    return false;
  }
  if (!deadlineBox.value) {
    alert(`Can't Post without a deadline!`);
    return false;
  }
  return true;
}

// Local storage
function saveNotes() {
  const json = JSON.stringify(allNotes);
  localStorage.setItem("allNotes", json);
}

function loadNotes() {
  const json = localStorage.getItem("allNotes");
  if (!json) return;
  allNotes = JSON.parse(json);
  displayNotes(allNotes);
}
