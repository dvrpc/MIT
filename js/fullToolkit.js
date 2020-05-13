// get a handle on the accordion wrappers
const environment = document.getElementById('environment-accordions')
const communities = document.getElementById('communities-accordions')
const economy = document.getElementById('economy-accordions')
const equity = document.getElementById('equity-accordions')
const transportation = document.getElementById('transportation-accordions')

// get the API response
const getTools = (async () => {
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    }

    const stream = await fetch('https://alpha.dvrpc.org/mitoolbox/section', options)
    const response = await stream.json()

    if(!response.error){
        populateAccordions(response)
    }else{
        // @TODO: error handling
    }
})()

// Iterate over the API response to populate accordions
const populateAccordions = statements => {
    statements.forEach((statement, index) => createAccordions(statement, index))
}

// Consume API response to create each accordion 
const createAccordions = (statement, index) => {
    const category = statement.category.split(' ')[0]
    
    // create the necessary elements
    const accordionFragment = document.createDocumentFragment()
    const accordionControls = document.createElement('ul')
    const accordionLi = document.createElement('li')
    const accordionButton = document.createElement('button')
    const panel = document.createElement('div')
    const contentList = document.createElement('ul')

    // add the aria properties
    accordionControls.setAttribute('aria-label', 'Accordion Control Group Button')
    accordionButton.setAttribute('aria-controls', `content-${index}`)
    accordionButton.setAttribute('aria-expanded', false)
    panel.setAttribute('aria-hidden', true)
    
    // classes and ids
    accordionControls.classList.add('accordion-controls')
    accordionButton.classList.add('accordion')
    accordionButton.classList.add(`${category}-accordion`)
    panel.classList.add('panel')
    contentList.classList.add('accordion-content-list')

    accordionButton.id = `accordion-controls-${index}`
    panel.id = `content-${index}`

    // event handlers
    accordionButton.onclick = () => toggleAccordions(accordionButton)

    // button text content
    accordionButton.textContent = statement.description
    
    // populate the list of tool links
    const listItems = populateContentList(statement.tools)

    // append the things
    contentList.appendChild(listItems)
    panel.appendChild(contentList)
    accordionLi.appendChild(accordionButton)
    accordionLi.appendChild(panel)
    accordionControls.appendChild(accordionLi)
    accordionFragment.appendChild(accordionControls)

    // add the built accordion to the correct category
    switch(statement.category) {
        case 'Environment':
            environment.appendChild(accordionFragment)
            break;
        case 'Livable Communities':
            communities.appendChild(accordionFragment)
            break;
        case 'Economy':
            economy.appendChild(accordionFragment)
            break;
        case 'Equity':
            equity.appendChild(accordionFragment)
            break;
        case 'Transportation':
            transportation.appendChild(accordionFragment)
            break;
        default:
            console.log('the problem statement does not have a valid category')
    }
}

// create the links for each panel <ul>
const populateContentList = tools => {
    
    // first handle cases where there are no associated tools
    if(!tools.length){
        const noToolMsg = document.createElement('p')
        noToolMsg.textContent = 'There are no tools for this problem statement at the moment.'
        return noToolMsg
    }

    const frag = document.createDocumentFragment()

    tools.forEach(tool => {
        const link = document.createElement('a')
        const listItem = document.createElement('li')

        link.href = `/Connections2045/MIT/toolpage.html?tool=${tool._id}`
        link.textContent = tool.name

        listItem.appendChild(link)
        frag.appendChild(listItem)
    })

    return frag
}

// show/hide the accordions on click
const toggleAccordions = accordion => {
    accordion.classList.toggle('active')

    // toggle the aria-expanded attribute of the accordion button
    let ariaExpandedBool = accordion.getAttribute('aria-expanded')
    ariaExpandedBool === 'false' ? ariaExpandedBool = 'true' : ariaExpandedBool = 'false'
    accordion.setAttribute('aria-expanded', ariaExpandedBool)

    // toggle the aria-hidden attribute of the accordion panel
    const panel = accordion.nextElementSibling
    let ariaHiddenBool = panel.getAttribute('aria-hidden')
    ariaHiddenBool === 'false' ? ariaHiddenBool = 'true' : ariaHiddenBool = 'false'
    panel.setAttribute('aria-hidden', ariaHiddenBool)

    // show/hide the panel on click
    if(panel.style.maxHeight){
        panel.style.maxHeight = null
    }else{
        panel.style.maxHeight = panel.scrollHeight + 'px'
    }
}

// handle cases where users are navigating from toolpage category icons
const zoomToSection = () => {
    window.onload = function() {
        let hash = window.location.hash
        // make sure the passed hash follows the right pattern
        if(hash && hash.split('-')[1] === 'accordions'){
            hash = hash.substr(1)
            const el = document.getElementById(hash)
            const section = el.parentElement
            section.scrollTo({
                top: 50,
                behavior: 'auto'
            })
        }
    }
}
window.onload = () => zoomToSection()
