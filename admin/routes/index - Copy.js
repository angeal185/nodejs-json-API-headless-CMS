var express = require('express');
var path = require('path');
var url = require('url');
var updateJsonFile = require('update-json-file');
var router = express.Router();
var bodyParser = require('body-parser');
var blogEntry = require('../modules/blogEntry.component').blogEntry;
var singleItem = require('../modules/singleItem.component').singleItem;
var fs = require('fs');
var recursive = require("recursive-readdir");
var fileExists = require('../modules/main').fileExists;
var createjson = require('../modules/main').createjson;
var config = require('../config/config.json')
var gdata = require('../data/main/data.json');
var blogPostData = require('../data/blog/template/data.json');
var storeItemData = require('../data/item/template/data.json');
var schemaData = require('../data/schema/data.json');
var gulp = require('gulp');
//var jupdate = require('json-update');
function confReplace() {
    gulp.start('config:replace');
}



require('../gulpfile.js');

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
	title: 'Dashboard',
	gdata:gdata,
	config:config
  });
});

/* GET home page. */
router.get('/schema', function (req, res, next) {
	res.render('schema', {
	title: 'schema generator',
	schemaURL: true,
	items: schemaData,
	gdata:gdata,
	config:config
  });
});

/* GET home page. */
router.get('/options', function (req, res, next) {
	res.render('options', {
	title: 'options',
	optionsURL: true,
	gdata:gdata,
	config:config
  });
});

router.post('/options', function (req, res, next) {
	var tawkTo = req.body.tawkTo;
	var googleCharts = req.body.googleCharts;
	
	
	updateJsonFile('config/config.json', (data) => {
	  data.tawkTo = tawkTo,
	  data.googleCharts = googleCharts;
	  
	  return data;
	  
	});
	setTimeout(confReplace, 4000);
	res.redirect('./options');
	
});

/* GET deletePost page. */
router.get('/editPost', function (req, res, next) {
	
	var postFileList = require('../public/data/blog/list/postFileList.json');
		res.render('editPost', {
		title: 'Edit post',
		data: postFileList,
		gdata:gdata,
		config:config
	  
	});
	
});

/* deletePost data to json file and save */
router.post('/editPost', function (req, res, next) {

});

/* GET deleteItem page. */
router.get('/editItem', function (req, res, next) {
	//var q = url.parse(adr, true);
	var toEdit = req.body.id;
	var itemFileList = require('../public/data/item/list/itemFileList.json');
		res.render('editItem', {
		title: 'Edit Item',
		data: itemFileList,
		gdata:gdata,
		config:config
	  
	});
	
	
});


/* deletePost data to json file and save */
router.post('/editItem', function (req, res, next) {

});



/* GET deletePost page. */
router.get('/deletePost', function (req, res, next) {
	
	var postFileList = require('../public/data/blog/list/postFileList.json');
		res.render('deletePost', {
		title: 'Delete post',
		data: postFileList,
		gdata:gdata,
		config:config
	  
	});
	
});

/* deletePost data to json file and save */
router.post('/deletePost', function (req, res, next) {
	var todelete = req.body.todelete;

	fs.unlink('./public/data/blog/post/' + todelete , function (err) {
	  if (err) throw err;
	  console.log('File deleted!');
	});	
		
	gulp.start('fileList:post');		
	res.redirect('./');

});

/* GET deleteItem page. */
router.get('/deleteItem', function (req, res, next) {
	
	var itemFileList = require('../public/data/item/list/itemFileList.json');
		res.render('deleteItem', {
		title: 'Delete item',
		data: itemFileList,
		gdata:gdata,
		config:config
	  
	});
	
});

/* deleteItem data to json file and save */
router.post('/deleteItem', function (req, res, next) {
	var todelete = req.body.todelete;

	fs.unlink('./public/data/item/single/' + todelete , function (err) {
	  if (err) throw err;
	  console.log('File deleted!');
	});	
		
	gulp.start('fileList:item');		
	res.redirect('./');

});

/* GET editor page. */
router.get('/editor', function (req, res, next) {
  res.render('editor', {
    title: 'Editor',
	gdata:gdata,
	editorURL: true,
	config:config
  });
});

/* GET form and data page. */
router.get('/blogPost', function (req, res, next) {

	res.render('blogPost', {
		title: 'Blog post',
		items: blogPostData,
		gdata:gdata,
		config:config
	});

});

/* GET form and data page. */
router.get('/itemPost', function (req, res, next) {
	res.render('itemPost', {
	title: 'Single item',
	items: storeItemData,
	gdata:gdata,
	config:config
	});
});


/* post data to json file and save */
router.post('/blogPost', function (req, res, next) {
	var date = req.body.date,
		author = req.body.author,
		slug = req.body.slug,
		title = req.body.title,
		img = req.body.img,
		body = req.body.body,
		category = req.body.category,
		blogPost = new blogEntry(date, author,slug,title,img,body,category);


fs.readFile('./data/post.json', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(data);

    data = JSON.parse(data);
    data.push(blogPost);
    var save = JSON.stringify(data);
    fs.writeFile('./public/data/blog/post/' + slug + '.json', save);
	
	fs.appendFile('./bin/postList.txt', ',"admin/data/blog/post/' + slug + '.json"', function (err) {
	  if (err) throw err;
	  console.log('Saved!');
	});
	
	gulp.start('fileList:post');
    res.redirect('/');

  });
});

/* post data to json file and save */
router.post('/itemPost', function (req, res, next) {
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


fs.readFile('./data/post.json', 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    data = JSON.parse(data);
    data.push(itemPost);
    var save = JSON.stringify(data);
    fs.writeFile('./public/data/item/single/' + slug + '.json', save);

	fs.appendFile('./bin/itemList.txt', ',"admin/data/item/single/' + slug + '.json"', function (err) {
	  if (err) throw err;
	  console.log('Saved!');
	});
	
	gulp.start('fileList:item');
    res.redirect('/');

  });
});







module.exports = router;