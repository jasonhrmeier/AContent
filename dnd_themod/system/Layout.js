<script type="text/javascript">

	// I apply my own style sheet to format dnd_themod
	$('head').append('<link rel="stylesheet" href="<?php echo $dnd_themod; ?>system/dnd_themod.css" type="text/css" />');
	
	
	
	// if the current content has a layout, I apply
	if("<?php echo $content_layout; ?>" != ''){
		current_layout	= "<?php echo $layout_dir.$content_layout.'/'.$content_layout.'.css'; ?>";
		$('head').append('<link rel="stylesheet" href="' + current_layout + '" type="text/css" />');
	}


	var DEFAULT_SCREENSHOT	= '<?php echo $dnd_themod; ?>system/noLayout.png';
	// I create a unique value to be assigned as a general class
	// do not change (fixed for "Page_templates" too)
	//var uniq		= 'dnd';
	var uniq		= 'content-text';
	// create any footer
	//var footer	= "<div id=\"anteprima-footer\"> </div>";
	var footer	= "";


	$(document).ready(function() {

		// this line allows us to display the form and only if JS 'enabled
		// the switch depends on the module name (which, in the language file, and 'customizable)
		var titolo_modulo	= "<?php echo _AT('layout'); ?>";
		titolo_modulo		= titolo_modulo.replace(/ /g, '');
		
		// if the user and 'an author authenticated
		// show the form
		if("<?php echo $is_author; ?>" == 1 && "<?php echo basename($_SERVER['PHP_SELF']); ?>" == "content.php"){
			$('#menu_' + titolo_modulo + ' form').show();
		}else{
			$('#menu_' + titolo_modulo).hide();
			//$('#menu_' + titolo_modulo).prev().hide();
			//$('#menu_' + titolo_modulo).siblings('br').slice(-1).remove();
		}


		var url		= "dnd_themod/system/AJAX_actions.php";


		// HIDE / SHOW "APPLY TO THE LESSON" BUTTON
		// ADMIN SECTION
		
		$("#apply_lesson_on").live("click", function() {
			// show the button
			$("#applicaTemaLezione_btn").show();


			$.post(url, { dnd_request: "759e647ad85438ed2669dbabfb77a602"}, function(data) {
			});
		});
		$("#apply_lesson_off").live("click", function() {
			// hide the button
			$("#applicaTemaLezione_btn").hide();

			$.post(url, { dnd_request: "c1388816ccd2cc64905595c526ca678b"}, function(data) {
			});
		});
		

		// SYSTEM OPTION

		var path	= "<?php echo htmlentities($_SERVER['PHP_SELF']); ?>";

		// show the form...
		if(path.indexOf('/system/') >= 0){
			
			var disabled	= '';
			var enabled		= '';

			if("<?php echo $apply_lesson_layout; ?>" == 0){
				disabled	= "checked=\"checked\"";
			}else
				enabled		= "checked=\"checked\"";

			$(".form-data tr:last").before("<tr><td colspan=\"2\"><fieldset class=\"dnd_themod_system_fieldset\"><legend><?php echo _AT('layout'); ?></legend>\
										<table><tr>\
										<td align=\"left\"><?php echo _AT('layout_lesson_apply'); ?></td>\
										<td align=\"left\">\
											<input type=\"radio\" name=\"apply_lesson\" id=\"apply_lesson_off\" " + disabled + " />\
											<label for=\"apply_lesson_on\"><?php echo _AT('disabled'); ?></label> \
											<input type=\"radio\" name=\"apply_lesson\" id=\"apply_lesson_on\" " + enabled + " />\
											<label for=\"apply_lesson_off\"><?php echo _AT('enabled'); ?></label>\
										</td>\
										</tr></table>\
									</fieldset></tr>");
		}
		
		/*
		 *exaggeration
			* TinyMCE is not accurate with carriage return, then, I try to repair
			* To display differences between TinyMCE and preview AContent.
			*
			* IN THIS CASE I correct ONLY THE DISPLAY OF THE CONTENT SAVED
			* TO BE DISPLAYED TinyMCE is ACONTENT
		*/
		if ($('#content-text').is('*')){
			text	= $('#content-text').html();

			text	= textFixJS(text);
			
			$('#content-text').html(text);
		}
		
		// imposed on the screenshot for the default layout
		$('#layoutScreenshot').attr('src',DEFAULT_SCREENSHOT);
		
		
		/*
		* Management of the preview of the layouts
		* Visualize the layout chosen during editing or preview of the content
		* I reset the layout and carry you to the main layout
		*/

		$('#listatemi').change(function() {

			str = $(this).val();

			// remove the previous layout

			$('#dnd_themod_layout').remove();
			$('#dnd_themod_view').remove();
			/////////////////////////////
			
			// I clean the thumbnail previews of who join not to leave
			// $ ("# view"). remove ();
			$('#content-text').removeClass('view');

			//*****************************************************************
			//$('#content-text').attr('name', uniq);

/*
			// if the current content has a layout, the disable (delete it)
			if("<?php echo $content_layout; ?>" != ''){
				current_layout	= "<?php echo $layouts_dir.$content_layout.'/'.$content_layout.'.css'; ?>";
				$('head link').each(function(link) {
					if($(this).attr('href') == current_layout)
						$(this).attr('href', 'ViewMode');
				});
			}
			*/

			switch(str){

				// I remove the tag "LINKS" on the layout applied
				case '-':

					// if the current content has a layout, the disable (delete it)
					if("<?php echo $content_layout; ?>" != ''){
						current_layout	= "<?php echo $layout_dir.$content_layout.'/'.$content_layout.'.css'; ?>";
						$('head link').each(function(link) {
							if($(this).attr('href') == 'ViewMode')
								$(this).attr('href', current_layout);
						});
					}

					// imposed on the screenshot
					$('#layoutScreenshot').attr('src', DEFAULT_SCREENSHOT);

					// remove the previous layout...
					$('#dnd_themod_layout').remove();
					$('#dnd_themod_view').remove();

					// hide the preview
					//$("#view").hide();
					$('#content-text').removeClass('view');

					// hide the preview in the editing phase or during the preview of the content
					if ($('form[name="form"]').is('*'))
						main = $('form[name="form"]');
					else if ($('#content-text').is('*'))
						main = $('#content-text');
					else
						main = null;

					if(main != null){

						main.show();
					}

					break;

				default:

					// if the current content has a layout, the disable (delete it)
					if("<?php echo $content_layout; ?>" != ''){
						current_layout	= "<?php echo $layout_dir.$content_layout.'/'.$content_layout.'.css'; ?>";
						$('head link').each(function(link) {
							if($(this).attr('href') == current_layout)
								$(this).attr('href', 'ViewMode');
						});
						
						//alert('rimosso tema ' + current_layout);
					}

					// imposed on the screenshot, IF THERE
					percorso_screenshot = '<?php echo $layout_dir; ?>' + str;
					immagine			= percorso_screenshot + '/screenshot.png';

					$.ajax({
						//control if there
					    url:	immagine,
					    esiste: false,
					    type:	'HEAD',
					    error:
					        function(){
					        	$('#layoutScreenshot').attr('src', DEFAULT_SCREENSHOT);
								return;
					        },
					    success:
					        function(){
					            $('#layoutScreenshot').attr('src', immagine);
					            return;
							}
					});

					// If the layout is not already applied, apply it
					//if(!esiste){ //esiste means there in english
						
						// I include the CSS resets the default settings
						$('head').append('<link rel="stylesheet" href="<?php echo $dnd_themod; ?>system/layout.css" type="text/css" id="dnd_themod_layout" />');

						// I include the desired CSS
						$('head').append('<link rel="stylesheet" href="<?php echo $layout_dir; ?>' + str + '/' + str + '.css" type="text/css" id="dnd_themod_view" />');
						var c = '<div id="content">' + $('#content-text').html() + '</div>';
						$('#content-text').html(c);

						// I can see the preview in the editing phase or during the preview of the content
						// To make this distinction I have to check the existence of the FORM name = "form" or ID # content-text (during the preview of the content)

						//preview during editing
						if ($('form[name="form"]').is('*')){
							// prendo il contenuto
							text = $('#body_text').text();

							// I hide the contents of the current page
							main = $('form[name="form"]');
						}
						// premiere during the preview of the content
						else if ($('#content-text').is('*')){

							// I take the content
							text = $('#content-text').html();

							// I hide the contents of the current page
							main = $('#content-text');
						}else
							main = null;

						if(main != null){

							var formatType = '<?php echo $formatContent; ?>';

							//if the text is displayed in Plain Text
							// The preview will have to meet the demand for display
							// For HTML and the Web links there are problems
							if(formatType == 0)
								text = jQuery(text).text();
							else{
								// clean text for preview (TinyMCE has problems with the carriage return)
								//text	= jQuery(text).text();
								text	= textFixJS(text);
							}

							//main.after('<div id="view"><div id="' + uniq + '">' + text + '</div>');
							//main.after('<div id="view">' + text);
							$('#content-text').addClass('view');
							
							//main.hide();

							// I show the preview page
							//$("#view").show();
						//}

					} // IF -> if the issue is not already applied, apply it
			} // switch
		});
		
			/** exaggeration
			* TinyMCE is not accurate with carriage return, then, I try to repair
			* To display differences between TinyMCE and preview AContent.
			* Text = text to be cleaned
		*/
		function textFixJS(text){
			text	= text.replace(/<p>&nbsp;<\/p>/g, "<br />");
			text	= text.replace(/<p><\/p>/g, "<br />");
			text	= text.replace(/<br>/g, "<br />");
			text	= text.replace(/<p>/g, "<div>");
			text	= text.replace(/<\/p>/g, "</div>");

			return text;
		}
		
	});

</script>