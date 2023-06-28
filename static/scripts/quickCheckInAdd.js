const addButton = document.querySelector('.add-button')
const remButton = document.querySelector('.fa-close')

getChildCount = () => {
    let count = 0;
    let id = ""
    children = document.querySelector('form').childNodes;
    for (let i = 0; i < children.length; i ++) {
        id = String(children[i].id)
        if(id.includes('child-name')) count +=1
    }
    return count;
}

count = getChildCount()
addButton.addEventListener('click', (event) => {

    event.preventDefault();
    count += 1;
    const nameLabelContainer = document.createElement('div')
    nameLabelContainer.classList.add('child-label-container')

    const nameLabel= document.createElement('label')
    nameLabel.innerHTML = `Child ${count}:`
        
    const removeB = document.createElement('button')
    removeB.classList.add('btn', 'remove-button')

    const x = document.createElement('i')
    x.classList.add('fa', 'fa-close')
    removeB.appendChild(x)

    nameLabelContainer.append(nameLabel, removeB)

    const nameInput = document.createElement('input')
    nameInput.type = "text"
    nameInput.id = `child-name-${count}`

    addButton.parentElement.insertBefore(nameLabelContainer, addButton)
    addButton.parentElement.insertBefore(nameInput, addButton)
})

function removeItem(event) {
    event.target.parentElement.remove();
    count -= 1;
}