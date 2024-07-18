const noteForm = document.getElementById("noteForm");
const headlineBox = document.getElementById("headlineBox");
const contentBox = document.getElementById("contentBox");
const deadlineBox = document.getElementById("deadlineBox");
const boardDiv = document.getElementById("boardDiv");
const noNotesH5 = document.getElementById("noNotesMSG");
const searchBox = document.getElementById("searchBox");

let allNotes = [];

// get info from user, validate, push to allNotes
function getNote() {
  const headline = headlineBox.value;
  const content = contentBox.value;
  const dateTimeFormatted = deadlineBox.value
    ? formatDateTime(deadlineBox.value)
    : ""; // only format if the user puts a deadline
  if (!validation()) return;

  const note = { headline, content, dateTimeFormatted };
  allNotes.push(note);
  displayNotes(allNotes);
  saveNotes();
  resetNote(); // deletes the input fields after posting the note
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
  return `${formattedTime} <br> ${formattedDate}`;
}

// Splice specific note from allNotes, deletes it, reshow allNotes, save current notes

function deleteNote(index) {
  const sure = confirm("Are you sure you want to delete the note?");
  if (!sure) return;
  allNotes.splice(index, 1);
  displayNotes(allNotes);
  saveNotes();
}

// to re format the date time back to the input
function reformatDateTimeForInput(dateTimeFormatted) {
  // return an empty string if dateTimeFormatted is empty
  if (!dateTimeFormatted) return "";

  const [time, date] = dateTimeFormatted.split(", ");
  const [day, month, year] = date.split("/");
  const [hours, minutes] = time.split(":");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function editNote(index) {
  const sure = confirm("Are you sure you want to edit note?");
  if (!sure) return;
  const note = allNotes[index];
  headlineBox.value = note.headline;
  contentBox.value = note.content;
  // if there isnt a deadline, dont format it
  deadlineBox.value = note.dateTimeFormatted
    ? reformatDateTimeForInput(note.dateTimeFormatted)
    : "";
  editIndex = index;

  allNotes.splice(index, 1);
  displayNotes(allNotes);
  saveNotes();
}

// Create div for every note and inject content
function displayNotes(notes) {
  let html = ``;
  for (let i = 0; i < notes.length; i++) {
    html += `<div class="note">
      <div class="noteHeadline">
        <p>${notes[i].headline}</p>
      </div>
      <div class="noteContent">
        <p>${notes[i].content}</p>
      </div>
      <div class="noteBottom">
        <div class="buttonsBottomDiv">
          <button title="Edit Note" onclick="editNote(${i})" class="btn btn-outline-warning edit-button">
            <img class="noteBottomButton" src="assets/pencilIcon.png" />
          </button>
          <button title="Delete Note" class="deleteNoteBtn btn btn-outline-danger" onclick="deleteNote(${i})">
            <img class="noteBottomButton" src="assets/xIcon.png" />
          </button>
        </div>
        <div title="Deadline" class="noteDeadline">
          <p>${notes[i].dateTimeFormatted}</p>
        </div>
      </div>
    </div>`;
  }
  boardDiv.innerHTML = html;
  boardDiv.style.display = notes.length > 0 ? "flex" : "none";
  noNotesH5.style.display = notes.length > 0 ? "none" : "block";
  noNotesH5.innerText =
    notes.length > 0
      ? ""
      : "No notes available. Add a new note to get started!";
}

// Empties Fields
function resetNote() {
  headlineBox.value = ``;
  contentBox.value = ``;
  deadlineBox.value = ``;
}

// User can choose to post note without a headline,deadline or content
function validation() {
  if (!headlineBox.value && !contentBox.value && !deadlineBox.value) {
    alert("Can't post an empty note!");
    return false;
  }
  if (!headlineBox.value) {
    const sure = confirm(
      "Are you sure you want to post a note without a headline?"
    );
    if (!sure) return;
  }
  if (!contentBox.value) {
    const sure = confirm(
      "Are you sure you want to post a note without content?"
    );
    if (!sure) return;
  }
  if (!deadlineBox.value) {
    const sure = confirm(
      "Are you sure you want to post a note without a deadline?"
    );
    if (!sure) return;
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

function searchNote() {
  const query = searchBox.value.toLowerCase();

  if (query === "") {
    displayNotes(allNotes);
    noNotesH5.innerText =
      allNotes.length > 0
        ? ""
        : "No notes available. Add a new note to get started!";
    noNotesH5.style.display = allNotes.length > 0 ? "none" : "block";
    return;
  }

  const filteredNotes = allNotes.filter((note) =>
    note.content.toLowerCase().includes(query)
  );

  displayNotes(filteredNotes);

  if (filteredNotes.length === 0) {
    noNotesH5.innerText = "No notes found with this content!";
    noNotesH5.style.display = "block";
  } else {
    noNotesH5.style.display = "none";
  }
}
