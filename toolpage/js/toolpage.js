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
    
    if(!response.error){
        populateToolMain(response.content, response.img, response.name, response.categories)
        populateToolLinks(response.case_studies, response.ordinances, response.resources)
        
        const tools = response.relatedTools

        // remove the See Also elements if there aren't any related tools
        if(tools.length <= 1){
            const seeAlso = document.getElementById('see-also')
            const seeAlsoHeader = document.getElementById('see-also-header')
            seeAlso.remove()
            seeAlsoHeader.remove()
        // otherwise populate them with related tools
        }else{
            populateSeeAlso(tools)
        }
    }else{
        // @TODO: function for some kind of 'we dont know what happened but this page doesnt exist' situation
    }
})()

/***** Fill out the main content for the tool *****/
const populateToolMain = (content, image, name, categories) => {
    // get a hold of necessary elements
    const header = document.getElementById('toolpage-header')
    const categoryIconsWrapper = document.getElementById('toolpage-header-icons')
    const textWrapper = document.getElementById('toolpage-main-content-wrapper')
    
    // not every toolpage has media
    let img = image.src.length ? document.getElementById('toolpage-img') : false

    // populate the header
    header.textContent = name

    // build and populate category icons
    const categoryFragment = document.createDocumentFragment()
    buildCategoryIcons(categories, categoryFragment)
    categoryIconsWrapper.appendChild(categoryFragment)

    // populate the media figure if applicable, otherwise remove the media wrapper
    if(img){
        const figcaption = document.getElementById('toolpage-media-caption')
        
        img.src = 'https://www.dvrpc.org/Connections2045/img/MIT/' + image.src
        img.alt = name + ' toolpage image'
        
        if(image.caption.length) figcaption.insertAdjacentHTML('afterbegin', image.caption)
        
        // handle maps
        if(image.href) {
            const media = document.getElementById('toolpage-media')
            const imgLink = document.createElement('a')
            imgLink.href = image.href
            imgLink.target = '_blank'
            imgLink.appendChild(img)
            media.insertBefore(imgLink, figcaption)
        }
    }else{
        const media = document.getElementById('toolpage-media')
        const contentWrapper = document.getElementById('toolpage-main-content-wrapper')

        // hide media jawn and bump up the contentWrapper size
        media.style.display = 'none'
        contentWrapper.style.width = '72%'
    }

    // populate the main paragraph
    textWrapper.insertAdjacentHTML('beforeend', content)
}

// lookup table to map categories to img filenames & full toolkit hash 
const catMap = {
    Economy: {
        img: 'econo-icon.png',
        hash: 'economy-accordions'
    },
    'Livable Communities': {
        img: 'comm-icon.png',
        hash: 'communities-accordions'
    },
    Environment: {
        img: 'enviro-icon.png',
        hash: 'environment-accordions'
    },
    Equity: {
        img: 'equity-icon.png',
        hash: 'equity-accordions'
    },
    Transportation: {
        img: 'transpo-icon.png',
        hash: 'transportation-accordions'
    }
}

// function to create tooltips for the category icons
const createTooltip = name => {
    const tooltip = document.createElement('div')
    const text = document.createElement('span')

    tooltip.classList.add('tooltip')
    text.classList.add('tooltip-text')

    text.textContent = name

    tooltip.appendChild(text)

    return tooltip
}

const buildCategoryIcons = (categories, fragment) => {
    categories.forEach(category => {
        const wrapper = document.createElement('a')
        const img = document.createElement('img')
        const src = catMap[category].img

        // link the imgs to the corresponding full toolkit section
        wrapper.href = `/Connections2045/MIT/fullToolkit#${catMap[category].hash}`
        
        img.src = `../img/toolpages/${src}`
        img.alt = `${category} icon`
        
        img.classList.add('icon')
        wrapper.classList.add('icon-wrapper')

        // create tooltips for each category icon
        const tooltip = createTooltip(category)
        img.onmouseover = () => tooltip.style.visibility = 'visible'
        img.onmouseleave = () => tooltip.style.visibility = 'hidden'
        
        wrapper.appendChild(img)
        wrapper.appendChild(tooltip)
        fragment.appendChild(wrapper)
    })
}


/***** Fill out the external links for the tool *****/
const populateToolLinks = (caseStudies, ordinances, resources) => {

    // get a hold of the necessary elements
    const resourceBox = document.getElementById('toolpage-resources')
    const caseStudiesBox = document.getElementById('toolpage-case-studies')
    const modelAndDesignBox = document.getElementById('toolpage-ordinances-and-guidelines')

    // build links for each info box that has them and remove the ones that don't
    const resourceFragment = document.createDocumentFragment()
    resources.length ? buildInfoLink(resources, resourceFragment) : resourceBox.parentElement.parentElement.style.display = 'none'

    const caseStudiesFragment = document.createDocumentFragment()
    caseStudies.length ? buildInfoLink(caseStudies, caseStudiesFragment) : caseStudiesBox.parentElement.parentElement.style.display = 'none'

    const modelAndDesignFragment = document.createDocumentFragment()
    ordinances.length ? buildInfoLink(ordinances, modelAndDesignFragment) : modelAndDesignBox.parentElement.parentElement.style.display = 'none'

    resourceBox.appendChild(resourceFragment)
    caseStudiesBox.appendChild(caseStudiesFragment)
    modelAndDesignBox.appendChild(modelAndDesignFragment)
}

// subject to change depending on what goes in the responses arrays
const buildInfoLink = (links, fragment) => {
    links.forEach(link => {
        const listItem = document.createElement('li')
        const a = document.createElement('a')

        const uri = link.href
        const linkText = link.text
        a.href = uri

        // behavior for external links
        if(uri.indexOf('www.dvrpc.org' === -1)){
            a.target = 'blank'
            a.rel = 'external'
        }

        listItem.classList.add('toolpage-accordion-li')

        a.textContent = linkText

        listItem.appendChild(a)
        fragment.appendChild(listItem)
    })
}

const noLink = type => {
    const noLink = document.createElement('p')
    
    noLink.id = 'no-link'
    noLink.textContent = `This toolpage does not have additional links for ${type}`

    return noLink
}

// accordion stuff
const accordions = document.querySelectorAll('.accordion') 
const length = accordions.length

for(var i = 0; i < length; i++){
    accordions[i].onclick = function(){
        // show/hide the accordions on click
        this.classList.toggle('active')

        // toggle the aria-expanded attribute of the accordion button
        let ariaExpandedBool = this.getAttribute('aria-expanded')
        ariaExpandedBool === 'false' ? ariaExpandedBool = 'true' : ariaExpandedBool = 'false'
        this.setAttribute('aria-expanded', ariaExpandedBool)

        // toggle the aria-hidden attribute of the accordion panel
        const panel = this.nextElementSibling
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
}


/****** Fill out the See Also section ******/
const populateSeeAlso = relatedTools => {
    const frag = document.createDocumentFragment()

    relatedTools.forEach(tool => {
        if(tool._id !== safeID) {
            const link = document.createElement('a')
            
            link.classList.add('see-also-links')

            link.textContent = tool.name
            link.href = "/Connections2045/MIT/toolpage?tool="+tool._id

            frag.appendChild(link)
        }
    })

    const seeAlso = document.getElementById('see-also')
    seeAlso.appendChild(frag)
}
