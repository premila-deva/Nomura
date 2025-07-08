$(document).ready(function(){

	// Global Variables
	var $menuH = $('header#home nav').outerHeight(),
		$menuItems = $('header#home nav ul li a'),
		scrollItems = $menuItems.map(function(){
      		var item = $($(this).attr("data-target"));
      		if (item.length) { return item; }
    	});
    

    $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
        bodyNoScroll( false );
    });
     
    //append the body scroll to apply markup to the sections except the last
    $( '<a href="javascript:void(0);" class="apply-jump" data-target="#apply">Jump to Apply section</a>' ).appendTo( 'body > section:not(#apply)' );   

	// Starting menu is at 100px but should scrollon 70px has it is resized on scroll
	if ($menuH > 70){ $menuH = 70; }
	// Mobile version of the menu is small
	if ($('body').innerWidth() < 1024){ $menuH = 50; }

	// Main navigation scrolling
	$('a[data-target]').on('click', function(){
		var $el = $(this),
			target = $el.attr('data-target');

		// Scroll page - offset the height of the nav
		$(window).stop().scrollTo( target , 500 );
		return false;
	});


	// Watch the scroll page
	$(window).scroll(function(){
		var pagePos = $(document).scrollTop() + $menuH + 1;

		// Add class to body if not top page
		if (pagePos - 1 > $menuH){ $('body').addClass('not_top'); } else { $('body').removeClass('not_top'); }

		// Get id of current scroll item
	   	var curMenuItem = scrollItems.map(function(){
			if ($(this).offset().top < pagePos) { 
	     		return this;
	     	} 
	   	});

	   	// Get the id of the current element
	   	curMenuItem = curMenuItem[curMenuItem.length-1];
	   	var id = curMenuItem && curMenuItem.length ? curMenuItem[0].id : "";

	   	// If page at the bottom, ID is last
	   	if ($(window).scrollTop() + $(window).height() == $(document).height()){
       		id = $menuItems.last().attr('data-target').replace('#', '');
   		}

	   	// Set/remove active class
	   	$menuItems.removeClass("active");
	   	$menuItems.filter("[data-target=#"+id+"]").addClass("active");
	});
   

	// Make all fullweight classes call the method
	$('.fullheight').fullheight();

	// Landing Section
	$('#landing a').on('click', function() {
		var show = $(this).attr('data-show'),
			hide = $(this).attr('data-hide'),
			d = ( $( 'body' ).hasClass( 'no-landing-animation' ) ? 0 : 1000 );
			
		// Show the correct section
		$('nav .'+hide).remove();
		$('.'+hide).css('display', 'none');
        $('.'+show+', header, footer, #slideshow').show();
		$('#landing').fadeOut(d, function(){
			// Reset everything
			$(window).scrollTop(0).resize();
            //fix for backgrounds on EUROPE which have a bg image when a section is hidden
            if ( $( '#news' ).is( ':hidden' ) ) $( '#apply' ).css( {'background-image': 'none'} ).removeClass( 'parallax' )  ;  
		});
        $('figure span.caption').negMargin();
		return false;
	});	


	var locationObj = location.hash;
	if( locationObj && locationObj.toString().indexOf( 'students-graduates' ) > -1 || locationObj.toString().indexOf( 'experienced-professionals' ) > -1 ) {
		var h = locationObj.substr(2),
			sections = h.split( '/' ),
			path = sections[0],
			section = sections[1];

		setTimeout( function() {
			$( '#' + path ).trigger( 'click' );
			$( '#home a[data-target="#'+section+'"]' ).trigger( 'click' );
			$( 'body' ).addClass( 'no-landing-animation' );
			location.hash = '';
		}, 100 );

	} else {
		// Wait for the image to load
		var src = $('#landing').css('background-image');
		var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
		var img = new Image();

		img.src = url;

		$(img).load(function(){ 
			$('#landing').fadeIn(1000);
		});
		// IE Compatibility
		if (img.complete){ 
			$('#landing').fadeIn(1000);
		}
	}


	// Parallax Backgrounds
	$('section.parallax').each(function(){
        var $el = $(this),
        	speed = 2;
     
        $(window).scroll(function() {
            var yPos = -( ($(window).scrollTop() - $el.offset().top) / speed); 
             
            // Put together our final background position
            var coords = '50% '+ yPos + 'px';

            // Move the background
            $el.css({ backgroundPosition: coords });
        }); 
    });   


    // Open Reveal Modal Callback
    $(document).on('open', '[data-reveal]', function () {
		var modal = $(this),
			content = modal.find('article'),
			w = $(window),
	  		modalH = w.outerHeight() * 0.8;

	  	// Set the modal max-height
	  	modal.css('max-height', modalH);
	  	content.css('max-height', modalH - 133); /* 133 = modal title height + modal padding */
	  	// Disable scroll event
	  	bodyNoScroll( true );
	 });
	 // Opened Reveal Modal Callback
	 $(document).on('opened', '[data-reveal]', function () { 	
	 	var modal = $(this);

	  	// If HTML5 Video is not supported
	  	if ( $('html').hasClass('no-video') && modal.hasClass('video') ){
	  		var poster = modal.find('.vjs-poster'),
	  			vH = poster.height(),
	  			vW = poster.width();

	  		modal.find('.video-js').css({
	  			height: vH,
	  			width: vW
	  		});
	  	}
	});


    // Carousel
    $('.owl-carousel').owlCarousel({
    	items : 6,
    	navigation : true
    });


    // Fading Slider
    $('.fade-slider').owlCarousel({
    	pagination : true,
    	singleItem : true,
    	transitionStyle : "fade"
    });


    // Open tab from link
    $('.openTab').on('click', function(){
    	var target = $(this).attr('href'),
            noScroll = $(this).attr( 'data-noscroll' );

    	// Fake click tab
    	$('.tab-title a[href='+ target +']').click();

        if ( noScroll == "true" ) return false;
        
    	// Scroll to it
    	$('html, body').animate({
	        scrollTop: $(target).offset().top - 100
	    }, 500);

    	return false;
    });


    // Randomly change the image
    var slideNb = Math.floor(Math.random() * 3) + 1;
    $('#slideshow figure').css('background-image', 'url(assets/images/home_'+slideNb+'.jpg)');
    // Change the headline position
    if (slideNb === 2 || slideNb === 3){
    	$('#slideshow figure .box div.columns').addClass('right');
    }


    // Program Navigator Filtering
    $('.program-navigator .f-dropdown li a').on('click', function(e){
    	var el = $(this),
    		tableContent = $('#program-navigator-content table'),
    		rows = tableContent.find('tr'),
    		program = [],
    		country = [],
    		business = [];

    	// Add/Remove active state
    	if ( el.parent().hasClass('has-children') ){
    		if ( el.hasClass('active') ){
    			el.removeClass('active');
    			el.parent().find('a').removeClass('active');
	    	} else {
	    		el.addClass('active');
    			el.parent().find('a').addClass('active');
	    	}
    	} else {
    		el.toggleClass('active');
    	}

    	// Hide all rows first
    	rows.addClass('disabled');

    	// Get all the different filters
    	$('.program-navigator ul[data-dropdown-content]').each(function(){
    		var selectId = $(this).attr('id'),
    			selection = [];

    		// Stringify selection
    		$(this).find('.active').each(function(){
    			selection.push( $(this).attr('data-type') );
    		});

	    	// Add all data if empty
			if (selection.length == 0){
	    		selection.push('all');
	    	}
    		
    		switch(selectId){
    			case 'select-program':
    				program = selection;
    				break;
    			case 'select-country':
    				country = selection;
    				break;
    			case 'select-business':
    				business = selection;
    				break;
    		}
    	});

    	// Here is the filtering
    	rows.each(function(){
    		var el = $(this);

    		$.each(program, function(index, val){
    			if ( el.attr('data-program').indexOf(val) != -1 ){
    				$.each(country, function(index, val){
		    			if ( el.attr('data-country').indexOf(val) != -1  ){
		    				$.each(business, function(index, val){
				    			if ( el.attr('data-business').indexOf(val) != -1  ){
				    				el.removeClass('disabled');
				    			}
				    		});
		    			}
		    		});
    			}
    		});

    		
    	});

    	return false;

    });

});


