<?php

	class Layout{


		/*			
		 * Update an existing course record
		 * @access  public
		 * @param   courseID: course ID
		 *          fieldName: the name of the table field to update
		 *          fieldValue: the value to update
		 * @return  true if successful
		 *          error message array if failed; false if update db failed
		 * @author  Mauro Donadio
		 */

		/*
		 * Variables declarations / definitions
		 * 
		 * */

		private $mod_path	= array();
		private $config		= array();
		private $content_id	= '';
		private $course_id	= '';
		private $uniq		= 'dnd';

		// folders and documents to be excluded from the list of topics presented
		private $except		= array('.', '..', '.DS_Store', 'desktop.ini', 'Thumbs.db');



		/**
		 * Constructor: sets the main variables used (paths, ..)
		 * @access  public
		 * @param   mod_path: associative array containing the paths list
		 * @return  none
		 * @author  Mauro Donadio
		 */

		public function __construct($mod_path){

			global $_course_id, $_content_id;

			/* content id of an optional chapter */
			$this->content_id	= (isset($_REQUEST['cid']) ? intval($_REQUEST['cid']) : $_content_id);
			$this->course_id	= (isset($_REQUEST['course_id']) ? intval($_REQUEST['course_id']) : $_course_id);

			//
			if(isset($_POST['listatemi'], $_POST['applicaTemaCorso_btn']))
				$this->applicaTemaCorso();
			elseif(isset($_POST['listatemi'], $_POST['applicaTemaLezione_btn']))
				$this->applicaTemaLezione();

			$this->mod_path		= $mod_path;

			if($this->mod_path != '')
				$this->config		= parse_ini_file($this->mod_path['syspath'].'config.ini');

			return;
		}

		/*
		 * Open the configuration file reading the parameters
		 * input:	none
		 * output:	none
		 * 
		 * */

		public function getConfig(){
			return $this->config;
		}

		/*
		 * Read loaded layout creating a list of available layout
		 * input:	none
		 * output:	none
		 * 
		 * */

		public function getListaTemi(){

			$listaTemi	= array();
			$dir		= array();

			// I read the list of available layout
			$dir		= scandir($this->mod_path['layout_dir_int']);

			// subtract the files to be excluded from the list of available layout
			$dir		= array_diff($dir, $this->except);

			// I call the function that validates layout available
			$listaTemi	= $this->temaConforme($dir);

			return $listaTemi;
		}

		/*
		 * The following function reads from the file system of the existing layout and validates them
		* According to preset criteria (eg confrontation between versions of the layout and core)
		* Returning an array of layout available and valid.
		* Input: $ dir [] list of available layout
		* Output: list of available layout compatiblità skimmed according to each layout
		 * 
		 * */
		
		private function temaConforme($dir = array()){
			
			// scan all existing layout
		
			foreach($dir as $item){
			
				$isdir	= $this->mod_path['layout_dir_int'].$item;
			
				// control that the element is a directory
				if(is_dir($isdir)){
			
					// check the file exists. info and parse
					$isfile	= $isdir.'/layout.info';
			
					if(is_file($isfile)){

						$info	= parse_ini_file($isdir.'/layout.info');
		
						// If you have not specified a name, use the folder name
						if(!$info['name'])
							$info['name'] = $item;

						// control the "core"
						if(!$info['core'])
							continue;
						else{

							$vfile	= explode('.', $info['core']);
							$vcore	= explode('.', VERSION);
			
							// control surface for the version compatibility
							// Blocking the cycle at the first incompatibilities found
							if($vfile[0] < $vcore[0])
								// non compatible
								continue;
							elseif(strtolower($vfile[1]) != 'x' AND $vfile[1] < $vcore[1])
								// non compatible
								continue;
						}
		
						// I put the info of the current layout into a vector
						$temi[$item] = $info;
					}
				}
			}
		
			return $temi;
		}


		/*
		 * 	The following function provides for the generation of a form to show
		* Graphical user the list of layout available.
		* The form is returned by the function and then integrated
		* Output of this module.
		* Input: $ listaTemi[] list of available layout occurred
		* Output: none
		 * */

		public function createUI($listaTemi){

			$ui		= '';
		
			//$ui		.= '<form action="" id="dnd_themod" onsubmit="return false" method="post" style="display: none">';
			$ui		.= '<form action="'.$_SERVER['REQUEST_URI'].'" id="dnd_themod" method="post" style="display: none">';
		
			// select
		
			$ui		.= '<label for="listatemi">'._AT('layout_select').'</label>';
			$ui		.= '<select name="listatemi" id="listatemi">';
		
			// opzione di default (null)
			$ui		.= '<option selected="selected">';
			$ui		.= ' - ';
			$ui		.= '</option>';
			
			// I post all the layout from the options available
			foreach($listaTemi as $tname => $tval){
		
				$ui	.= '<option value="'.$tname.'">';
					$ui	.= $tval['name'];
				$ui	.= '</option>';
			
			}
			
			$ui		.= '</select>';
			
			// fine select
			
			$ui		.= '<div>';
		
			$ui		.= '<div><img src="" alt="Screenshot" desc="Screenshot" title="Screenshot" id="layoutScreenshot" /></div>';
		
			$ui		.= '<div><input type="submit" value="'._AT('layout_course_apply').'" id="applicaTemaCorso_btn" name="applicaTemaCorso_btn" /></div>';

			// I add this option only if you set
			if($this->config['apply_to_the_lesson'] == 0)
				$display = 'display:none';

			$ui		.= '<div><input type="submit" style="'.$display.'" value="'._AT('layout_lesson_apply').'" id="applicaTemaLezione_btn" name="applicaTemaLezione_btn" /></div>';
		
			$ui		.= '</div>';
			
			$ui		.= '</form>';
			
			$ui		.= '<noscript><div>'._AT('no_js').'</div></noscript>';
		
			return $ui;
		}


		/*
		 *
		 */

		private function applicaTemaCorso(){

			define("TR_INCLUDE_PATH", "../../include/");

			require_once(TR_INCLUDE_PATH.'vitals.inc.php');
			require_once(TR_INCLUDE_PATH.'classes/DAO/ContentDAO.class.php');

			$tema_selezionato	= (isset($_POST['listatemi']) ? htmlentities($_POST['listatemi']) : '-');

			// layout reset
			if($tema_selezionato == '-'){
				$layout_name		= '';
			}else{
				// new layout
				$layout_name		= $tema_selezionato;
			}


			$contentDAO = new ContentDAO();

			$lezioni	= $contentDAO->getContentByCourseID($this->course_id);

			// for each lesson with that code of course, imposed / override the style of the lessons (Italian)
			//for each lesson with that code of course, imposed / override the style of the lessons

			for($i = 0; $i < count($lezioni); $i++){

				$cid		= $lezioni[$i]['content_id'];
				$text		= $this->textFixPHP($lezioni[$i]['text']);

				if(strstr($text, '<div id="content">')){
					$text = str_replace('<div id="content">','',$text, $count);
				}
	
				$text = strrev($text);
	
				for($j=0; $j<$count; $j++)
					$text = str_replace('>vid/<','',$text);
				
				$text = strrev($text);
	
				$text		= '<div id="content">'.$text.'</div>';
				/*
				echo '<div style="position:absolute">';
				echo '--> '.var_dump($text);
				echo '</div><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />';
				*/
					
				// I clear the text from the <div id = "dnd" and add:
				// Does not 'say that lessons have all the tags, so I take it all and riaggiungo (more' safe even if the most 'expensive)
	
				// I clear the text from the tag
				$text		= $this->clearContent($text);

				// I add
				/*
				if($layout_name != ''){
					$text		= '<div id="'.$this->uniq.'">'.$text.'<div id="anteprima-footer"> </div></div>';
				}*/
	
				// scrivo sul db
				$contentDAO->UpdateField($cid, 'text', $text);
				$contentDAO->UpdateField($cid, 'layout', $layout_name);
			}
			
			//die();

			// page redirect
			echo '<script type="text/javascript">';
				echo 'window.location = "'.$_SERVER['REQUEST_URI'].'";';
			echo '</script>';

		}

		/*
		 * 
		 */

		private function applicaTemaLezione(){

			define("TR_INCLUDE_PATH", "../../include/");

			require_once(TR_INCLUDE_PATH.'vitals.inc.php');
			require_once(TR_INCLUDE_PATH.'classes/DAO/ContentDAO.class.php');

			$tema_selezionato	= (isset($_POST['listatemi']) ? htmlentities($_POST['listatemi']) : '-');

			// layout reset
			if($tema_selezionato == '-'){
				$layout_name		= '';
			}else{
				// new layout
				$layout_name		= $tema_selezionato;
			}



			$contentDAO = new ContentDAO();

			$lezioni	= $contentDAO->get($this->content_id);

			$text		= $this->textFixPHP($lezioni['text']);

			if(strstr($text, '<div id="content">')){
				$text = str_replace('<div id="content">','',$text, $count);
			}

			$text = strrev($text);

			for($i=0; $i<$count; $i++)
				$text = str_replace('>vid/<','',$text);
			
			$text = strrev($text);

			$text		= '<div id="content">'.$text.'</div>';

			// I clear the text from the <div id = "dnd" and add:
			// Does not 'say that lessons have all the tags, so I take it all and riaggiungo (more' safe even if the most 'expensive)

			// Clean up the text by tags
			$text		= $this->clearContent($text);

			// I add
			/*
			if($layout_name != ''){
				//$text		= '<div id="'.$this->uniq.'">'.$text.'<div id="anteprima-footer"> </div></div>';
				$text		= '<div id="'.$this->uniq.'">'.$text.'<div id="anteprima-footer"> </div></div>';
			}*/

			// scrivo sul db
			$contentDAO->UpdateField($this->content_id, 'text', $text);
			$contentDAO->UpdateField($this->content_id, 'layout', $layout_name);

			// page redirect
			echo '<script type="text/javascript">';
				echo 'window.location = "'.$_SERVER['REQUEST_URI'].'";';
			echo '</script>';
		}

		/*
		 *	Function that wipes the contents passed as a parameter.
		 * Cleaning is the removal of the block <div id="dnd"> <div id="anteprima-footer"> </ div> built from the layout
		 */
	
		private function clearContent($content = ''){
	
			// delete the div
			$content	= str_replace('<div id="'.$this->uniq.'">','', $content);
	
			// completely delete the footer from the text
			$content	= preg_replace('/<div id="anteprima-footer">(.*)<\/div><\/div>/Uis', '', $content);
	
			return $content;
		}

		/*
		 *	exaggeration
		* TinyMCE is not accurate with carriage return, then, I try to repair
		* To display differences between TinyMCE and preview AContent.
		* Text = text to be cleaned
		*/
	
		private function textFixPHP($text = ''){
	
			// JUMP

			/*
			$text	= str_replace('<p>&nbsp;</p>', "<br />", $text);
			$text	= str_replace('<p></p>', "<br />", $text);
			$text	= str_replace('<br>', "<br />", $text);
			$text	= str_replace('<p>', "<div>", $text);
			$text	= str_replace('</p>', "</div>", $text);
			*/
	
			return $text;		
		}


		public function exportLayout($_content_id = '', $_course_id = ''){
			die('Ho bloccato Layout.class.php perch&#232; va parametrizzata!');
			$stylesheet	= '';
			
			$stylesheet = file_get_contents('../../dnd_themod/layout/unibo/unibo.css');
			
			$stylesheet	= str_replace('#'.$this->uniq, 'body', $stylesheet);
			
			//var_dump($stylesheet);
/*
			if($_content_id == '')
				echo 'tratto il caso del corso intero';
			else
				echo 'tratto il caso della lezione';
 */
/*
			echo '<pre>';
				print_r(get_defined_vars());
			echo '</pre>';
*/
			//die();


			return $stylesheet;
		}

		public function appendStyle($rows, $zipfile, $_content_id = ''){

			// $ _content_id determinates if the packing or the Entire lesson course
			// $ Row complete lessons for a specific course list

			$styles			= array();
			$stylesheet		= '';
			/*
			echo $_content_id;
			var_dump($rows);
			die();
			*/
			for($i=0; $i < count($rows); $i++){

				if($rows[$i]['layout'] != ''){
					// In another version, AContent requires 'commoncartridge' as folder
					$rows[$i]['head']					= '<link rel="stylesheet" href="commoncartridge/'.$rows[$i]['layout'].'.css" type="text/css" />'.$rows[$i]['head'];
					//$rows[$i]['head']					= '<link rel="stylesheet" href="'.$rows[$i]['layout'].'.css" type="text/css" />'.$rows[$i]['head'];
					$rows[$i]['use_customized_head']	= '1';

					// create image folder

						/*
						echo $src;
						echo '<br />';
						echo $dst;
						echo '<br />';
						*/

						/*
						$dir = opendir($src);
						while(false !== ( $file = readdir($dir)) ) { 
					        if (( $file != '.' ) && ( $file != '..' )) {
					            //copy($src . '/' . $file, $dst . '/' . $file);
								$zipfile->add_file($src . '/' . $file, $dst . '/' . $file);
						    } 
						}
						closedir($dir);
						*/
					/*
					echo '<hr />';
					echo 'content_id = '.$_content_id;
					echo '<br />';
					echo '$rows[$i][\'content_id\'] = '.$rows[$i]['content_id'];
					echo '<br />';
					echo 'styles = ';
					print_r($styles);
					echo '<br />';
					*/

					// if it's a new style to add
					if(($_content_id != '' AND $_content_id == $rows[$i]['content_id']) OR $_content_id == ''){
						//if(!in_array($rows[$i]['layout'], $styles)){
						
						//echo '<div>FIRST STEP</div>';

						$styles[]		= $rows[$i]['layout'];

						//if(($_content_id != '' AND $_content_id == $rows[$i]['content_id']) OR $_content_id == ''){
						if(in_array($rows[$i]['layout'], $styles)){
							//echo '<div>-SECOND STEP</div>';

							if($stylesheet = file_get_contents('../../dnd_themod/layout/'.$rows[$i]['layout'].'/'.$rows[$i]['layout'].'.css')){
								
								//echo '<div>THIRD (LAST) STEP</div>';
								$stylesheet	= str_replace('#'.$this->uniq, 'body', $stylesheet);
								$zipfile->add_file($stylesheet, 'resources/commoncartridge/'.$rows[$i]['layout'].'.css');

								// add images folder
								$src	= '../../dnd_themod/layout/'.$rows[$i]['layout'].'/'.$rows[$i]['layout'].'/';
								//$dst	= 'resources/commoncartridge/'.$rows[$i]['layout'].'/';
								$dst	= 'resources/commoncartridge/'.$rows[$i]['layout'].'/';
		
								$zipfile->create_dir('resources/commoncartridge/'.$rows[$i]['layout'].'/');
								$zipfile->add_dir($src, $dst);
							}
						}
					}//else{
						//echo '<div>BACK STEP</div>';
					//}
				}
			}
			//die('END');

			return $rows;
		}

	}
?>
