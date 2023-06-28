const addButton = document.querySelector('.add-button')
const remButton = document.querySelector('.fa-close')

remButton.parentNode.addEventListener('click', (event) => {event.preventDefault()})

getChildCount = () => {
    let count = 0;
    let id = ""
    children = document.querySelector('form').childNodes;
    for (let i = 0; i < children.length; i ++) {
        id = String(children[i].id)
        if(id.includes('child-container')) count +=1
    }
    return count;
}

count = getChildCount()
console.log(count)
addButton.addEventListener('click', (event) => {

    event.preventDefault();
    count += 1;

    const childContainer = document.createElement('div')
    childContainer.id = 'child-container'

    const nameLabelContainer = document.createElement('div')
    nameLabelContainer.classList.add('child-label-container')

    const nameLabel= document.createElement('label')
    nameLabel.innerHTML = `Child ${count}:`
        
    const removeB = document.createElement('button')
    removeB.classList.add('btn', 'remove-button')
    removeB.addEventListener('click', (event) => {event.preventDefault()})

    const x = document.createElement('i')
    x.classList.add('fa', 'fa-close')
    x.addEventListener('click', removeItem)
    removeB.appendChild(x)

    nameLabelContainer.append(nameLabel, removeB)

    const nameInput = document.createElement('input')
    nameInput.type = "text"
    nameInput.id = `child-name-${count}`

    childContainer.append(nameLabelContainer, nameInput)

    addButton.parentElement.insertBefore(childContainer, addButton)
    updateCounts()
})

remButton.addEventListener('click', removeItem)

function removeItem(event) {
    event.preventDefault();
    event.target.parentElement.parentElement.parentElement.remove();
    updateCounts()
    count -= 1;
}

function updateCounts() {
    let tmpCount = 1;
    children = document.querySelector('form').childNodes;

    for (let i = 0; i < children.length; i++) {
        id = String(children[i].id)
        if(id.includes('child-container')) {
            children[i].children[0].children[0].innerHTML = `Child ${tmpCount}:`
            tmpCount += 1
        }
    }
}