var OG_WIDTH = 810;
var OG_HEIGHT = 900;

function updateTextOverlay(textDiv, text) {
  $(textDiv).text(text);
  $(textDiv).css('font-size', '100px');
  var containerDiv = $(textDiv).closest('.product-preview-text-container');
  var textField = $(textDiv)[0];
  var newFontSize;
  
  // console.log(textDiv);
  // console.log("height = " + $(textDiv).height());

  // console.log("innerHeight = " + $(textDiv).innerHeight());
  // console.log("offsetHeight = " + $(textDiv)[0].offsetHeight);
  // console.log("container offsetHeight = " + containerDiv[0].offsetHeight);

  while ($(textDiv).height() > containerDiv[0].offsetHeight) {
    newFontSize = (parseInt($(textDiv).css('font-size').slice(0, -2)) - 1) + 'px';
    $(textDiv).css('font-size', newFontSize);
  }
}

function initTextPreviewListeners() {
  $('.product-preview-text-container').each(function(index, container) {
    var preview_img = $($(container).siblings('.preview-img')[0]);
	
	// Check if the img is loaded completely, when it's not the height will be 0.
	// If it's 0 then wait until fully loaded
    if (preview_img.height() == 0) {
      $(preview_img).on('load', function() {
        resizeContainers(preview_img, container);
      });
    } else {
      resizeContainers(preview_img, container);
    }
  });
  
  // Resize text on every user input
  $('input.tag-customizer-input').each(function(index, input) {
    $(input).on('input', function() {
      updateTextOverlay("#field-" + $(this).attr("id"), $(this).val());
    });
  });
}

// Given a preview_img on the page, calculate the text container size based on the ratio against the original 810x900 image
function resizeContainers(preview_img, container) {
  // Calculate the text field width/height
  var width_ratio = (preview_img.width() / OG_WIDTH);
  var height_ratio = (preview_img.height() / OG_HEIGHT);
  var new_width = Math.round($(container).attr('width') * width_ratio);
  var new_height = Math.round($(container).attr('height') * height_ratio);
  var new_left = Math.round($(container).attr('left') * width_ratio - new_width/2);
  var new_top = Math.round($(container).attr('top') * height_ratio - new_height/2);

  var text_transform = $(container).attr('text-transform');
  $(container).css('font-family', $(container).attr('font-family'));
  $(container).css('text-transform', $(container).attr('text-transform'));
  $(container).css('color', $(container).attr('color'));
  $(container).css('width', new_width);
  $(container).css('height', new_height);
  $(container).css('line-height', new_height + 'px');
  $(container).css('left', new_left);
  $(container).css('top', new_top);
  $(container).css('text-transform', text_transform);
  
  // TODO: maybe move this to the form submit
  if (text_transform == "uppercase") {
    var input_id = $(container).attr("id").replace("container-", "");
    $("input#" + input_id).css('text-transform', text_transform);
  }
  
  if ($(container).val()) {
    updateTextOverlay(container, $(container).val());
  }
}


// ACCORDION

function expandClick() {
  var accordion_icon = $(this).find(".accordion-icon");
  accordion_icon.toggleClass("fa-angle-down");
  accordion_icon.toggleClass("fa-angle-up");

  var content = this.nextElementSibling;
  content.classList.toggle("closed");
}

function initAccordionListeners() {
  var accordion_headers = $(".accordion-header");
  for (var i = 0; i < accordion_headers.length; i++) {
	accordion_headers[i].addEventListener("click", expandClick, false);  
  }
}

// On form submit do a check:

// TODO: check all fields for unsupported chars
// if there are then show warning and prevent submit
// if not then remove warning

// for blank fields we tried:
// adding empty symbols (did not work because backend will show squares)
// Adding spaces (will not show up still)
// changing the cart code (cannot change checkout code unless we have shopify prem)

// try this method for blank fields:
// add empty symbol, and backend trims all of that exact symbol before outputting

// theme.js > cart.prototype.addItemFromForm 

$(document).ready(function() {
  // console.log("Staging");
  initTextPreviewListeners();
  initAccordionListeners();
});