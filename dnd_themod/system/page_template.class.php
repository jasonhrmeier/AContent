<?php

	class page_template{


		/**
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

			/*
			echo '<script type="text/javascript">';
				echo 'alert("Mauro Donadioioioioio!");';
			echo '</script>';
			*/

			//
			if(isset($_POST['cid'], $_POST['action'], $_POST['text']) AND htmlentities($_POST['action']) == 'save_page_template_content'){
				$this->apply_page_template_content();
			}

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
		 * Read loaded themes creating a list of available themes
		 * input:	none
		 * output:	none
		 * 
		 * */

		public function get_list_page_template(){

			$list_page_template	= array();
			$dir			= array();

			// I read the list of available Page_template
			$dir		= scandir($this->mod_path['page_template_dir_int']);

			// subtract the files to be excluded from the list of available Page_templates
			$dir		= array_diff($dir, $this->except);

			$dir		= array_merge(array(),$dir);

			// I call the function that validates Page_template available
			$list_page_template	= $this->page_template_complies($dir);

			return $list_page_template;
		}

		/*
            *The following function reads from the filesystem Page_template existing and validates them
			* According to preset criteria (eg confrontation between the core and Page_template version)
			* Returning a vector Page_templates valid and available.
			* Input: $ dir [] list of available Page_templates
			* Output: the list of available Page_template skimmed according to compatiblity of each Page_template
			*
			**/
		
		function page_template_complies($dir = array()){
			
			// scandisc all existing page_template
		
			foreach($dir as $item){

				$isdir	= $this->mod_path['page_template_dir_int'].$item;
			
				// control that the element is a directory
				if(is_dir($isdir)){
			
					// check if .info exists and parse
					$isfile	= $isdir.'/page_template.info';
			
					if(is_file($isfile)){

						$info	= parse_ini_file($isdir.'/page_template.info');
		
						// If you have not specified a name, use the folder name
						if(!$info['name'])
							$info['name'] = $item;
						
						// I reduce the name to an acceptable number of characters
						$limit	= 15;
						if(strlen($info['name']) >= $limit){
							$info['name']	= substr($info['name'], 0, ($limit-2));
							$info['name']	.= '..';
						}

						// control the "core"
						if(!$info['core'])
							continue;
						else{

							$vfile	= explode('.', $info['core']);
							$vcore	= explode('.', VERSION);
			
							// control surface for the version compatibility
                            // Blocking the cycle at the first incompatibilities found
							if($vfile[0] < $vcore[0])
								// not compatible!
								continue;
							elseif(strtolower($vfile[1]) != 'x' AND $vfile[1] < $vcore[1])
								// not compatible!
								continue;
						}
		
						// I put the info of the current page_template into a vector
						$page_template[$item] = $info;
					}
				}
			}
		
			return page_template;
		}


		/*
		 * The following function provides for the generation of a form to show
		* Graphical user the list of themes available.
		* The form is returned by the function and then integrated
		* Output of this module.
		* Input: $ listaTemi [] list of available themes occurred
		* Output: none
		 **/

		public function createUI(){

			$ui		= '';

			$ui		.= '<form action="" onsubmit="return false" method="post" style="display: none" id="dnd_moduli">';

			$ui		.= '<div>';
	
			$ui		.= '<div><input type="checkbox" value="'._AT('activate_page_template').'" id="activate_page_template_btn" />';
			$ui		.= '<label for="activate_page_template_btn"> '._AT('activate_page_template').'</label></div>';
	
			$ui		.= '<div><input type="checkbox" value="'._AT('arrange_page_template').'" id="ordina_page_template_btn" />';
			$ui		.= '<label for="ordina_page_template_btn"> '._AT('arrange_page_template').'</label></div>';
			
			$ui		.= '</div>';

			$ui		.= '</form>';

			$ui		.= '<noscript><div>'._AT('no_js').'</div></noscript>';
		
			return $ui;
		}


		private function apply_page_template_content(){

			$cid	= htmlentities($_POST['cid']);
			$text	= $this->textFixPHP($_POST['text']);

			if(strlen($text) == 0)
				return;

			define("TR_INCLUDE_PATH", "../../include/");

			require_once(TR_INCLUDE_PATH.'vitals.inc.php');
			require_once(TR_INCLUDE_PATH.'classes/DAO/ContentDAO.class.php');

			$contentDAO = new ContentDAO();

			// scrivo sul db
			$contentDAO->UpdateField($cid, "text", $text);

			// page redirect
			echo '<script type="text/javascript">';
				echo 'window.location = "'.$_SERVER['REQUEST_URI'].'";';
			echo '</script>';

			return;
		}

		public function get_page_template_structure($page_templateID = ''){
			$struct	= '';

			$file	= '../../dnd_themod/page_template/'.$page_templateID.'/'.$page_templateID.'.html';

			if(file_exists($file))
				$struct	= file_get_contents($file);

			return $struct;
		}

		/*
		*	exaggeration
		* TinyMCE is not accurate with carriage return, then, I try to repair
		* To display differences between TinyMCE and preview AContent.
		* Text = text to be cleaned
		*/
	
		private function textFixPHP($text = ''){

			/*
			$text	= str_replace('<p>&nbsp;</p>', "<br />", $text);
			$text	= str_replace('<p></p>', "<br />", $text);
			$text	= str_replace('<br>', "<br />", $text);
			$text	= str_replace('<p>', "<div>", $text);
			$text	= str_replace('</p>', "</div>", $text);
			*/
			
			// remove the double header that will be created
			
	
			return $text;		
		}

	}
?>
