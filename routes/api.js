/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// var expect = require('chai').expect;
// var MongoClient = require('mongodb');
// var ObjectId = require('mongodb').ObjectID;

const Issue = require('../models/issue')

// const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
    
      Issue.find(Object.assign(req.query, { project_title: project }), (error, documents) => {
        res.status(200).json(documents)
      })
    })
    
    .post(function (req, res){
      var project = req.params.project;
      // I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
      
      var issue_title = req.body.issue_title
      var issue_text = req.body.issue_text
      var created_by = req.body.created_by
      
      if (req.body.issue_title === undefined|| req.body.issue_text === undefined || req.body.created_by === undefined || !project) {
        res.status(400).send('POST requests must have the following properties: project name, issue_title, issue_text, and created_by')
      } else {
        var assigned_to = req.body.assigned_to
        var status_text = req.body.status_text

        let newIssueData = {
          project_title: project,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          created_on: new Date,
          updated_on: new Date,
          open: true
        }

        if (req.body.assigned_to) {
          newIssueData.assigned_to = req.body.assigned_to
        }

        if (req.body.status_text) {
          newIssueData.status_text = req.body.status_text
        }

        const newIssue = new Issue(newIssueData)

        newIssue.save((error, issue) => {
          if (error) { console.log('error saving new issue: ', error) }

          res.status(200).json(issue)
        })
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
    
      Issue.findOne({ _id: req.body._id }, (error, issue) => {
        let bodyContainsNoData = true
        
        for (var field in req.body) {
          if (req.body[field] && field !== '_id') {
            bodyContainsNoData = false
            
            issue[field] = req.body[field]
          }
        }
        
        if (bodyContainsNoData) {
          res.send('no updated field sent')
        } else {
          issue.updated_on = new Date

          issue.save((error, issue) => {
            if (error) {
              console.log(error)
              res.status(500).send('could not update ' + req.body._id)
            }

            res.status(200).send('successfully updated')
          })
        }
      })
    })
    
    .delete(function (req, res){
      console.log('delete request')
    
      var project = req.params.project;
    
      if (!req.body._id) {
        res.send('_id error')
      } else {
        Issue.deleteOne({ _id: req.body._id }, (error) => {
          if (error) {
            res.send('could not delete ' + req.body._id)
          } else {
            res.send('deleted ' + req.body._id)
          }
        })
      }
    });
    
};
