### app-server-real-mqtt

##  `agent/connected`

``` js
{
    agent: {
        uuid,   // auto generado
        username,   //  define by configuration
        name,   //  define by configuration
        hostname,   //  get SO
        pid     // get process
    }
}
```

##  `agent/disconnected`

``` js
{
    agent: {
        uuid
    }
}
```

##  `aagent/message`

``` js
{
    agent,
    metrics: [
        {
            type,
            value
        }
    ],
    timestamps  // generate when message created
}
```
