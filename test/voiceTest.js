var express = require('express');
var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../app');

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done();
		});
};

describe('Testing voice route', function() {
	describe('get voices', function() {
		it('should return 200 if api can find and return all voices', function(done){
			makeRequest('/voices', 200, function(err, res) {
				done();
			});
		});

		it('should return 200 if api can find voice with specific id', function(done) {
			makeRequest('/voices/5721ed0114cf9511001b9e3a', 200, function(err, res) {
				if (err) {return done(err);}

				done();
			});
		});
	});

	describe('invalid route', function() {
		it('should return 404 when route is not found', function(done) {
			makeRequest('/randomRoute/someRandomRoute', 404, done);
		});
	});
});