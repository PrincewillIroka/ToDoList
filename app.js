let toDoArray = []

const startApp = () => {
    // addDataToStorage()
    arrangeLayout()
}

const arrangeLayout = () => {
    const modal = document.getElementById("myModal");
    const today = new Date().toDateString().split(' ')
    const day = new Date().getDay();
    const rDay = day == 0 ? "Sunday"
        : day == 1 ? "Monday"
            : day == 2 ? "Tuesday"
                : day == 3 ? "Wednesday"
                    : day == 4 ? "Thursday"
                        : day == 5 ? "Friday"
                            : "Saturday"

    document.querySelector('[data-day-number]').innerHTML = today[2]
    document.querySelector('[data-month]').innerHTML = today[1]
    document.querySelector('[data-year]').innerHTML = today[3]
    document.querySelector('[data-day-of-week]').innerHTML = rDay
    const openModalButton = document.querySelector('[data-create]')
    const addToDoField = document.getElementsByClassName('addToDoField')[0]
    openModalButton.addEventListener('click', (e) => {
        addToDoField.setAttribute('data-action', 'create-new')
        addToDoField.value = ''
        openModal(modal)
    })
    if (retrieveDataFromStorage()) {
        toDoArray = [...retrieveDataFromStorage()]
    }
    populateToDo(toDoArray, 'newNode')
    addToDo()
}

const populateToDo = (toDoArray, nodeIndex) => {
    const ul = document.querySelector('[data-to-do-list]')

    if (toDoArray)
        for (const [index, values] of toDoArray.entries()) {
            const classesToAdd = ['fa',
                'fa-edit'];
            const classesToAdd2 = ['fa',
                'fa-trash'];

            const li = document.createElement("li")
            const div = document.createElement("div")
            const radio = document.createElement("input")
            const editBtn = document.createElement("div")
            const editIcon = document.createElement("i")
            const deleteBtn = document.createElement("div")
            const deleteIcon = document.createElement("i")
            const node = document.createTextNode(values.toDo)
            div.appendChild(node)
            radio.setAttribute('type', 'radio')
            if (values.done) {
                radio.setAttribute('checked', true)
                radio.checked = true
                li.classList.add('selectedToDo')
            }

            radio.addEventListener('click', (e) => {
                markItemAsDone(index, e);
            }, false)
            editIcon.classList.add(...classesToAdd)
            editBtn.appendChild(editIcon)
            deleteIcon.classList.add(...classesToAdd2)
            deleteBtn.appendChild(deleteIcon)
            editBtn.style.display = 'none'
            deleteBtn.style.display = 'none'
            li.appendChild(div)
            li.appendChild(radio)
            li.appendChild(editBtn)
            li.appendChild(deleteBtn)
            li.setAttribute('data-index', index)
            li.setAttribute('data-value', values.toDo)
            li.setAttribute('data-done', values.done)
            li.addEventListener('click', (e) => {
                toggleSelection(e)
            }, false)
            if (nodeIndex === 'newNode') {
                ul.insertBefore(li, ul.childNodes[0])
            } else {
                ul.replaceChild(li, ul.childNodes[nodeIndex])
            }

        }

}

const addToDo = () => {
    const addToDoButton = document.getElementsByClassName('addToDo')[0]
    const addToDoField = document.getElementsByClassName('addToDoField')[0]
    const warningMessage = document.getElementsByClassName('warningMessage')[0]

    addToDoButton.addEventListener('click', () => {

        if (addToDoField.value) {
            const action = addToDoField.dataset.action
            const newToDo = {
                toDo: addToDoField.value,
                done: false
            }

            if (action === 'update') {
                const liIndex = addToDoField.dataset.liindex
                const toDoIndex = addToDoField.dataset.todoindex
                toDoArray[toDoIndex].toDo = addToDoField.value
                populateToDo([newToDo], liIndex)
            } else {
                toDoArray.push(newToDo)
                populateToDo([newToDo], 'newNode')
            }

            addDataToStorage(toDoArray)
            addToDoField.value = ''
        } else {
            warningMessage.style.visibility = 'visible'
            setTimeout(() => {
                warningMessage.style.visibility = 'hidden'
            }, 2000)
        }

    })
}

const markItemAsDone = (index, e) => {
    const isChecked = e.currentTarget.getAttribute('checked')
    isChecked ? toDoArray[index].done = false : toDoArray[index].done = true
    addDataToStorage(toDoArray);
}

const toggleSelection = (e) => {
    const li = e.currentTarget
    const node = e.target
    const liIndex = li.dataset.index
    const liValue = li.dataset.value
    const liDone = li.dataset.done
    const modal = document.getElementById("myModal");
    const addToDoField = document.getElementsByClassName('addToDoField')[0]
    if (e.target === li || node == li.firstElementChild) {
        if (li.classList.contains('viewMoreForToDo')) {
            li.children[2].style.display = 'none'
            li.children[3].style.display = 'none'
            li.classList.remove('viewMoreForToDo')
        } else {
            // for (const iterator of [...li.parentNode.children].entries()) {
            //     console.log(iterator.classList);
            // }

            li.children[2].style.display = 'block'
            li.children[3].style.display = 'block'
            li.classList.add('viewMoreForToDo')
        }
    } else if (node.nodeName === 'INPUT') {
        const isChecked = node.getAttribute('checked')
        if (isChecked) {
            li.classList.remove('selectedToDo')
            node.removeAttribute('checked')
            node.checked = false
            li.dataset.done = false
        } else {
            li.classList.add('selectedToDo')
            node.setAttribute('checked', true)
            node.checked = true
            li.dataset.done = true
        }

    } else if (node.classList.contains('fa-edit')) {
        addToDoField.setAttribute('data-action', 'update')
        addToDoField.setAttribute('data-liindex', [...li.parentNode.children].indexOf(li))
        addToDoField.setAttribute('data-todoindex', liIndex)
        addToDoField.value = liValue
        openModal(modal)
        addToDoField.select()
    } else if (node.classList.contains('fa-trash')) {
        const ul = li.parentNode
        ul.removeChild(li)
        toDoArray.splice(liIndex, 1)
        addDataToStorage(toDoArray)
    }

}

const addDataToStorage = (someToDos) => {
    localStorage.setItem("myToDoList", JSON.stringify(someToDos))
}

const retrieveDataFromStorage = () => {
    return JSON.parse(localStorage.getItem("myToDoList"))
}

const openModal = (modal) => {
    // const span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";

    // span.onclick = () => {
    //     modal.style.display = "none";
    // }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

startApp()
