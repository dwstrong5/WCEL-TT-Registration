
// Get reference to add button
const addButton = document.querySelector(".add-button");
addButton.addEventListener('click', addChildEntry);


function addChildEntry() {
    document.querySelector('.services-container').insertAdjacentElement('afterend',createChildEntry())
}

function createChildEntry() {
    const res = document.createElement('div')
    res.className="added-child-container"
    const nameLabel= document.createElement('label')
    nameLabel.innerHTML = "Your child's full name:"
        
    const nameInput = document.createElement('input')
    nameInput.type = "text"
    nameInput.placeholder = "ex: Jane Smith"
    nameInput.id = "child-name"
    nameInput.name = "child-name"

    const ageLabel = document.createElement('label')
    ageLabel.innerHTML = "How old is your child?"

    const agePicker = document.createElement('input')
    agePicker.type = "number"
    agePicker.min = 0
    agePicker.max = 5
    agePicker.defaultValue = 1
    agePicker.id = "child-age"
    agePicker.name = "child-age"

    const servicesLabel = document.createElement('label')
    servicesLabel.innerHTML = "Are they receiving services at WCEL?"

    const servicesContainer = document.createElement('div')
    servicesContainer.className = "services-container"
    const yesRadioBtn = document.createElement('input')
    yesRadioBtn.type="radio"
    yesRadioBtn.value="Yes"
    yesRadioBtn.id = "receiving-services"
    yesRadioBtn.name = "receiving services"

    const yesLabel = document.createElement('label');
    yesLabel.id = "receiving-services"
    yesLabel.innerText = "Yes"


    const noRadioBtn = document.createElement('input')
    noRadioBtn.type="radio"
    noRadioBtn.value="No"
    noRadioBtn.id = "receiving-services"
    noRadioBtn.name = "receiving services"

    const noLabel = document.createElement('label');
    noLabel.id = "receiving-services"
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
}

