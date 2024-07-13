const noteForm = document.getElementById("noteForm");
const headlineBox = document.getElementById("headlineBox");
const contentBox = document.getElementById("contentBox");
const deadlineBox = document.getElementById("deadlineBox");
const boardDiv = document.getElementById("boardDiv");

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

// Splice specific note from allNotes, deletes it, reshow allNotes
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
      ${allNotes[i].headline}
    </div>
    <div class="noteContent">
      ${allNotes[i].content}
    </div>
    <div class="noteBottom">
      <div class="noteDeadline">
        ${allNotes[i].dateTimeFormatted}
      </div>
      <div class='deleteButtonDiv'>
      <button class='deleteNoteBtn btn btn-outline-danger' onclick='deleteNote(${i})'><img src='assets/xIcon.png'></button>
      </div>
    </div>
    </div>`;
  }
  boardDiv.innerHTML = html; 
//   If arr allNotes is empty, undisplay the board. one liner style!
  boardDiv.style.display = allNotes.length > 0 ? "flex" : "none";
}

// Empties Fields
function resetNote() {
  headlineBox.value = ``;
  contentBox.value = ``;
  deadlineBox.value = ``;
}

// User can choose to post without headline, content, and deadline
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
