<?php
/************************************************************************/
/* AContent                                                             */
/************************************************************************/
/* Copyright (c) 2011                                                   */
/* Inclusive Design Institute                                           */
/*                                                                      */
/* This program is free software. You can redistribute it and/or        */
/* modify it under the terms of the GNU General Public License          */
/* as published by the Free Software Foundation.                        */
/************************************************************************/

if (!defined('TR_INCLUDE_PATH')) { exit; }
require_once(TR_INCLUDE_PATH.'vitals.inc.php');
require_once(TR_INCLUDE_PATH.'classes/DAO/ContentDAO.class.php');

global $savant;

$contentDAO = new ContentDAO();
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
$mod_path['layout_dir']		= $mod_path['dnd_themod']		. 'layout/';
$mod_path['layout_dir_int']	= $mod_path['dnd_themod_int']	. 'layout/';

// includo immediatamente il file "applicaTema" così che possa ereditare variabili e costanti definite dal sistema
include_once($mod_path['dnd_themod_sys'].'layout.class.php');

// istanzio la classe layout (che chiama il costruttore) 
$the		= new layout($mod_path);

// includo le classi necessarie
//require_once($mod_path['dnd_themod_int'].'system/applicaTema.inc.php');

// prendo la lista dei temi disponibili validi
$listaTemi	= $the->getListaTemi();

// chiamo la funzione che crea il modulo grafico di selezione del tema
$resArray	= $the->createUI($listaTemi);

// array contenente il contenuto corrente (testo, eader, bit che indica che l'header è incluso)
$content	= getContent($contentDAO, $cid);

######################################
#	SCRIPT JQUERY DEL MODULO
######################################

// le seguenti "conversioni" da array a variabile sono necessarie a risolvere problemi di compatibilita fra JS e PHP
$textContent	= $content['text'];
$textContent	= htmlentities($textContent);
$textContent	= str_replace("\r\n","", $textContent);

$headContent	= $content['head'];
$headContent	= str_replace("\r\n","", $headContent);

$formatContent	= $content['formatting'];

$course_id		= $content['course_id'];

$content_layout	= $content['layout'];



$dnd_themod		= TR_BASE_HREF.'dnd_themod/';
$dnd_themod_int	= $mod_path['dnd_themod_int'];
$dnd_themod_sys	= $mod_path['dnd_themod_sys'];
// percorso contenente la lista dei temi
$layout_dir		= $dnd_themod.'layout/';
$layout_dir_int	= $dnd_themod_int.'layout/';

$config					= parse_ini_file($mod_path['dnd_themod_sys'].'config.ini');
$apply_lesson_layout		= $config['apply_to_the_lesson'];

include $mod_path['dnd_themod_sys'].'layout.js';

######################################
#	RESTITUISCO L'OUTPUT
######################################

// restituisco l'output
$output		= $resArray;

if ($output == '') {
	$output = _AT('none_found');
}

// titolo del blocco laterale
// se non esiste traduzione nella lingua scelta, uso quella di default (ita)

$savant->assign('title', _AT('layout'));

// contenuto

$savant->assign('dropdown_contents', $output);
//$savant->assign('default_status', "hide");

$savant->display('include/box.tmpl.php');

######################################
#	FUNZIONI PHP
######################################

/*
 * Prendo da subito i valori del contenuto attuale
 * $text		: deve essere manipolato e utilizzato nell'anteprima
 * $head 		: nel caso in cui il tema debba essere sovrascritto, tale operazione viene fatta in JQuery
 * $formatting	: necessario per sapere come visualizzare l'anteprima (Plain Text, HTML, Web Link)
 */

function getContent($contentDAO, $cid){

	if(isset($cid)){
		$db =  $contentDAO->get($cid);
		
		$content['text']				= $db['text'];
		$content['head']				= $db['head'];
		$content['formatting']			= $db['formatting'];
		$content['course_id']			= $db['course_id'];
		$content['layout']				= $db['layout'];
		
		return $content;
	}else
		return '';
}

?>
