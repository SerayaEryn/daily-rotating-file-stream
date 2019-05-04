'use strict'

const DailyRotatingFileStream = require('..')
const test = require('ava')
const { join } = require('path')
const DateFormat = require('fast-date-format')
const fs = require('fs')

const dateFormat = new DateFormat('DDMMYYYY')

test.cb('Should end stream', (t) => {
  t.plan(1)
  const options = {
    fileName: join(__dirname, '/testfiles0/console%DATE%.log')
  }

  const stream = new DailyRotatingFileStream(options)
  stream.on('finish', () => {
    t.pass()
    cleanUp(getFileName(0))
    t.end()
  })
  stream.end()
})

test.cb('Should write to file', (t) => {
  t.plan(4)
  const options = {
    fileName: join(__dirname, '/testfiles1/console%DATE%.log')
  }
  const fileName = getFileName(1)
  const stream = new DailyRotatingFileStream(options)

  stream.write('hello world')
  stream.on('finish', () => {
    t.pass()
    fs.readFile(fileName, (err, buffer) => {
      t.falsy(err)
      t.truthy(buffer)
      t.is(buffer.toString(), 'hello world')
      cleanUp(fileName)
      t.end()
    })
  })
  stream.end()
})

test.cb('Should write to file with bufferSize', (t) => {
  t.plan(3)
  const options = {
    fileName: join(__dirname, '/testfiles2/console%DATE%.log'),
    bufferSize: 32
  }
  const fileName = getFileName(2)
  const stream = new DailyRotatingFileStream(options)

  stream.write('hello world')
  stream.on('finish', () => {
    fs.readFile(fileName, (err, buffer) => {
      t.falsy(err)
      t.truthy(buffer)
      t.is(buffer.toString(), 'hello world')
      cleanUp(fileName)
      t.end()
    })
  })
  stream.end()
})

test.cb('Should write to file with rotating', (t) => {
  t.plan(4)
  const options = {
    fileName: join(__dirname, '/testfiles3/console%DATE%.log')
  }
  const fileName = getFileName(3)
  const stream = new DailyRotatingFileStream(options)
  stream.once('ready', () => {
    stream.currentDate = ~~(Date.now() / 86400000) - 1

    stream.on('rotate', () => {
      t.pass('rotate emitted')
    })
    stream.write('hello world')

    stream.on('finish', () => {
      fs.readFile(fileName, (err, buffer) => {
        t.falsy(err)
        t.truthy(buffer)
        t.is(buffer.toString(), 'hello world')
        cleanUp(fileName)
        t.end()
      })
    })
    stream.end()
  })
})

test.cb('Should write to file once ready', (t) => {
  t.plan(3)
  const options = {
    fileName: join(__dirname, '/testfiles4/console%DATE%.log')
  }
  const fileName = getFileName(4)
  const stream = new DailyRotatingFileStream(options)

  stream.write('hello world')
  stream.on('finish', () => {
    fs.readFile(fileName, (err, buffer) => {
      t.falsy(err)
      t.truthy(buffer)
      t.is(buffer.toString(), 'hello world')
      cleanUp(fileName)
      t.end()
    })
  })
  stream.end()
})

test.cb('Should end ready stream', (t) => {
  t.plan(2)
  const options = {
    fileName: join(__dirname, '/testfiles5/console%DATE%.log')
  }

  const stream = new DailyRotatingFileStream(options)
  stream.on('ready', () => {
    t.pass('ready emitted')
    stream.on('finish', () => {
      t.pass('finish emitted')
      cleanUp(getFileName(5))
      t.end()
    })
    stream.end()
  })
})

test.cb('Should destroy stream', (t) => {
  t.plan(1)
  const options = {
    fileName: join(__dirname, '/testfiles6/console%DATE%.log')
  }

  const stream = new DailyRotatingFileStream(options)
  stream.destroy()
  stream.on('close', () => {
    t.truthy(stream.destroyed)
    cleanUp(getFileName(6))
    t.end()
  })
})

test.cb('Should flush', (t) => {
  t.plan(3)
  const options = {
    fileName: join(__dirname, '/testfiles7/console%DATE%.log')
  }
  const fileName = getFileName(7)
  const stream = new DailyRotatingFileStream(options)

  stream.write('hello world')
  stream.flush()
  stream.on('finish', () => {
    fs.readFile(fileName, (err, buffer) => {
      t.falsy(err)
      t.truthy(buffer)
      t.is(buffer.toString(), 'hello world')
      cleanUp(fileName)
      t.end()
    })
  })
  stream.end()
})

function cleanUp (fileName) {
  if (fs.existsSync(fileName)) {
    fs.unlinkSync(fileName)
  }
  const index = fileName.lastIndexOf('/')
  const folder = fileName.substring(0, index)
  if (fs.existsSync(folder)) {
    fs.rmdirSync(folder)
  }
}

function getFileName (index) {
  return join(__dirname, `/testfiles${index}/console${dateFormat.format()}.log`)
}
