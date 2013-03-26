var SEARCH_BOX_DEF_VAL = 'What would you like to learn?';
function clearSearchBox(e) {
    if (e && e.value == SEARCH_BOX_DEF_VAL)
        e.value = '';
}

function validateSearchBox(e) {
    if (e && (e.val() == SEARCH_BOX_DEF_VAL || e.val() == '')) {
        //e.focus();
		return false;    
    }
    return true;
}

//you can remove this one if/after Modernizr gets implemented
function testElementAttributeSupport(elem, attr) {
	var testElement = document.createElement(elem);

	return !!(attr in testElement);
}

var simpleEval = function(json) { return ("string" === typeof json) ? (json.length > 2 ? eval(json.charAt(0) != '(' ? '(' + json + ')' : json) : null) : json; };
var login=function(u,p,IsModal,RememberMe)
{
	var success=false;
	var loginUrl=location.protocol=="https:"
		?(lynda.baseUrl.replace("http","https")+"ajax/secureLogin.aspx")
		:(lynda.baseUrl+"ajax/login.aspx")
		;
	jQuery.ajax({ async: false,url: loginUrl,type: 'POST',data: { username: u,password: p,remember: RememberMe },dataType: 'string',traditional: true,
		success: function(data)
		{
			var d=simpleEval(data);
			success=d&&d.success;
			state=d&&d.state;
			loginResults(d);
		},
		error: function(data) { jQuery('#login-error').show(); }
	});
	return success;
};
function modalLogin(eu,ep,er) { login(jQuery('#'+eu).val(),jQuery('#'+ep).val(),true,jQuery('#'+er).is(':checked')); };
function pageLogin(eu,ep) { login(jQuery('#'+eu).val(),jQuery('#'+ep).val(),false,false); };
function pageLoginFull(eu,ep,er) { login(jQuery('#'+eu).val(),jQuery('#'+ep).val(),false,jQuery('#'+er).is(':checked')); };
var iframeIntervalValue = null;
function processLoginPopup() {
    jQuery.fancybox.showActivity();
    jQuery("#fancybox-frame").attr("src", parseSecureUrl(jQuery("a#login-modal").attr("href"))).load(function () {
            // Bind the resize event. When the iframe's size changes, update its height as
            // well as the corresponding info div.
            jQuery.fancybox.hideActivity();
            var originalHeight = jQuery("#fancybox-frame").height();
            var originalWidth = jQuery("#fancybox-frame").width();
            var originalBodyHeight = jQuery("#fancybox-frame").contents().find('body').height();
            var originalBodyWidth = jQuery("#fancybox-frame").contents().find('body').width();
            if (jQuery(this).contents().find("#lcleIPLogIn").css("display") == "block") {
                jQuery('#fancybox-inner').width(jQuery(this).contents().find("#lcleIPLogIn").width());
                jQuery('#fancybox-wrap, #fancybox-frame').width(jQuery('#fancybox-inner').width() + 15);
                jQuery('#fancybox-wrap').css("margin-left", jQuery('#fancybox-inner').width() / 2);
                originalHeight += 100;
            }
            jQuery('#fancybox-inner').height(originalHeight);
            jQuery('#fancybox-wrap').height(originalHeight);
            iframeIntervalValue = setInterval(function () {
                var currentBodyheight = jQuery("#fancybox-frame").contents().find('body').height();
                if (currentBodyheight != originalBodyHeight) {
                    //originalHeight = jQuery("#fancybox-frame").contents().find('body').height();
                    jQuery('#fancybox-inner').height(originalHeight + currentBodyheight - originalBodyHeight);
                    jQuery('#fancybox-wrap').height(originalHeight + currentBodyheight - originalBodyHeight);
                }
            }, 100);
        if (typeof (lynda.isIMobileDevice) != 'undefined' && lynda.isIMobileDevice) jQuery("#fancybox-overlay").css({ width: document.body.scrollWidth + 'px', height: document.body.scrollHeight + 'px' });
        jQuery(".frm-username").focus();
    });
};

