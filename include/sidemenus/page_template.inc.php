<?php
/************************************************************************/
/* AContent                                                             */
/************************************************************************/
/* Copyright (c) 2010                                                   */
/* Inclusive Design Institute                                           */
/*                                                                      */
/* This program is free software. You can redistribute it and/or        */
/* modify it under the terms of the GNU General Public License          */
/* as published by the Free Software Foundation.                        */
/************************************************************************/

if (!defined('TR_INCLUDE_PATH')) { exit; }
require_once(TR_INCLUDE_PATH.'vitals.inc.php');
require_once(TR_INCLUDE_PATH.'classes/DAO/ContentDAO.class.php');
require_once(TR_INCLUDE_PATH.'classes/DAO/PrivilegesDAO.class.php');
require_once(TR_INCLUDE_PATH.'classes/DAO/CoursesDAO.class.php');
require_once(TR_INCLUDE_PATH.'../home/classes/StructureManager.class.php');

global $savant;

$contentDAO		= new ContentDAO();
$privilegesDAO	= new PrivilegesDAO();
//$coursesDAO = new CoursesDAO();
$output = '';

?>

<?php

######################################
#	Variables declarations / definitions
######################################

global $_course_id, $_content_id;

$_course_id		= $course_id = (isset($_REQUEST['course_id']) ? intval($_REQUEST['course_id']) : $_course_id);
$_content_id	= $cid = isset($_REQUEST['cid']) ? intval($_REQUEST['cid']) : $_content_id; /* content id of an optional chapter */

// paths settings

$mod_path					= array();
$mod_path['dnd_themod']		= realpath(TR_BASE_HREF			. 'dnd_themod').'/';
$mod_path['dnd_themod_int']	= realpath(TR_INCLUDE_PATH		. '../dnd_themod').'/';
$mod_path['dnd_themod_sys']	= $mod_path['dnd_themod_int']	. 'system/';
$mod_path['page_template_dir']		= $mod_path['dnd_themod']		. 'page_template/';
$mod_path['page_template_dir_int']	= $mod_path['dnd_themod_int']	. 'page_template/';

// I include the file immediately "applicaTema" ¬ thing that can inherit variables and constants defined by the system
include_once($mod_path['dnd_themod_sys'].'page_template.class.php');

// Instantiate class layout (which calls the constructor) 
$mod		= new page_template($mod_path);

// I include the necessary classes
//require_once($mod_path['dnd_themod_int'].'system/applicaTema.inc.php');

$user_priv	= $privilegesDAO->getUserPrivileges($_SESSION['user_id']);
$is_author	= $user_priv[1]['is_author'];

// I take the list of valid themes available

$list_page_template = array();

if($_content_id != "" && $_course_id != "") {
	
	//$course = $coursesDAO->get($_course_id);
	$content = $contentDAO->get($_content_id);
	
	if($content['structure']!='') {
		$structManager = new StructureManager($content['structure']);
		$array = $structManager->getContent($content['title']);
		$list_page_template = $mod->page_template_complies($array);
			
	}  else {
		$list_page_template = $mod->get_list_page_template();
	}

}




	
//}
// I call the function that creates the graphics module theme selection
//$list_page_templates
$resArray		= $mod->createUI();

// array contenente il contenuto corrente (testo, eader, bit che indica che l'header Ã¨ incluso)
//$content	= getContent(DAO, $cid);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// percorso del modulo
$dnd_themod		= TR_BASE_HREF.'dnd_themod/';
$dnd_themod_int	= TR_INCLUDE_PATH.'../dnd_themod/';

// path containing the list of topics
$page_template_dir		= $dnd_themod.'page_template/';
$page_template_dir_int	= $dnd_themod_int.'page_template/';

// directory and file systems to be excluded from the list of topics presented
$except	= array('.', '..', '.DS_Store', 'desktop.ini', 'Thumbs.db');

// id content
$cid	= $this->cid;
// se non presente, prendo il _cid (id del contenuto in fase di modifica)
if($cid == '' AND isset($_GET['_cid']) AND $_GET['_cid'] != '')
	$cid = htmlentities($_GET['_cid']);


######################################
#	JQuery script MODULE
######################################
//include $mod_path['dnd_themod_sys'].'page_template.js';
include $mod_path['dnd_themod_sys'].'page_template.js';
######################################
#	I return the OUTPUT
######################################

// restituisco l'output
$output		= $resArray;

$savant->assign('title', _AT('page_template'));

$savant->assign('dropdown_contents', $output);
//$savant->assign('default_status', "hide");

$savant->display('include/box.tmpl.php');
/*
echo '<div style="position:absolute; background:white"></pre>';
	var_dump($_SESSION);
echo '</pre></div>';
*/
?>
