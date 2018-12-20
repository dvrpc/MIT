// get a handle on all the necessary elements
const principlesList = document.getElementById('principles-list')

const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
    }
}

// fetch all statements?
getPrinciples = (async () => {
    const stream = await fetch('https://alpha.dvrpc.org/mitoolbox/word/', options)
    const response = await stream.json()

    const fragment = document.createDocumentFragment()
    response.forEach(principle => addPrinciple(principle, fragment))

    principlesList.appendChild(fragment)
})()

addPrinciple = (principle, fragment) => {
    const li = document.createElement('li')
    li.classList.add('principle')
    li.textContent = principle.name
    fragment.appendChild(li)
}