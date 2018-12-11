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
    const categoryIcons = buildCategoryIcons(categories)
    categoryIcons.forEach(category => categoryIconsWrapper.appendChild(category))

    // populate the media figure
    img.src = image
    img.alt = 'tbd'
    figcaption.textContent = 'also tbd'

    // build and populate the paragraphs
    const paragraphs = buildMainText(content)
    paragraphs.forEach(paragraph => textWrapper.appendChild(paragraph))
}

// lookup table to map categories to img filenames
const catMap = {
    Economy: 'econo-icon.png',
    Community: 'comm-icon.png',
    Environment: 'enviro-icon.png',
    Equity: 'equity-icon.png',
    Transportation: 'transpo-icon.png'
}

buildCategoryIcons = categories => {
    let output = categories.map(category => {
        const img = document.createElement('img')
        const src = catMap[category]
        
        img.src = `./img/toolpages/${src}`
        img.classList.add('icon')
        img.alt = `${category} icon`
    })
    
    return output
}

// subject to change depending on how the response serves the paragraphs
buildMainText = content => {
    let output = content.map(paragraph => {
        const p = document.createElement('p')
        p.textContent = paragraph
    })

    return output
}


/***** fill out the external links for the tool *****/
populateToolLinks = (caseStudies, cases, models, ordinances, resources) => {
    const comboModelsAndOrdinances = models.concat(ordinances)

    // get a hold of the necessary elements
    const resourceBox = document.getElementById('toolpage-resources')
    const caseStudiesBox = document.getElementById('toolpage-case-studies')
    const modelAndDesignBox = document.getElementById('toolpage-ordinances-and-guidelines')

    // build links for each info box
    const resourceLinks = buildInfoLink(resources)
    const caseStudiesLinks = buildInfoLink(caseStudies)
    const modelAndDesignLinks = buildInfoLink(comboModelsAndOrdinances)

    // add em
    resourceLinks.forEach(resource => resourceBox.appendChild(resource))
    caseStudiesLinks.forEach(caseStudy => caseStudiesBox.appendChild(caseStudy))
    modelAndDesignLinks.forEach(jawn => modelAndDesignBox.appendChild(jawn))
}

// subject to change depending on what goes in the responses arrays
buildInfoLink = links => {
    let output = links.map(link => {
        const a = document.createElement('a')
        a.href = link

        // behavior for external links (apparently indexOf is *usually* faster than str.match(regExp))
        if(link.indexOf('www.dvrpc.org' === -1)){
            a.target = 'blank'
            a.rel = 'external'
        }

        a.classList.add('toolpage-links')

        // depends on the response object but hopefully each link has an associated title
        a.textContent = 'tbd here as well'
    })

    return output
}