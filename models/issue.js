const mongoose = require('mongoose')

const IssueSchema = mongoose.Schema({
  project_title: {
    type: String,
    required: true
  },
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  status_text: {
    type: String
  },
  created_on: {
    type: Date,
    required: true
  },
  updated_on: {
    type: Date,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
})


const Issue = module.exports = mongoose.model('Issue', IssueSchema)