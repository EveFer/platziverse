'use strict'

const Squelize = require('sequelize')

let sequelize = null

module.exports = function setupDatabase (config) {
  if (!sequelize) {
    sequelize = new Squelize(config)
  }
  return sequelize
}
