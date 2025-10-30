
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


let allAttachments = []; // keep track of all selected files

// 🪄 1. Define the function outside and above
function updateAttachmentPreview() {
    previewBox.innerHTML = ""; // clear old previews

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

    // add delete button logic
    previewBox.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = parseInt(this.dataset.index);
            allAttachments.splice(index, 1);
            updateAttachmentPreview(); // refresh the preview
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

    // show any warnings under the field
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
    updateAttachmentPreview(); // rebuild preview
});


// Listen for when the form is submitted
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

    // If valid:

    console.log("✅ User typed:",
        titleValue,
        descValue,
        duedateValue,
        assignedPerson,
        `Attachments: ${attachmentCount}`);




});

// Find the container where todos will appear
const todoListContainer = document.getElementById("todo-list");

