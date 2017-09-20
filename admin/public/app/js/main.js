


	
function htmlAce(){	
	$('textarea[data-editor]').each(function () {
		var textarea = $(this);

		var editDiv = $('<div>', {
			position: 'absolute',
			width: "100%",
			height: "400px",
			'class': textarea.attr('class')
		}).insertBefore(textarea);
		textarea.css('display', 'none');
		var editor = ace.edit(editDiv[0]);
		editor.$blockScrolling = Infinity;
		editor.getSession().setMode("ace/mode/html");
		editor.renderer.setShowGutter(true);
		editor.getSession().setValue(textarea.val());
		editor.getSession().setUseWrapMode(true);
		editor.setTheme("ace/theme/monokai");
		
		// copy back to textarea on form submit...
		textarea.closest('form').submit(function () {
			textarea.val(editor.getSession().getValue());
		})
	});

};


	
function getDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();
	if(dd < 10){
		dd = '0' + dd;
	} 
	if(mm < 10){
		mm = '0' + mm;
	} 
	var today = dd + '/' + mm + '/' + yyyy;
	document.getElementById("timestampGen").value = today;
  } 

//timestampgen
function getTimestamp(){
  var $, $result, $text, error, obj;

  $text = document.getElementById('timestampGen');
  $result = document.getElementById('mdlresult');

  obj = {
    f_convert_date: function(ts) {
      var date, exd;
      exd = new Date(ts.slice(0, 10) / 1000);
      date = {
        d: exd.getDate() < 10 ? '0' + exd.getDate() : exd.getDate(),
        m: exd.getMonth() < 9 ? '0' + exd.getMonth() + 1 : exd.getMonth() + 1,
        y: exd.getFullYear()
      };
      return date.d + '/' + date.m + '/' + date.y;
    },
    f_reverse: function(str) {
      var str;
      str = str.replace(/-|_|\/|[\s\.]/g, '-').split('-').reverse().join('-');
      return new Date(str).valueOf() / 1000;
    }
  };

  error = {
    length: 'LENGTH ERROR',
    type: 'INPUT TYPE ERROR'
  };

  $text.oninput = function() {
    var data;
    data = this.value.trim();
    if (data.match(/^\d+$/g)) {
      $result.innerHTML = obj.f_convert_date(data);
    } else if (data.match(/-|_|\/|[\s\.]/g)) {
      $result.innerHTML = obj.f_reverse(data);
    }
  };

};

//modal
var mdlModal = document.getElementById('modelDiv');
var mdlModal2 = document.getElementById('modelDiv2');
var mdlModal5 = document.getElementById('modelDiv5');

var mdlButton = document.getElementById('modelBtn');
var mdlButton2 = document.getElementById('modelBtn2');
var mdlButton5 = document.getElementById('tree-toggle');


function saveLD(){
  var text = document.getElementById("json").value;
  var filename = document.getElementById("schema-fileName").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".html");
  alertify.success("Schema saved");
}

function open1() {
  mdlModal.style.display = 'block';
};

function open2() {
  mdlModal2.style.display = 'block';
};

function open5() {
  mdlModal5.style.display =  mdlButton5.style.display =  'block';
  
};



function closeMdl(){
	mdlModal.style.display = mdlModal2.style.display = 'none';
	
}
$(mdlButton5).click(function() {
	mdlModal5.style.display = mdlButton5.style.display = 'none';
	$('.ace_editor').remove();	
});
//scrollToTop
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("toTop").style.display = "block";
    } else {
        document.getElementById("toTop").style.display = "none";
    }
}

document.getElementById('toTop').onclick = function () {
    scrollTo(document.body, 0, 100);
}
    function scrollTo(element, to, duration) {
        if (duration < 0) return;
        var difference = to - element.scrollTop;
        var perTick = difference / duration * 2;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        scrollTo(element, to, duration - 2);
    }, 10);
}

//select output
function copyToClp(){
    document.execCommand('copy');
	alertify.success('Copied to clipboard');
}

function reloadEditor() {
   location.reload();
}


function editSingleItem() {
	
	var loadItem = document.getElementById('toLoad').value;
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', 'data/item/single/' + loadItem, true);
    xhr.send();
    xhr.onreadystatechange = function() {
	  var data;
	  if (this.readyState !== 4) {
		return;
	  }
	  if (this.status !== 200) {
		alert('Error: ' + (this.status ? this.statusText : 'error'));
		return;
	  }
	  
	  data = JSON.parse(this.responseText);
	  var item = data[0];
		console.log(item);
		
	var chosenItem = '<div class="form-group"><label for="id">id</label><input id="id" type="text" name="id" value="'+item.id+'" class="form-control"></div><div class="form-group"><label for="date">date</label><input id="date" type="text" name="date" value="'+item.date+'" class="form-control"></div><div class="form-group"><label for="name">name</label><input id="name" type="text" name="name" value="'+item.name+'" class="form-control"></div><div class="form-group"><label for="url">url</label><input id="url" type="text" name="url" value="'+item.url+'" class="form-control"></div><div class="form-group"><label for="slug">slug</label><input id="slug" type="text" name="slug" value="'+item.slug+'" class="form-control"></div><div class="form-group"><label for="price">price</label><input id="price" type="text" name="price" value="'+item.price+'" class="form-control"></div><div class="form-group"><label for="wasPrice">wasPrice</label><input id="wasPrice" type="text" name="wasPrice" value="'+item.wasPrice+'" class="form-control"></div><div class="form-group"><label for="label">label</label><input id="label" type="text" name="label" value="'+item.label+'" class="form-control"></div><div class="form-group"><label for="category">category</label><input id="category" type="text" name="category" value="'+item.category+'" class="form-control"></div><div class="form-group"><label for="listA">list item A</label><input id="listA" type="text" name="listA" value="'+item.listA+'" class="form-control"></div><div class="form-group"><label for="listB">list item B</label><input id="listB" type="text" name="listB" value="'+item.listB+'" class="form-control"></div><div class="form-group"><label for="listC">list item C</label><input id="listC" type="text" name="listC" value="'+item.listC+'" class="form-control"></div><div class="form-group"><label for="imgLarge">Large image</label><input id="imgLarge" type="text" name="imgLarge" value="'+item.imgLarge+'" class="form-control"></div><div class="form-group"><label for="imgSmall">Small image</label><input id="imgSmall" type="text" name="imgSmall" value="'+item.imgSmall+'" class="form-control"></div><div class="form-group"><label for="description">description</label><textarea id="description" type="text" name="description" value="'+item.description+'" class="form-control" data-editor>'+item.description+'</textarea></div><button type="submit" id="form" class="btn btn-default">Submit</button>';
	
	document.getElementById('editSingleOutput').innerHTML = chosenItem;
	
            
    htmlAce();
	//alertify.success("Item-list data loaded");
    };
};

