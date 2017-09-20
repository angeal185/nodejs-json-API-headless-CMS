const express = require('express');
const path = require('path');
const os = require('os');
const url = require('url');
const fs = require('fs-extra');
var Paths = require('../url/');
const delay = require('delay');
const router = express.Router();
const bodyParser = require('body-parser');
const recursive = require("recursive-readdir");
const tar = require('tar-fs')
const crypto = require('crypto');
var sleep = require('system-sleep');
var simpleJSONFilter = require('simple-json-filter');
var fileExists = require('../modules/main').fileExists;
var createjson = require('../modules/main').createjson;
var config = require('../config/config.json');
var gdata = require('../data/main/data.json');
var gencryption = require('../data/encryption/data.json');
var encSettings = require('../data/encryption/settings.json').locked;
var blogPostData = require('../data/blog/template/data.json');
var todosData = require('../data/todo/data.json');
var storeItemData = require('../data/item/template/data.json');
const insert = require('../modules/insert');
const tree = require('../modules/tree');
var schemaData = require('../data/schema/data.json');
const gen = require('../config/generator.json');
var blogEntry = require('../modules/blogEntry.component').blogEntry;
var todoEntry = require('../modules/todoEntry.component').todoEntry;
var singleItem = require('../modules/singleItem.component').singleItem;
var postFileList = require('../public/data/blog/list/postFileList.json');
var itemFileList = require('../public/data/item/list/itemFileList.json');
var htmlTpl = tree(Paths.FrontDev + 'pages/views', {extensions:/\.html/});
var layoutTpl = tree(Paths.FrontDev + 'pages/layouts', {extensions:/\.html/});
var includesTpl = tree(Paths.FrontDev + 'pages/includes', {extensions:/\.html/});
var cssTpl = tree(Paths.FrontDev + 'styles/css', {extensions:/\.css/});
var stylusTpl = tree(Paths.FrontDev + 'styles/stylus', {extensions:/\.styl/});
var scssTpl = tree(Paths.FrontDev + 'styles/scss', {extensions:/\.scss/});
var lessTpl = tree(Paths.FrontDev + 'styles/less', {extensions:/\.less/});
var javascriptMainTpl = tree(Paths.FrontDev + 'scripts/main', {extensions:/\.js/});
var javascriptControllersTpl = tree(Paths.FrontDev + 'scripts/controllers', {extensions:/\.js/});
var javascriptComponentsTpl = tree(Paths.FrontDev + 'scripts/components', {extensions:/\.js/});
var javascriptDirectivesTpl = tree(Paths.FrontDev + 'scripts/directives', {extensions:/\.js/});
var javascriptServicesTpl = tree(Paths.FrontDev + 'scripts/services', {extensions:/\.js/});
var recycleBin = tree('./.tmp/recycle');
var jupdate = require('json-update');
var replace = require("replace");
var encBackup = tree('./admin/backup', {extensions:/\.enc/});
var easyjson = require('easyjson');



const gulp = require('gulp');
require('../../gulpfile.js');

//console.log(htmlTpl);
//var jupdate = require('json-update');

//const ciphers = crypto.getCiphers();
//console.log(ciphers); // ['aes-128-cbc', 'aes-128-ccm', ...]
//const hashes = crypto.getHashes();
//console.log(hashes);
/*function getCrypt() {
var secret = '123456';	
var salt = gencryption.salt;
crypto.pbkdf2(secret, salt, 4096, 512, 'sha512', function(err, key) {
  if (err)
    throw err;
  console.log(key.toString('hex') + salt + secret);  // 'c5e478d...1469e50'
});
};*/
//function confReplace() {
//    gulp.start('config:replace');
//}
/* GET backup. */

/* GET home page. */
router.get('/recycle', function (req, res) {

		res.render('recycle', {
		title: 'recycle',
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: recycleBin
		
	});
	console.log(recycleBin);
});

