"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// pull the tool ID from the query string
var urlQuery = window.location.href.split('tool=')[1]; // regex to eliminate non-alphanumeric characters

var safeID = urlQuery.replace(/[^A-Za-z0-9]/gi, ''); // get the tool info from the API

var getToolInfo = _asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var headers, options, stream, response;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
          });
          options = {
            method: 'GET',
            mode: 'cors',
            headers: headers
          };
          _context.next = 4;
          return fetch("https://alpha.dvrpc.org/mitoolbox/tool/".concat(safeID), options);

        case 4:
          stream = _context.sent;
          _context.next = 7;
          return stream.json();

        case 7:
          response = _context.sent;

          if (!response.error) {
            populateToolMain(response.content, response.img, response.name, response.categories);
            populateToolLinks(response.case_studies, response.ordinances, response.resources);
          } else {// @TODO: function for some kind of 'we dont know what happened but this page doesnt exist' situation
          }

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))(); // get related tools from the API


var getAdditionalToools = _asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee2() {
  var headers, options, stream, response, tools, seeAlso, seeAlsoHeader;
  return regeneratorRuntime.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          headers = new Headers({
            'Content-Type': 'application/json; charset=utf-8'
          });
          options = {
            method: 'GET',
            mode: 'cors',
            headers: headers
          };
          _context2.next = 4;
          return fetch("https://alpha.dvrpc.org/mitoolbox/section/tool/".concat(safeID), options);

        case 4:
          stream = _context2.sent;
          _context2.next = 7;
          return stream.json();

        case 7:
          response = _context2.sent;

          if (!response.error) {
            tools = response.tools; // remove the See Also elements if there aren't any related tools

            if (tools.length === 1) {
              seeAlso = document.getElementById('see-also');
              seeAlsoHeader = document.getElementById('see-also-header');
              seeAlso.remove();
              seeAlsoHeader.remove(); // otherwise populate them with related tools
            } else {
              populateSeeAlso(tools);
            }
          } else {// @TODO: function for some kind of 'we dont know what happened but this page doesnt exist' situation
          }

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
}))();
/***** Fill out the main content for the tool *****/


populateToolMain = function populateToolMain(content, image, name, categories) {
  // get a hold of necessary elements
  var header = document.getElementById('toolpage-header');
  var categoryIconsWrapper = document.getElementById('toolpage-header-icons');
  var textWrapper = document.getElementById('toolpage-main-content-wrapper'); // not every toolpage has media

  var img = image ? document.getElementById('toolpage-img') : false;
  var figcaption = document.getElementById('toolpage-media-caption'); // populate the header

  header.textContent = name; // build and populate category icons

  var categoryFragment = document.createDocumentFragment();
  buildCategoryIcons(categories, categoryFragment);
  categoryIconsWrapper.appendChild(categoryFragment); // populate the media figure if applicable, otherwise remove the media wrapper

  if (img) {
    img.src = image;
    img.alt = name + ' toolpage image';
    figcaption.textContent = name;
  } else {
    var media = document.getElementById('toolpage-media');
    media.style.display = 'none';
  } // populate the main paragraph


  textWrapper.insertAdjacentHTML('beforeend', content);
}; // lookup table to map categories to img filenames & full toolkit hash 


var catMap = {
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
  } // function to create tooltips for the category icons

};

var createTooltip = function createTooltip(name) {
  var tooltip = document.createElement('div');
  var text = document.createElement('span');
  tooltip.classList.add('tooltip');
  text.classList.add('tooltip-text');
  text.textContent = name;
  tooltip.appendChild(text);
  return tooltip;
};

