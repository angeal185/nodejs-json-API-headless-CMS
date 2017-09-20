//editor
var $schema = document.getElementById('schema'),
	$output = document.getElementById('output'),
	$editor = document.getElementById('editor'),
	$validate = document.getElementById('validate'),
	$set_schema_button = document.getElementById('setschema'),
	$set_schema_button2 = document.getElementById('setschema2'),
	$set_schema_button3 = document.getElementById('setschema3'),
	$set_schema_button4 = document.getElementById('setschema4'),
	$set_schema_button5 = document.getElementById('setschema5'),
	$set_value_button = document.getElementById('setvalue'),
	jsoneditor;

var reload = function(keep_value) {
    var startval = (jsoneditor && keep_value) ? jsoneditor.getValue() : window.startval;
    window.startval = undefined;

    if (jsoneditor) jsoneditor.destroy();
    jsoneditor = new JSONEditor($editor, {
        schema: schema,
        startval: startval
    });
    window.jsoneditor = jsoneditor;
    jsoneditor.on('change', function() {
        var json = jsoneditor.getValue();

        $output.value = JSON.stringify(json, null, 2);

        var validation_errors = jsoneditor.validate();
        if (validation_errors.length) {
            $validate.value = JSON.stringify(validation_errors, null, 2);
        } else {
            $validate.value = 'valid';
        }

    });
	
};

$schema.value = JSON.stringify(Post, null, 2);
schema = JSON.parse($schema.value);
$output.value = '';

$set_value_button.addEventListener('click', function() {
    jsoneditor.setValue(JSON.parse($output.value));
	alertify.success("Form updated");
});



