(function(){tinymce.PluginManager.requireLangPack('insert_tag');tinymce.create('tinymce.plugins.Insert_tagPlugin',{createControl:function(n,cm){var editor=tinyMCE.activeEditor;switch(n){case'insert_tag':var pluginImgURL=tinymce.baseURL+'/plugins/insert_tag/img/';var c=cm.createMenuButton('insert_tag',{title:'insert_tag.desc',image:pluginImgURL+'insert_tag.png',cmd:'mceInsert_tag'});c.onRenderMenu.add(function(c,m){m.add({title:'insert_tag.term',onclick:function(){editor.execCommand('mceInsertContent',false,'[?][/?]')}});m.add({title:'insert_tag.code',onclick:function(){editor.execCommand('mceInsertContent',false,'[code][/code]')}});m.add({title:'insert_tag.media',onclick:function(){editor.execCommand('mceInsertContent',false,'[media|640|480]http://[/media]')}})});return c}return null},getInfo:function(){return{longname:'Insert tag plugin',author:'ATutor',authorurl:'http://www.atutor.ca',infourl:'http://www.atutor.ca',version:"0.1alpha"}}});tinymce.PluginManager.add('insert_tag',tinymce.plugins.Insert_tagPlugin)})();