/* recycle all */
router.post('/recycleAll', function (req, res) {
	
	fs.emptyDir('./.tmp/recycle', err => {
	  if (err) return winston.error(err)

	  winston.log('/recycleAll success!')
	})

	res.redirect('/');

});

/* recycle item */
router.post('/recycle', function (req, res) {
	var toRecycle = req.body.toRecycle;
	
	function deleteRecycle(err) {
	if (err) {
      winston.log(err);
      return;
    }
	
	fs.unlink('./.tmp/recycle/' + toRecycle , function (err) {
	  if (err) throw err;
	  winston.log('recycle deleted!');
	});

	res.redirect('/');
	};
	deleteRecycle();
});

router.get('/create/view', function (req, res) {

		res.render('createView', {
		title: 'View',
		gdata:gdata,
		config:config,
		encSettings: encSettings
		
	});
	
});

router.get('/create/directive', function (req, res) {

		res.render('createDirective', {
		title: 'Directive',
		gdata:gdata,
		config:config,
		encSettings: encSettings
		
	});
	
});

router.get('/create/controller', function (req, res) {

		res.render('createController', {
		title: 'Controller',
		gdata:gdata,
		config:config,
		encSettings: encSettings
		
	});
	
});



router.post('/createView', function (req, res) {

	var Title = req.body.Title;
	var controller = req.body.controller;
	var str = '/*--- views ---*/';
	var tpl = '<!--- ' + Title + ' --->';
	
	var data = `
.when('/${Title}', {
        templateUrl: 'views/${Title}.html',
        controller: '${controller}Ctrl'
      })`
	
	fs.writeFile('./admin/public/front/pages/views/' + Title + '.html', tpl, function (err) {
		return tpl;
	});
	
	replace({
		  regex: str,
		  replacement: str + '\n' + data,
		  paths: ['./admin/public/front/scripts/main/app.js'],
		  recursive: true,
		  silent: true,
		});
	
	res.redirect('./create/view');

});


router.post('/createDirective', function (req, res) {

	var cTitle = req.body.DirectiveTitle;
	var cBody = req.body.contbody;
	var cModule = req.body.cModule;
	var cDirective = req.body.cDirective;
	var str = '<!-- directives -->';
	
	var data = `
/**
 * @ngdoc directive
 * @name ${cModule}.directive:${cTitle}
 * @description
 * # ${cTitle}
 */
angular.module('${cModule}')
.directive('${cTitle}', function (${cDirective}) {
	
${cBody}

	});`
	
	fs.writeFile('./admin/public/front/scripts/directives/' + cTitle + '.js', data, function (err) {
		return data;
	});
	
	
	replace({
		  regex: str,
		  replacement: str + '\n<script src="scripts/directives/' + cTitle + '.js"></script>',
		  paths: ['./admin/public/front/pages/layouts/index.html'],
		  recursive: true,
		  silent: true,
		});
	
	res.redirect('./create/directive');

});




router.post('/createController', function (req, res) {

	var cTitle = req.body.ControllerTitle;
	var cBody = req.body.contbody;
	var cModule = req.body.cModule;
	var cDirectives = req.body.cDirectives;
	var str = '<!-- controllers -->';
	
	var data = `
/**
 * @ngdoc function
 * @name ${cModule}.controller:${cTitle}Ctrl
 * @description
 * # ${cTitle}Ctrl
 * Controller of ${cModule}
*/

angular.module('${cModule}')
  .controller('${cTitle}Ctrl', function (${cDirectives}) {

${cBody}

  });

});`	
	
	
	fs.writeFile('./admin/public/front/scripts/controllers/' + cTitle + '.js', data, function (err) {
		return data;
	});
	
	
	replace({
		  regex: str,
		  replacement: str + '\n<script src="scripts/controllers/' + cTitle + 'Ctrl.js"></script>',
		  paths: ['./admin/public/front/pages/layouts/index.html'],
		  recursive: true,
		  silent: true,
		});
	
	res.redirect('./create/controller');
	
});




