const headerCheckbox = document.querySelector('#header-checkbox');
const checkboxes = document.querySelectorAll("#data-checkbox");
const buttons = document.querySelectorAll(".open-form-btn");
const popups = document.querySelectorAll(".popup-form");
const editButton = document.getElementById("edit-btn");
const viewButton = document.getElementById("view-btn");
const delButton = document.getElementById("del-btn");
const checked = new Set();
var editMode = false;
var totalChecked = 0;
const recordFields = document.querySelectorAll('[id$="-info"]');
var record;

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

    } else {
        viewButton.classList.remove("disabled");

    }
}


function phoneFormat(input) {//returns (###) ###-####
    input = input.replace(/\D/g,'');
    var size = input.length;
    if (size>0) {input="("+input}
    if (size>3) {input=input.slice(0,4)+") "+input.slice(4,11)}
    if (size>6) {input=input.slice(0,9)+"-" +input.slice(9)}
    return input;
}

function formatDate(input) {
    input = input.replace(/\D/g,'');
    var size = input.length;
    if (size>2) {input=input.slice(0,2)+"/"+input.slice(2,8)}
    if (size>4) {input=input.slice(0,5)+"/"+input.slice(5)}
    return input;
}

function populateFormData() {
    recordFields.forEach(i => {
        currField = i.id.slice(0,-5);
        if(currField in record) {
            document.getElementById(i.id).value = record[currField];
        } else {
            document.getElementById(i.id).value = "";
        }
    });
}

// Function that closes all popups.
function closePopUps() {
    popups.forEach(i => {
        i.style.display = 'none';
    });
}

function toggleEditMode() {
    var fields = document.querySelectorAll('[id$="-info"]')
    if(!editMode) {
        fields.forEach(i => {
            i.classList.remove("form-control-plaintext");
            i.classList.add("form-control");
            i.removeAttribute('readonly');
        });
        document.getElementById("edit-btn-container").style.display = "none";
        document.getElementById("changes-btn-container").style.display = "flex";
        editMode = true;
    } else {
        fields.forEach(i => {
            i.classList.remove("form-control");
            i.classList.add("form-control-plaintext");
            i.setAttribute('readonly', true);
        });
        document.getElementById("edit-btn-container").style.display = "flex";
        document.getElementById("changes-btn-container").style.display = "none";
        editMode = false;
    }
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
            console.log(`Adding ${e.target.parentElement.parentElement.dataset.recordId}`);
            checked.add(e.target.parentElement.parentElement.dataset.recordId);
        } else {
            totalChecked--;
            console.log(`Removing ${e.target.parentElement.parentElement.dataset.recordId}`);
            checked.delete(e.target.parentElement.parentElement.dataset.recordId);
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
        else if (event.target.id === "view-btn") {
            closePopUps();
            if (checked.size === 1) {
                $.ajax({
                    type: "POST",
                    url: "/view-record",
                    data: JSON.stringify([...checked]),
                    contentType: "application/json",
                    dataType: "json",
                    success: function(response) {
                        // Check the response from the server
                        if (response.status === 200) {
                            record = response.record
                            populateFormData();
                        } else {
                            // Handle other cases, e.g., display an error message
                            console.error(response.message);
                        }
                    },
                    error: function(error) {
                        console.error(error); // Log any errors for debugging
                    }
                });
                document.getElementById("viewRecordPopupForm").style.display = 'block';
            }
            
        } else if (event.target.id === "edit-btn") {
            closePopUps();
            document.getElementById("editRecordPopupForm").style.display = 'block';
        }
    });
});

// Creates an event listener that closes a popup form when the user clicks anywhere
// in the surrounding area. Works for all popup forms.
document.addEventListener('click', function (event) {

    if (!event.target.closest('.popup-form') && !event.target.closest('.open-form-btn')) {
        closePopUps();
        if(editMode) {
            toggleEditMode();
        }
    }
});

// Confirm deletion of selected records.
document.querySelector('#confirm-delete-button').addEventListener('click', (e) => {
    $.ajax({
        type: "POST",
        url: "/delete-record",
        data: JSON.stringify([...checked]),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            // Check the response from the server
            if (response.status === 200) {
                // Redirect to the home page after successful deletion
                window.location.href = "/home";
            } else {
                // Handle other cases, e.g., display an error message
                console.error(response.message);
            }
        },
        error: function(error) {
            console.error(error); // Log any errors for debugging
        }
    });
});

editButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleEditMode();
});

document.getElementById("cancel-changes-btn").addEventListener("click", (e) => {
    e.preventDefault();
    if (editMode) {
        toggleEditMode();
        closePopUps();
    }
});

// Reject confirmation to delete selected records. If clicked, close the "Delete Record" popup.
document.querySelector('#reject-delete-button').addEventListener('click', (e) => {
    e.target.parentElement.parentElement.style.display = 'none';
});

document.getElementById("submit-changes-btn").addEventListener("click", (e) => {
    e.preventDefault();
    var newEntry = {"_id": record["_id"]};
    recordFields.forEach(i => {
        if(document.getElementById(i.id).value != "") {
            newEntry[i.id.slice(0,-5)] = document.getElementById(i.id).value
        }
    });
    console.log(newEntry)
    $.ajax({
        type: "POST",
        url: "/update-record",
        data: JSON.stringify(newEntry),
        contentType: "application/json;",
        dataType: "json",
        success: function(response) {
            // Check the response from the server
            if (response.status === 200) {
                // Redirect to the home page after successful deletion
                window.location.href = "/home";
            } else {
                // Handle other cases, e.g., display an error message
                console.error(response.message);
            }
        },
        error: function(error) {
            console.error(error); // Log any errors for debugging
        }
    });
});

document.getElementById("date-info").addEventListener("input", (e) => {
    e.target.value = formatDate(e.target.value)
});

document.getElementById("phone-info").addEventListener("input", (e) => {
    e.target.value = phoneFormat(e.target.value)
});

document.querySelectorAll('[id^="child-age"]').forEach(i => {
    i.addEventListener("input", (e) => {
        e.target.value = formatDate(e.target.value);
    });
});

