// Creates an event listener that opens a popup form when the button is clicked.
// For all buttons that create popups (Generate Report, Add/Edit/Del Records)
const buttons = document.querySelectorAll(".open-form-btn");
const popups = document.querySelectorAll(".popup-form");

function closePopUps() {
    popups.forEach(i => {
        i.style.display = 'none';
    });
}

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
        closePopUps()
    }
});

// Event listeners for the Remove Confirmation popup
const confirmDelete = document.querySelector('#confirm-delete-button');
const rejectDelete = document.querySelector('#reject-delete-button');

rejectDelete.addEventListener('click', (e) => {
    rejectDelete.parentElement.parentElement.style.display = 'none';
});