router.get('/system', function (req, res) {
	
	var mem = os.totalmem();
	var type = os.platform();

	
	
	
			res.render('system', {
			title: 'Build tasks',
			gdata:gdata,
			config:config,
			encSettings: encSettings
		});
	});

if (config.buildTasks === true) {
router.get('/cms/buildTasks', function (req, res) {
			res.render('buildTasks', {
			title: 'Build tasks',
			gdata:gdata,
			config:config,
			encSettings: encSettings
		});
	});
	
	router.post('/buildTask', function (req, res) {
		var buildTask = req.body.buildTask;	
		gulp.start(buildTask, function (err) {
		  if (err) {
			winston.log('buildTask fail');
		  } else {
			winston.log('buildTask success');
		  }
		});
		res.redirect('/cms/buildTasks');
	});
}

/* GET cms editor. */
if (config.cmsEditor === true) {

	router.get('/cms/template', function (req, res) {
			res.render('cmsTemplateGen', {
			title: 'Cms templates',
			gdata:gdata,
			config:config,
			encSettings: encSettings
		});
	});
	
	
	router.post('/cmsTplCreate', function (req, res) {
		var title = req.body.tplTitle;	
		var tplContent = req.body.tplContent;
		var url = Paths.Views + title + '.njk';

		fs.writeFile(url, tplContent, 'utf8'), function (err) {
				  if (err) throw err;
				  
				  winston.log('Cms template created');
				};
			
			res.redirect('/cms/template');
	});

	

};

/* GET home page. */
router.get('/', function (req, res, next) {
		res.render('index', {
		title: 'Dashboard',
		dashboardURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings
	});
});


/* GET vault */
if (config.passwordSafe === true) {
	if (encSettings === false) {
		router.get('/vault', function (req, res, next) {
			var dbFile = require('../public/data/encryption/db.json');
			var dbString = JSON.stringify(dbFile);

				res.render('vault', {
				title: 'vault',
				gdata:gdata,
				dbFile:dbFile,
				dbString: dbString,
				config:config,
				encSettings: encSettings
				

			});

		});
		
		router.get('/createVault', function (req, res, next) {
			var dbFile = require('../public/data/encryption/db.json');
			var dbString = JSON.stringify(dbFile);

				res.render('createVault', {
				title: 'vault entry',
				gdata:gdata,
				dbFile:dbFile,
				dbString: dbString,
				config:config,
				encSettings: encSettings
				

			});
			

		});

		/* update Password safe. */
		router.post('/updateDB', function (req, res) {
		var update = req.body.vaultResult;	
		var dbFile = Paths.Dec + 'db.json';

		fs.writeFile(dbFile, update, 'utf8'), function (err) {
				  if (err) throw err;
				  
				  winston.log('Vault updated');
				};
			
			res.redirect('/vault');
		});


		/* lock Password safe. */
		router.post('/lockDB', function (req, res) {
		var update = req.body.vaultResult;	
		var algorithm = 'aes-256-ctr';
		var password =  'password'; //req.body.dbEncPassord;	
		var encrypt = crypto.createCipher(algorithm, password);
		var dbFile = Paths.Dec + 'db.json';
		var dbFile2 = Paths.Enc + 'db2.json';

		fs.createReadStream(dbFile)
			.pipe(encrypt)
			.pipe(fs.createWriteStream(dbFile2), function (err) {
				  if (err) throw err;
				  winston.log('Safe unlocked!');
				});
				
		easyjson.path(Paths.Enc + 'settings.json')
			.modify('locked', true)
			.express();
				
		fs.unlink(dbFile);

			res.redirect('/');
			
		});
	}


/* unlock Password safe. */
	if (encSettings === true) {
		router.post('/unlockDB', function (req, res) {
		var algorithm = 'aes-256-ctr';
		var password = req.body.dbDecPassord;	
		var decrypt = crypto.createDecipher(algorithm, password);
		var dbFile = Paths.Dec + 'db.json';
		var dbFile2 = Paths.Enc + 'db2.json';

		fs.createReadStream(dbFile2)
		  .pipe(decrypt)
		  .pipe(fs.createWriteStream(dbFile), function (err) {
				  if (err) throw err;
				  
				  winston.log('Safe locked!');
				});
			
		easyjson.path(Paths.Enc + 'settings.json')
			.modify('locked', false)
			.express();
				
		fs.unlink(dbFile2);

		res.redirect('/');

		});
	}
}
/* save MD file. */
router.post('/saveMD', function (req, res) {
	var sourceMD = req.body.sourceMD;
	var mdName = req.body.mdName;
	var folderLocal = req.body.folderLocal;
	var url = './admin/public/markdown/' + mdName + '.md';

	
	fs.writeFile(url, sourceMD, function (err) {
	  if (err) throw err;
		winston.log('MD Saved!');
	});

    res.redirect('/');
 
});


