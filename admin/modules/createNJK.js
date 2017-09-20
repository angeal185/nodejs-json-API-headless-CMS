var fs = require('fs');
var insert = require('./insert.js');

module.exports = function (njkTpl) {
	
//booleans
var isLayout = njkTpl.isLayout || false;
var isExpress = njkTpl.isExpress || false;
var includes = njkTpl.includes || true;
var macros = njkTpl.macros || true;
var CSS = njkTpl.CSS || true;
var JS = njkTpl.JS || true;
var fullLayout = njkTpl.fullLayout || false

//strings
var title = njkTpl.title || 'test';
var layoutPath = njkTpl.layoutPath || 'layouts';
var includesPath = njkTpl.includesPath || 'includes/include';
var macrosPath = njkTpl.macrosPath || 'macros/macro';
var CSSPath = njkTpl.CSSPath || 'css/styles';
var JSPath = njkTpl.JSPath || 'js/app';


var expressPath = njkTpl.JSPath || 'routes/';

var ext = njkTpl.ext || 'njk';
var headblock = njkTpl.headblock || 'head';
var mainblock = njkTpl.mainblock || 'content';
var scriptsblock = njkTpl.scriptsblock || 'scripts';

var includesTpl, macrosTpl, CSShref, JSsrc;

if (includes === true) {
	includesTpl = njkTpl.includesTpl || '{% include "' + includesPath + '.' + ext + '" %}';
} else {
	includesTpl = njkTpl.includesTpl || '';
};

if (macros === true) {
	macrosTpl = njkTpl.macrosTpl || '{% import "' + macrosPath + '.' + ext + '" as macro %}';
} else {
	macrosTpl = njkTpl.macrosTpl || '';
};

if (CSS === true && isLayout === true) {
	CSShref = njkTpl.CSShref || '<link rel="stylesheet" href="' + CSSPath + '.css" >';
} else {
	CSShref = njkTpl.CSShref || '';
};

if (JS === true && isLayout === true) {
	JSsrc = njkTpl.JSsrc || '<script src="' + JSPath + '.js"></script>';
} else {
	JSsrc = njkTpl.JSsrc || '';
};

if (fullLayout === true && isLayout === true) {
	includesTpl = njkTpl.includesTpl || '{% include "' + includesPath + '.' + ext + '" %}';
	macrosTpl = njkTpl.macrosTpl || '{% import "' + macrosPath + '.' + ext + '" as macro %}';
	CSShref = njkTpl.CSShref || '<link rel="stylesheet" href="' + CSSPath + '.css" >';
	JSsrc = njkTpl.JSsrc || '<script src="' + JSPath + '.js"></script>';
};

if (isExpress === true && isLayout === false) {	
var expressTpl = `

//${title}
router.get("/${title}", function (req, res, next) {
	res.render("index", {
		title: "${title}"
		
	});
});
`;


insert(expressPath + 'index.js').content(expressTpl).at(25).then(function(err) {
  var content = fs.readFileSync(expressPath + 'index.js', 'utf8')
  console.log(content)
})

};
	
//templates
	if (isLayout === false) {
  return `{% extends "${layoutPath}.${ext}" %}
${macrosTpl}
{% block ${headblock} %}

{% endblock %}
{% block ${mainblock} %}

${includesTpl}

{% endblock %}
{% block ${scriptsblock} %}

{% endblock %}
`
} else {
	return `${macrosTpl}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title></title>
	${CSShref}
{% block ${headblock} %}

{% endblock %}
</head>
<body>
	${includesTpl}
	{% block ${mainblock} %}

	{% endblock %}
	${JSsrc}
	{% block ${scriptsblock} %}

	{% endblock %}
</body>
</html>
`
};

};