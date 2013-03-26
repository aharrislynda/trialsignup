jQuery(document).ready(function () {

    //Bind event handler for pressing the enter key. 
    jQuery(".emailCaptureTextBox").each(function () {
        jQuery(this).keypress(function (e) {
            var code = (e.keyCode ? e.keyCode : e.which);
            if (code == 13) {
                jQuery(this).parents(".emailCaptureParentDiv").find(".emailCaptureSubmitButton").click();
            }
        });
    });

    function resetEmailCollectionForm() {
        jQuery(".emailCaptureMessageDiv").html("");
        jQuery(".emailCaptureErrorImage").hide();
        jQuery(".processing").hide();
        jQuery(".emailCaptureTextBox").val("your email address");
        jQuery(".emailCaptureTextBox").addClass("placeholder").blur();
    }
    resetEmailCollectionForm();

    //Lighbox trigger
    jQuery("a.modal-trigger").each(function () {
        var link = jQuery(this);
        link.fancybox(
        {
            'scrolling': 'no',
            'hideOnContentClick': false,
            'autoDimensions': true,
            'autoScale': false,
            'padding': 0,
            'titleShow': true,
            'overlayOpacity': 0.5,
            'titlePosition': 'outside',
            'showCloseButton': true,
			'onClosed': function() {
				jQuery("#email-content .emailCaptureMessageDiv").html("");
				jQuery("#email-content .emailCaptureErrorImage").hide();
				jQuery("#email-content .processing").hide();
				jQuery("#email-content .emailCaptureTextBox").val("your email address");
				jQuery("#email-content .emailCaptureTextBox").addClass("placeholder").blur();
			}
        });
    });


    //Bind event handler for clicking the submit button.
    jQuery('.emailCaptureSubmitButton').bind('click', function () {

        var submitButton = jQuery(this);
        var parentDiv = submitButton.parents(".emailCaptureParentDiv");
        var emailAddressTextBox = parentDiv.find(".emailCaptureTextBox");
        var emailAddress = jQuery.trim(emailAddressTextBox.val());
        emailAddressTextBox.val(emailAddress);

        if (emailCaptureUrl != "undefined" && emailCaptureUrl != null && emailCaptureUrl != "" && emailAddress != "undefined" && emailAddress != "") {

            var messageBox = parentDiv.find(".emailCaptureMessageDiv");
            var errorImage = parentDiv.find(".emailCaptureErrorImage");
            var loadingImage = parentDiv.find(".processing");

            //Start ajax call.
            submitButton.attr('disabled', 'disabled');
            messageBox.html("");
            errorImage.hide();
            loadingImage.show();

            jQuery.ajax({
                async: true,
                url: emailCaptureUrl,
                type: 'POST',
                data: { email: emailAddress },
                success: function (data) {
                    submitButton.removeAttr('disabled');

                    if (data.Status === "ERROR" && data.DisplayError) {
                        //Display error in error box.
                        messageBox.html(data.Message);
                        loadingImage.hide();
                        errorImage.show();
                    }
                    else if (data.Status === "OK") {
                        //Show success pop-up.
                        messageBox.html("");
                        loadingImage.hide();
                        errorImage.hide();
                        emailAddressTextBox.val("your email address");
                        emailAddressTextBox.addClass("placeholder").blur();

                        //Show success pop-up and record event click. 
                        var actionButton = parentDiv.find("[href='#submit-content']");
                        var trackingPageUrl = "/virtualpage/newsletter-signup?bnr=" + parentDiv.find(".emailCaptureTrackingParameter").val();
                        _gaq.push(['_trackEvent', 'Newsletter signup', actionButton.text(), emailCaptureCurrentPageUrl]);
                        _gaq.push(['_trackPageview', trackingPageUrl]);
                        actionButton.trigger('click');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    submitButton.removeAttr('disabled');
                }
            });
        }
        else {
            //Display error in error box.
            parentDiv.find(".emailCaptureMessageDiv").html("Must be a valid email format.");
            parentDiv.find(".emailCaptureErrorImage").show();
        }
    });

});
