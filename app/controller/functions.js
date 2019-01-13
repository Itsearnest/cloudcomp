"use strict";
var functions = require("./functions.js");

exports.getSnippets = function(req, res){
	if( req.query.id != undefined || req.query.name != undefined ||	req.query.description != undefined ||
		req.query.author != undefined || req.query.language != undefined || req.query.code != undefined || 
		req.query.tags != undefined )
		getSnippetWithAttributes(req, res);
	else if(Object.keys(req.query).length == 0)
		getAllSnippets(req, res);
	else
		functions.error404function(req, res);
};

function getAllSnippets(req, res) {
	res.send({url: req.originalUrl, type: "get all snippets", callStatus: "success"});
}

function getSnippetWithAttributes(req, res) {
	res.send({url: req.originalUrl, type: "get snippets with attributes", callStatus: "success"});
}

exports.postSnippet = function(req, res){
	res.send({url: req.originalUrl, type: "post snippets", callStatus: "success"});
};

exports.getSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "get snippet id", callStatus: "success"});
};

exports.updateSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "put snippet with id", callStatus: "success"});
};

exports.deleteSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "delete snippet with id", callStatus: "success"});
};

exports.error404function =  function(req, res){
	res.status(404).send({url: req.originalUrl + ' not found'});
};