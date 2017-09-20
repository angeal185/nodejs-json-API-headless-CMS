var singleItem = function(itemId,itemDate,itemName,itemUrl,itemSlug,itemDescription,itemPrice,itemWasPrice,itemLabel,itemStars,itemCategory,itemListA,itemListB,itemListC,imgL,imgS){
	this.id = itemId;
	this.date = itemDate;
	this.name = itemName;
	this.url = itemUrl;
	this.slug = itemSlug;
	this.description = itemDescription;
	this.price = itemPrice;
	this.wasPrice = itemWasPrice;
	this.label = itemLabel;
	this.stars = itemStars;
	this.category = itemCategory;
	this.listA = itemListA;
	this.listB = itemListB;
	this.listC = itemListC;
	this.imgLarge = imgL;
	this.imgSmall = imgS;
};

module.exports.singleItem = singleItem;