// PAGE LOADED AND ON RESIZE
$(window).bind('load resize', function(){

	
	// Centre all picture caption
	$('.centered').negMargin();
	$('.center_vertically').centerVertically();
    
    //$('figure.columns').replaceResizeImages();

});


// PLUGINS
(function ($){

	// Make any element fill the height of the browser
	$.fn.fullheight = function(){

		// Variable setup
		var $el = this,
			$window = $(window);

		// On window load/resize
		$window.bind('load resize', function(){
			var windowH = $window.height();

			$el.css('height', windowH);
		});
		
	};


	// Make any element vertically centered
	$.fn.centerVertically = function(){
		var $el = this;

		// Give the dialog window a height
		$el.css('max-height', ( $(window).outerHeight() - 20 ) - ( parseInt($el.css('padding-top').replace('px', '')) + parseInt($el.css('padding-bottom').replace('px', '')) ));
		// Calculate the margin to place it in the center
		$el.css('margin-top', '-' + ($el.outerHeight() / 2) + 'px');
		
	};


	// Calculate negative margin to centre elements
	$.fn.negMargin = function(){
		
		$.each(this, function(){
			var $el = $(this);
            
            $el.css( {'width': 'auto'} );

			if ($el.hasClass('middle')){
				$el.css('margin-top', '-'+($el.outerHeight() / 2)+'px');
				$el.css('margin-left', '-'+($el.outerWidth() / 2)+'px');
			}
			if ($el.hasClass('centered')){
				$el.css('margin-left', '-'+($el.outerWidth() / 2)+'px');
			}
		});		
		
	};


	// Tab component
	$.fn.tabify = function(){

		// Variable setup
		var $component = this,
			$tab = $component.find('ul.tabs li a'),
			$content = $component.find('div.content');

		// Do something if not active
		$tab.on('click', function(){
			var $el = $(this);

			if (!$el.hasClass('active')){
				// Unselect previous tad - Hide previous content
				$component.find('.active').removeClass('active');
				// Selected current tab - Show current content
				$el.parent().addClass('active');
				$content.find('[data-tab='+ $el.attr('id') +']').addClass('active');			
			}
		});
		
	};


}(jQuery));





