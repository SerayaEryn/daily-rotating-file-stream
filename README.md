# daily-rotating-file-stream

![Build Status](https://github.com/SerayaEryn/daily-rotating-file-stream/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/SerayaEryn/daily-rotating-file-stream/badge.svg?branch=master)](https://coveralls.io/github/SerayaEryn/daily-rotating-file-stream?branch=master)
[![NPM version](https://img.shields.io/npm/v/daily-rotating-file-stream.svg?style=flat)](https://www.npmjs.com/package/daily-rotating-file-stream)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Installation

```bash
npm i daily-rotating-file-stream
```

## API

## DailyRotatingFileStream(options)

### fileName

The name of the log file(s). Must contain a `%DATE%` placeholder.

### dateFormat (optional)

The format of the date that will replace the placeholder `%DATE%` in the file name. Defaults to `DDMMYYYY`.<br>
Supports all formating options of [fast-date-format](https://github.com/SerayaEryn/fast-date-format).

### bufferSize (optional)

The size of the internal buffer that is used to store the logs before writing them to the file. Defaults to `4096`. 

## DailyRotatingFileStream#write(string)

Writes a string to the file.

## DailyRotatingFileStream#flush()

Flushes the content of the buffer to the file.

## DailyRotatingFileStream#destroy()

Destroys the stream.

## DailyRotatingFileStream#end()

Flushes the data and ends the stream.

## License

[MIT](./LICENSE)
