"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* Get a handle on the necessary elements */
var g = document.querySelector('g');
var cloudContainer = document.querySelector('#cloud-container');
var problemStatementsWrapper = document.querySelector('#problem-statements-wrapper');
var defaultStatement = document.querySelector('#default-statement'); // set the height of the container to match that of the word cloud (include mobile breakpoint)

cloudContainer.style.height = window.innerWidth > 800 ? window.innerHeight / 1.2 + 'px' : window.innerHeight / 0.9 + 'px'; // generate problem statements from the clicked wordcloud keywords

g.onclick = function (e) {
  return getProblemStatements(e.target);
};

var toTitleCase = function toTitleCase(keyword) {
  return keyword[0] + keyword.substr(1).toLowerCase();
};

var muteOtherKeywords = function muteOtherKeywords(keyword) {
  var length = g.children.length;

  for (var i = 0; i < length; i++) {
    var child = g.children[i];

    if (child != keyword) {
      child.classList.add('inactive-word');
    } else {
      // for each subsequent click, make sure to unmute the selected keyword
      child.classList.remove('inactive-word');
    }
  }
}; // fetch a keywords associated problem statements and then add them to the page


var getProblemStatements =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(keyword) {
    var accordionWrappers, options, stream, response, statementsFragment, statements, accordions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // mute the other keywords
            muteOtherKeywords(keyword); // remove default statement (first pass only)

            if (document.body.contains(defaultStatement)) {
              defaultStatement.remove(); // remove existing accordions for each subsequent pass
            } else {
              accordionWrappers = document.querySelectorAll('.accordion-controls');
              removeStatementAccordion(accordionWrappers);
            } // convert to title case first


            keyword = toTitleCase(keyword.textContent); // fetch the associated problem statements

            options = {
              method: 'GET',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            };
            _context.next = 6;
            return fetch("https://alpha.dvrpc.org/mitoolbox/word/".concat(keyword), options);

          case 6:
            stream = _context.sent;
            _context.next = 9;
            return stream.json();

          case 9:
            response = _context.sent;
            // build out the accordions
            statementsFragment = document.createDocumentFragment();
            statements = response.pstatements;
            makeStatementAccordion(statements, statementsFragment);
            problemStatementsWrapper.appendChild(statementsFragment); // add click handler to the newly created accordions

            accordions = document.querySelectorAll('.problem-statement-btn');
            addAccordionFunctionality(accordions);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getProblemStatements(_x) {
    return _ref.apply(this, arguments);
  };
}(); // create each problem statement tag


var makeStatementAccordion = function makeStatementAccordion(statements, fragment) {
  // build accordions for each problem statement
  statements.forEach(function (statement, index) {
    // create the elements needed for the accordion
    var accordionControls = document.createElement('ul');
    var listItem = document.createElement('li');
    var accordionButton = document.createElement('button');
    var accordionDiv = document.createElement('div');
    accordionControls.setAttribute('aria-label', 'Accordion Control Group Button');
    accordionControls.classList.add('accordion-controls');
    accordionButton.setAttribute('aria-controls', "content-".concat(index));
    accordionButton.setAttribute('aria-expanded', 'false');
    accordionButton.id = "accordion-controls-".concat(index);
    accordionButton.classList.add('problem-statement-btn');
    accordionButton.textContent = '"' + statement.description + '"';
    accordionDiv.setAttribute('aria-hidden', 'true');
    accordionDiv.id = "content-".concat(index);
    accordionDiv.classList.add('panel'); // iterate over each tool and create a tool

    var toolsFragment = document.createDocumentFragment();
    makeTools(statement.tools, toolsFragment); // add everything to the DOM

    accordionDiv.appendChild(toolsFragment);
    listItem.appendChild(accordionButton);
    listItem.appendChild(accordionDiv);
    accordionControls.appendChild(listItem);
    fragment.appendChild(accordionControls);
  });
};

var makeTools = function makeTools(tools, fragment) {
  tools.forEach(function (tool) {
    var toolLink = document.createElement('a');
    var name = toTitleCase(tool.name);
    toolLink.classList.add('tools'); // add the tool ID into the URL so that the toolpage can hydrate the jawn

    toolLink.href = "/Connections2045/MIT/toolpage.html?tool=" + tool._id;
    toolLink.textContent = name;
    toolLink.target = '_blank';
    fragment.appendChild(toolLink);
  });
};

removeStatementAccordion = function removeStatementAccordion(accordionWrappers) {
  return accordionWrappers.forEach(function (accordionWrapper) {
    return accordionWrapper.remove();
  });
}; // add the interactive jawns


var addAccordionFunctionality = function addAccordionFunctionality(accordions) {
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
};
