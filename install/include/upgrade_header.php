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

error_reporting(E_ALL ^ E_NOTICE);

if ($step < 5) {
	error_reporting(0);
	include('../include/config.inc.php');
	error_reporting(E_ALL ^ E_NOTICE);
	if (defined('TR_INSTALL')) {
		include_once(TR_INCLUDE_PATH.'common.inc.php');
		echo print_meta_redirect();
		exit;
	}
}

$new_version = $new_version ? $new_version : $_POST['step1']['new_version'];

$install_steps[0] = array('name' => 'Introduction');
$install_steps[1] = array('name' => 'Locate Old Version');
$install_steps[2] = array('name' => 'Database');
$install_steps[3] = array('name' => 'New '.$new_version.' Configuration Options');
$install_steps[4] = array('name' => 'Content Directory');
$install_steps[5] = array('name' => 'Content Files');
$install_steps[6] = array('name' => 'Save Configuration');
$install_steps[7] = array('name' => 'Anonymous Usage Collection');
$install_steps[8] = array('name' => 'Done!');


?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8"> 
<head>
<title>AContent Upgrade</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" href="stylesheet.css" type="text/css" />
</head>

<body>
<div style="height: 70px; vertical-align: bottom; background: #354A81">
	<h1 id="header">AContent <?php echo $new_version; ?> Upgrade</h1>
	<img src="../images/AC_Logo1_sm.png" height="29" width="84" alt="AContent Logo" id="logo" />
</div>
<div style="clear: all"></div>
<div class="content">