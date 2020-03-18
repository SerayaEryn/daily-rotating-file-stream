'use strict'

const SonicBoom = require('sonic-boom')
const DateFormat = require('fast-date-format')
const mkdirp = require('mkdirp')
const EventEmitter = require('events')

const DATE_FORMAT = 'DDMMYYYY'

const ensureDirectoryExists = Symbol('ensureDirectoryExists')
const rotate = Symbol('rotate')
const stream = Symbol('stream')
const dateFormatter = Symbol('dateFormatter')
const fileName = Symbol('fileName')
const logfile = Symbol('logfile')

module.exports = class DailyRotatingFileStream extends EventEmitter {
  constructor (options) {
    super()
    this[fileName] = options.fileName
    this[dateFormatter] = new DateFormat(options.dateFormat || DATE_FORMAT)
    this.currentDate = Math.floor(Date.now() / 86400000)

    const formatted = this[dateFormatter].format()
    this[logfile] = this[fileName].replace(/%DATE%/g, formatted)

    this[ensureDirectoryExists]()
    const bufferSize = options.bufferSize != null ? options.bufferSize : 4096
    this[stream] = new SonicBoom({ dest: this[logfile], minLength: bufferSize })
    bubbleEvents(['close', 'finish', 'error', 'ready'], this[stream], this)
  }

  write (chunk) {
    if (~~(Date.now() / 86400000) !== this.currentDate) {
      this[rotate]()
    }
    return this[stream].write(chunk)
  }

  flush () {
    this[stream].flush()
  }

  destroy () {
    this[stream].destroy()
  }

  end () {
    this[stream].end()
  }

  get destroyed () {
    return this[stream].destroyed
  }

  [ensureDirectoryExists] () {
    const index = this[logfile].lastIndexOf('/')
    const path = this[logfile].substring(0, index)
    mkdirp.sync(path)
  }

  [rotate] () {
    const newDate = this[dateFormatter].format()
    const newLogfile = this[fileName].replace(/%DATE%/g, newDate)
    this.currentDate = Math.floor(Date.now() / 86400000)
    this[stream].reopen(newLogfile)
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
