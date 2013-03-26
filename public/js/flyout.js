(function(lp, jQuery) {
    lp.flyOut = function(parameters) {
        var self = this;
        var options = jQuery.extend({
            // the text to be replaced on the html template with content
            templateContentIdentifier: '',
            // the html template
            template: '',
            // selectors for the elements that should allow the hover
            selector: '',
            // shows the modal
            show: function(element) { },
            // executed after the setContent loads the content, meant to adjust the size of the modal
            adjust: function(element, contentElement, modalElement) { },
            // repositions the modal to the specified location
            reposition: function(currentElement, modalElement, offset) { },
            // hard offset for the modal window
            offset: {},
            // use explicit open, meaning call a funtion to open the modal, instead of the mouse enter event
            useExplicitOpen: false,
            // use explicit close, meaning call a funtion to close the modal, instead of the mouse leave event
            useExplicitClose: false,
            // the delay in milliseconds before the flyout fades away
            closeDelayMS: 300,
            // this allows the flyout to not close if the mouse is over it
            enableModalHover: true,
            // this allows the flyout to not show on hover
            enableToolTip: true
        }, parameters);
        var closeTimer;

        // methods to setContent and fade for hover	
        this.setContent = function(element, html) {
            _element.html(html);
            options.adjust(element, _element, _modal);
        };
        this.hoverIn = function(element) {
            if (closeTimer)
                clearTimeout(closeTimer);
            if (element.constructor)
                var e = element.constructor.toString().indexOf('HTML') != -1 ? jQuery(element) : jQuery(this);
            else
                var e = jQuery(element);
            if (options.show && options.show(e)) {
                var o = { left: options.offset.left + e.width(), top: options.offset.top + 0 };
                options.reposition(e, _modal.stop().css({ display: 'block' }), o).stop().animate({ opacity: 100 }, { duration: 300, complete: function() { options.reposition(e, _modal, o); } });
            }
            return false;
        };
        this.hoverOut = function() { closeTimer = setTimeout(function() { _modal.stop().animate({ opacity: 0 }, 300, 'swing', function() { jQuery(this).css({ display: 'none' }); _element.html(options.templateContentIdentifier); }); }, options.closeDelayMS); return false; };
        this.dispose = function() { _modal.remove(); jQuery(options.selector).unbind('mouseenter').unbind('mouseleave'); };
        this.open = function() { return self.hoverIn(this); };
        this.close = function() { return self.hoverOut(); };
        this.modalHoverIn = function() { if (closeTimer) clearTimeout(closeTimer); return false; };
        this.modalHoverOut = function() { self.hoverOut(); };

        // insert modal into dom
        var _modal = jQuery(options.template);
        var _element = {};
        _modal.find('*').each(function() { if (jQuery(this).html() == options.templateContentIdentifier) _element = jQuery(this); });
        jQuery('body').append(_modal);

        // add hover to selected elements
        if(options.enableToolTip){
					var e = jQuery(options.selector);
					if (!options.useExplicitOpen)
							e.mouseenter(self.hoverIn);
					if (!options.useExplicitClose)
							e.mouseleave(self.hoverOut);
					if (options.enableModalHover)
							_modal.unbind('mouseenter').unbind('mouseleave').hover(self.modalHoverIn, self.modalHoverOut);
        }
    };
    lp.toolTip = function(parameters) {
        var self;
        return self = new lp.flyOut(jQuery.extend({
            templateContentIdentifier: '...',
            template: '<div class="toolTipWrapper2"><div class="toolTipMid2">...</div><div class="toolTipArrow2"></div></div>',
            selector: '.toolTip, .levelToolTip',
            show: function(element) {
                //4440 - Redesign - Homepage - Latest Releases thumbnails do not show when logging off from a secure page 
                //tooltips not working on https
				var url=lynda.baseUrl+'WebServices/Public/P.asmx/';
				url=location.protocol+'//'+location.host+url.substring(url.indexOf('/',9));

                var findHtml = function(serviceMethod, id) {
                    var html = '';
                    jQuery.ajax({ async: false,
                        url: url + serviceMethod,
                        type: 'POST',
                        data: '{args:[' + id + ']}',
                        dataType: 'json',
                        contentType: 'application/json',
                        traditional: true,
                        success: function(data) { if (data && data.d) html = data.d; }
                    });
                    return html;
                };
                if (element.attr('cid'))
                    self.setContent(element, findHtml('M5', element.attr('cid')));
                else if (element.attr('lvlid'))
                    self.setContent(element, findHtml('M10', element.attr('lvlid')));
                else if (element.attr('aid')) {
                    var html = findHtml('M13', element.attr('aid'));
                    self.setContent(element, html.length > 150 ? (html.substring(0, 150) + '&hellip;') : html);
                }
                else if (element.data('tip'))
                    self.setContent(element, element.data('tip'));
                else
                    return false;
                return true;
            },
            adjust: function(element, contentElement, modalElement) {
                var midHeight = (modalElement.find('div.toolTipMid2').height() / 2) + (element.height() / 2);
                var t = modalElement.height() * -.5;
                var h = modalElement.find('div.toolTipArrow2').css({ top: t }).height() / 2;
                var o = element.offset();
                if (navigator.userAgent.indexOf("iPad;") != -1) {
                    modalElement.css({ top: ((o.top - jQuery(window).scrollTop()) - midHeight) });
                } else {
                    modalElement.css({ top: (o.top - midHeight) });
                }   
            },
            reposition: function(currentElement, modalElement, offset) {
                var l = offset.left;
                var o = currentElement.offset();
                if ((o.left + modalElement.width() + offset.left) > jQuery(window).width()) {
                    l = l - currentElement.width() - modalElement.width();
                    modalElement.find('div.toolTipMid2,div.toolTipArrow2').addClass('right');
                }
                else {
                    modalElement.find('div.toolTipMid2,div.toolTipArrow2').removeClass('right');
                }

                var midHeight = (modalElement.find('div.toolTipMid2').height() / 2) + (currentElement.height() / 2);
                var t = modalElement.height() * -.5;
                var h = modalElement.find('div.toolTipArrow2').css({ top: t }).height() / 2;
                if (navigator.userAgent.indexOf("iPad;") != -1) {
                	return modalElement.css({ top: ((o.top+jQuery(window).scrollTop())-(modalElement.height()/2)+(currentElement.height()/2)),left: (o.left+l) });
                   } else{
                   	return modalElement.css({ top: (o.top-(modalElement.height()/2)+(currentElement.height()/2)),left: (o.left+l) });
                }   
            },
            offset: { left: 0, top: 0 }
        }, parameters));
    };
    lp.filterOverflow = function(parameters) {
        var onclickCloseFlyOut = String.format("javascript:jQuery(\'div#filter-wrapper\').css(\'background-color\', \'#EDEAE2\');{0}",
                                                (lynda.isIMobileDevice)?"jQuery(\'div#filtering li\').css(\'background-color\', \'#EDEAE2\')":"");
        var self;
        return self = new lp.flyOut(jQuery.extend({
            templateContentIdentifier: '...',
            template: '<div class="filterOverflowWrapper"><div class="top"><span class="title"></span><a class="close" href="" onclick="' + onclickCloseFlyOut + '"><span class="icon remove">&nbsp;</span></a></div><div class="bottom"><div>...</div><div class="cl"></div></div></div>',
            selector: '.filterOverflow',
            show: function(element) {
                var html = element.next().html();
                self.setContent(element, html);
                return true;
            },
            adjust: function(element, contentElement, modalElement) { },
            reposition: function(currentElement, modalElement, offset) {
                var o = currentElement.offset();
                var o1 = {
                    left: offset.left - currentElement.width(),
                    top: offset.top - currentElement.height()
                };

                modalElement.find('a.close').unbind('click').click(self.close);

                var t = modalElement.find('div.top');
                var b = modalElement.find('div.bottom');
                var cnt = b.find('a').length;

                var newWidth = 182 * (cnt > 30 ? 4 : cnt > 20 ? 3 : cnt > 10 ? 2 : 1);
                var adj = (newWidth - 142) / 2;
                if (((o.left + o1.left) - adj) <= 0) {
                    adj += ((o.left + o1.left) - adj);
                    adj -= 10;
                }

			    if (cnt<=10) adj -= 9;
			    t.css({marginLeft:adj-11});
			    b.css({width:newWidth+2});
			
				return modalElement.css({width:newWidth+2,top:(o.top+o1.top),left:((o.left+o1.left)-adj)});
            },
            offset: { left: 0, top: -76 },
            useExplicitOpen: true,
            useExplicitClose: true,
            closeDelayMS: 50,
            enableModalHover: false
        }, parameters));
    };
})(lynda, jQuery);
