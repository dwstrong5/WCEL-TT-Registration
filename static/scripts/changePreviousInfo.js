const edit = document.querySelector("#edit-button")
const submit = document.querySelector("#submit-button")
const container = document.querySelector('.main-content-container')
editMode = false;

// Get contents of previous elements.
let parentName = document.querySelector("#parent-name").innerHTML.split(":")[1].trim()
let parentPhone = document.querySelector("#parent-phone").innerHTML.split(":")[1].trim()
let parentEmail = document.querySelector("#parent-email").innerHTML.split(":")[1].trim()
let children = document.getElementsByClassName("child-name")
let childNames = []
for(var i = 0; i < children.length; i++) {
    childNames.push(children[i].innerHTML.split(":")[1].trim())
}

// Create form element
var form = document.createElement("form")
form.setAttribute("method", "post")
form.setAttribute("action", "")
form.classList.add("hidden")

// Create parent name label and input
var parentNameLabel = document.createElement("label")
parentNameLabel.innerHTML = "Your name:"
var parentNameInput = document.createElement("input")
parentNameInput.setAttribute("name", "parent-name")
parentNameInput.setAttribute("type", "input")
parentNameInput.setAttribute("placeholder", parentName)
parentNameInput.setAttribute("required", '')

// Create phone number label and input
var parentPhoneLabel = document.createElement("label")
parentPhoneLabel.innerHTML = "Your phone number:"
var parentPhoneInput = document.createElement("input")
parentPhoneInput.setAttribute("name", "phone")
parentPhoneInput.setAttribute("type", "tel")
parentPhoneInput.setAttribute("placeholder", parentPhone)
parentPhoneInput.setAttribute("required", '')

// Create email label and input
var parentEmailLabel = document.createElement("label")
parentEmailLabel.innerHTML = "Your email address:"
var parentEmailInput = document.createElement("input")
parentEmailInput.setAttribute("name", "email")
parentEmailInput.setAttribute("type", "email")
parentEmailInput.setAttribute("placeholder", parentEmail)
parentEmailInput.setAttribute("required", '')

// Create parent name label and input
var childNameLabel = document.createElement("label")
childNameLabel.innerHTML = "Your child's name:"
var childNameInput = document.createElement("input")
childNameInput.setAttribute("name", "child-name")
childNameInput.setAttribute("type", "input")
childNameInput.setAttribute("placeholder", childNames[0])
childNameInput.setAttribute("required", '')

form.append(parentNameLabel, parentNameInput, parentPhoneLabel, parentPhoneInput, 
    parentEmailLabel, parentEmailInput, childNameLabel, childNameInput)
container.insertAdjacentElement("afterend", form)


edit.addEventListener('click', () => {
    if (!editMode) {
        container.classList.toggle("hidden")
        form.classList.toggle("hidden")
    }
})


function removeItem(event) {
    event.target.parentElement.remove();
    childCount -= 1;
}

