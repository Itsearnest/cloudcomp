"use strict";

module.exports = function(app){
	var functions = require("../controller/functions.js");

	app.route("/snippets")
		.get(functions.getSnippets)
		.post(functions.postSnippet);

	app.route("/snippets/:id")
		.get(functions.getSnippetById)
		.put(functions.updateSnippetById)
		.delete(functions.deleteSnippetById);

	app.use(functions.error404function);
};