router.get('/backup', function (req, res, next) {
	res.render('backup', {
	title: 'backup',
	pageURL: true,
	gdata:gdata,
	config:config,
	encSettings: encSettings,
	tree: encBackup

	});
    
});

//////
router.post('/encryptBackup', function (req, res) {
	
	var algorithm = 'aes-256-ctr';
	var secret = req.body.passWord;
	var salt = gencryption.salt;
	var url = req.body.dirUrl;
	var fileName = req.body.fileName;
	var File = './admin/backup/' + fileName + '.enc';
	
	crypto.pbkdf2(secret, salt, 4096, 512, 'sha512', function(err, key) {
		if (err)
			throw err;
		var password =  key.toString('hex') + secret + salt;
		//console.log(password);
		var encrypt = crypto.createCipher(algorithm, password);
		  tar.pack(url)
			  .pipe(encrypt)
			  .pipe(fs.createWriteStream(File), function (err) {
		  if (err) throw err;
		  
		  winston.log('Files encrypted!');
		});
	});	
	
	res.redirect('/backup');

});

//////
router.post('/decryptBackup', function (req, res) {
	
	var algorithm = 'aes-256-ctr';
	var secret = req.body.importPass;
	var salt = gencryption.salt;
	var decryptName = req.body.decryptName;
	var decryptLocation = req.body.decryptLocation
	var File = './admin/backup/' + decryptName;
	
	crypto.pbkdf2(secret, salt, 4096, 512, 'sha512', function(err, key) {
		if (err)
			throw err;
		var password =  key.toString('hex') + secret + salt;
		//console.log(password);
		
		var decrypt = crypto.createDecipher(algorithm, password);
		fs.createReadStream(File)
			.pipe(decrypt)
			.pipe(tar.extract(decryptLocation), function (err) {
		  if (err) throw err;

		  winston.log('Files imported!');
		});
	});	

	res.redirect('/backup');

});


//////
router.post('/deleteBackup', function (req, res) {
	var deleteName = req.body.deleteName;
	var url = './admin/backup/' + deleteName;

	fs.unlink(url, function (err) {
	  if (err) throw err;
	  winston.log('backup deleted!');
	});
	
	res.redirect('/backup');
});


router.get('/page/css', function (req, res, next) {
		res.render('pageHtmlTpl', {
		title: 'css',
		mode:'css',
		folder:'styles',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: cssTpl
	});  
});

if (config.enableStylus === true) {
	router.get('/page/stylus', function (req, res, next) {
			res.render('pageHtmlTpl', {
			title: 'stylus',
			mode:'stylus',
			folder:'styles',
			pageURL: true,
			gdata:gdata,
			config:config,
			encSettings: encSettings,
			tree: stylusTpl
		});  
	});
}

if (config.enableScss === true) {
	router.get('/page/scss', function (req, res, next) {
			res.render('pageHtmlTpl', {
			title: 'scss',
			mode:'scss',
			folder:'styles',
			pageURL: true,
			gdata:gdata,
			config:config,
			encSettings: encSettings,
			tree: scssTpl
		});  
	});
}

