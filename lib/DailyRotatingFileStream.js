'use strict'

const SonicBoom = require('sonic-boom')
const DateFormat = require('fast-date-format')
const mkdirp = require('mkdirp')
const EventEmitter = require('events')

const DATE_FORMAT = 'DDMMYYYY'

module.exports = class DailyRotatingFileStream extends EventEmitter {
  constructor (options) {
    super(options)
    this.fileName = options.fileName
    this.dateFormatter = new DateFormat(options.dateFormat || DATE_FORMAT)
    this.currentDate = Math.floor(Date.now() / 86400000)

    const formatted = this.dateFormatter.format()
    this.logfile = this.fileName.replace(/%DATE%/g, formatted)

    this._ensureDirectoryExists()
    this._ready = false
    const bufferSize = options.bufferSize != null ? options.bufferSize : 4096
    this.stream = new SonicBoom(this.logfile, bufferSize)
    bubbleEvents(['close', 'finish', 'error', 'ready'], this.stream, this)
  }

  write (chunk) {
    if (~~(Date.now() / 86400000) !== this.currentDate) {
      this._rotate()
    }
    return this.stream.write(chunk)
  }

  destroy () {
    this.stream.destroy()
  }

  end () {
    if (this.stream._opening) {
      this.stream.on('ready', () => {
        this.stream.end()
      })
    } else {
      this.stream.end()
    }
  }

  get destroyed () {
    return this.stream.destroyed
  }

  _ensureDirectoryExists () {
    const index = this.logfile.lastIndexOf('/')
    const path = this.logfile.substring(0, index)
    mkdirp.sync(path)
  }

  _rotate () {
    const newDate = this.dateFormatter.format()
    const newLogfile = this.fileName.replace(/%DATE%/g, newDate)
    this.currentDate = Math.floor(Date.now() / 86400000)
    this.stream.reopen(newLogfile)
    this.emit('rotate')
  }
}

function bubbleEvents (events, emitterA, emitterB) {
  for (const event of events) {
    emitterA.on(event, (...args) => {
      emitterB.emit(event, ...args)
    })
  }
}
