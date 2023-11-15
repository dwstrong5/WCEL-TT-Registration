// Creates an event listener that opens a popup form when the button is clicked.
// For all buttons that create popups (Generate Report, Add/Edit/Del Records)
const buttons = document.querySelectorAll(".open-form-btn");
const popups = document.querySelectorAll(".popup-form");

buttons.forEach(i => {
    i.addEventListener('click', (event) => {
        if(event.target.id === "reportButton") {
            document.getElementById("reportPopupForm").style.display = 'block';
        }
        else if (event.target.id === "add-btn") {
            document.getElementById("addRecordPopupForm").style.display = 'block';
        }
    });
});

// Creates an event listener that closes a popup form when the user clicks anywhere
// in the surrounding area. Works for all popup forms.
document.addEventListener('click', function (event) {

    if (!event.target.closest('.popup-form') && !event.target.closest('.open-form-btn')) {
        popups.forEach(i => {
            i.style.display = 'none';
        });
    }
});