function editSinglePost() {
	
	var loadItem = document.getElementById('toLoad').value;
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', 'data/blog/post/' + loadItem, true);
    xhr.send();
    xhr.onreadystatechange = function() {
	  var data;
	  if (this.readyState !== 4) {
		return;
	  }
	  if (this.status !== 200) {
		alert('Error: ' + (this.status ? this.statusText : 'error'));
		return;
	  }
	  
	  data = JSON.parse(this.responseText);
	  var item = data[0];
		console.log(item);
		
	var chosenPost = '<div class="form-group"><label for="date">Date</label><input id="date" type="text" name="date" value="'+item.date+'" class="form-control"></div><div class="form-group"><label for="author">Author</label><input id="author" type="text" name="author" value="'+item.author+'" class="form-control"></div><div class="form-group"><label for="slug">Slug</label><input id="slug" type="text" name="slug" value="'+item.slug+'" class="form-control"></div><div class="form-group"><label for="title">Title</label><input id="title" type="text" name="title" value="'+item.title+'" class="form-control"></div><div class="form-group"><label for="img">Img</label><input id="img" type="text" name="img" value="'+item.img+'" class="form-control"></div><div class="form-group"><label for="category">Category</label><input id="category" type="text" name="category" value="'+item.category+'" class="form-control"></div><div class="form-group"><label for="body">Body</label><textarea id="body" type="text" name="body" value="'+item.body+'" class="form-control" data-editor>'+item.body+'</textarea></div><button type="submit" id="form" class="btn btn-default">Submit</button>';
	
	document.getElementById('editSingleOutput').innerHTML = chosenPost;
	htmlAce();
	//alertify.success("Item-list data loaded");
    };
};


$('#jsonSearchItem').keyup(function() {
  var count = '',
  myExp = '',
  output = '',
  searchField = '',
  searchField = $('#jsonSearchItem').val(),
  myExp = new RegExp(searchField, 'i'),
  output = '<div>',
  count = 1;
  $.getJSON('data/item/list/itemFileList.json', function(data) {
	$.each(data, function(key, val) {
	  if (val.search(myExp) != -1 || val.search(myExp) != -1) {
		output += '<div class="col-md-4"><button type="button" onclick="document.getElementById(\'toLoad\').value = this.innerHTML" class="btn btn-primary btn-lg btn-block">' + val + '</button></div>';
		if (count % 2 == 0) {
		  output += '</div><div>';
		}
		count++;
	  }
	});
	output += '</div>';
	$('#jsonSearchresults').html(output);
  
    });
  });

$('#jsonSearchPost').keyup(function() {
  var count = '',
  myExp = '',
  output = '',
  searchField = '',
  searchField = $('#jsonSearchPost').val(),
  myExp = new RegExp(searchField, 'i'),
  output = '<div>',
  count = 1;
  $.getJSON('data/blog/list/postFileList.json', function(data) {
	$.each(data, function(key, val) {
	  if (val.search(myExp) != -1 || val.search(myExp) != -1) {
		output += '<div class="col-md-4"><button type="button" onclick="document.getElementById(\'toLoad\').value = this.innerHTML" class="btn btn-primary btn-lg btn-block">' + val + '</button></div>';
		if (count % 2 == 0) {
		  output += '</div><div>';
		}
		count++;
	  }
	});
	output += '</div>';
	$('#jsonSearchresults').html(output);
  
    });
  });
 

 
 var requestFullscreen = function(ele) {
    if (ele.requestFullscreen) {
        ele.requestFullscreen();
    } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
    } else {
        console.log('Fullscreen API is not supported.');
    }
};

var exitFullscreen = function() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else {
        console.log('Fullscreen API is not supported.');
    }
}; 
 
var fsDocButton = $('#fs-doc-button');
fsDocButton.data('toggleState', 'first');

fsDocButton.on('click', function(e) {
    e.preventDefault();
    if ($(this).data('toggleState') == 'first'){
        requestFullscreen(document.documentElement);
        $(this).data('toggleState', 'second');
    }
    else{
        exitFullscreen();
        $(this).data('toggleState', 'first');
    }
});

$(document).keydown(function(e){
    if (e.keyCode == 27){
        $('#fs-doc-button').data('toggleState', 'second');
    }
});



