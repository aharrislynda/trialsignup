lynda.page = {};
lynda.page.pricingOptions = 
    [
        {
            displayName: "Basic Monthly",
            displayFrequency: "Monthly",
            exerciseFiles: false,
            frequency: "month",
            price: 25,
            subscriptionId: 1001,
            premium:false
        },
        {
            displayName: "Basic Annual",
            displayFrequency: "Annually",
            exerciseFiles: false,
            frequency: "year",
            price: 250,
            subscriptionId: 1002,
            savings: "50",
            premium: false
        },
        {
            displayName: "Premium Monthly",
            displayFrequency: "Monthly",
            exerciseFiles: true,
            frequency: "month",
            price: 37.50,
            subscriptionId: 1008,
            premium: true
        },
        {
            displayName: "Premium Annual",
            displayFrequency: "Annually",
            exerciseFiles: true,
            frequency: "year",
            price: 375,
            subscriptionId: 1003,
            savings: "75",
            premium: true
        }
    ];
lynda.page.user = 
    {
        country: '241',
        expirationMonth: new Date().getMonth()+1,
        expirationYear: new Date().getFullYear(),
        monthlyNewsletter: true,
        newReleaseAnnouncements: true,
        selectedPlan: lynda.page.pricingOptions[2],
        specialAnnouncements: true,
        orderId: 0
    };