$set_schema_button.addEventListener('click', function() {
    try {
        schema = JSON.parse($schema.value);
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

    reload();
	alertify.success("Schema updated");
});

//Item
$set_schema_button2.addEventListener('click', function() {
    try {
		$schema.value = JSON.stringify(Item, null, 2);
        schema = JSON.parse($schema.value);
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

    reload();
	document.getElementById('breadcrumb').innerHTML = 'Item';
	alertify.success('Item data loaded');
});

//post
$set_schema_button3.addEventListener('click', function() {
    try {
		$schema.value = JSON.stringify(Post, null, 2);
        schema = JSON.parse($schema.value);
		
    } catch (e) {
        alert('Invalid Schema: ' + e.message);
        return;
    }

	document.getElementById('breadcrumb').innerHTML = 'Post';
	alertify.success('Post data loaded');
    reload();
});

//item-list
document.getElementById('itemList').addEventListener('click', function() {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', globals.urls.itemList, true);
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
	  try {
	  $schema.value = JSON.stringify(linkList, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	document.getElementById('breadcrumb').innerHTML = "Item List";
	alertify.success("Item-list data loaded");
    };
});

//post-list
document.getElementById('postList').addEventListener('click', function() {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', globals.urls.postList, true);
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
	  try {
	  $schema.value = JSON.stringify(linkList, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	document.getElementById('breadcrumb').innerHTML = "post List";
	alertify.success("Post-list data loaded");
    };
});

// gallery
document.getElementById('setschema4').addEventListener('click', function() {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', globals.urls.gallery, true);
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
	  try {
	  $schema.value = JSON.stringify(gallerySchema, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	document.getElementById('breadcrumb').innerHTML = 'Gallery';
	alertify.success('Gallery data loaded');
    };
});

// flicker-converted-gallery
document.getElementById('setschema5').addEventListener('click', function() {
    var xhr;
    xhr = new XMLHttpRequest;
    xhr.open('GET', globals.urls.flickrConverted , true);
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
	  try {
	  $schema.value = JSON.stringify(gallerySchema, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	document.getElementById('breadcrumb').innerHTML = 'Flickr';
	alertify.success('flicker-converted data loaded');
    };
});

//flicker-default-gallery/
document.getElementById('loadFlickr').addEventListener('click', function() {
    var xhr;
	var flickrURL = globals.flickr.url + 'method=flickr.people.getPhotos&api_key=' + globals.flickr.api +  '&user_id=' + globals.flickr.id + '&format=json&nojsoncallback=1'
    xhr = new XMLHttpRequest;
    xhr.open('GET', flickrURL, true);
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
	  try {
	  $schema.value = JSON.stringify(flickrSchema, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data.photos.photo, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	//console.log(data);
	document.getElementById('breadcrumb').innerHTML = "Flicker-default gallery";
	alertify.success("Flickr data loaded");
    };
});

//loadURL
function loadURL() {
    var xhr;
	var URL = document.getElementById("inputurl").value;
    xhr = new XMLHttpRequest;
    xhr.open('GET', URL, true);
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
	  try {
	  $schema.value = JSON.stringify(flickrSchema, null, 2);
		schema = JSON.parse($schema.value);
		} catch (e) {
			alert('Invalid Schema: ' + e.message);
        return;
		}
		reload();
	  data = JSON.parse(this.responseText);

	  $output.value = JSON.stringify(data, null, 2);
	  jsoneditor.setValue(JSON.parse($output.value));
	console.log(data);
    };
} 

var aceTheme = function(theme, no_reload) {
    theme = theme || '';

    var mapping = globals.aceMap;

    if (typeof mapping[theme] === 'undefined') {
        theme = 'monokai';
        document.getElementById('aceTheme_switcher').value = theme;
    }

    JSONEditor.plugins.ace.theme = theme;

    document.getElementById('aceTheme_script').href = mapping[theme];
    document.getElementById('aceTheme_switcher').value = JSONEditor.plugins.ace.theme;

    if (!no_reload) reload(true);
};

var refreshBooleanOptions = function(no_reload) {
    var boolean_options = document.getElementById('boolean_options').children;
    for (var i = 0; i < boolean_options.length; i++) {
        JSONEditor.defaults.options[boolean_options[i].value] = boolean_options[i].selected;
    }
    if (!no_reload) reload(true);
};

document.getElementById('aceTheme_switcher').addEventListener('change', function() {
    aceTheme(this.value);
	alertify.success("ACE Theme changed");
});

document.getElementById('object_layout').addEventListener('change', function() {
    JSONEditor.defaults.options.object_layout = this.value;
    reload(true);
	alertify.success("Layout changed");
});
document.getElementById('show_errors').addEventListener('change', function() {
    JSONEditor.defaults.options.show_errors = this.value;
    reload(true);
	alertify.success("Error options changed");
});


aceTheme((window.location.href.match(/[?&]theme=([^&]+)/) || [])[1] || 'monokai', true);

document.getElementById('object_layout').value = (window.location.href.match(/[?&]object_layout=([^&]+)/) || [])[1] || 'normal';
JSONEditor.defaults.options.object_layout = document.getElementById('object_layout').value;

document.getElementById('show_errors').value = (window.location.href.match(/[?&]show_errors=([^&]+)/) || [])[1] || 'interaction';
JSONEditor.defaults.options.show_errors = document.getElementById('show_errors').value;

reload();

//file-input 
var inputs = document.querySelectorAll('.inputfile');
Array.prototype.forEach.call(inputs, function(input) {
    var label = input.nextElementSibling,
        labelVal = label.innerHTML;

    input.addEventListener('change', function(e) {
        var fileName = '';
        if (this.files && this.files.length > 1)
            fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
        else
            fileName = e.target.value.split('\\').pop();

        if (fileName)
            label.querySelector('span').innerHTML = fileName;
        else
            label.innerHTML = labelVal;
    });
});

//load file
function loadFile() {
    var file = document.getElementById("myFile").files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var textArea = document.getElementById("output");
        textArea.value = e.target.result;
    };
    reader.readAsText(file);
	alertify.success("File loaded");
}

//load URL 
/*
function loadURL() {
    var file = document.getElementById("inputurl").files[0];
    var reader = new FileReader();
    reader.onload = function(e) {
        var textArea = document.getElementById("output");
        textArea.value = e.target.result;
    };
    reader.readAsText(file);
}
*/


//save
function saveJson(){
  var text = document.getElementById("output").value;
  var filename = document.getElementById("input-fileName").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".json");
  alertify.success("Output saved");
}


//saveFlkrJson
function saveFlkrJson(){
  var text = document.getElementById("flkrOutput").innerHTML;
  var filename = document.getElementById("input-flkr").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".json");
  alertify.success("Flicker data saved");
}

function saveSchema(){
  var text = document.getElementById("schema").value;
  var filename = document.getElementById("schema-fileName").value;
  var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
  saveAs(blob, filename + ".json");
  alertify.success("Schema saved");
}

//modal

var mdlModal3 = document.getElementById('modelDiv3');
var mdlButton3 = document.getElementById('modelBtn3');

var open3 = function() {
  mdlModal3.style.display = 'block';
	var url = globals.flickr.url + 'method=flickr.people.getPhotos&api_key=' + globals.flickr.api + '&user_id=' + globals.flickr.id + '&format=json&nojsoncallback=1';
	var output = $('#flkrOutput');

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		success: function(data) {
			data = data.photos.photo;
			$.each(data, function(i, img) {
				output.append('{\n"title":"' + img.title + '",\n"url":"https://farm' + img.farm + '.staticflickr.com/' + img.server + '/' + img.id + '_' + img.secret + '_m.jpg"\n},');

			});

			$(document).ready(function() {
				output.text(function(_, txt) {
					return txt.slice(1, -1);
				});
				output.prepend('[');
				output.append(']');
				$('pre code').each(function(i, block) {
					  hljs.highlightBlock(block);
				  });
			});
		}
	});
	
};

mdlButton3.addEventListener('click', open3, false);

function closeMdl3(){
	mdlModal3.style.display = 'none';
}