if (config.enableLess === true) {
	router.get('/page/less', function (req, res, next) {
			res.render('pageHtmlTpl', {
			title: 'less',
			mode:'less',
			folder:'styles',
			pageURL: true,
			gdata:gdata,
			config:config,
			encSettings: encSettings,
			tree: lessTpl
		});  
	});
}

router.get('/page/main', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'main',
		mode:'javascript',
		folder:'scripts',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptMainTpl
	});
});

router.get('/page/controllers', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'controllers',
		mode:'javascript',
		folder:'scripts',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptControllersTpl
	});
});

router.get('/page/components', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'components',
		mode:'javascript',
		folder:'scripts',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptComponentsTpl
	});
});

router.get('/page/directives', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'directives',
		mode:'javascript',
		folder:'scripts',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptDirectivesTpl
	});
});

router.get('/page/services', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'services',
		mode:'javascript',
		folder:'scripts',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptServicesTpl
	});
});

router.get('/page/vendor', function (req, res) {
		res.render('pageHtmlTpl', {
		title: 'vendor',
		folder:'js',
		mode:'javascript',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: javascriptServicesTpl
	});
});

/* GET page. */
router.get('/page/pages', function (req, res, next) {
		res.render('pageHtmlTpl', {
		title: 'views',
		folder:'pages',
		mode:'html',
		pageURL: true,
		gdata:gdata,
		config:config,
		encSettings: encSettings,
		tree: htmlTpl
	});
});

/* GET page. */
router.get('/page/layouts', function (req, res, next) {
	res.render('pageHtmlTpl', {
	title: 'layouts',
	folder:'pages',
	mode:'html',
	pageURL: true,
	gdata:gdata,
	config:config,
	encSettings: encSettings,
	tree: layoutTpl
	});
});

/* GET page. */
router.get('/page/includes', function (req, res, next) {
	res.render('pageHtmlTpl', {
	title: 'includes',
	folder:'pages',
	mode:'html',
	pageURL: true,
	gdata:gdata,
	config:config,
	tree: includesTpl
	});
});

router.post('/updateHtmlTpl', function (req, res) {
	var treeItem = req.body.treeItem;
	var folder = req.body.Location;
	var folderLocal = req.body.folderLocal;
	var url = './admin/public/front/' + folderLocal + '/'  + folder + '/' + treeItem;
	var loadHtmlTpl = req.body.loadHtmlTpl;

	
	fs.writeFile(url, loadHtmlTpl, function (err) {
	  if (err) throw err;
		
		winston.log('tpl updated');
	});

    res.redirect('/page/' + folder);
 
});

router.post('/deleteHtmlTpl', function (req, res) {
	var original = req.body.original;
	var folder = req.body.Location;
	var folderLocal = req.body.folderLocal;
	var url = './admin/public/front/' + folderLocal + '/' + folder + '/' + original;

	
	fs.unlink(url, function (err) {
	  if (err) throw err;
	  winston.log('File deleted!');
	});
	
	res.redirect('/page/' + folder);

	gulp.start('config:replace');
});

/* GET schema page. */
router.get('/schema', function (req, res) {
	res.render('schema', {
	title: 'schema generator',
	schemaURL: true,
	items: schemaData,
	gdata:gdata,
	config:config,
	encSettings: encSettings
  });
});

router.post('/schema', function (req, res) {
	var json = req.body.json;
	var Schema = req.body.schemaFileName;

	fs.writeFile('./admin/data/public/schema/' + Schema + '.html', json, function (err) {
	  if (err) throw err;
	  winston.log('schema saved');
	});

	res.redirect('/schema');

});

/* GET home page. */
router.get('/options', function (req, res) {

	res.render('options', {
	title: 'options',
	optionsURL: true,
	gdata:gdata,
	config:config,
	encSettings: encSettings

  });

});