lynda.page.userController = function($scope)
{
    $scope.user = lynda.page.user;

    $scope.hasUSMilitaryAddress = function()
    {
        return $scope.user.state === "US military address" ? true : false;
    };
    $scope.isUSAddress = function()
    {
        return $scope.user.country === '241' ? true : false;
    };
    $scope.isCAAddress = function()
    {
        return $scope.user.country === '47' ? true : false;
    };
    $scope.cardType = function()
    {
        var cardNumber = $scope.user.cardNumber;
        var cardType = "";
        if(/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber))
        {
            cardType = "Visa";
        } else if(/^5[1-5][0-9]{14}$/.test(cardNumber)){
            cardType = "MasterCard";
        } else if(/^3[47][0-9]{13}$/.test(cardNumber)){
            cardType = "American Express";
        } else if(/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(cardNumber)){
            cardType = "Diners Club";
        } else if(/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)){
            cardType = "Discover";
        } else if(/^(?:2131|1800|35\d{3})\d{11}$/.test(cardNumber)){
            cardType = "JCB";
        } else{
            cardType = "";
        }
        return cardType;
    };
    $scope.maskedCardNumber = function()
    {
        try
        {
            //return $scope.user.cardNumber.slice(-4);
        } catch(e){
            return "";
        }
    };
};
lynda.page.pricingController = function($scope)
{
    $scope.user = lynda.page.user;
    $scope.plans = lynda.page.pricingOptions;

    $scope.comparisonCheckmark = function(property, plan)
    {
        return plan[property] ? "&#10003;" : "&nbsp;";
    };
    $scope.isSelectedPlan = function(plan)
    {
        return plan === $scope.user.selectedPlan ? true : false;
    };
    $scope.isMultilineDisplayName = function(name)
    {
        return name.match(/ /) ? true : false;
    };
    $scope.multilineDisplayName = function(name)
    {
        return name.replace(' ', '<br/>');
    };
    $scope.planWithSubscriptionId = function(subscriptionId)
    {
        for(var i in $scope.plans)
        {
            if($scope.plans[i].subscriptionId === subscriptionId)
            {
                return $scope.plans[i];
            }
        }
        return null;
    };
    $scope.annualSavings = function()
    {
        for(var i in $scope.plans)
        {
            if($scope.plans[i].savings)
            {
                return $scope.plans[i].savings;
            }
        }
    };

    return $scope;
};
lynda.page.stateController = function($scope, $location)
{
    $scope.animationDuration = 500;
    $scope.location = $location;
    $scope.registrationComplete = false;
    $scope.shouldAnimate = false; 
    $scope.state = 'account';

    $scope.$watch('state', function(state)
    {
        $location.path(state);
    });
    $scope.$watch(function(){ return $location.path(); }, function(path)
    {
        var testVersion = /trial\/registration(\d+[a-zA-Z]+)/.exec($location.$$absUrl);
        lynda.page.testVersion = testVersion ? testVersion[1].toUpperCase() : "";
        if(path !== "")
        {
            if($scope.registrationComplete)
            { 
                window.location.href = '/';  return;
            }

            path = path.slice(1);
            $scope.registrationComplete = path === 'complete' ? true : false;
            $scope.state = path;
            $scope[path + 'StateSwap']();
        } else {
            window.history.back();
        }
    });
    $scope.accountStateSwap = function () 
    {
        _gaq.push(['_trackPageview', '/virtualpage' + lynda.page.testVersion + 'RegistrationStep1.aspx?lpk35=' + lynda.page.lpk35 ]);
        lynda.page.fireYahooRetargetingPixel();
        lynda.page.fireDataXuRetargeting();
    
        $scope.hideState('completeState', $scope.shouldAnimate, 'left');
        $scope.hideState('billingState', $scope.shouldAnimate, 'left');
        $scope.showState('accountState', $scope.shouldAnimate, 'right');
        $("#status_bar").removeClass('billingStatus').removeClass('completeStatus').addClass('accountStatus');
        $("#current_breadcrumb").text('create your account');
        $scope.shouldAnimate = true;
    };
    $scope.billingStateSwap = function ()
    {
        $scope.hideState('completeState', $scope.shouldAnimate, 'right');
        $scope.hideState('accountState', $scope.shouldAnimate, 'left');
        $scope.showState('billingState', $scope.shouldAnimate, 'right');
        $("#status_bar").removeClass('accountStatus').removeClass('completeStatus').addClass('billingStatus');
        $("#current_breadcrumb").text('set up future billing');
        $scope.shouldAnimate = true;
    };
    $scope.completeStateSwap = function () 
    {
        _gaq.push(['_trackPageview', '/virtualpage' + lynda.page.testVersion + '/home/registration/RegistrationConfirmationR.aspx?lpk35=' + lynda.page.lpk35]);
        lynda.page.fireYahooRetargetingPixel(true);
        
        if(typeof(_vis_opt_top_initialize) == "function" && lynda.page._vis_opt_goal_conversion)
        {
            // Code for Custom Goal: Trial Activations
            _vis_opt_goal_conversion(lynda.page._vis_opt_goal_conversion);
        }
        $scope.hideState('accountState', $scope.shouldAnimate, 'left');
        $scope.hideState('billingState', $scope.shouldAnimate, 'left');
        $scope.showState('completeState', $scope.shouldAnimate, 'right');
        $("#status_bar").removeClass('accountStatus').removeClass('billingStatus').addClass('completeStatus');
        $("#current_breadcrumb").text('confirmed');
        
        this.fakeLogin();
        $scope.shouldAnimate = true;
        $scope.registrationComplete = true;
    };

    $scope.fakeLogin = function()
    {
        if(!lynda.page.user.loggedIn)
        {
            var hello_text = document.createElement('strong');
            $(hello_text).text("Hi, " + lynda.page.user.firstName);
            $(".member-links").children(".become").html(hello_text).addClass('first').removeClass('become');
            $(".acct-links").find("li:contains('reactivate')").remove();
            $(".acct-links").find("li:contains('subscribe')").remove();
            $(".acct-links").find("li:contains('free trial')").remove();
            $(".acct-links .nav .logout").before('<li class="with-sub-menu"><a href="/home/userAccount/ChangeContactInfo.aspx">my account</a><div class="sub hidden" style="opacity: 1; display: none; "><ul class="sub-menu"><li><a href="/home/userAccount/ChangeContactInfo.aspx">my profile</a></li><li><a href="/home/Preferences.aspx">site preferences</a></li><li><a href="/news/NewsletterPreferences.aspx">news + email options</a></li><li><a href="/home/userAccount/AccountBilling.aspx">account + billing</a></li></ul></div></li>');
            var logOutText = document.createElement('strong');
            $(logOutText).text("log out");
            var logOutLink = document.createElement('a');
            $(logOutLink).attr('href', "/ajax/logout.aspx?url=%2fmember.aspx").append(logOutText);
            $(".acct-links").find('.logout').html(logOutLink);
            $("li.with-sub-menu").each(function(){
                var element = $(this);
                element.mouseenter(function(){
                    element.find("div.sub").stop().fadeTo('fast',1);
                });
                element.mouseleave(function(){
                    element.find(".sub").hide();
                });
            });
            lynda.page.user.loggedIn = true;
        }
    };
    $scope.showState = function(state, animate, animationDirection)
    {
        $("."+state).each(function()
        {
            var element = $(this);
            if(animate)
            {
                if(element.hasClass('fade'))
                {
                    element.delay($scope.animationDuration).fadeIn($scope.animationDuration);
                } else if(element.hasClass('slide')){
                    var slideAmount = animationDirection === 'left' ? '-'+ element.width() + 'px' : element.width() + 'px';
                    element.css({opacity:0, position:'relative', left:slideAmount }).show().delay($scope.animationDuration).animate({opacity:1, left:0}, $scope.animationDuration);
                }
            } else {
                element.show();
            }
        });
    };
    $scope.hideState = function(state, animate, animationDirection)
    {
        $("."+state).each(function()
        {
            var element = $(this);
            if(animate)
            {
                if(element.hasClass('fade'))
                {
                    element.fadeOut($scope.animationDuration);
                } else if(element.hasClass('slide')){
                    var slideAmount = animationDirection === 'left' ? '-'+ element.width() + 'px' : element.width() + 'px';
                    element.css({position:'relative'}).animate({left:slideAmount, opacity:0}, $scope.animationDuration, function()
                        {
                            element.hide();
                        });
                }
            } else {
                element.hide();
            }
        });
    };
};
lynda.page.fireGoogleTrackingPixel = function(id, label, value)
{
    var pixel = $(document.createElement('img'));
    var random = new Date().getMilliseconds();
    var url = window.location.href;
    var queryPosition = url.indexOf("#") > url.indexOf("?") ? url.indexOf("?") : url.indexOf("#");
    url = url.substr(0, queryPosition);
    pixel.attr('src', 'https://www.googleadservices.com/pagead/conversion/'+id+'/?random='+random+'&value='+value+'&frm=0&label='+label+'&guid=ON&url='+location).width(1).height(1).css('position', 'absolute');
    $('body').append(pixel);
};
lynda.page.fireYahooRetargetingPixel = function(unpixel)
{
    $('#yahooRetargetingPixel').remove();
    var yahooPixel = document.createElement('img');
    var src = unpixel ? 'https://ad.yieldmanager.com/unpixel?id=1880408' : 'https://ad.yieldmanager.com/pixel?id=1880408&t=2';
    $(yahooPixel).attr('id', 'yahooRetargetingPixel').attr('src', src).width(1).height(1).css('position', 'absolute');
    $("body").append(yahooPixel);
};
lynda.page.fireYahooConversionPixel = function()
{
    var yahooPixel = document.createElement('img');
    var src = 'https://ad.yieldmanager.com/pixel?id=1880404&t=2';
    $(yahooPixel).attr('id', 'yahooConversionPixel').attr('src', src).width(1).height(1).css('position', 'absolute');
    $("body").append(yahooPixel);
};
lynda.page.fireMSNConversionPixel = function()
{
    var msnPixel = document.createElement('img');
    var src = 'https://386881.r.msn.com/?type=1&cp=5050';
    $(msnPixel).attr('id', 'msnConversionPixel').attr('src', src).width(1).height(1).css('position', 'absolute');
    $("body").append(msnPixel);
};
lynda.page.fireDataXuRetargeting = function (unpixel) {
	var dataXuPixel = document.createElement('img');
	if ('https:' == document.location.protocol) {
		if (unpixel) {
			$(dataXuPixel).attr('id', 'dataXuPixel').attr('src', 'https://securetags.w55c.net/rs?id=994b44a05077438a826920023cb04b8c&t=checkout');
		} else {
			$(dataXuPixel).attr('id', 'dataXuPixel').attr('src', 'https://securetags.w55c.net/rs?id=68952abc34ed4ff08fc4435dfd8cab28&t=marketing');
		}
	} else {
		$(dataXuPixel).attr('id', 'dataXuPixel').attr('src', unpixel ? 'http://tags.w55c.net/rs?id=994b44a05077438a826920023cb04b8c&t=checkout' : 'http://tags.w55c.net/rs?id=922d6ec347824d17bb909bfc52d5c3a1&t=marketing');
	}
	$("body").append(dataXuPixel);
}
lynda.page.fireDataXuConversion = function (transaction) {
	$("img#dataXuPixel").each(function () {
		$(this).remove();
	});
	var dataXuPixel = document.createElement('img');
	var dataXu_parameters = '&tx=' + transaction.OrderID + '&sku=' + transaction.Items[0].SKU + '&price=' + transaction.Items[0].Price;
	$(dataXuPixel).attr('id', 'dataXuPixel').attr('src', ('https:' == document.location.protocol ? 'https://securetags.' : 'http://tags.') + 'w55c.net/rs?id=ec1f4bb85525461bb15015f1dd299830&t=checkout' + dataXu_parameters);
	$("body").append(dataXuPixel);
}
lynda.page.submitForm = function(form, nextState)
{
    var processingIcon = document.createElement('span');
    $(processingIcon).addClass('lynda-validate-message').addClass('processing').text(' ');
    $(form).find("input[type='submit']").attr('disabled', true).addClass('inactive').after(processingIcon);
    $.post($(form).attr('action'),
        $(form).serialize(),
        function (data)
        {
            var $stateScope = angular.element('#state-controller').scope();
            if(data.Success === true)
            {
                $(".issueAlert").empty();
                $(".issueAlert").hide();

                $stateScope.state = nextState;

                window.scrollTo(0, 0);
                
            } else {
                if(data.RedirectUrl !== null && data.RedirectUrl !== "")
                {
                    window.location.href = data.RedirectUrl; 
                }
                var errors = data.Errors;
                $(".issueAlert").empty();
                var title = document.createElement('h3');
                $(title).text("Please correct the following items:");
                var ul = document.createElement("ul");
                for(var y in errors) 
                {
                    for(var x in errors[y].Messages) {
                        var emailAddressExistsError = /This email address is already associated with a lynda.com account./.test(x);
                        if(emailAddressExistsError)
                        {
                            $.fancybox(
                                $('#modal-existing-account'),
                                {
                                    'scrolling': 'no',
                                    'hideOnContentClick': false,
                                    'autoDimensions': true,
                                    'autoScale': false,
                                    'padding': 0,
                                    'titleShow': true,
                                    'overlayOpacity': 0.5,
                                    'titlePosition': 'outside',
                                    'showCloseButton': true
                                }
                            );
                            var reactivateLink = document.createElement('a');
                            $(reactivateLink).attr('href', '/home/registration/RenewalStep1.aspx');
                            $(reactivateLink).text('Reactivate your account');
                            $('[name="' + y + '"]').next('.lynda-validate-message').addClass('error').removeClass('success').html(reactivateLink);
                        }
                        else if (y == 'securityCode')
                        {
                            //leaving this to fall below will only show an error in the case that there is an invalid format of securityCode
                            //doing this will catch validation errors as well
                            $('[name="' + y + '"]').nextAll('.lynda-validate-message').addClass('error').removeClass('success').html(x);
                        }
                        else if($('[name="' + y + '"]').hasClass('lynda-validate'))
                        {
                            $('[name="' + y + '"]').trigger('validate');
                        } else {
                            var li = document.createElement("li");
                            $(li).html(errors[y].Messages[x].Message);
                            $(ul).append(li);
                        }
                    }
                }
                if($(ul).children().length)
                {
                    $(".issueAlert").append(title).append(ul);
                    $(".issueAlert").slideDown(1000);
                } else {
                    $(".issueAlert").slideUp(1000);
                }
                
            }
            $(form).find("input[type='submit']").attr('disabled', false).removeClass('inactive').next('span').remove();
            lynda.page.user.billingName = lynda.page.user.firstName + " " + lynda.page.user.lastName;
            $stateScope.$apply();
        }
    );
};

