'use strict'

const db  = require('../')

async function run () {
    const config = {
        database: process.env.DB_NAME || 'academydb',
        username: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || 'admin',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres'
      }

    const { Agent,  Metric } = await db(config).catch(handleFatalError)

    const agent = await Agent.createOrUpdate({
        uuid: 'yya',
        name: 'alberto',
        username: 'Achamorro04',
        hostname: '127.0.0.0.1',
        pid: 1,
        connected: true
    }).catch(handleFatalError)

    console.log('----created agent-----')
    console.log(agent)

    const agents = await Agent.findAll().catch(handleFatalError)
    console.log('----list agents-----')
    console.log(agents)

    const metric = await Metric.create(agent.uuid, {
        type: 'memory',
        value:  '300'
    }).catch(handleFatalError)
    console.log('----create metric-----')
    console.log(metric)

    const metrics = await Metric.findByAgentUuid(agent.uuid).catch(handleFatalError)
    console.log('----findByAgentUuid metrics-----')
    console.log(metrics)

    const metricsByType = await Metric.findByTypeAgentUuid(metric.type, agent.uuid).catch(handleFatalError)
    console.log('----findByTypeAgentUuid metrics-----')
    console.log(metricsByType)

    console.log('Success End... !')
    process.exit(0)
}

function handleFatalError (err) {
    console.error(`${err.message}`)
    console.error(err.stack)
    process.exit(1)
}  

run()
