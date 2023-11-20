const headerCheckbox = document.querySelector('#header-checkbox');
const checkboxes = document.querySelectorAll("#data-checkbox");
var totalChecked = 0;

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
})


// Add event listeners to monitor status of checkboxes for each DATA row
checkboxes.forEach(i => {
    i.addEventListener('change', (e) => {
        if (e.target.checked) {
            totalChecked++;
        } else {
            totalChecked--;
        }
        console.log(`Checked: ${totalChecked}, Unchecked: ${100 - totalChecked}`);
    });
});


