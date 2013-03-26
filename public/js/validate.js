lynda.validate = function (container) {
	var validateTimer = null;
	function updateValidationDisplay(field, isValid, message) {
		field = $(field);
		if (isValid) {
			field.nextAll('.lynda-validate-message').eq(0).addClass("success").removeClass("error").removeClass("processing").html(message);
			for (var i = 0; i < notifySelectors.length; i++) {
				$(notifySelectors[i]).addClass("success").removeClass("error").removeClass("processing");
			}
		}
		else {
			field.nextAll('.lynda-validate-message').eq(0).addClass("error").removeClass("success").removeClass("processing").html(message);
			for (var y = 0; y < notifySelectors.length; y++) {
				$(notifySelectors[y]).addClass("error").removeClass("success").removeClass("processing");
			}
		}
	}
	function validatePassword(password, emailAddress, username) {
		var messages = "";
		var valid = true;
		if (!/\d/.test(password) || !/[a-zA-Z]/.test(password) || password.length < 6) {
			messages += "At least six characters with a letter and a number.";
			valid = false;
		}
		if (/(.)\1\1/.test(password)) {
			if (messages !== "") {
				messages += "<br/>";
			}
			messages += "Can't contain the same number or letter consecutively more than twice.";
			valid = false;
		}
		if (/\ /.test(password)) {
			if (messages !== "") {
				messages += "<br/>";
			}
			messages += "Can't contain any spaces.";
			valid = false;
		}
		if (HasCharacterSequence(password)) {
			if (messages !== "") {
				messages += "<br/>";
			}
			messages += "Can't contain more than two sequential numbers or letters.";
			valid = false;
		}
		if (emailAddress === password) {
			if (messages !== "") {
				messages += "<br/>";
			}
			messages += "Can't match email address.";
			valid = false;
		}
		if (username === password) {
			if (messages !== "") {
				messages += "<br/>";
			}
			messages += "Can't match user name.";
			valid = false;
		}
		return { isValid: valid, message: messages };
	}
	function HasCharacterSequence(password) {
		var hasSequence = false;

		for (var i = 0; i < password.length; i++) {
			if (password.length < i + 3)
				break;

			var char1 = password.charCodeAt(i);
			var char2 = password.charCodeAt(i + 1);
			var char3 = password.charCodeAt(i + 2);

			if ((char1 + 1 === char2 && char2 + 1 === char3)
				|| (char1 - 1 === char2 && char2 - 1 === char3)) {
				hasSequence = true;
				break;
			}
		}

		return hasSequence;
	}
	function luhnCheck(a, b, c, d, e) {
		for (d = +a[b = a.length - 1], e = 0; b--; )
			c = +a[b], d += ++e % 2 ? 2 * c % 10 + (c > 4) : c;
		return !(d % 10);
	}
	function creditCardType(cardNumber) {
		if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
			return "Visa";
		} else if (/^5[1-5][0-9]{14}$/.test(cardNumber)) {
			return "Master Card";
		} else if (/^3[47][0-9]{13}$/.test(cardNumber)) {
			return "American Express";
		} else if (/^6(?:011|5[0-9]{2})[0-9]{12}$/.test(cardNumber)) {
			return "Discover Card";
		} else {
			return null;
		}
	}
	function validateField(field, validation_type) {
		var isValid = true;
		var message = null;
		var ajax = false;
		field = $(field);
		notifySelectors = field.data("notify") ? field.data("notify") : [];
		if (typeof notifySelectors == "string") {
			notifySelectors = $.parseJSON(field.data("notify").replace(/'/g, '"'));
		}
		field.nextAll('.lynda-validate-message').eq(0).addClass("processing");
		field.nextAll('.lynda-validate-message').eq(0).text("");
		for (var i = 0; i < notifySelectors.length; i++) {
			$(notifySelectors[i]).addClass("processing");
		}
		switch (true) {
			case /^name$/.test(validation_type):
				isValid = /^[A-Z\-\.\'\s]{1,255}$/i.test(field.attr("value")) ? true : false;
				message = isValid ? "&nbsp;" : "Only letters, dots, dashes, and apostrophes.";
				break;
			case /^creditCard$/.test(validation_type):
				isValid = /^[0-9]{12,19}$/.test(field.attr("value")) ? true : false;
				if (isValid) {
					isValid = luhnCheck(field.attr("value")) ? true : false;
				}
				if (isValid) {
					isValid = creditCardType(field.attr("value")) ? true : false;
				}
				message = isValid ? "&nbsp;" : "Enter a valid card number.";
				break;
			case /^emailAddress$/.test(validation_type):
				isValid = /^[A-Z0-9'._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/i.test(field.attr("value")) ? true : false;
				message = isValid ? "&nbsp;" : "Enter a valid email address.";
				break;
			case /^password$/.test(validation_type):
				var checkPassword = validatePassword(field.attr("value"), field.data('affiliate_email_address'), field.data('affiliate_username'));
				isValid = checkPassword.isValid;
				message = isValid ? "&nbsp;" : checkPassword.message;
				break;
			case /^required$/.test(validation_type):
				isValid = /^.+$/.test(field.attr("value")) ? true : false;
				if (isValid) {
					message = "&nbsp;";
				} else if (field.is('select')) {
					message = "Required selection.";
				} else {
					message = "Required field.";
				}
				break;
			case /^securityCode$/.test(validation_type):
				isValid = /^[0-9]{3,4}$/.test(field.attr("value")) ? true : false;
				message = isValid ? "&nbsp;" : "Enter a 3- or 4-digit code.";
				break;
			case /^username$/.test(validation_type):
				isValid = /^[^ ]{1,50}$/.test(field.attr("value")) ? true : false;
				if (isValid) {
				} else {
					message = isValid ? "&nbsp;" : "Enter a valid username.";
				}
				break;
			case /^verifyPassword$/.test(validation_type):
				isValid = validatePassword(field.attr("value")).isValid;
				message = isValid ? "&nbsp;" : "Invalid format.";
				if (isValid) {
					isValid = field.attr("value") == $("#" + field.data("affiliate")).attr("value") ? true : false;
					message = isValid ? "&nbsp;" : "Password must match";
				}
				break;
			default: window.console.log("You tried to validate a field that we do not have validation criteria for");
		}
		if (!ajax) {
			updateValidationDisplay(field, isValid, message);
		}
	}



	$(container).keyup(function () {
		var field = $(this);
		var validation_type = field.data("type");
		clearTimeout(validateTimer);
		if (field.attr("value")) {
			validateTimer = setTimeout(function () {
				if (field.data('lastValidatedValue') != field.attr('value')) {
					field.data('lastValidatedValue', field.attr('value'));
					validateField(field, validation_type);
				}
			}, 1500);
		}
	});
	$(container).blur(function () {
		var field = $(this);
		if (field.data('lastValidatedValue') != field.attr('value')) {
			field.data('lastValidatedValue', field.attr('value'));
			validateField(field, field.data("type"));
		}
	});
	$(container).change(function () {
		var field = $(this);
		if (field.data('lastValidatedValue') != field.attr('value')) {
			field.data('lastValidatedValue', field.attr('value'));
			validateField(field, field.data("type"));
		}
	});
	$(container).bind('validate', function () { validateField($(container), $(container).data("type")); });
};
$(document).ready(function(){
	$(".lynda-validate").each(function()
    {
		lynda.validate($(this));
	});
});