
function validateInput(inputElement, errorElement, message) {
    const value = inputElement.value.trim();

    if (value === "") {
        errorElement.textContent = message;
        inputElement.classList.add("is-invalid");
        return false; // invalid
    } else {
        errorElement.textContent = "";
        inputElement.classList.remove("is-invalid");
        return true; // valid
    }
}

const form = document.getElementById("todoForm");
const titleInput = document.getElementById("title");
const titleError = document.getElementById("title-error");
const descInput = document.getElementById("description");
const descError = document.getElementById("description-error");
const dueDateInput = document.getElementById("duedate");
const dateError = document.getElementById("duedate-error");
const personSelect = document.getElementById("sel1");

const attachmentInput = document.getElementById("attachment");
const clearAttachmentsBtn = document.getElementById("clear-attachments");
const previewBox = document.getElementById("attachment-preview");
const attachmentError = document.getElementById("attachment-error");

const todoList = document.getElementById("todo-list");

let allAttachments = [];


function updateAttachmentPreview() {
    previewBox.innerHTML = "";

    if (allAttachments.length === 0) {
        previewBox.innerHTML = "<p class='text-muted'>No attachments selected.</p>";
        return;
    }

    allAttachments.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className =
            "border border-1 border-secondary-subtle rounded p-2 mb-2 bg-light d-flex justify-content-between align-items-center";
        fileItem.innerHTML = `
      <div>
        <i class="bi bi-file-earmark me-2"></i>${file.name}
        <span class="text-muted small">(${Math.round(file.size / 1024)} KB)</span>
      </div>
      <button class="btn btn-sm btn-outline-danger" data-index="${index}">
        <i class="bi bi-x"></i>
      </button>
    `;
        previewBox.appendChild(fileItem);
    });

    previewBox.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            allAttachments.splice(index, 1);
            updateAttachmentPreview();
        });
    });
}

attachmentInput.addEventListener("change", function () {
    attachmentError.textContent = ""; // clear any previous warnings

    const newFiles = Array.from(attachmentInput.files);
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".txt"];
    const maxSize = 2 * 1024 * 1024; // 2 MB
    const safeFiles = [];
    const errorMessages = [];

    newFiles.forEach(file => {
        const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

        if (!allowedExtensions.includes(ext)) {
            errorMessages.push(`"${file.name}" is not an allowed file type.`);
        } else if (file.size > maxSize) {
            errorMessages.push(`"${file.name}" is too large (max 2 MB).`);
        } else {
            safeFiles.push(file);
        }
    });

    // show a warnings under the field
    if (errorMessages.length > 0) {
        attachmentError.textContent = "⚠️ " + errorMessages.join(" ");
    }

    allAttachments = allAttachments.concat(safeFiles);
    updateAttachmentPreview();
});

clearAttachmentsBtn.addEventListener("click", function () {
    attachmentInput.value = "";
    allAttachments = [];
    attachmentError.textContent = "";
    updateAttachmentPreview();
});

form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the page from refreshing

    const titleValue = titleInput.value.trim(); // get what the user typed
    const descValue = descInput.value.trim();
    const duedateValue = dueDateInput.value.trim();
    const personValue = personSelect.value;
    const assignedPerson = personValue ? personValue : "Unassigned";
    const attachmentCount = allAttachments.length;

    const titleValid = validateInput(titleInput, titleError, "⚠️ Please enter a title");
    const descValid = validateInput(descInput, descError, "⚠️ Please enter a description");
    const dateValid = validateInput(dueDateInput, dateError, "⚠️ Please choose a due date");

    if (!titleValid || !descValid || !dateValid) {
        return; // stop if any field is invalid
    }

    const now = new Date();
    const selectedDate = new Date(duedateValue);

    if (selectedDate < now) {
        dateError.textContent = "⚠️ Due date cannot be in the past.";
        dueDateInput.classList.add("is-invalid");
        return; // stop submission
    } else {
        dateError.textContent = "";
        dueDateInput.classList.remove("is-invalid");
    }

    // If valid:
    console.log("✅ User typed:",
        titleValue,
        descValue,
        duedateValue,
        assignedPerson,
        `Attachments: ${attachmentCount}`);

    const todoItem = document.createElement("div");
    todoItem.className = "p-3 border border-1 border-secondary-subtle rounded-1 mb-2";
    todoItem.id = `todo-${Date.now()}`; // unique ID based on timestamp

    todoItem.innerHTML =`<div class="d-flex justify-content-between align-items-start">
    <div>
      <h6 class="fw-semibold mb-1">${titleValue}</h6>
      <p class="text-muted mb-2">${descValue}</p>
      <div class="d-flex flex-wrap align-items-center gap-2">
        <span class="text-muted">
          <i class="bi bi-calendar3 me-1"></i> Due: ${duedateValue}
        </span>
        ${assignedPerson !== "Unassigned" ? `
        <span class="badge bg-info text-dark d-flex align-items-center">
          <i class="bi bi-person-fill me-1"></i> ${assignedPerson}
        </span>` : ""}
        ${attachmentCount > 0 ? `
        <span class="badge bg-secondary d-flex align-items-center">
          <i class="bi bi-paperclip me-1"></i> ${attachmentCount} attachment${attachmentCount > 1 ? "s" : ""}
        </span>` : ""}
      </div>
    </div>

    <div class="d-flex align-items-center justify-content-end gap-2">
      <small class="text-muted">Created: ${new Date().toLocaleDateString()}</small>
      <div class="btn-group" role="group">
        <button type="button" class="btn btn-outline-success p-1" style="width: 36px; height: 36px;" data-action="check">
          <i class="bi bi-check-lg"></i>
        </button>
        <button type="button" class="btn btn-outline-primary p-1" style="width: 36px; height: 36px;" data-action="edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button type="button" class="btn btn-outline-danger p-1" style="width: 36px; height: 36px;" data-action="delete">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>`;


    const exampleTodo = document.getElementById("example-todo");
    if (exampleTodo) {
        exampleTodo.classList.add("d-none"); // hides it with Bootstrap
    }
    todoList.appendChild(todoItem);

    form.reset();
    allAttachments = [];
    updateAttachmentPreview();

});

    todoList.addEventListener("click", function (event) {
        if (event.target.closest("[data-action='delete']")) {
            const todoCard = event.target.closest(".p-3");
            todoCard.remove();

            // check if there are any real todos left
            const remainingTodos = todoList.querySelectorAll("[id^='todo-']");
            if (remainingTodos.length === 0) {
                const exampleTodo = document.getElementById("example-todo");
                if (exampleTodo) exampleTodo.classList.remove("d-none");
            }
    }
});