function loginResults(data)
{
	if(data&&data.state=="conflicted")
	{
		// recreate the login modal to hide the close button (for conflicted modal)
		var loginModal = jQuery("a#login-modal");
		loginModal.fancybox({
			'hideOnOverlayClick': false,
			'type': 'iframe',
			'scrolling': 'no',
			'hideOnContentClick': false,
			'autoDimensions': false,
			'height': 265,
			'width': 420,
			'padding': 0, /* NOTE -- set this in our css */
			'titleShow': true,
			'title': '',
			'overlayOpacity': 0.5,
			'titlePosition': 'outside',
			'onStart': function () { this.href = ""; },
			'onComplete': function () {
			    jQuery("#fancybox-frame").attr("src", parseSecureUrl(jQuery("a#login-modal").attr("href")));
			    if (typeof (lynda.isIMobileDevice) != 'undefined' && lynda.isIMobileDevice) jQuery("#fancybox-overlay").css({ width: document.body.scrollWidth + 'px', height: document.body.scrollHeight + 'px' });
			    jQuery(".frm-username").focus();
			},
			'onClosed': function () {
			    clearInterval(iframeIntervalValue);
			},
			'showCloseButton': false
		});

		var a=jQuery("a#login-modal");
		if(a.length>0)
		{
			a.click();
			return;
		}
	}
	if(data&&data.success)
	{
		var url=data.redirect;

		var s=jQuery("#stayPut"),f=jQuery("#fromUrl");
		if(s&&s.length>0&&f&&f.length>0&&s.val().toLowerCase()=='true')
			url=f.val();
		
		document.location.href=url;
	}
	else
	{
		jQuery('#login-error').show();
	}
}


function resizeLoginModal(height)
{
	var e=jQuery("#fancybox-wrap");
	var i=jQuery("#fancybox-inner");
	var b=e.height()-i.height();
	i.height(height);
	e.height(height+b);
	
	jQuery.fancybox.center();
}

function getCookiesEnabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false
    //if not IE4+ nor NS6+
    if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
        document.cookie = "testcookie"
        cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
    }
    return cookieEnabled;
}