router.post('/options', function (req, res) {
	var tawkTo = req.body.tawkTo;
	var googleCharts = req.body.googleCharts;
	var theme = req.body.theme;
	var minifyOutput = req.body.minifyOutput;
	var cache = req.body.cache;
	var enableStylus = req.body.enableStylus;
	var enableScss = req.body.enableScss;
	var enableLess = req.body.enableLess;
	var encryptedBackups = req.body.encryptedBackups;
	var passwordSafe = req.body.passwordSafe;
	var sysMonitor = req.body.sysMonitor;
	var cmsEditor = req.body.cmsEditor;
	
	var data = '{"tawkTo":' + tawkTo + ',"googleCharts":' + googleCharts + ',"theme":' + theme + ',"minifyOutput":' + minifyOutput + ',"cache":' + cache + ',"enableStylus":' + enableStylus + ',"enableScss":' + enableScss + ',"enableLess":' + enableLess + ',"encryptedBackups":' + encryptedBackups + ',"passwordSafe":' + passwordSafe + ',"sysMonitor":' + sysMonitor + ',"cmsEditor":' + cmsEditor + ',"buildTasks":' + buildTasks + '}';
	
	fs.writeFile('./admin/config/config.json', data, function (err) {
	  return data;
	});
	 winston.log('options updated');
	res.redirect('./');

});

/* GET deletePost page. */
router.get('/editPost', function (req, res) {

		res.render('editPost', {
		title: 'Edit post',
		data: postFileList,
		gdata:gdata,
		encSettings: encSettings,
		config:config

	});
	
});

/* deletePost data to json file and save */
router.post('/editPost', function (req, res) {

});

/* GET deleteItem page. */
router.get('/editItem', function (req, res) {
	var toEdit = req.body.id;
		res.render('editItem', {
		title: 'Edit Item',
		data: itemFileList,
		gdata:gdata,
		encSettings: encSettings,
		config:config

	});
});


/* deletePost data to json file and save */
router.post('/editItem', function (req, res) {

});



/* GET deletePost page. */
router.get('/deletePost', function (req, res) {
		res.render('deletePost', {
		title: 'Delete post',
		data: postFileList,
		gdata:gdata,
		encSettings: encSettings,
		config:config

	});
});

/* deletePost data to json file and save */
router.post('/deletePost', function (req, res) {
	var todelete = req.body.todelete;

	fs.unlink(Paths.BlogData + 'post/' + todelete, function (err) {
	  if (err) throw err;
	  winston.log('File deleted!');
	});

	//gulp.start('fileList:post');
	res.redirect('/');

});

/* GET deleteItem page. */
router.get('/deleteItem', function (req, res) {

		res.render('deleteItem', {
		title: 'Delete item',
		data: itemFileList,
		gdata:gdata,
		encSettings: encSettings,
		config:config

	});
});

/* deleteItem data to json file and save */
router.post('/deleteItem', function (req, res) {
	var todelete = req.body.todelete;

	fs.unlink(Paths.ItemData + 'single/' + todelete , function (err) {
	  if (err) throw err;
	  winston.log('File deleted!');
	});

	//gulp.start('fileList:item');
	res.redirect('/');

});

/* GET editor page. */
router.get('/editor', function (req, res) {
	
  res.render('editor', {
    title: 'Editor',
	gdata:gdata,
	editorURL: true,
	encSettings: encSettings,
	config:config
	
  });
});

/* GET form and data page. */
router.get('/blogPost', function (req, res) {

	res.render('blogPost', {
		title: 'Blog post',
		items: blogPostData,
		gdata:gdata,
		encSettings: encSettings,
		config:config
	});
});

/* GET form and data page. */
router.get('/itemPost', function (req, res) {
	
	res.render('itemPost', {
	title: 'Single item',
	items: storeItemData,
	gdata:gdata,
	encSettings: encSettings,
	config:config
	
	});
});


