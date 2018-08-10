# Academy-agent

## Usage

``` js

const AcademyAgent = require('academy-agent')
const agent = new AcademyAgent({
    interval: 2000
})

agent.connect()
agent.on('agent/message', payload => {
    console.log(payload)
})

setTimeout(() => agent.disconnect(), 20000)

```