jQuery(document).ready(function () {
	// Login
	var loginModal = jQuery("a#login-modal");
	if (loginModal.length > 0)
		loginModal.attr("href", parseSecureUrl(loginModal.attr("href")));
	if (loginModal && loginModal.fancybox)
	// for Login Conflict Modal, hide the X button		
		if (isLoginConflited == 'True')
			loginModal.fancybox({
				'hideOnOverlayClick': false,
				'type': 'iframe',
				'scrolling': 'no',
				'hideOnContentClick': false,
				'autoDimensions': false,
				'height': 265,
				'width': 420,
				'padding': 0, /* NOTE -- set this in our css */
				'titleShow': true,
				'title': '',
				'overlayOpacity': 0.5,
				'titlePosition': 'outside',
				'onStart': function () { this.href = ""; },
				'onComplete': function () {
					jQuery("#fancybox-frame").attr("src", parseSecureUrl(jQuery("a#login-modal").attr("href")));
					if (typeof (lynda.isIMobileDevice) != 'undefined' && lynda.isIMobileDevice) jQuery("#fancybox-overlay").css({ width: document.body.scrollWidth + 'px', height: document.body.scrollHeight + 'px' });
					jQuery(".frm-username").focus();
	            },
	            'onClosed': function () {
	                clearInterval(iframeIntervalValue);
	            },
				'showCloseButton': false
			});
		else
			loginModal.fancybox({
				'hideOnOverlayClick': false,
				'type': 'iframe',
				'scrolling': 'no',
				'hideOnContentClick': false,
				'autoDimensions': false,
				'height': 344,
				'width': 814,
				'padding': 0, /* NOTE -- set this in our css */
				'titleShow': true,
				'title': '',
				'overlayOpacity': 0.5,
				'titlePosition': 'outside',
				'onStart': function () { this.href = ""; },
				'onComplete': function () {
			        processLoginPopup();
			    },
			    'onClosed': function () {
			        clearInterval(iframeIntervalValue);
			        jQuery('#fancybox-wrap').css("margin-left", 'auto');
			    }
			});

	//accept terms modal
	var tcModal = jQuery("a#tos2");
	if (tcModal && tcModal.fancybox) {
		tcModal.fancybox({
			'titlePosition': 'inside',
			'modal': 'true',
			'transitionIn': 'none',
			'transitionOut': 'none',
			'scrolling': 'no'
		});
		if (lynda.isIMobileDevice && jQuery('#wrapper2').html() != null)
			setTermsTouchScroll('#wrapper2');
	}
	// textarea maxlength
	jQuery('textarea[maxlength]').live('keyup blur', function () {
		var maxlength = jQuery(this).attr('maxlength');
		var content = jQuery(this).val();

		if (content.length > maxlength) {
			jQuery(this).val(content.slice(0, maxlength));
		}
	});
	//feedback modal
	var feedbackModal = jQuery("a#feedback-modal");
	if (feedbackModal && feedbackModal.fancybox)
		feedbackModal.fancybox({
			'type': 'ajax',
			'hideOnContentClick': false,
			'autoDimensions': false,
			'height': 'auto',
			'width': 405,
			'padding': 0, /* NOTE -- set this in our css */
			'titleShow': true,
			'title': '',
			'overlayOpacity': 0.5,
			'titlePosition': 'inside',
			'disableNavButtons': false,
			'onComplete': function () {
				if (typeof (lynda.isIMobileDevice) != 'undefined' && lynda.isIMobileDevice)
					jQuery("#fancybox-overlay").css({ width: document.body.scrollWidth + 'px', height: document.body.scrollHeight + 'px' });
				jQuery(".frm-name").focus();
			},
			'onClosed': function () {
				jQuery("div#fancybox-outer").removeAttr('style');
			}
		});
	jQuery('#section-sitefeedback')
		.css({ 'right': (jQuery('#eyebrow').offset().left), 'opacity': '0.6' })
		.mouseenter(function () { jQuery(this).fadeTo("fast", 1.0); })
		.mouseleave(function () { jQuery(this).fadeTo("fast", 0.60); });
	jQuery(window).resize(function () {
		jQuery('#section-sitefeedback')
			.hide()
			.css({ 'right': '0'})
			.attr({ 'bottom': '0' })
			.show()
			;
	});

	//player feedback modal 
	var playerFeedbackModal=jQuery("#playerfeedback-modal");
	if(playerFeedbackModal && playerFeedbackModal.fancybox)
		playerFeedbackModal.fancybox({
			'type': 'ajax',
			'hideOnContentClick': false,
			'autoDimensions': false,
			'height': 'auto',
			'width': 405,
			'padding': 0, /* NOTE -- set this in our css */
			'titleShow': true,
			'title': '',
			'overlayOpacity': 0.5,
			'titlePosition': 'inside',
			'disableNavButtons': false,
			'onComplete': function ()
			{
				if(typeof (lynda.isIMobileDevice)!='undefined'&&lynda.isIMobileDevice)
					jQuery("#fancybox-overlay").css({ width: document.body.scrollWidth+'px',height: document.body.scrollHeight+'px' });
				jQuery(".frm-name").focus();
			},
			'onClosed': function ()	{
				jQuery("div#fancybox-outer").removeAttr('style'); 
			} 
		});
		jQuery('#section-playerfeedback')
		   .css({ 'right': (jQuery('#eyebrow').offset().left),'opacity': '0.6' })
		   .mouseenter(function () { jQuery(this).fadeTo("fast",1.0); })
		   .mouseleave(function () { jQuery(this).fadeTo("fast",0.60); });
		jQuery(window).resize(function () {
			jQuery('#section-playerfeedback')
			     .hide()
				 .css({ 'right': (jQuery('#eyebrow').offset().left) })
				 .show()
				 ;
		});

	 //header administration menu click
	var selector = "div#eyebrow ul.nav li.with-sub-menu:last a:first:contains('administration')";
	var url = "div#eyebrow ul.nav li.with-sub-menu:last ul.sub-menu:first li.multirole:first a";
	jQuery(selector).attr("href", jQuery(url).attr("href"));
	// Footer tooltip
	jQuery(".view-more > a").click(function (e) {
		e.preventDefault();
		var sibs = jQuery(e.target).siblings();
		sibs.toggle();
		//sibs.find('img.close-btn').unbind('click').click(function () { sibs.hide(); });
		return false;

	});
	jQuery('.view-more img.close-btn').click(function (e) {
		jQuery(e.target).parents('.view-more').find('div:first').hide();
	});

	jQuery('ul.nav > li.with-sub-menu .sub').css({ opacity: 0 }).hide();

	jQuery("li.with-sub-menu").each(function (index, el) {
		jQuery(this).mouseenter(function () {
			var e = jQuery(this);
			e.find("div.sub").stop().fadeTo('fast', 1);
		});
		jQuery(this).mouseleave(function () {
			jQuery(this).find(".sub").hide();
		});
	});
	//Promo banner
	if (jQuery("#topart")) {
		jQuery("#topart").mouseenter(function () {
			jQuery("#topart").clearQueue();
			jQuery("#topart").delay(750).animate({ "height": "300px" }, "fast", function () { jQuery('div.ac_results').hide(); });
		});
		jQuery("#topart").mouseleave(function () {
			jQuery("#topart").clearQueue();
			jQuery("#topart").animate({ "height": "40px" }, "fast");
		});
		jQuery("#topart").click(function () {
			if (jQuery("#topart").css('height') == "300px") {
				jQuery("#topart").animate({ "height": "40px" }, "fast");
			} else {
				jQuery("#topart").animate({ "height": "300px" }, "fast", function () { jQuery('div.ac_results').hide(); });
			}
		});
	}
	//sidebar curves
	if (jQuery(".monopod")) {
		jQuery('div.monopod').first().addClass('monotop');
		//jQuery('<div class="monotop">&nbsp;</div>').insertBefore(jQuery('div.monopod').first());
		jQuery('<div class="monobottom">&nbsp;</div>').insertAfter(jQuery('div.monopod').last());
		//jQuery('div.monopod').last().addClass('monobottom');
	}

    //this is used for redirecting the user to login page or to the lyndaKiosk error page
    //when trying to access a method that requires authentication or a lyndaKiosk 
    //has a timeout and no licenses available
    jQuery("body").ajaxError(
            function (e, request, settings) {
                if (request.status == 403) {
                    //alert(settings.url+'\r\n'+request.responseText);
                    if (request.responseText !== undefined &&
                        request.responseText == "timeoutExceededIPConnectionLimit") {
                        document.location.href = lynda.baseUrl + "IP-Login/Error?timeoutExceededIPConnectionLimit=true";
                    } else {
                        document.location.href = lynda.baseUrl + "login/login.aspx";
                    }
                }
            }
     );

	//searchbox placeholder alternative for non-HTML5 supporting browsers
	(function ($) {
		//test for Modernizr.input.placeholder if the library is going to be implemented in the future
		var supportsPlaceholderAttribute = testElementAttributeSupport('input', 'placeholder');
		if (!supportsPlaceholderAttribute) {
			var searchBoxes = $('input.site-search');

			$(searchBoxes).each(function (i) {
				var searchBox = searchBoxes[i],
					hasFocus = (searchBox === document.activeElement && searchBox.value != null);
				
				searchBox.defaultText = $(searchBox).attr('placeholder');
				
				if (!hasFocus && searchBox.value == '') {
					searchBox.value = searchBox.defaultText;
				}
				$(searchBox).bind({
					focus: function (e) { clearDefaultText(e) },
					blur: function (e) { replaceDefaultText(e) }
				});
			});
		}
	})(jQuery);
});

