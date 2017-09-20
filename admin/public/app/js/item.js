var Item = {
  "title": "Item",
  "type": "object",
  "properties": {
    "date": {
      "type": "integer",
      "format": "datetime",
      "description": "timestamp"
    },
    "author": {
      "type": "string",
      "description": "postcreated by",
      "minLength": 4,
      "default": "admin2"
    },
    "slug": {
      "type": "string",
      "description": "post slug",
      "minLength": 4,
      "default": ""
    },
    "title": {
      "type": "string",
      "description": "post title",
      "minLength": 4,
      "default": ""
    },
    "img": {
      "type": "string",
      "format": "url",
      "description": "post image url",
      "minLength": 4,
      "default": "https://"
    },
    "category": {
      "type": "string",
      "enum": [
        "a",
        "b",
        "c",
        "d",
        "e"
      ]
    },
    "body": {
      "type": "string",
      "description": "post body",
      "format": "html",
      "default": "<p></p>",
      "options": {
        "wysiwyg": false
      }
    }
  }
};