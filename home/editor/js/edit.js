/************************************************************************/
/* Transformable                                                        */
/************************************************************************/
/* Copyright (c) 2009                                                   */
/* Adaptive Technology Resource Centre / University of Toronto          */
/*                                                                      */
/* This program is free software. You can redistribute it and/or        */
/* modify it under the terms of the GNU General Public License          */
/* as published by the Free Software Foundation.                        */
/************************************************************************/

/*global jQuery*/
/*global trans */
/*global tinyMCE */
/*global window */

trans = trans || {};
trans.editor = trans.editor || {};

(function () {
    var hiddenClass = "hidden";
    var enabledClass = "clickable";
    
    var hideIt = function (theElement, hiddenElement) {
        theElement.addClass(hiddenClass);
        hiddenElement.val("0");
    };

    var showIt = function (theElement, hiddenElement) {
        theElement.removeClass(hiddenClass);
        hiddenElement.val("1");
    };

    //hides or shows tool (toggle) and sets hidden input value appropriately.
    var doToggle = function (theElement, hiddenElement) {
        if (theElement.hasClass(hiddenClass)) {
            showIt(theElement, hiddenElement);
        } else {
            hideIt(theElement, hiddenElement);
        }
    };

    //click function to launch accessibility validation window
    var launchAChecker = function () {
    	var theCode = '<html><body onLoad="document.accessform.submit();"> \n';
		theCode += '<h1>'+trans.editor.processing_text+' .....</h1>\n';
		theCode += '<form action="'+trans.base_href+'home/editor/accessibility.php?popup=1" name="accessform" method="post"> \n';
		theCode += '<input type="hidden" name="_cid" value="'+jQuery("input[name=\_cid]").val()+'" /> \n';
       	theCode += '<textarea name="body_text" style="display:none">' + tinyMCE.activeEditor.getContent() + '</textarea>\n';
		theCode += '<input type="submit" style="display:none" /></form> \n';  
		theCode += '</body></html> \n';
		accessWin = window.open('', 'accessibilityWin',  'menubar=0,scrollbars=1,resizable=1,width=600,height=600');
		accessWin.document.writeln(theCode);
		accessWin.document.close();
    	return false;
    };

    //AChecker variables
    var accessibilityTool = {
            toolId: "#accessibilitytool",
            enabledClass: enabledClass,
            enabledImage: "images/achecker.png",
            clickFunction: function () {
                launchAChecker();
            },
            disabledImage: "images/achecker_disabled.png"
        };

    //customized head variables
    var headId = "#head";
    var displayheadId = "#displayhead";
    var headTool = {
            toolId: "#headtool",
            enabledClass: enabledClass,
            enabledImage: "images/custom_head.png",
            clickFunction: function () {
                doToggle(jQuery(headId), jQuery(displayheadId));
            },
            disabledImage: "images/custom_head_disabled.png"
        };

    //paste from file variables
    var pasteId = "#paste";
    var displaypasteId = "#displaypaste";
    var pasteTool = {
            toolId: "#pastetool",
            enabledClass: enabledClass,
            enabledImage: "images/paste.png",
            clickFunction: function () {
                doToggle(jQuery(pasteId), jQuery(displaypasteId));
            },
            disabledImage: "images/paste_disabled.png"
        };

    //click function to launch file manager window
    var launchFileManager = function () {
        window.open(trans.base_href + 'file_manager/index.php?framed=1&popup=1&cp=' + trans.editor.content_path + '&_course_id=' + trans.editor.course_id, 'newWin1', 'menubar=0,scrollbars=1,resizable=1,width=640,height=490');
        return false;
    };

    //file manager variables
    var filemanTool = {
            toolId: "#filemantool",
            enabledClass: enabledClass,
            enabledImage: "images/file-manager.png",
            clickFunction: function () {
                launchFileManager();
            },
            disabledImage: "images/file-manager_disabled.png"
        };
    
    //checks hidden variable and shows/hides element accordingly
    var setDisplay = function (theElement, hiddenElement) {
        if (hiddenElement.val() === '0') {
            theElement.addClass(hiddenClass);
        } else {
            theElement.removeClass(hiddenClass);
        }
    };

    var disableTool = function (theTool) {
        var theToolElement = jQuery(theTool.toolId);
        theToolElement.removeClass(theTool.enabledClass);
        theToolElement.attr("src", trans.base_href + theTool.disabledImage);
        theToolElement.attr("title", theTool.disabledTitle);
        theToolElement.attr("alt", theTool.disabledTitle);
        theToolElement.unbind("click");
    };
    
    var enableTool = function (theTool) {
        var theToolElement = jQuery(theTool.toolId);
        theToolElement.addClass(theTool.enabledClass);
        theToolElement.attr("src", trans.base_href + theTool.enabledImage);
        theToolElement.attr("title", theTool.enabledTitle);
        theToolElement.attr("alt", theTool.enabledTitle);
        theToolElement.click(theTool.clickFunction);
    };	

    //initialises values to show or hide them
    var setupPage = function () {
        var head = jQuery(headId);
        var displayhead = jQuery(displayheadId);
        var paste = jQuery(pasteId);
        var displaypaste = jQuery(displaypasteId);
        var textArea = jQuery("#textSpan");
        var weblink = jQuery("#weblinkSpan");
        var textAreaId = "body_text";
        if (jQuery("#weblink").attr("checked")) {
            disableTool(accessibilityTool);
            disableTool(headTool);
            disableTool(pasteTool);
            disableTool(filemanTool);
            
            hideIt(head, displayhead);
            hideIt(paste, displaypaste);
            if (tinyMCE.get(textAreaId)) {
            	tinyMCE.execCommand('mceRemoveControl', false, textAreaId);
            }
            textArea.hide();
            weblink.show();
        } else if (jQuery("#html").attr("checked")) {
            enableTool(accessibilityTool);
            enableTool(headTool);
            enableTool(pasteTool);
            enableTool(filemanTool);
            
            setDisplay(head, displayhead);
            setDisplay(paste, displaypaste);
            if (trans.editor.editor_pref !== '1' && !tinyMCE.get(textAreaId)) {
           		tinyMCE.execCommand('mceAddControl', false, textAreaId);
            }
            weblink.hide();
            textArea.show();
        } else {
            disableTool(accessibilityTool);
            disableTool(headTool);
            enableTool(pasteTool);
            enableTool(filemanTool);
            
            hideIt(head, displayhead);
            setDisplay(paste, displaypaste);
            weblink.hide();
            if (tinyMCE.get(textAreaId)) {
            	tinyMCE.execCommand('mceRemoveControl', false, textAreaId);
            }
            textArea.show();
        }	
    };
    
    
    var forumTool = function () {
    	
    	var theCode = '<html><body onLoad="document.accessform.submit();"> \n';
		theCode += '<form action="'+trans.base_href+'home/editor/forums_tool.php?popup=1" name="accessform" method="post"> \n';
		theCode += '<input type="hidden" name="_cid" value="'+jQuery("input[name=\_cid]").val()+'" /> \n';
       	theCode += '<textarea name="body_text" style="display:none">' + tinyMCE.activeEditor.getContent() + '</textarea>\n';
		theCode += '<input type="submit" style="display:none" /></form> \n';  
		theCode += '</body></html> \n';
		accessWin = window.open('', 'accessibilityWin',  'menubar=0,scrollbars=1,resizable=1,width=600,height=600');
		accessWin.document.writeln(theCode);
		accessWin.document.close();
    	return false;
    	
    	
    	
    };

    //click function to launch preview window
    var previewTool = function () {
		var theCode = '<html><body onLoad="document.accessform.submit();"> \n';
		theCode += '<h1>'+trans.editor.processing_text+' .....</h1>\n';
		theCode += '<form action="'+trans.base_href+'home/editor/preview.php?popup=1" name="accessform" method="post"> \n';
		theCode += '<input type="hidden" name="title" value="'+jQuery("input[name=title]").val()+'" /> \n';
		theCode += '<input type="hidden" name="_cid" value="'+jQuery("input[name=\_cid]").val()+'" /> \n';
		theCode += '<input type="hidden" name="formatting" value="'+jQuery("#formatting_radios input:radio:checked").val()+'" /> \n';
        if (jQuery("#weblink").attr("checked")) {
    		theCode += '<input type="hidden" name="weblink_text" value="'+jQuery("#weblink_text").val()+'" /> \n';
        } else if (jQuery("#html").attr("checked")) {
        	theCode += '<textarea name="body_text" style="display:none">' + tinyMCE.activeEditor.getContent() + '</textarea>\n';
        } else {
        	theCode += '<textarea name="body_text" style="display:none">' + jQuery("#body_text").val() + '</textarea>\n';
        }
		theCode += '<input type="submit" style="display:none" /></form> \n';  
		theCode += '</body></html> \n';
		accessWin = window.open('', 'previewWin',  'menubar=0,scrollbars=1,resizable=1,width=600,height=600');
		accessWin.document.writeln(theCode);
		accessWin.document.close();
    	return false;
    };

    //click function to launch tool window
    var launchTool = function () {
        window.open(trans.base_href + 'home/tool_manager/index.php?framed=1&popup=1&tool_file=' + trans.editor.tool_file + '&_cid=' + trans.editor.content_id, 'newWin2', 'menubar=0,scrollbars=1,resizable=1,width=600,height=400');
        return false;
    };

    //set up click handlers and show/hide appropriate tools via setupPage
    var initialize = function () {
        jQuery("#previewtool").click(previewTool);
        
        //catia
        jQuery("#forumtool").click(forumTool);
        
        jQuery(".tool").click(launchTool);
        jQuery("#formatting_radios > input").click(setupPage);
        headTool.disabledTitle = trans.editor.head_disabled_title;
        pasteTool.enabledTitle = trans.editor.paste_enabled_title;
        pasteTool.disabledTitle = trans.editor.paste_disabled_title;
        filemanTool.enabledTitle = trans.editor.fileman_enabled_title;
        filemanTool.disabledTitle = trans.editor.fileman_disabled_title;
        accessibilityTool.enabledTitle = trans.editor.accessibility_enabled_title;
        accessibilityTool.disabledTitle = trans.editor.accessibility_disabled_title;
        setupPage();
    };
    
    jQuery(document).ready(initialize);
})();