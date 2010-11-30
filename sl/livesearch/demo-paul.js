(function($) {

$(function() {

    var cache = {}, lastXhr;
    var ajm = $.manageAjax.create('livesearch',
                                  { queue: true, cacheResponse: true }
                                 );

    // The drop-down menu
    $(".ui-ls-menu").button({
	icons: {
	    secondary: "ui-icon-triangle-1-s"
	}
    }).each(function() {
        var btn_text = $(this).find('.ui-button-text');
	$(this).next().menu({
	    select: function(event, ui) {

                // Update the text in the button
                btn_text.text(ui.item.text());

                // Tell autocomplete about the new category
                var ac = $('.ui-autocomplete'); // XXX should be less general
                ac.data('selected_category', ui.item.text());
                
		$(this).hide();
	    },
	    input: $(this)
	}).hide();
    }).click(function(event) {
	var menu = $(this).next();
	if (menu.is(":visible")) {
	    menu.hide();
	    return false;
	}
	menu.menu("deactivate").show().css({top:0, left:0}).position({
	    my: "left top",
	    at: "left bottom",
	    of: this
	});
	$(document).one("click", function() {
	    menu.hide();
	});
	return false;
    });

    
    // The autocomplete widget
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function(ul, items) {
            var self = this,
                currentCategory = "";

            // The context menu should have assigned a selected_menu
            var selected_category = $('.ui-autocomplete').data('selected_category');
            
            $.each(items, function (index, item) {
                // Change autocomplete behavior which overrides the
                // searchterm
                item.data_value = item.value;
                item.value = self.term;
                
                if (
                    (item.category !== currentCategory) &&
                    (1==2)
                    ){
                    var li = $('<li class="ui-autocomplete-category"></li>');
                    li.append(
                        $('<span class="ui-ls-category-text"></span>')
                            .text(item.category)
                        );
                    li.append(
                        $('<span class="ui-ls-more"></span>')
                            .attr('href', '/search/more')
                            .text('more')
                        .bind('click', function (evt, ui) {
                            alert('clicked');
                        })
                    );
                    ul.append(li);
                    currentCategory = item.category;
                }
                self._renderItem(ul, item);
            });
            // Set a class on the first item, to remove a border on
            // the first row
            ul.find('li:first').addClass('ui-ls-autocomplete-first');
        },

	_renderItem: function( ul, item) {

            var li = $('<li>');
            var entry, div;

            // Render different items in different ways
            switch (item.type) {
                case 'profile': {
                    entry = $('<a class="ui-ls-profile"></a>');
                    entry.append($('<img>').attr('src', item.icon));
                    div = entry.append($('<div>'));
                    div.append(
                        $('<span class="ui-ls-profilelabel"></span>')
                            .text(item.label)
                    );
                    div.append($('<span>')
                               .text(item.extension));
                    entry.append($('<div>').text(item.department));
                    break;
                };

                default: {
                    entry = $( "<a></a>" ).text( item.label );
                };
            };
	    return $( "<li></li>" )
		.data( "item.autocomplete", item )
		.append( entry )
		.appendTo( ul );
	}
        
    });
    $(".ui-ls-autocomplete").catcomplete({
        delay: 0,
        position: {
	    my: "right top",
	    at: "right bottom",
            of: $('.ui-ls-gobtn'),
	    collision: "none"
        },            
        source: function (request, response) {
            var url = 'demo-paul-data.json';
            var term = request.term;

            $.manageAjax.add(
                'livesearch',
                {
                    url: url,
                    dataType: 'json',
                    maxRequests: 1,
                    queue: 'clear',
                    abortOld: true,
                    success: function(data) {
                        response(data);
                    },
                    error: function (xhr, status, exc) {
                        console.log(status);
                    }
                });            
            
            return;
            
            if ( term in cache ) {
		response( cache[ term ] );
		return;
	    }

	    lastXhr = $.getJSON( url, request, function( data, status, xhr ) {
		cache[ term ] = data;
		if ( xhr === lastXhr ) {
		    response( data );
		}
            });
            
        }
    });
    

    // The magnifying glass button on the right
    $(".ui-ls-gobtn").button({
        text: false,
	icons: {
	    primary: "ui-icon-search"
        }
    });

    // Dynamically set some positioning
    $('.ui-ls-autocomplete')
        .height($('.ui-ls-menu').height()+1)
        .focus();
    $('.ui-ls-autocomplete').position({
        of: $('.ui-ls-menu'),
        at: "right top",
        my: "left top"
    });
});


})(jQuery);
