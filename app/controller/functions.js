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
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){
		functions.error500function(req, res);
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
		var retJson = JSON.parse(retString);
		res.send(retJson);
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){
		functions.error500function(req, res);
	});
}

exports.postSnippet = function(req, res){
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		functions.error422function(req, res);
		return;
	}
	var name = req.body.name,
		description = req.body.description,
		author = req.body.author,
		language = req.body.language,
		code = req.body.code,
		tags = req.body.tags;
	
	if(name === undefined || description === undefined || author === undefined || language === undefined || code === undefined){
		functions.error422function(req, res);
		return;
	}
	if(tags === undefined){
		tags = [];
	}
	client.query("INSERT INTO snippets VALUES(DEFAULT, $1, $2, $3, $4, $5, $6);", [name, description, author, language, code, tags]).then(function(dbres){
		client.query("SELECT * FROM snippets WHERE name = $1 order by id desc LIMIT 1;", [name]).then(function(dbres){
			var retString = "";
			var count = 0;
			for(let row of dbres.rows){
				retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
				count++;
			}
			retString = "{" + retString.substring(0, retString.length -1) + "}";
			var retJson = JSON.parse(retString);
			res.send(retJson);
		});
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){
		functions.error500function(req, res);
	});
};

exports.getSnippetById = function(req, res){
	var id = req.originalUrl.split("/")[2];
	if(isNaN(id)){
		functions.error400function(req, res);
		return;
	}
	client.query("SELECT * FROM snippets WHERE id = $1;", [id]).then(function(dbres){
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
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){
		functions.error500function(req, res);
	});
};

exports.updateSnippetById = function(req, res){
	if(req.body.constructor === Object && Object.keys(req.body).length === 0){
		functions.error422function(req, res);
		return;
	}
	var id = req.originalUrl.split("/")[2];
	if(isNaN(id)){
		functions.error400function(req, res);
		return;
	}
	var name = req.body.name,
		description = req.body.description,
		author = req.body.author,
		language = req.body.language,
		code = req.body.code,
		tags = req.body.tags;
	
	if(name === undefined || description === undefined || author === undefined || language === undefined || code === undefined){
		functions.error422function(req, res);
		return;
	}
	if(tags === undefined){
		tags = [];
	}
	client.query("UPDATE snippets SET name = $1, description = $2, author = $3, language = $4, code = $5, tags = $6 where id = $7;", [name, description, author, language, code, tags, id]).then(function(dbres){
		client.query("SELECT * FROM snippets WHERE id = $1;", [id]).then(function(dbres){
			var retString = "";
			var count = 0;
			for(let row of dbres.rows){
				retString += "\"" + count + "\":" + JSON.stringify(row) + ",";
				count++;
			}
			retString = "{" + retString.substring(0, retString.length -1) + "}";
			var retJson = JSON.parse(retString);
			res.send(retJson);
		});
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){

		functions.error500function(req, res);
	});
};

exports.deleteSnippetById = function(req, res){
	var id = req.originalUrl.split("/")[2];
	if(isNaN(id)){
		functions.error400function(req, res);
		return;
	}
	client.query("DELETE FROM snippets WHERE id = $1;", [id]).then(function(dbres){
		res.send({"status": "success", "id": id});
	}).catch(function(dberr){
		if(dberr){
			if(dberr.code === "42703" || dberror.code === "42601" || dberr.code === "22P02")
				functions.error400function(req, res);
			else if(dberr.code === "42P01")
				functions.error404function(req, res);
			else
				functions.error500function(req, res);
		}
	}).catch(function(err){
		functions.error500function(req, res);
	});
};

exports.error400function =  function(req, res){
	res.status(400).send({error: "400: Bad request"});
};

exports.error404function =  function(req, res){
	res.status(404).send({error: "404: " + req.originalUrl + " not found"});
};

exports.error422function = function(req, res){
	res.status(422).send({error: "422: Unprocessable Entity, invalid JSON format in body or missing argument"});
};

exports.error500function =  function(req, res){
	res.status(500).send({error: "500: Internal server error"});
};