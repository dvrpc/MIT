// doing all of the HTML manually because there isn't consistency w/the names or layout for the full toolkit table and the tools endpoint
    // so this file is just accordion stuff
const accordions = document.querySelectorAll('.accordion') 

for(var i = 0; i < accordions.length; i++){
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