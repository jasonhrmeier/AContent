<script type="text/javascript">

	var remove_page_template_top_bar	= '<div class="remove_page_templateTopBar"><div class="remove_page_template">X</div></div>';
	var sort_tools			= '<div class="sort_tools">\
								<img src="<?php echo $dnd_themod; ?>system/top.png" class="move_page_templateTop" alt="move top" />\
								<img src="<?php echo $dnd_themod; ?>system/up.png" class="move_page_templateUp" alt="move up" />\
								<img src="<?php echo $dnd_themod; ?>system/down.png" class="move_page_templateDown" alt="move down" />\
								<img src="<?php echo $dnd_themod; ?>system/bottom.png" class="move_page_templateBottom" alt="move bottom" />\
								</div>';

	$(document).ready(function(){
	//document.onload = function() {
		// This line allows us to display the form and only if JS 'enabled
		// The switch depends on the module name (which, in the language file, and 'customizable)
	//	var titolo_modulo	= "<?php echo _AT('page_template'); ?>";
	//	titolo_modulo		= titolo_modulo.replace(/ /g, '');

		// if the user and 'an author authenticated
		// Show the form
		/*
		if("<?php echo $is_author; ?>" == 1 && "<?php echo basename($_SERVER['PHP_SELF']); ?>" == "content.php"){
			alert("inside if before code");
			$('#menu_' + titolo_modulo + ' form').show();
			alert("inside if after code");
		}else{
			alert("in else before code");
			$('#menu_' + titolo_modulo + ' form').hide();
			alert("in else after code");
		//	$('#menu_' + titolo_modulo).hide();
			//$('#menu_' + titolo_modulo).prev().hide();
			//$('#menu_' + titolo_modulo).siblings('br').slice(-1).remove();
		}
*/
		/*
		if($('#view').is('*'))
			base			= $('#view');
		else
		*/
		alert("commented out if/else");
			base			= $('#content-text');

		////////////////////////////////////////
		//	INCLUSIONS / DECLARATIONS / DEFINITIONS
		////////////////////////////////////////

		var box_page_template			= '<div class="box_page_template"><ul></ul></div>';

		// consider only page_templates during the preview of the content

		// I determine if they are being edited or during the preview of the content
		// TEXTAREA
		/*
		if($('#body_text').is('*')){
			// phase change
			base		= $('#body_text');
		}else{
		//	Previewing content
			base		= $('#content-text');
		}

		base			= $('#content-text');
		*/

		// I post at the head of the textual content box related to the page_templates
		box_page_template_toolbox = "<div class=\"box_page_template_toolbox\"><ul>";

		// paste
		box_page_template_toolbox = box_page_template_toolbox + "<li id=\"page_template_paste\"><img src=\"<?php echo $dnd_themod; ?>system/paste.png\" title=\"<?php echo _AT('paste'); ?>\" alt=\"\" /> <?php echo _AT('paste_page_template_sequence'); ?></li>";
		
		// copy
		box_page_template_toolbox	= box_page_template_toolbox + "<li id=\"page_template_copy\"><img src=\"<?php echo $dnd_themod; ?>system/copy.png\" title=\"<?php echo _AT('copy'); ?>\" alt=\"\" /> <?php echo _AT('copy_page_template_sequence'); ?></li>";
		
		box_page_template_toolbox = box_page_template_ toolbox + "</ul></div>";


		////////////////////////////////////////
		//	EVENT ON / OFF PAGE_TEMPLATES
		////////////////////////////////////////

		$('#page_templateCopy').live("click", function(){

			var all_page_templates	= '';

			$('.page_template').each(function(index) {
				all_page_templates = all_page_templates + "|" + $(this).attr('class');
			});

			var c_name		= 'page_template_clipboard';
			var value		= all_page_templates;
			var exdays		= '1';

			// I create the cookie
			var exdate		= new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value		= escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
			document.cookie	= c_name + "=" + c_value;

			$('#page_template_copy').css('background','#f0f8ff');

			$('#page_template_paste').css('display','inline');

		});

		$('#page_template_paste').live("click", function(){

			var c_name		= 'page_template_clipboard';
	
			// I read the cookie
			var i,x,y,ARRcookies=document.cookie.split(";");
			for (i=0;i<ARRcookies.length;i++){
				x	= ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
				y	= ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
				x	= x.replace(/^\s+|\s+$/g,"");
				if (x==c_name){
					if(unescape(y) == '')
						alert("<?php echo _AT('no_set_copied'); ?>");
					else
						var page_templates = unescape(y);
				}
			}

			// If there are already 'other page_templates
			// Ask if you want to add the clipboard in the head
			if($('.page_template').attr('class') != 'page_template no_page_template'){
				if(!confirm("<?php echo _AT('add_to_existing_page_templates'); ?>") ) {
            		return false;
		  		}
		  	}

			// add page_templates
			//$('#dnd').html(page_templates + $('#dnd').html());
			var m = page_templates.split('|');

			var not_after_page_template = 0;
			// the cycle starts from 1 in that the first element is''
			for(i=1; i<m.length; i++){
				var page_templateID = m[i].replace("page_template ", "");
				
				if(page_templateID == 'no_page_template')
					not_after_page_template = 1;
				else
					add_page_template(page_templateID, not_after_page_template);
			}
			
			// save new content
			save_content_changes();

		});

	
		$('#activate_page_template_btn').change(function (event) {
			
			if($('#activate_page_template_btn').is(':checked')) {
				
				// disable ORDER PAGE_TEMPLATES				
				$('#order_page_template_btn').attr('disabled','disabled');

				$('head').append('<link rel="stylesheet" href="<?php echo $dnd_themod; ?>system/page_template.css" type="text/css" />');

				// cut and paste toolBar
				base.before(box_page_template + box_page_template_toolbox);

				// CUT & PASTE

				// cookie name
				var c_name		= 'page_template_clipboard';

				// I read the cookie
				var i,x,y,ARRcookies=document.cookie.split(";");
				for (i=0;i<ARRcookies.length;i++){
					x	= ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
					y	= ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
					x	= x.replace(/^\s+|\s+$/g,"");
					if (x==c_name){
						if(unescape(y) != '')
							$('#page_template_paste').css('display','inline');
					}
				}
	
				// I fill the box with the available page_templates only if we choose to view page_templates
				var m = '';

				var count = 0;
				<?php
					
					foreach($page_Templates_list as $key => $value) {
						echo 'count++;';
						echo '$(".box_page_template").append($("<li>"));';
						echo 'm = m + "<li><table id=\"'.$key.'\"><tr><td><img src=\"'.$dnd_themod.'/page_template/'.$key.'/screenshot.png\" /></td></tr><td class=\"desc\">'.$value['name'].'</td></tr></table></li>";';
					}
				?>

				$(".box_page_template ul").append(m);

				// mostro il box dei page_templates
				$('.box_page_template').slideToggle('slow', function(){
					$(this).css('display','block');
				});

				show_page_templates();

			}else{
				
				// temporarily turn off the button _page_templates
				$('#activate_page_template_btn').attr("disabled", "disabled");

				hide_page_templates();

				// monster box page_templates

				$('.box_page_template').slideToggle('slow', function(){

					// rimuovo il box del cut & paste dal DOM
					$('.box_page_template_toolbox').remove();
					// remove box_page_template from DOM
					$('.box_page_template').remove();

					// I save the document
					save_content_changes();

					// I remove the style sheet
					var page_template_stylesheet	= $('link[href="<?php echo $dnd_themod; ?>system/page_template.css"]');
					page_template_stylesheet.remove();

				});
			}
		});


		////////////////////////////////////////
		//	ARRANGE PAGE_TEMPLATES BUTTON
		////////////////////////////////////////

		$('#sort_page_template_btn').click(function(){
			if($('#sort_page_template_btn').is(':checked')){

				// disable ACTIVE PAGE_TEMPLATES
				$('#activate_page_template_btn').attr('disabled', 'disabled');

				$('.no_page_template').addClass('no_page_template_sorting');
				
				$('head').append('<link rel="stylesheet" href="<?php echo $dnd_themod; ?>system/page_template.css" type="text/css" />');

				show_page_template();
				
			}else{
				
				hide_page_templates();

				//$('.box_page_template_toolbox').hide();
				
				// disable ACTIVE PAGE_TEMPLATES
				$('#order_page_template_btn').attr('disabled', 'disabled');

				$('.no_page_template').removeClass('no_page_template_sorting');

				// I show box page_templates
				
				// I remove from the DOM box_page_template
				$('.box_page_template').remove();

				// I save the document
				/*
				var url			= "<?php echo $dnd_themod; ?>" + "system/AJAX_actions.php";
				var vcid		= "<?php echo $cid; ?>";
				var vaction		= 'save_page_template_content';
				//var vtext		= base.html();
				var vtext		= duplicated_text_ fix();

				$.post(url, {cid: vcid, text: vtext, action: vaction}, function(data){

					// Rehabilitated button _page_templates
					$('#activate_page_template_btn').removeAttr("disabled");
					$('#order_page_template_btn').removeAttr('disabled');

				});
				*/
				save_content_changes();

				// I remove the style sheet
				var page_template_stylesheet	= $('link[href="<?php echo $dnd_themod; ?>system/page_template.css"]');
				page_template_stylesheet.remove();
			}
		});


		////////////////////////////////////////
		//	ORDER PAGE_TEMPLATE
		////////////////////////////////////////

		// top

		$('.move_page_template_top').live("click", function(){

			// this page_template
			var page_template = $(this).parents('.page_template');

			base.prepend(page_template);

		});

		// up

		$('.move_page_template_up').live("click", function(){

			// this page_template
			var page_template = $(this).parents('.page_template');

			if(page_template.prev().attr('class') != undefined){
			
				var parent = page_template.prev();
				parent.before(page_template);
			}else{
				base.prepend(page_template);
			}

		});

		// down

		$('.move_page_template_down').live("click", function(){

			// this page_template
			var page_template = $(this).parents('.page_template');

			//model.next('.model').css('background', 'red');
			//alert(model.next().attr('class'));
			//model.css('background', 'red');

			if(page_template.next().attr('class') != undefined){
			
				var child = page_template.next();
				child.after(page_template);
			}else
			{
				base.append(page_template);
			}

		});

		// bottom

		$('.move_page_template_bottom').live("click", function(){

			// this page_template
			var page_template = $(this).parents('.page_template');

			base.append(page_template);
		});

		////////////////////////////////////////
		//	Add A NEW PAGE_TEMPLATE
		////////////////////////////////////////

		$('.box_page_template li').live("click", function(){

			var structure	= "";

			// I take the name of the template you want to insert
			var page_template_ID		= $(this).find('table').attr('id');
			
			// add page_template
			add_page_template(page_templateID, 0);

		});

		////////////////////////////////////////
		//	Eliminated the SELECTED PAGE_TEMPLATE
		////////////////////////////////////////

		$('.remove_page_template').live("click", function(){


			// effect slideUp
			/*
			$(this).parent().parent().slideUp(300,function(){
				$(this).remove();
			});
			*/
			var page_template	= $(this).parents('.page_template');

			// effect fade

			page_template.fadeOut(300, function(){
				page_template.remove();
			});

		});


		$("#body_text_ifr").live("mouseover", function(){
			//var a = $('#body_text').contents().text();
			//a = a.find('plain_text').css('color','gold');
			//alert(a.html());
			//var a = tinyMCE.activeEditor.getContent();
			//var a = tinyMCE.activeEditor.getContent({format : 'raw'});
			var oldContent	= tinyMCE.activeEditor.getContent();
			
			//newContent = oldContent.replace('a','@');
			
			var new_content;
			
			//$('.page-title').html(a);
			//alert(a);
			
			tinyMCE.activeEditor.setContent(newContent);
			//var a = tinyMCE.get('.page_template_content').getContent();

			//$('.page-title').html(a);
			/*
			var a = tinyMCE.activeEditor.getContent({format : 'raw'});

			a.find(".page_template_content").live("mouseover", function(){
				$(this).css('background','red');
			});
			*/

		});
		/*
		$("#body_text_ifr").contents().find(".page_template_content").live("mouseover", function(){
			alert('aaaaaaa');
		});*/


		/*
		*	I fix an annoying bug in browser design:
		* When I browse the contents of a div vertically (in this case the page_template)
		* And arrive at the end, the focus is automatically taken from the page that runs
		* Uncomfortably at the bottom. 
		*/
		$(".box_page_template").live({

			mouseover: function() {
    			$('body').css('overflow','hidden');
    			$('body').css('padding-right','15px');
    			//$('body').css('display','block');
  			},
  			mouseout: function() {
    			$('body').css('overflow','auto');
    			$('body').css('padding-right','0px');
  			}
		});


		/*######################################
			FUNCTIONS
		######################################*/
		
		function add_page_template(page_templateID, after_no_page_template){

			var url			= "<?php echo $dnd_themod; ?>" + "system/AJAX_actions.php";

			// structure is not 'nothing but the mere HTML code of the page_template
			$.post(url, {ptID: page_templateID}, function(structure){

				if(after_no_page_template == 0){
					//$('.page_template:first').before('<div class="page_template ' + page_templateID + '" id="new_page_template">' + create_page_template(structure) + "</div>");
					//$('.page_template:first').before('<table class="page_template ' + page_templateID + '" id="new_page_template"><tr><td>' + create_page_template(structure) + "</td></tr></table>");
					if(base.children(":first").is("*")){
						base.children(":first").before(create_page_template(structure, page_templateID));
					}else{
						base.append(create_page_template(structure, page_templateID));
					}
				}else{
					$('.no_page_template').after('<div class="page_template ' + page_templateID + '" id="new_page_template">' + create_page_template(structure, page_templateID) + "</div>");
				}

				// I update the preview themes
/*
				if($('.view').is('*')){

					$('#new_page_template').fadeIn(1, function(){
						var text = $('#content-text').html();

						// I also add the tag "dnd" that, by the orignale "content-text" does not exist						
						$('.view').html("<div id=\"dnd\">" + text + "</div>");
					});

				}else{
					*/
					// inserisco il _page_template
					$('#new_page_template').fadeIn(300);
				//}

				// replace the image of the _page_template in the default

				$('#content-text .page_template img').each(function(index) {
					if($(this).attr('src') == 'dnd_image'){
						$(this).attr('src', "<?php echo $dnd_themod.'system/page_template_image.png'; ?>");
						$(this).addClass("insert_image");
					}
				});

				$('#new_page_template').removeAttr('id');
			});
		}
		
		function save_content_changes(){
			var url			= "<?php echo $dnd_themod; ?>" + "system/AJAX_actions.php";
			//window.alert(url);//stop code and output a message box
			var vcid		= "<?php echo $cid; ?>";
			var vaction		= 'save_page_template_content';
			//var vtext		= duplicated_text_ fix();
			
			var vtext		= $('#content-text').html();

			$.post(url, {cid: vcid, text: vtext, action: vaction}, function(data){

				// Rehabilitated button page_templates
				$('#activate_page_template_btn').removeAttr("disabled");
				$('#order_page_template_btn').removeAttr('disabled');

			});
		}
		
		function create_page_template(content, page_templateID){

			page_template = '<table style="width:100%" class="page_template ' + page_templateID + '" id="new_page_template">';
				//modello = modello + '<tr><td>' + removeModelTopBar + '</tr></td>';
				page_template = page_template + '<tr><td>' + remove_page_template_top_bar;

				page_template = page_template + '<tr><td class="page_template_content">' + content + '</tr></td>';

			 	page_template = page_template + '<tr><td>' + sort_tools + '</tr></td>';
			page_template = page_template + '</table>';

			return page_template;
		}
		
		function show_page_templates() {

			// I show the options of page_template (delete, sort)
			$('.page_template').each(function(index) {
				// I show the X which eliminates the page_template
				$(this).find(' tr:first').before("<tr><td>" + remove_page_template_top_bar);

				// I show the sort bar
				$(this).append("<tr><td>" + sort_tools);
			});
			
			// encapsulate the existing content in a "no_page_template"
			//base..css('background','lightgreen');

			return;

			//if and 'set a theme (so there is an ID "dnd")
			/*
			if($('#content-text #dnd').is('*')){
				var dad	= $('#dnd');
			}else{
				var dad	= $('#content-text');
			}

			// to ensure that the page_templates assume the theme assigned to the lesson
			// Must be passed in the content div "# dnd".
			// To differentiate the page_templates from the "old content" I put it all in-text content;
			// The "old content" are in oldContent and new page_templates are in new_page_template but all in # dnd

			// if no_page_template (the "old content") is not 'there, I add
			if(!$('.no_page_template').is('*')){
				dad.html('<div class="Page_template no_page_template">' + dad.html());
				//creaModello(dad.html()));
			}else{
				$('.no_page_template').addClass('page_template');
			}

			// I make visible all the templates
			// for each tag
			$('.custom_page_template').each(function(index) {
				$(this).removeClass('custom_page_template');
				$(this).addClass('page_template');
			});

			// I show an X to eliminate the page_template
			//$('.page_template_content').before(remove_page_templateTopBar);
			$('.page_template_content').before(remove_page_template_top_bar);
			//$('.remove_page_template_top_bar').show();
			
			//$('.page_template_content').append(sort_tools);
			$('.page_template').append(sort_tools);
			*/
		}
		
		function hide_page_templates(){

			$('.page_template').each(function(index) {
				// I hide the X for eliminating the page_template
				$(this).find(' tr:first').remove();

				// remove the sortbar
				$(this).find(' tr:last').remove();
			});

			return;
		}

		function duplicated_text_ fix(){

			// start from the first
			$('#content-text div[id*="_header_"]:first').each(function() {

				// first
				var element = $(this);
	
				// any other element
				// I check is unique compared to her children!
				//while(element.next().is('*')){
					while(element.next().is('*')){
					//alert("content iniziale: " + element.html());

					element.html(uniqChildren(element));

					//alert("content finale: " + $(this).html());

					element = element.next();
				}
			});

			return $('#content-text').html();
		}

		function uniqChildren(element){

			var c = new Array();
			var res;

			c.push(element.attr('id'));

			element.find('[id*="_header_"]').each(function() {

				// if there is
				if($.inArray($(this).attr('id'), c) > -1){
					//alert('duplicato: ' + $(this).attr('id'));
					//alert($(this).html());
					$(this).parent().html($(this).html());
					$(this).remove();
					//alert($(this).html());
					//$(this).css('border-left','20px solid blue');
				}else{
					//alert('originale: ' + $(this).attr('id'));
					c.push($(this).attr('id'));
					//$(this).css('color','black');
				}
				
				res = $(this).html();
			});
//alert(res);
			return res;
		}

		// I write in textarea
		//$('form[name="form"] textarea').html('<div style="background:red">Mauro</div>');

		//$('mceContentBody iframe').contents().append('<div style="background:red">Mauro</div>');

		/*
		 *	Add the extremes
		 */
		//$('#content-text').append('<div class="bottom-stripe"></div>');
		//$('#content-text').prepend('<div id=".box_page_template"></div>');
		/*
		$('#bottom-stripe').live("hover", function(){
			
			$('#bottom-stripe').css('height','100');
			$('#bottom-stripe').css('background','#EEE');
		});
		*/

/*
		$(".no_page_template").sortable({
			placeholder: "ui-state-highlight";
		});
		$(".no_page_template").disableSelection();
*/
	});
</script>