function toggle(id) {
	var e=document.getElementById(id);
	if (e.className=='closed')
		e.className='open';
	else
		e.className='closed';
}
function toggleWithWork(func, paramArray) {
	var e = document.getElementById(paramArray[0]);
	if(e.className == 'closed')
		e.className = 'open';
	else
		e.className = 'closed';
	func(paramArray);
}

function parseSecureUrl(url)
{
	if(url==undefined)
		return;
	return location.protocol+'//'+location.host+url.substring(url.indexOf('/',9));
}

function setTermsTouchScroll(contentSelector) {
	if (jQuery(contentSelector).height() != 0) {
		jQuery('#fancybox-inner').addClass('scrollableContainer').css('border','0px');
		jQuery(contentSelector).addClass('scrollableContent').css('overflow','').touchScroll();;
	}
	else
		setTimeout(function() { setTermsTouchScroll(contentSelector) }, 500);
}

jQuery(function () {
	var formInputs = jQuery(':input.cleardefault');
	jQuery(formInputs).each(function (i) {
        var theInput = formInputs[i];
        jQuery(theInput).bind({
            focus: function (e) { clearDefaultText(e) },
            blur: function (e) { replaceDefaultText(e) }
        });

        /* Save the current value */
        if (theInput.value != '') { theInput.defaultText = theInput.value; }
    });
});

function clearDefaultText(e, isEvent) {
	var target = window.event ? window.event.srcElement : e ? e.target : null;
	if (arguments.length > 1)
		target = e;
    if (!target) return;

    if (target.value == target.defaultText) {
        target.value = '';
        jQuery(target).removeClass('placeholder');
    }
}

function replaceDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;

    if (target.value == '' && target.defaultText) {
        target.value = target.defaultText;
        jQuery(target).addClass('placeholder');
    }
}

function inputFocus(inputID) {
    if (jQuery('#' + inputID).hasClass('empty_input')) {
        jQuery('#' + inputID).val('');
    }
    jQuery('#' + inputID).removeClass('empty_input')
    jQuery('#' + inputID).addClass('default_input')
}

function inputBlur(inputID, defaultValue) {
    if (jQuery('#' + inputID).val() == '') {
        jQuery('#' + inputID).val(defaultValue);
        jQuery('#' + inputID).removeClass("default_input");
        jQuery('#' + inputID).addClass("empty_input");
    }
    else {
        jQuery('#' + inputID).removeClass("empty_input");
        jQuery('#' + inputID).addClass("default_input");
    }
}
