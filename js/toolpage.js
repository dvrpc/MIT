// pull the tool ID from the query string
const urlQuery = window.location.href.split('tool=')[1]

// regex to eliminate non-alphanumeric characters
const safeID = urlQuery.replace(/[^A-Za-z0-9]/gi, '')

// get the tool info from the API
const getToolInfo = (async () => {
    const headers = new Headers({'Content-Type': 'application/json; charset=utf-8'})
    const options = {
        method: 'GET',
        mode: 'cors',
        headers
    }

    const stream = await fetch(`https://alpha.dvrpc.org/mitoolbox/tool/${safeID}`, options)
    const response = await stream.json()

    // build the page for correct responses
    if(!response.error){
        // update this to work with the response when it comes in
        populateToolMain(response.content, response.img, response.name, response.categories)
        populateToolLinks(response.case_studies, response.cases, response.models, response.ordinance, response.resources)
    }else{
        // @TODO: function for some kind of 'we dont know what happened but this page doesnt exist' situation
    }
})()


/***** fill out the main content for the tool *****/
populateToolMain = (content, image, name, categories) => {
    // get a hold of necessary elements
    const header = document.getElementById('toolpage-header')
    const categoryIconsWrapper = document.getElementById('toolpage-header-icons')
    const textWrapper = document.getElementById('toolpage-text-wrapper')
    const img = document.getElementById('toolpage-img')
    const figcaption = document.getElementById('toolpage-media-caption')

    // populate the header
    header.textContent = name

    // build and populate category icons
    const categoryFragment = document.createDocumentFragment()
    buildCategoryIcons(categories, categoryFragment)
    categoryIconsWrapper.appendChild(categoryFragment)

    // populate the media figure
    img.src = image
    img.alt = 'tbd'
    figcaption.textContent = 'also tbd'

    // build and populate the paragraphs
    const paragraphsFragment = document.createDocumentFragment()
    buildMainText(content, paragraphsFragment)
    textWrapper.appendChild(paragraphsFragment)
}

// lookup table to map categories to img filenames
const catMap = {
    Economy: 'econo-icon.png',
    Community: 'comm-icon.png',
    Environment: 'enviro-icon.png',
    Equity: 'equity-icon.png',
    Transportation: 'transpo-icon.png'
}

buildCategoryIcons = (categories, fragment) => {
    categories.forEach(category => {
        const img = document.createElement('img')
        const src = catMap[category]
        
        img.src = `./img/toolpages/${src}`
        img.classList.add('icon')
        img.alt = `${category} icon`

        fragment.appendChild(img)
    })
}

// subject to change depending on how the response serves the paragraphs
buildMainText = (content, fragment) => {
    content.forEach(paragraph => {
        const p = document.createElement('p')
        p.textContent = paragraph
        fragment.appendChild(p)
    })
}


/***** fill out the external links for the tool *****/
populateToolLinks = (caseStudies, cases, models, ordinances, resources) => {
    const comboModelsAndOrdinances = models.concat(ordinances)

    // get a hold of the necessary elements
    const resourceBox = document.getElementById('toolpage-resources')
    const caseStudiesBox = document.getElementById('toolpage-case-studies')
    const modelAndDesignBox = document.getElementById('toolpage-ordinances-and-guidelines')

    // build links for each info box
    const resourceFragment = document.createDocumentFragment()
    buildInfoLink(resources, fragment)

    const caseStudiesFragment = document.createDocumentFragment()
    buildInfoLink(caseStudies, fragment)

    const modelAndDesignFragment = document.createDocumentFragment()
    buildInfoLink(comboModelsAndOrdinances, fragment)

    resourceBox.appendChild(resourceFragment)
    caseStudiesBox.appendChild(caseStudiesFragment)
    modelAndDesignBox.appendChild(modelAndDesignFragment)
}

// subject to change depending on what goes in the responses arrays
buildInfoLink = (links, fragment) => {
    links.forEach(link => {
        const a = document.createElement('a')
        a.href = link

        // behavior for external links
        if(link.indexOf('www.dvrpc.org' === -1)){
            a.target = 'blank'
            a.rel = 'external'
        }

        a.classList.add('toolpage-links')

        // depends on the response object but hopefully each link has an associated title
        a.textContent = 'tbd here as well'

        fragment.appendChild(a)
    })
}