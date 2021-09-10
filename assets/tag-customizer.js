var OG_WIDTH = 810;
var OG_HEIGHT = 900;
var DEBUG_MODE = false;
var text_preview_event_tracked = false;

function updateTextOverlay(textDiv, text) {
  $(textDiv).text(text);
  $(textDiv).css('font-size', '100px');
  var containerDiv = $(textDiv).closest('.product-preview-text-container');
  var textField = $(textDiv)[0];
  var newFontSize;
  
  if (DEBUG_MODE) {
    console.log("updateTextOverlay: " + textDiv + " " + text);
    console.log("height = " + $(textDiv).height());
    console.log("innerHeight = " + $(textDiv).innerHeight());
    console.log("offsetHeight = " + $(textDiv)[0].offsetHeight);
    console.log("container offsetHeight = " + containerDiv[0].offsetHeight);
  }

  while ($(textDiv).height() > containerDiv[0].offsetHeight) {
    newFontSize = (parseInt($(textDiv).css('font-size').slice(0, -2)) - 1) + 'px';
    $(textDiv).css('font-size', newFontSize);
  }
}

function resizeAllContainers() {
  $('.product-preview-text-container').each(function(index, container) {
    var preview_img = $($(container).siblings('.preview-img')[0]);
    if (DEBUG_MODE) {
      console.log(preview_img);
    }
    // Check if the img is loaded completely, when it's not the height will be 0.
    // If it's 0 then wait until fully loaded
    if (preview_img.height() == 0) {
      $(preview_img).on('load', function() {
        resizeContainer(preview_img, container);
      });
    } else {
      resizeContainer(preview_img, container);
    }
  });
}

function initTextPreviewListeners() {
  // Resize text on every user input
  $('input.tag-customizer-input').each(function(index, input) {
    $(input).on('input', function() {
      updateTextOverlay("#field-" + $(this).attr("id"), $(this).val());
      if (!text_preview_event_tracked) {
        var text_type = $('.product-single__title').text();
        ga('send', {
          hitType: 'event',
          eventCategory: 'TextPreviewInput',
          eventAction: 'input',
          eventLabel: text_type
        });
        text_preview_event_tracked = true;
      }
    });
  });
}

// Given a preview_img on the page, calculate the text container size based on the ratio against the original 810x900 image
function resizeContainer(preview_img, text_container) {
  // Calculate the text field width/height
  var width_ratio = (preview_img.width() / OG_WIDTH);
  var height_ratio = (preview_img.height() / OG_HEIGHT);
  var new_width = Math.round($(text_container).attr('width') * width_ratio);
  var new_height = Math.round($(text_container).attr('height') * height_ratio);
  var new_left = Math.round($(text_container).attr('left') * width_ratio - new_width/2);
  var new_top = Math.round($(text_container).attr('top') * height_ratio - new_height/2);
  var input_id =  $(text_container).attr("id").replace("container-", "");

  if (DEBUG_MODE) {
    console.log("heights:");
    console.log(preview_img.height());
    console.log(height_ratio);
    console.log(new_height);
  }

  var text_transform = $(text_container).attr('text-transform');
  $(text_container).css('font-family', $(text_container).attr('font-family'));
  $(text_container).css('text-transform', $(text_container).attr('text-transform'));
  $(text_container).css('color', $(text_container).attr('color'));
  $(text_container).css('width', new_width);
  $(text_container).css('height', new_height);
  $(text_container).css('line-height', new_height + 'px');
  $(text_container).css('left', new_left);
  $(text_container).css('top', new_top);
  $(text_container).css('text-transform', text_transform);
  
  // TODO: maybe move this to the form submit
  if (text_transform == "uppercase") {
    var input_id = $(text_container).attr("id").replace("container-", "");
    $("input#" + input_id).css('text-transform', text_transform);
  }
  
  if ($("input#" + input_id).val()) {
    // console.log("input_id = " + input_id);
    updateTextOverlay("#field-" + input_id, $("input#" + input_id).val());
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

$(document).ready(function() {
  resizeAllContainers();
  initTextPreviewListeners();
  initAccordionListeners();
  $(window).resize(function(e) {
    resizeAllContainers();
  });
});