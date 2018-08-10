'use strict'

const EventEmitter = require('events')

class AcademyAgent extends EventEmitter {

    constructor (options) {
        super ()

        this._options = options
        this._started = false
        this._timer = null
    }

    connect () {
        if (!this._started) {
            this._started = true
            this.emit('agent/connected')
            this._timer = setInterval(() => {
                this.emit('agent/message', 'this is a message')
            }, this._options.interval)
        }
    }

    disconnect () {
        if (this._started) {
            clearInterval(this._timer)
            this._started = false
            this.emit('agent/disconnected')
        }
    }
}

module.exports = AcademyAgent
