# Academy-agent

## Usage

``` js

const AcademyAgent = require('academy-agent')
const agent = new AcademyAgent({
    interval: 2000
})

agent.connect()

// This agent only
agent.on('connected')
agent.on('disconnected')
agent.on('message')

agent.on('agent/connected')
agent.on('agent/disconnected')
agent.on('agent/message', payload => {
    console.log(payload)
})

setTimeout(() => agent.disconnect(), 20000)

```