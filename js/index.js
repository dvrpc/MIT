/* Get a handle on the necessary elements */
let g = document.querySelector('g')
const cloudContainer = document.querySelector('#cloud-container')
const problemStatementsWrapper = document.querySelector('#problem-statements-wrapper')
const defaultStatement = document.querySelector('#default-statement')


/////////////////////////// BEGIN POLYFILLS ///////////////////////////

// SVG children polyfill
const svgChildrenPolyfill = constructor => {
    if (constructor && constructor.prototype && constructor.prototype.children == null) {
        Object.defineProperty(constructor.prototype, 'children', {
            get: function() {
                var i = 0, node, nodes = this.childNodes, children = [];
                while (node = nodes[i++]) {
                    if (node.nodeType === 1) {
                        children.push(node);
                    }
                }
                return children;
            }
        });
    }
}
svgChildrenPolyfill(window.Node || window.Element);

// classList polyfill
if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
      get: function get() {
        var _this = this
  
        return {
          contains: function contains(className) {
            return _this.className.baseVal.split(' ').indexOf(className) !== -1
          },
          add: function add(className) {
            // short out if the class already exists
            if(_this.classList.contains(className)) return

            return _this.setAttribute(
              'class',
              _this.getAttribute('class') + ' ' + className
            )
          },
          remove: function remove(className) {
            if(_this.classList.contains(className)) {
                var reg = new RegExp('(^| )'+className+'($| )','gi')
                var updatedClassList = _this.getAttribute('class').replace(reg, ' ')
                _this.setAttribute('class', updatedClassList)
            }
          },
          toggle: function toggle(className) {
            if (this.contains(className)) {
              this.remove(className)
            } else {
              this.add(className)
            }
          }
        }
      }
    })
  }

// MDN node.remove() polyfill
const removePolyfill = arr => {
arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
    return;
    }
    Object.defineProperty(item, 'remove', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function remove() {
        if (this.parentNode === null) {
        return;
        }
        this.parentNode.removeChild(this);
    }
    });
});
}
removePolyfill([Element.prototype, CharacterData.prototype, DocumentType.prototype])

/////////////////////////// END POLYFILLS ///////////////////////////


// set the height of the container to match that of the word cloud (include mobile breakpoint)
cloudContainer.style.height = window.innerWidth > 800 ? window.innerHeight / 1.2+'px' : window.innerHeight / 0.9+'px'

const toTitleCase = keyword => keyword[0] + keyword.substr(1).toLowerCase()

const muteOtherKeywords = keyword => {
    const length = g.children.length

    for(var i = 0; i < length; i++){
        const child = g.children[i]
        
        if(child != keyword){
            child.classList.add('inactive-word')
        }else{
            // for each subsequent click, make sure to unmute the selected keyword
            child.classList.remove('inactive-word')
        }
    }
}

// fetch a keywords associated problem statements and then add them to the page
const getProblemStatements = async keyword => {
    
    // mute the other keywords
    muteOtherKeywords(keyword)

    // remove default statement (first pass only)
    if(document.body.contains(defaultStatement)){
        defaultStatement.remove()

    // remove existing accordions for each subsequent pass
    }else{
        const accordionWrappers = document.querySelectorAll('.accordion-controls')
        removeStatementAccordion(accordionWrappers)
    }

    // convert to title case first
    keyword = toTitleCase(keyword.textContent)

    // fetch the associated problem statements
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        }
    }

    const stream = await fetch(`https://alpha.dvrpc.org/mitoolbox/word/${keyword}`, options)
    const response = await stream.json()
    
    // build out the accordions
    const statementsFragment = document.createDocumentFragment()
    const statements = response.pstatements

    makeStatementAccordion(statements, statementsFragment)
    problemStatementsWrapper.appendChild(statementsFragment)

    // add click handler to the newly created accordions
    const accordions = document.querySelectorAll('.problem-statement-btn')
    addAccordionFunctionality(accordions)
}

// create each problem statement tag
const makeStatementAccordion = (statements, fragment) => {

    // build accordions for each problem statement
    statements.forEach((statement, index) => {

        // create the elements needed for the accordion
        const accordionControls = document.createElement('ul')
        const listItem = document.createElement('li')
        const accordionButton = document.createElement('button')
        const accordionDiv = document.createElement('div')

        accordionControls.setAttribute('aria-label', 'Accordion Control Group Button')
        accordionControls.classList.add('accordion-controls')
        
        accordionButton.setAttribute('aria-controls', `content-${index}`)
        accordionButton.setAttribute('aria-expanded', 'false')
        accordionButton.id=`accordion-controls-${index}`
        accordionButton.classList.add('problem-statement-btn')
        accordionButton.textContent = '"'+statement.description+'"'
        
        accordionDiv.setAttribute('aria-hidden', 'true')
        accordionDiv.id=`content-${index}`
        accordionDiv.classList.add('panel')

        // iterate over each tool and create a tool
        const toolsFragment = document.createDocumentFragment()
        makeTools(statement.tools, toolsFragment)
        
        // add everything to the DOM
        accordionDiv.appendChild(toolsFragment)
        listItem.appendChild(accordionButton)
        listItem.appendChild(accordionDiv)
        accordionControls.appendChild(listItem)
        fragment.appendChild(accordionControls)
    })
}

const makeTools = (tools, fragment) => {
    tools.forEach(tool => {
        const toolLink = document.createElement('a')
        
        toolLink.classList.add('tools')
        // add the tool ID into the URL so that the toolpage can hydrate the jawn
        toolLink.href="/Connections2045/MIT/toolpage.html?tool="+tool._id
        toolLink.textContent = tool.name
        toolLink.target = '_blank'

        fragment.appendChild(toolLink)
    })
}

const removeStatementAccordion = accordionWrappers => accordionWrappers.forEach(accordionWrapper => accordionWrapper.remove())

// add the interactive jawns
const addAccordionFunctionality = accordions => {
    const length = accordions.length

    for(var i = 0; i < length; i++){

        accordions[i].onclick = function() {

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
}

// generate problem statements from the clicked wordcloud keywords (wait until the word cloud draws to assign handler)
let timeoutIDs = []

const assignCloudClickHandler = drawn => {
    if(drawn) {
        if(!g) g = document.querySelector('g')
        g.onclick = e => getProblemStatements(e.target)
        
        // clear all of the timeouts if necessary
        if(timeoutIDs.length) timeoutIDs.forEach(id => clearTimeout(id))

        // remove drawn from local storage
        localStorage.removeItem('drawn')
    } else{
        drawn = localStorage.getItem('drawn')
        timeoutIDs.push(window.setTimeout(assignCloudClickHandler, 100, drawn))
    }
}

// get the status of the wordcloud drawing from localStorage
let drawn = localStorage.getItem('drawn')
assignCloudClickHandler(drawn)