"use strict";
var functions = require("./functions.js"),
	dbconfig = require("../config/dbconfig.json");
const { Client } = require("pg");
const client = new Client(dbconfig.dbcredentials);
client.connect();

exports.getSnippets = function(req, res){
	if( req.query.id !== undefined || req.query.name !== undefined ||	req.query.description !== undefined ||
		req.query.author !== undefined || req.query.language !== undefined || req.query.code !== undefined || 
		req.query.tags !== undefined )
		getSnippetWithAttributes(req, res);
	else if(Object.keys(req.query).length === 0)
		getAllSnippets(req, res);
	else
		functions.error404function(req, res);
};

function getAllSnippets(req, res) {
	client.query("SELECT * FROM snippets;").then(function(dbres){
		var retString = "";
		var count = 0;
		for(let row of dbres.rows){
			retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		retString = "{" + retString.substring(0, retString.length -1) + "}";
		var retJson = JSON.parse(retString);
		res.send(retJson);
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42P01")
				functions.error404function(req, res);
			else if(dberr.code === "42703")
				functions.error400function(req, res);
			else
				functions.error500function(req, res);
		}
	});
}

function getSnippetWithAttributes(req, res) {
	var id = "%",
		name = "%",
		description = "%",
		author = "%",
		language = "%",
		code = "%";
	var tagsWhere = "";
	if(req.query.id !== undefined)
		id = "%" + req.query.id + "%";
	if(req.query.name !== undefined)
		name = "%" + req.query.name + "%";
	if(req.query.description !== undefined)
		description = "%" + req.query.description + "%";
	if(req.query.author !== undefined)
		author = "%" + req.query.author + "%";
	if(req.query.language !== undefined)
		language = "%" + req.query.language + "%";
	if(req.query.code !== undefined)
		code = "%" + req.query.code + "%";
	if(req.query.tags !== undefined)
		tagsWhere = " AND '" + req.query.tags + "' = ANY(tags)";

	client.query("SELECT * FROM snippets where to_char(id, '9999999') like $1 and name like $2 and description like $3 and author like $4 and language like $5 and code like $6" + tagsWhere, [id, name, description, author, language, code]).then(function(dbres){
		var retString = "";
		var count = 0;
		for(let row of dbres.rows){
			retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		retString = "{" + retString.substring(0, retString.length -1) + "}";
		console.log(retString);
		var retJson = JSON.parse(retString);
		res.send(retJson);
	}).catch(function(dberr){
		console.log(dberr);
		if(dberr){
			if(dberr.code === "42703" || dberror.code === "42601")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	});
}

exports.postSnippet = function(req, res){
	res.send({url: req.originalUrl, type: "post snippets", callStatus: "success"});
};

exports.getSnippetById = function(req, res){
	client.query("SELECT * FROM snippets WHERE id = $1;", [1]).then(function(dbres){
		var retString = "";
		var count = 0;
		for(let row of dbres.rows){
			retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
			count++;
		}
		retString = "{" + retString.substring(0, retString.length -1) + "}";
		var retJson = JSON.parse(retString);
		res.send(retJson);
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42P01")
				functions.error404function(req, res);
			else if(dberr.code === "42703")
				functions.error400function(req, res);
			else
				functions.error500function(req, res);
		}
	});
};

exports.updateSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "put snippet with id", callStatus: "success"});
};

exports.deleteSnippetById = function(req, res){
	res.send({url: req.originalUrl, type: "delete snippet with id", callStatus: "success"});
};

exports.error400function =  function(req, res){
	res.status(400).send({error: "400: Bad request"});
};

exports.error404function =  function(req, res){
	res.status(404).send({error: "404: " + req.originalUrl + " not found"});
};

exports.error500function =  function(req, res){
	res.status(500).send({error: "500: Internal server error"});
};