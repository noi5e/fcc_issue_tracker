/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');

var assert = chai.assert;
var server = require('../server');
var Issue = require('../models/issue')

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    let testId = ''
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
        
        const testData = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        }
        
       chai.request(server)
        .post('/api/issues/test')
        .send(testData)
        .end(function(err, res){
          assert.equal(res.status, 200);
          
          //fill me in too!
          for (var key in testData) {
            assert.equal(res.key, testData.key)
          }
          
         // console.log(res)
         
          assert.isTrue(res.body.hasOwnProperty('created_on'))
          assert.isTrue(res.body.hasOwnProperty('updated_on'))
          assert.isTrue(res.body.hasOwnProperty('open'))
         
          testId = res.body._id
         
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        const testData = {
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in'
        }
        
        chai.request(server)
          .post('/api/issues/test')
          .send(testData)
          .end(function(err, res) {
            assert.equal(res.status, 200)
          
            for (var key in testData) {
              assert.equal(res.key, testData.key)
            }
          
            assert.isTrue(res.body.hasOwnProperty('created_on'))
            assert.isTrue(res.body.hasOwnProperty('updated_on'))
            assert.isTrue(res.body.hasOwnProperty('open'))

            done();
          })
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({ issue_title: 'blah blah' })
          .end(function(err, res) {
            assert.equal(res.status, 400)
          
            done()
          })
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({})
          .end(function(err, res){
            assert.equal(res.text, 'no updated field sent')
            done()
          }) 
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ _id: testId, created_by: 'bob' })
          .end(function(err, res) {
            
            assert.equal(res.text, 'successfully updated')
          
            Issue.findOne({ _id: testId }, (err, issue) => {
              assert.equal(issue.created_by, 'bob')
              
              done()
            })
          })
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({ _id: testId, created_by: 'joe', issue_title: 'joe has no pants' })
          .end(function(err, res) {
            assert.equal(res.text, 'successfully updated')
            
            Issue.findOne({ _id: testId }, (err, issue) => {
              assert.equal(issue.created_by, 'joe')
              assert.equal(issue.issue_title, 'joe has no pants')
              
              done()
            })
          })
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
            .query({ _id: testId })
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(res.body[0].created_by, 'joe')
          
              done()
            })
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
            .query({ created_by: 'joe', issue_title: 'joe has no pants' })
            .end(function(err, res) {
              assert.equal(res.status, 200)
              assert.equal(res.body[0]._id, testId)
          
              done()
            })
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({})
          .end(function(err, res) {
            assert.equal(res.text, '_id error')
          
            done()
          })
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({ _id: testId })
          .end(function(err, res) {
            assert.equal(res.text, 'deleted ' + testId)
          
            done()
          })
      });
      
    });

});
