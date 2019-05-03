"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// get a handle on the accordion wrappers
var environment = document.getElementById('environment-accordions');
var communities = document.getElementById('communities-accordions');
var economy = document.getElementById('economy-accordions');
var equity = document.getElementById('equity-accordions');
var transportation = document.getElementById('transportation-accordions'); // get the API response

var getTools = _asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var options, stream, response;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            }
          };
          _context.next = 3;
          return fetch('https://alpha.dvrpc.org/mitoolbox/section', options);

        case 3:
          stream = _context.sent;
          _context.next = 6;
          return stream.json();

        case 6:
          response = _context.sent;

          if (!response.error) {
            populateAccordions(response);
          } else {// @TODO: error handling
          }

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))(); // Iterate over the API response to populate accordions


var populateAccordions = function populateAccordions(statements) {
  statements.forEach(function (statement, index) {
    return createAccordions(statement, index);
  });
}; // Consume API response to create each accordion 


var createAccordions = function createAccordions(statement, index) {
  // create the necessary elements
  var accordionFragment = document.createDocumentFragment();
  var accordionControls = document.createElement('ul');
  var accordionLi = document.createElement('li');
  var accordionButton = document.createElement('button');
  var panel = document.createElement('div');
  var contentList = document.createElement('ul'); // add the aria properties

  accordionControls.setAttribute('aria-label', 'Accordion Control Group Button');
  accordionButton.setAttribute('aria-controls', "content-".concat(index));
  accordionButton.setAttribute('aria-expanded', false);
  panel.setAttribute('aria-hidden', true); // classes and ids

  accordionControls.classList.add('accordion-controls');
  accordionButton.classList.add('accordion');
  panel.classList.add('panel');
  contentList.classList.add('accordion-content-list');
  accordionButton.id = "accordion-controls-".concat(index);
  panel.id = "content-".concat(index); // event handlers

  accordionButton.onclick = function () {
    return toggleAccordions(accordionButton);
  }; // button text content


  accordionButton.textContent = statement.description; // populate the list of tool links

  var listItems = populateContentList(statement.tools); // append the things

  contentList.appendChild(listItems);
  panel.appendChild(contentList);
  accordionLi.appendChild(accordionButton);
  accordionLi.appendChild(panel);
  accordionControls.appendChild(accordionLi);
  accordionFragment.appendChild(accordionControls); // add the built accordion to the correct category

  switch (statement.category) {
    case 'Environment':
      environment.appendChild(accordionFragment);
      break;

    case 'Livable Communities':
      communities.appendChild(accordionFragment);
      break;

    case 'Economy':
      economy.appendChild(accordionFragment);
      break;

    case 'Equity':
      equity.appendChild(accordionFragment);
      break;

    case 'Transportation':
      transportation.appendChild(accordionFragment);
      break;

    default:
      console.log('the problem statement does not have a valid category');
  }
}; // create the links for each panel <ul>


var populateContentList = function populateContentList(tools) {
  // first handle cases where there are no associated tools
  if (!tools.length) {
    var noToolMsg = document.createElement('p');
    noToolMsg.textContent = 'There are no tools for this problem statement at the moment.';
    return noToolMsg;
  }

  var frag = document.createDocumentFragment();
  tools.forEach(function (tool) {
    var link = document.createElement('a');
    var listItem = document.createElement('li');
    link.href = "/Connections2045/MIT/toolpage.html?tool=".concat(tool._id);
    link.textContent = tool.name;
    listItem.appendChild(link);
    frag.appendChild(listItem);
  });
  return frag;
}; // show/hide the accordions on click


var toggleAccordions = function toggleAccordions(accordion) {
  accordion.classList.toggle('active'); // toggle the aria-expanded attribute of the accordion button

  var ariaExpandedBool = accordion.getAttribute('aria-expanded');
  ariaExpandedBool === 'false' ? ariaExpandedBool = 'true' : ariaExpandedBool = 'false';
  accordion.setAttribute('aria-expanded', ariaExpandedBool); // toggle the aria-hidden attribute of the accordion panel

  var panel = accordion.nextElementSibling;
  var ariaHiddenBool = panel.getAttribute('aria-hidden');
  ariaHiddenBool === 'false' ? ariaHiddenBool = 'true' : ariaHiddenBool = 'false';
  panel.setAttribute('aria-hidden', ariaHiddenBool); // show/hide the panel on click

  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }
}; // handle cases where users are navigating from toolpage category icons


var zoomToSection = function zoomToSection() {
  var hash = window.location.hash;

  if (hash) {
    // make sure the passed hash follows the right pattern
    if (hash.split('-'[1] === 'accordions')) {
      hash = hash.substr(1);
      var el = document.getElementById(hash);
      el.scrollTo({
        top: 10,
        behavior: 'smooth'
      });
    }
  }
};

window.onload = function () {
  return zoomToSection();
};
