#########################################################
# SQL for the default HowTo lesson in AContent          #
#########################################################

INSERT INTO `courses` (`course_id`, `category_id`, `content_packaging`, `access`, 
    `title`, `description`, `primary_language`, `created_date`) 
    VALUES (1,0,'top','public','Creating your First Lesson in AContent', 
    'Learn how to start creating lessons in AContent','en',now());

INSERT INTO `content` (`content_id`, `course_id`, `content_parent_id`, `ordering`, 
    `last_modified`, `revision`, `formatting`, `keywords`, `content_path`, `title`, 
    `text`, `head`, `use_customized_head`, `test_message`, `content_type`) VALUES 
    (1,1,0,1,now(),0,1,'','','Getting Started with AContent','','',1,'',1);
    
INSERT INTO `content` (`content_id`, `course_id`, `content_parent_id`, `ordering`, 
    `last_modified`, `revision`, `formatting`, `keywords`, `content_path`, `title`, 
    `text`, `head`, `use_customized_head`, `test_message`, `content_type`) 
    VALUES (2,1,1,1,now(),0,1,'','','Welcome to AContent',
    '<p>This is a simple howto lesson that acts\r\nas some default content for 
    a fresh installation of AContent, and  as\r\na primer, to get you started creating 
    AContent lessons.</p>\r\n<h3>What\'s a Lesson?</h3>\r\n<p>The word lesson 
    has been used to\r\ndescribe the content of a learning unit you might create 
    in AContent.\r\nA lesson however, could be a complete course, or just a single 
    page\r\nof content. The word lesson was used to encourage the creation 
    of\r\nsmaller, more manageable units of information, perhaps focused on 
    a\r\nsmall number of sub-topics. Creating a course might involve 
    creating\r\nseveral subtopics as several lessons, that together when 
    imported\r\ninto a learning system make up a larger topic, or a course.</p>
    \r\n<p>When using AContent as a content\r\nrepository with other systems, 
    there are often file size limits\r\nplaced on these systems. If you create 
    a lesson as a complete course,\r\nthe space it occupies, and thus the file 
    size of an exported content\r\npackage, may be too large to transfer between 
    systems, particularly\r\nif it contains multimedia.  There are no real limits 
    on the size of a\r\nlesson, though you should try to keep them as small as 
    possible to\r\nensure they will transfer across systems.</p>','',1,'',0);
    
INSERT INTO `content` (`content_id`, `course_id`, `content_parent_id`, `ordering`,
    `last_modified`, `revision`, `formatting`, `keywords`, `content_path`, `title`,
    `text`, `head`, `use_customized_head`, `test_message`, `content_type`) VALUES 
    (3,1,1,2,now(),0,1,'','','Create vs Import a Lesson','<p>After you have created 
    an author\r\naccount in AContent and logged in, you will be placed on the 
    home\r\npage where you will see a list of available lessons. Above the 
    list\r\nclick on the Create Lesson tab.</p>\r\n<p>On the Create Lesson 
    screen that opens\r\nyou have two options for creating a new lesson, 
    either creating one\r\nfrom scratch, or uploading an existing one as 
    a standard content\r\npackage or common cartridge, then modifying it.
    </p>\r\n<h3>Create Lesson Tool</h3>\r\n<p>If you are creating a new lesson, 
    then\r\nfollow the link to the Create Lesson Tool. \r\n</p>\r\n<p>This opens 
    a screen for defining some\r\nof the basic properties for the lesson, such 
    as its title,\r\ndescription, a copyright notice, and the language of the 
    lesson. You\r\nmay also choose to hide the lesson from others by selecting 
    the like\r\nnamed checkbox. This is helpful while content is being developed.
    \r\nAfter completion un-checking the checkbox makes the content available\r\n
    to others.</p>\r\n<p>After saving the initial properties for\r\na lesson, you 
    are placed on the first page of the lesson, which at\r\nthis point, contains 
    no content.  In the instruction box on this\r\nfirst page, choose to either 
    create a content page, or create a\r\ncontent folder, into which content pages 
    can be sorted. \r\n</p>\r\n<h3>Importing an Exiting Lesson</h3>\r\n<p>You may 
    import existing content that is\r\nformatted as an IMS Content Package, or an 
    IMS Common Cartridge. IMS\r\nQTI tests and quizzes can be imported through the 
    Tests &amp; Surveys\r\nmanager once a lesson has been created. These IMS formats 
    are content\r\ninteroperability standards that make it possible to move content
    \r\nbetween  systems. A good place to find existing packages and\r\ncartridges 
    is through the Open University\'s OpenLearn Web site.\r\nDownload some content 
    from OpenLearn, then import it into AContent.</p>\r\n<p><strong>OpenLearn</strong>
    </p>\r\n<p><a href=\"http://openlearn.open.ac.uk/\">http://openlearn.open.ac.uk/
    </a></p>\r\n<p>[After you have found some content on\r\nOpenLearn, choose from 
    the Alternative Formats menu block to the\r\nleft, Download this unit. Then 
    choose either Content Package,\r\nor Common Cartridge.]</p>','',1,'',0);
    
INSERT INTO `content` (`content_id`, `course_id`, `content_parent_id`, `ordering`, 
    `last_modified`, `revision`, `formatting`, `keywords`, `content_path`, 
    `title`, `text`, `head`, `use_customized_head`, `test_message`, `content_type`)
    VALUES (4,1,1,3,now(),0,1,'','','The AContent Handbook','<p>Notice the 
    Handbook tab to the upper\r\nright while using a tool. It provides a direct 
    link to the page in the handbook that\r\ndescribes how to use the particular 
    tool you have open. You can\r\nalways access the complete handbook through 
    the AContent Handbook\r\nlink in the footer area from anywhere within AContent. 
    Use its search\r\nfeature to find information, and click on the Print Version 
    link to\r\nturn the handbook into a single page for printing.</p>','',1,'',0);