buildCategoryIcons = function buildCategoryIcons(categories, fragment) {
  categories.forEach(function (category) {
    var wrapper = document.createElement('a');
    var img = document.createElement('img');
    var src = catMap[category].img; // link the imgs to the corresponding full toolkit section

    wrapper.href = "/Connections2045/MIT/fullToolkit.html#".concat(catMap[category].hash);
    img.src = "./img/toolpages/".concat(src);
    img.alt = "".concat(category, " icon");
    img.classList.add('icon');
    wrapper.classList.add('icon-wrapper'); // create tooltips for each category icon

    var tooltip = createTooltip(category);

    img.onmouseover = function () {
      return tooltip.style.visibility = 'visible';
    };

    img.onmouseleave = function () {
      return tooltip.style.visibility = 'hidden';
    };

    wrapper.appendChild(img);
    wrapper.appendChild(tooltip);
    fragment.appendChild(wrapper);
  });
};
/***** Fill out the external links for the tool *****/


populateToolLinks = function populateToolLinks(caseStudies, ordinances, resources) {
  // get a hold of the necessary elements
  var resourceBox = document.getElementById('toolpage-resources');
  var caseStudiesBox = document.getElementById('toolpage-case-studies');
  var modelAndDesignBox = document.getElementById('toolpage-ordinances-and-guidelines'); // build links for each info box that has them, otherwise display a useful "error" message

  var resourceFragment = document.createDocumentFragment();
  resources.length ? buildInfoLink(resources, resourceFragment) : resourceFragment.appendChild(noLink('resources'));
  var caseStudiesFragment = document.createDocumentFragment();
  caseStudies.length ? buildInfoLink(caseStudies, caseStudiesFragment) : caseStudiesFragment.appendChild(noLink('case studies'));
  var modelAndDesignFragment = document.createDocumentFragment();
  ordinances.length ? buildInfoLink(ordinances, modelAndDesignFragment) : modelAndDesignFragment.appendChild(noLink('model ordinances & design guidelines'));
  resourceBox.appendChild(resourceFragment);
  caseStudiesBox.appendChild(caseStudiesFragment);
  modelAndDesignBox.appendChild(modelAndDesignFragment);
}; // subject to change depending on what goes in the responses arrays


buildInfoLink = function buildInfoLink(links, fragment) {
  links.forEach(function (link) {
    var listItem = document.createElement('li');
    var a = document.createElement('a');
    var uri = link.href;
    var linkText = link.text;
    a.href = uri; // behavior for external links

    if (uri.indexOf('www.dvrpc.org' === -1)) {
      a.target = 'blank';
      a.rel = 'external';
    }

    listItem.classList.add('toolpage-accordion-li');
    a.textContent = linkText;
    listItem.appendChild(a);
    fragment.appendChild(listItem);
  });
};

noLink = function noLink(type) {
  var noLink = document.createElement('p');
  noLink.id = 'no-link';
  noLink.textContent = "This toolpage does not have additional links for ".concat(type);
  return noLink;
}; // accordion stuff


var accordions = document.querySelectorAll('.accordion');
var length = accordions.length;

for (var i = 0; i < length; i++) {
  accordions[i].onclick = function () {
    // show/hide the accordions on click
    this.classList.toggle('active'); // toggle the aria-expanded attribute of the accordion button

    var ariaExpandedBool = this.getAttribute('aria-expanded');
    ariaExpandedBool === 'false' ? ariaExpandedBool = 'true' : ariaExpandedBool = 'false';
    this.setAttribute('aria-expanded', ariaExpandedBool); // toggle the aria-hidden attribute of the accordion panel

    var panel = this.nextElementSibling;
    var ariaHiddenBool = panel.getAttribute('aria-hidden');
    ariaHiddenBool === 'false' ? ariaHiddenBool = 'true' : ariaHiddenBool = 'false';
    panel.setAttribute('aria-hidden', ariaHiddenBool); // show/hide the panel on click

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  };
}
/****** Fill out the See Also section ******/


var populateSeeAlso = function populateSeeAlso(relatedTools) {
  var frag = document.createDocumentFragment();
  relatedTools.forEach(function (tool) {
    if (tool._id !== safeID) {
      var link = document.createElement('a');
      link.classList.add('see-also-links');
      link.textContent = tool.name;
      link.href = "/Connections2045/MIT/toolpage.html?tool=" + tool._id;
      frag.appendChild(link);
    }
  });
  var seeAlso = document.getElementById('see-also');
  seeAlso.appendChild(frag);
};
