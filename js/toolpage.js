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

    console.log('respones is ', response)
    
    if(!response.error){
        populateToolMain(response.content, response.img, response.name, response.categories)
        populateToolLinks(response.case_studies, response.cases, response.models, response.ordinances, response.resources)
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
    
    // not every toolpage has media
    let img = image ? document.getElementById('toolpage-img') : false
    const figcaption = document.getElementById('toolpage-media-caption')

    // populate the header
    header.textContent = name

    // build and populate category icons
    const categoryFragment = document.createDocumentFragment()
    buildCategoryIcons(categories, categoryFragment)
    categoryIconsWrapper.appendChild(categoryFragment)

    // populate the media figure
    if(img){
        img.src = image
        img.alt = name + ' toolpage image'
        figcaption.textContent = name
    }else{
        const media = document.getElementById('toolpage-media')
        media.style.display = 'none'
    }

    // populate the main paragraph
    textWrapper.innerHTML = content
}

// lookup table to map categories to img filenames
const catMap = {
    Economy: 'econo-icon.png',
    'Livable Communities': 'comm-icon.png',
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


/***** fill out the external links for the tool *****/
populateToolLinks = (caseStudies, cases, models, ordinances, resources) => {
    const comboModelsAndOrdinances = models.concat(ordinances)

    // get a hold of the necessary elements
    const resourceBox = document.getElementById('toolpage-resources')
    const caseStudiesBox = document.getElementById('toolpage-case-studies')
    const modelAndDesignBox = document.getElementById('toolpage-ordinances-and-guidelines')

    // build links for each info box that has them, otherwise display a useful "error" message
    const resourceFragment = document.createDocumentFragment()
    resources.length ? buildInfoLink(resources, resourceFragment) : resourceFragment.appendChild(noLink('resources'))

    const caseStudiesFragment = document.createDocumentFragment()
    caseStudies.length ? buildInfoLink(caseStudies, caseStudiesFragment) : caseStudiesFragment.appendChild(noLink('case studies'))

    const modelAndDesignFragment = document.createDocumentFragment()
    comboModelsAndOrdinances.length ? buildInfoLink(comboModelsAndOrdinances, modelAndDesignFragment) : modelAndDesignFragment.appendChild(noLink('model ordinances & design guidelines'))

    resourceBox.appendChild(resourceFragment)
    caseStudiesBox.appendChild(caseStudiesFragment)
    modelAndDesignBox.appendChild(modelAndDesignFragment)
}

// subject to change depending on what goes in the responses arrays
buildInfoLink = (links, fragment) => {
    links.forEach(link => {        
        const a = document.createElement('a')
        const uri = link.href
        const linkText = link.text
        a.href = uri

        // behavior for external links
        if(uri.indexOf('www.dvrpc.org' === -1)){
            a.target = 'blank'
            a.rel = 'external'
        }

        a.classList.add('toolpage-links')

        // depends on the response object but hopefully each link has an associated title
        a.textContent = linkText

        fragment.appendChild(a)
    })
}

noLink = type => {
    const noLink = document.createElement('p')

    noLink.textContent = `This toolpage does not have additional links for ${type}`

    return noLink

}