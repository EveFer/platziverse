'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })
  
  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel) // el modelo de agent tiene muchas metricas
  MetricModel.belongsTo(AgentModel) // el modelo de metrica pertece a un agente

  await sequelize.authenticate() // para verificar que se haya conectado bien a la bd, esta funcion es un promesa

  // verifica si en el campo setup de config es true para poder sincronizar la base de datos y crearla en el servidor
  if (config.setup) {
    await sequelize.sync({ force: true }) // esta funcion: verifica si los modelos no existen en la bd los crea
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}

/*
crear role en postgres
postgres=# CREATE ROLE node WITH LOGIN PASSWORD 'node';
CREATE ROLE
postgres=# CREATE DATABASE platziverse;
CREATE DATABASE
postgres=# GRANT ALL PRIVILEGES ON DATABASE platziverse TO node;
GRANT

*/