//no scroll on the body
var bodyNoScroll = function( bool ) {

    var scrollBarWidth = getWidthOfScrollbar(),
        $body = $('body');

    if( bool ) {
        $body.addClass( 'no-scroll' ).css( {
            'padding-right': scrollBarWidth + 'px'
        } );
        
        $body.find( '> section[style*="background"]' ).css( {'margin-right': '-' + scrollBarWidth + 'px'} );

        //Add a an element which appends itself to the body to create the impression that the scrollbar is still there.
        //Needed because the page looks weird with a padding on the right when there is no grey of the background visible. 
        $body.append( '<div id="scrollbar-replace" style="width: ' + scrollBarWidth + 'px' + '" />' );

    } else {
        $body.removeClass( 'no-scroll' ).removeAttr( 'style' );
        $( '#scrollbar-replace' ).remove();
        $body.find( '> section' ).css( {'margin-right': '0px'} );
    }

};

// measure the width of a scrollbar to make the body not jump about when revealing and closing a modal      
var getWidthOfScrollbar = function() {

    // Create the measurement node (has to be native JS as it breaks in Safari and Chrome)
    var scrollDiv = document.createElement("div");
    scrollDiv.id = "scrollbar-measure";
    document.body.appendChild( scrollDiv );

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

    // Delete the DIV 
    document.body.removeChild( scrollDiv );

    return scrollbarWidth;
}