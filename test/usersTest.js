var express = require('express');
var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../app');


function makeRequest(route, statusCode, callback){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return callback(err); }

			callback(err, res);
		});
}

function makePutRequest(route, body, statusCode, callback) {
	request(app)
		.put(route)
		.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res) {
			if(err) { return callback(err) }

			callback(err, res);
		});
}

function makeDeleteRequest(route, statusCode, callback) {
	request(app)
		.del(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err) { return callback(err) }

			callback(err, res);
		});
}

var testUser = {
	"firstname": "test"
};

describe('Testing users route', function() {
	it('should return 200 if api can find and return all users', function(done){
		makeRequest('/users', 200, function(err, res){
			if (err) { return done(err) }

			done();
		});
	});

	it('should return the user with the specified id', function(done) {
		makeRequest('/users/56fd01c8d8996a742ae10953', 200, function(err, res) {
			if (err) {return done(err);}

			expect(res.body._id).to.equal('56fd01c8d8996a742ae10953');
			done();
		});
	});

	it('should update the user', function(done) {
		makePutRequest("/users/56fd01c8d8996a742ae10953", testUser, 200, function(err, res) {
			if (err) { return done(err); }

			done();
		});
	});

	it('should delete the user', function(done) {
		makeDeleteRequest("/users/5733058fd901d8d43e4b899e", 202, function(err, res) {
			if (err) { return done(err);}

			expect(res.body.message).to.equal('Successfully deleted');
			done();
		});
	});
});