# db-application

## Usage

``` js

const setupDatabase = require('db-app')

setupDatabase(config).then(db => {
    const { Agent, Metric } = db
}).catch(err => console.error(err) )

```