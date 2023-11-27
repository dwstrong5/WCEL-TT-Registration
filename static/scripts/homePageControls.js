const headerCheckbox = document.querySelector('#header-checkbox');
const checkboxes = document.querySelectorAll("#data-checkbox");
const buttons = document.querySelectorAll(".open-form-btn");
const popups = document.querySelectorAll(".popup-form");
const editButton = document.getElementById("edit-btn")
const viewButton = document.getElementById("view-btn")
const delButton = document.getElementById("del-btn")

var totalChecked = 0;

// Disable view and edit buttons if totalChecked is zero or greater than
// one to prevent user from trying to view/edit multiple records simultaneously
function checkButtons() {
    console.log(`Checked: ${totalChecked}, Unchecked: ${100 - totalChecked}`);

    // Enable 'Delete Record(s) button if at least 1 is checked. Disabled by default.
    totalChecked > 0 ? delButton.classList.remove("disabled") : delButton.classList.add("disabled")

    // Enable View and Edit Record buttons if and only if one record is checked.
    // Disabled by default.
    if (totalChecked === 0 || totalChecked > 1) {
        viewButton.classList.add("disabled");
        editButton.classList.add("disabled");
    } else {
        viewButton.classList.remove("disabled");
        editButton.classList.remove("disabled");
    }
}


// Function that closes all popups.
function closePopUps() {
    popups.forEach(i => {
        i.style.display = 'none';
    });
}

// Add event listener to monitor status of checkbox for HEADER row
headerCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        checkboxes.forEach(i => {
            i.checked = true; 
            totalChecked = checkboxes.length; 
        });
    } else {
        checkboxes.forEach(i => {
            i.checked = false; 
            totalChecked = 0;
        });
    }
    checkButtons();
})


// Add event listeners to monitor status of checkboxes for each DATA row
checkboxes.forEach(i => {
    i.addEventListener('change', (e) => {
        if (e.target.checked) {
            totalChecked++;
        } else {
            totalChecked--;
        }
        checkButtons();
    });
});

// Add event listeners to trigger popups when their corresponding button is clicked.
buttons.forEach(i => {
    i.addEventListener('click', (event) => {
        if(event.target.id === "reportButton") {
            closePopUps();
            document.getElementById("reportPopupForm").style.display = 'block';
        }
        else if (event.target.id === "add-btn") {
            closePopUps();
            document.getElementById("addRecordPopupForm").style.display = 'block';
        }
        else if (event.target.id === "del-btn") {
            closePopUps();
            document.getElementById("deleteRecordPopupForm").style.display = 'block';
        }
    });
});

// Creates an event listener that closes a popup form when the user clicks anywhere
// in the surrounding area. Works for all popup forms.
document.addEventListener('click', function (event) {

    if (!event.target.closest('.popup-form') && !event.target.closest('.open-form-btn')) {
        closePopUps();
    }
});

// Event listeners for the Remove Confirmation popup
const confirmDelete = document.querySelector('#confirm-delete-button');
const rejectDelete = document.querySelector('#reject-delete-button');

rejectDelete.addEventListener('click', () => {
    rejectDelete.parentElement.parentElement.style.display = 'none';
});