$(document).ready(function(){
    var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

    //Tooltips
    if(lynda.toolTip)
    {
        var tTip = null;
        if (tTip) tTip.dispose();
        tTip = new lynda.toolTip(
        {
            selector:'a.has_tooltip:not(.toolTipAdded)',
            show: function(element)
            {
                var html = element.next().html();
                tTip.setContent(element, html);
                return true;
            }
        });
        $('a.has_tooltip').addClass('toolTipAdded');
    }

    emailAddress = QueryString.email;
    if (emailAddress) {
        emailAddress = emailAddress.replace("%40","@");
        $('#hiddenEmail').val(emailAddress);
        $('.userEmail').text(emailAddress);
    }

    chosenID = QueryString.subscriptionId;
    $('#subid').val(chosenID);
    $('#subid2').val(chosenID);
    var todayDate = "Mar 27";
    $('.todayDate').text(todayDate);
    var endDate = "Apr 3";
    $('.endDate').text(endDate);
    var renewDate = "Apr 4";
    $('.renewDate').text(renewDate);
    if (chosenID == '1001') {
        $('.planFrequencyMonthly').text('Monthly');
        $('.planPriceMonthly').text('$25.00');
        $('.planFrequencyAnnual').text('Annual');
        $('.planPriceAnnual').text('$250.00');
        $('.planPriceAnnualMonthly').text('$20.83');
        $('.annualSavings').text('50');
        $('.planType').text('Basic');
        $('.planFrequency').text('Monthly');
        $('.renewFrequency').text('month');
        $('.chosenPrice').text('$25.00');
        monthlyPrice="$25.00";
        annualPrice="$250.00";
    } else {
        $('.planFrequencyMonthly').text('Monthly');
        $('.planPriceMonthly').text('$37.50');
        $('.planFrequencyAnnual').text('Annual');
        $('.planPriceAnnual').text('$375.00');
        $('.planPriceAnnualMonthly').text('$31.25');
        $('.annualSavings').text('75');
        $('.planType').text('Premium');
        $('.planFrequency').text('Monthly');
        $('.renewFrequency').text('month');
        $('.chosenPrice').text('$37.50');
        monthlyPrice="$37.50";
        annualPrice="$375.00";
    }

    //complete page plan information
    var renewSelected = QueryString.selectedPlan;
    $('.renewPlan').text(renewSelected);
    if (renewSelected == "Annual") {
        $('.chosenPrice').text(annualPrice);
    } else {
        $('.chosenPrice').text(monthlyPrice);
    }

    //pill click behavior
    $('.pill').click( function() {
        $('.pill').removeClass('active');
        $(this).addClass('active');
    });
    $('.monthlyPill').click( function() {
        $('.planFrequency').text('Monthly');
        $('.renewFrequency').text('month');
        $('.chosenPrice').text(monthlyPrice);
    });
    $('.annualPill').click( function() {
        $('.planFrequency').text('Annual');
        $('.renewFrequency').text('year');
        $('.chosenPrice').text(annualPrice);
    });

    var debugMode = false;
    if (debugMode) {
        var title = document.createElement('h3');
        $(title).text("Please correct the following items:");
        $(".issueAlert").append(title);
        $(".issueAlert").show();
    }

    $('#expMonth option[value=3]').prop('selected',true);
    $('#countrySelector option[value=241]').prop('selected', true);
    $('.billingState').show();
    $('.completeState').show();

    //Overlays
    $("a.modal-link").each(function()
    {
        var link = $(this);
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
            'showCloseButton': true
        });
    });

    $('#accountInformationContainer').submit(function() {
        var formHasErrors = false;
        var nameError = false;
        var emailError = false;
        var pwdError = false;
        var pwdConfirmError = false;

        if ($('.name-validation').hasClass('success')) {
        } else {
            nameError = true;
        }

        if ($('.email-validation').hasClass('success')) {
        } else {
            emailError = true;
        }

        if ($('.pwd-validation').hasClass('success')) {
        } else {
            pwdError = true;
        }

        if ($('.pwd-confirm-validation').hasClass('success')) {
        } else {
            pwdConfirmError = true;
        }

        if ( nameError || emailError || pwdError || pwdConfirmError ) {
            formHasErrors = true;
        }

        if (formHasErrors) {
            $(".lynda-validate").trigger('validate');
            if ($('.name-validation').hasClass('success') && $('.email-validation').hasClass('success') && $('.pwd-validation').hasClass('success') && $('.pwd-confirm-validation').hasClass('success')) {
            } else {
                return false;
            }

        }
    });

    $('#billingForm').submit( function() {
        var formHasErrors = false;
        var errorSlider = false;
        $(".lynda-validate").trigger('validate');
        if ($('.lynda-validate-message').hasClass('error')) {
            formHasErrors = true;
        }

        var ul = document.createElement("ul");

        if ($('#expMonth option:selected').val() < 3) {
            var li = document.createElement("li");
            $(li).html("Please enter a valid expiration date.");
            $(ul).append(li);
            formHasErrors = true;
            errorSlider = true;
        }

        if ($('#stateSelector option:selected').val() == "Other") {
            var li = document.createElement("li");
            $(li).html("Please select a state.");
            $(ul).append(li);
            formHasErrors = true;
            errorSlider = true;
        }

        if (formHasErrors) {
            $(".issueAlert").empty();
            var title = document.createElement('h3');
            $(title).text("Please correct the following items:");
            if(errorSlider) {
                $(".issueAlert").append(title).append(ul);
                $(".issueAlert").slideDown(1000);
            } else {
                $(".issueAlert").slideUp(1000);
            }
            return false;
        }
        
    });

    //User initialization from previously entered registration information.
    if (lynda.page.registrationInfo !== undefined)
    {
        lynda.page.user.firstName = lynda.page.registrationInfo.UserInfo.FirstName;
        lynda.page.user.lastName = lynda.page.registrationInfo.UserInfo.LastName;
        lynda.page.user.emailAddress = lynda.page.registrationInfo.UserInfo.Email;
        lynda.page.user.username = lynda.page.registrationInfo.UserInfo.UserName;
        lynda.page.registrationInfo.SubscriptionId = lynda.page.registrationInfo.SubscriptionId || lynda.page.pricingOptions[0].SubscriptionId;
        lynda.page.user.selectedPlan = lynda.page.pricingController({}).planWithSubscriptionId(lynda.page.registrationInfo.SubscriptionId);

        var pricingOptionsLength = lynda.page.pricingOptions.length;
        for(var i=0; i<pricingOptionsLength; i++)
        {
            if(lynda.page.pricingOptions[i].premium != lynda.page.user.selectedPlan.premium)
            {
                lynda.page.pricingOptions.splice(i,1);
                i--;
                pricingOptionsLength--;
            }
        }
    }
});