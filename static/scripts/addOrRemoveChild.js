let childCount = 1;

// Get reference to add button
const addButton = document.querySelector(".add-button");
addButton.addEventListener('click', addChildEntry);

function addChildEntry() {
    document.querySelector('.services-container').insertAdjacentElement('afterend',createChildEntry())
}

function dateFormat(input) {
    input = input.replace(/\D/g,'');
    var size = input.length;
    if (size>2) {input=input.slice(0,2)+"-"+input.slice(2,8)}
    if (size>4) {input=input.slice(0,5)+"-"+input.slice(5)}
    return input;
}

function createChildEntry() {
    childCount += 1;
    const res = document.createElement('div')
    res.className="added-child-container"
    const nameLabel= document.createElement('label')
    nameLabel.innerHTML = "<span>* </span>Your child's full name:"
        
    const nameInput = document.createElement('input')
    nameInput.type = "text"
    nameInput.placeholder = "ex: Jane Smith"
    nameInput.id = `child-name-${childCount}`
    nameInput.name = `child-name-${childCount}`
    nameInput.required = true

    const ageLabel = document.createElement('label')
    ageLabel.innerHTML = "<span>* </span>Your child's date of birth:"

    const agePicker = document.createElement('input')
    agePicker.type = "text"
    agePicker.placeholder="MM-DD-YYYY"
    agePicker.pattern = "\d{2}-\d{2}-\d{4}"
    agePicker.id = `child-age-${childCount}`
    agePicker.name = `child-age-${childCount}`
    agePicker.required = true

    agePicker.addEventListener('input', (e) => {
        e.target.value = dateFormat(e.target.value)
    });

    const servicesLabel = document.createElement('label')
    servicesLabel.innerHTML = "Are they receiving services at WCEL?"

    const servicesContainer = document.createElement('div')
    servicesContainer.className = "services-container"
    const yesRadioBtn = document.createElement('input')
    yesRadioBtn.type="radio"
    yesRadioBtn.value="Yes"
    yesRadioBtn.id = `receiving-services-${childCount}`
    yesRadioBtn.name = `receiving-services-${childCount}`

    const yesLabel = document.createElement('label');
    yesLabel.id = `receiving-services-${childCount}`
    yesLabel.innerText = "Yes"


    const noRadioBtn = document.createElement('input')
    noRadioBtn.type="radio"
    noRadioBtn.value="No"
    noRadioBtn.id = `receiving-services-${childCount}`
    noRadioBtn.name = `receiving-services-${childCount}`

    const noLabel = document.createElement('label');
    noLabel.id = `receiving-services-${childCount}`
    noLabel.innerText = "No"

    servicesContainer.append(yesRadioBtn, yesLabel, noRadioBtn, noLabel)

    const removeBtn = document.createElement('input')
    removeBtn.type = "button"
    removeBtn.value = "Remove child"
    removeBtn.classList.add("remove-button")
    removeBtn.addEventListener("click", removeItem)

    res.append(nameLabel, nameInput, ageLabel, agePicker, servicesLabel, servicesContainer, removeBtn);

    return res;
}



function removeItem(event) {
    event.target.parentElement.remove();
    childCount -= 1;
}

