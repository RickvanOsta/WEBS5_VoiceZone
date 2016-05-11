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

function makePostRequest(route, body, statusCode, callback) {
	request(app)
		.post(route)
		.type('json')
		.send(body)
		.expect(statusCode)
		.end(function(err, res){
			if(err) { return callback(err) }

			callback(err, res);
		});
}

var testUser = {
	"_id": "123123123",
	"local": { "email": "testUser@email.com", "password": "123456789" }
};

describe('Testing users route', function() {

	describe('create user', function() {
		it('should create a new user', function(done) {
			makePostRequest('/users', testUser, 200, function(err, res) {
				if (err) { return done(err) }

				expect(res.body.message).to.equal('User created!');
				done();
			});
		});
	});

	describe('get users', function() {
		it('should return 200 if api can find and return all users', function(done){
			makeRequest('/users', 200, function(err, res){
				if (err) { return done(err) }

				done();
			});
		});

		it('should return the user with the specified id', function(done) {
			makeRequest('/users/56fd01c8d8996a742ae10953', 200, function(err, res) {
				if (err) {return done(err);}

				done();
			});
		});
	});

	// describe('put user', function() {
	// 	it('should update the user', function(done) {
	// 		//makePutRequest()
	// 	});
	// });

	describe('invalid route', function() {
		it('should return 404 when route is not found', function(done) {
			makeRequest('/randomRoute/someRandomRoute', 404, done);
		});
	});
});