/* post data to json file and save */
router.post('/blogPost', function (req, res) {
	var date = req.body.date,
		author = req.body.author,
		slug = req.body.slug,
		title = req.body.title,
		img = req.body.img,
		body = req.body.body,
		category = req.body.category,
		blogPost = new blogEntry(date, author,slug,title,img,body,category);

function createBlogPost(err, data) {
    if (err) {
      winston.log(err);
      return;
    }

	var data = '[]';
    data = JSON.parse(data);
    data.push(blogPost);
    var save = JSON.stringify(data);
    fs.writeFile(Paths.BlogData + 'post/' + slug + '.json', save, function (err) {
		if (err) {
			winston.log('postBuild fail');
		  }

		gulp.start('fileList:post', function (err) {
			  if (err) {
				winston.log('buildTask fail');
			  } else {
				winston.log('buildTask success');
			  }
		});
	});
  };
  createBlogPost();
  res.redirect('/');
});

/* post data to json file and save */
router.post('/itemPost', function (req, res) {
	var id = req.body.id,
		date = req.body.date,
		name = req.body.name,
		url = req.body.url,
		slug = req.body.slug,
		description = req.body.description,
		price = req.body.price,
		wasPrice = req.body.wasPrice,
		label = req.body.label,
		stars = req.body.stars,
		category = req.body.category,
		listA = req.body.listA,
		listB = req.body.listB,
		listC = req.body.listC,
		imgLarge = req.body.imgLarge,
		imgSmall = req.body.imgSmall;

	var itemPost = new singleItem(id,date,name,url,slug,description,price,wasPrice,label,stars,category,listA,listB,listC,imgLarge,imgSmall);

function createSingleItem(err, data) {
    if (err) {
      winston.log(err);
      return;
    }
	var data = '[]';
    data = JSON.parse(data);
    data.push(itemPost);
    var save = JSON.stringify(data);
    fs.writeFile(Paths.ItemData + 'single/' + slug + '.json', save, function (err) {
		if (err) {
			winston.log('itemPost fail');
		  }
	gulp.start('fileList:item', function (err) {
		  if (err) {
			winston.log('buildTask fail');
		  } else {
			winston.log('buildTask success');
		  }
		});
	});
    
  };
  createSingleItem();
  res.redirect('/');
});


/* GET home page. */
router.get('/createTodo', function (req, res) {
	
	res.render('createTodo', {
	title: 'createTodo',
	todoURL: true,
	todo:todosData,
	gdata:gdata,
	encSettings: encSettings,
	config:config
	});
  
});


router.post('/createTodo', function (req, res) {
	var title = req.body.title,
		date = req.body.date,
		content = req.body.content,
		todo = new todoEntry(title,date,content);

function createTodo(err, data) {
    if (err) {
      winston.log(err);
      return;
    }
	var data = '[]';
    data = JSON.parse(data);
    data.push(todo);
    var save = JSON.stringify(data);
    fs.writeFile(Paths.TodoData + 'todos/' + title + '.json', save, function (err) {
			if (err) {
				winston.log('buildTask fail');
			  }
		gulp.start('merge:todo', function (err) {
			  if (err) {
				winston.log('buildTask fail');
			  } else {
				winston.log('buildTask success');
			  }
		});
	});
  };
	createTodo();
	res.redirect('/createTodo');
});

/* todo */
router.get('/todo', function (req, res) {

	var todos = require('../public/data/todo/todo.json');
		res.render('todo', {
		title: 'todo',
		data: todos,
		gdata:gdata,
		encSettings: encSettings,
		config:config

	});

});

/* todo post */
router.post('/todo', function (req, res) {
	var todelete = req.body.todelete;
	
	function deleteTodo(err) {
	if (err) {
      winston.log(err);
      return;
    }
	
	fs.unlink(Paths.TodoData + 'todos/' + todelete + '.json' , function (err) {
	  if (err) throw err;
	  winston.log('Todo deleted!');
	});

	gulp.start('merge:todo');
	res.redirect('/');
	};
	deleteTodo();
});

module.exports = router;
