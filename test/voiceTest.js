var express = require('express');
var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('../app');

var voicenote = {
	"uid": "5721df1ea47bab11008ab97d"
};

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

describe('Testing voice route', function() {
	it('should return 200 if api can find and return all voices', function(done){
		makeRequest('/voices', 200, function(err, res) {
			done();
		});
	});

	it('should return 200 if api can find voice with specific id', function(done) {
		makeRequest('/voices/5721e6b53d9c1111007c1811', 200, function(err, res) {
			if (err) {return done(err);}

			expect(res.body._id).to.equal('5721e6b53d9c1111007c1811');
			done();
		});
	});
	it("should update the voicenote's user", function(done) {
		makePutRequest('/voices/b1d458d35024f3cc6f151bcfbef2a8b0', voicenote, 200, function(err, res) {
			if (err) { return done(err) }

			expect(res.body.message).to.equal('Voice updated');
			done();
		});
	});

	it("should delete the voicenote", function(done) {
		makeDeleteRequest('/voices/5721ed0114cf9511001b9e3a', 200, function(err, res) {
			if (err) { return done(err) }

			expect(res.body.message).to.equal('Successfully deleted');
			done();
		});
	});

	it('should return voices from a specific user', function(done) {
		makeRequest('/users/5721df1ea47bab11008ab97d/voices', 200, function(err, res) {
			if (err) { return done(err) }

			var array = res.body;

			//each voice note has to be of the given user
			array.forEach(function(item) {
				expect(item.user).to.equal('5721df1ea47bab11008ab97d');
			});

			done();
		});
	});
});

describe('invalid route', function() {
	it('should return 404 when route is not found', function(done) {
		makeRequest('/randomRoute/someRandomRoute', 404, done);
	});
});