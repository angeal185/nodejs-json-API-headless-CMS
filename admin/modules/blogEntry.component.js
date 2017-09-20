var blogEntry = function(pdate, pauthor,pslug,ptitle,pimg,pbody,pcategory){
	this.date = pdate;
	this.author = pauthor;
	this.slug = pslug;
	this.title = ptitle;
	this.img = pimg;
	this.body = pbody;
	this.category = pcategory;
};

module.exports.blogEntry = blogEntry;



