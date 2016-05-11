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
};

describe('Testing users route', function() {
	describe('get users', function() {

		it('should return 200 if api can find and return all users', function(done){
			makeRequest('/', 200, function(err, res){

				//expecten
				done();
			});
		});

		it('should return 200 if api can find a user with specific id', function(done) {
			makeRequest('/56fd01c8d8996a742ae10953', 200, function(err, res) {
				if (err) {return done(err);}

				console.log(res.body);
			});
		});
	});

	describe('invalid route', function() {
		it('should return 404 when route is not found', function(done) {
			makeRequest('/randomRoute/someRandomRoute', 404, done);
		});
	});
});