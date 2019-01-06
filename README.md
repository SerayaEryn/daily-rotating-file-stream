# daily-rotating-file-stream

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

## DailyRotatingFileStream#destroy()

Destroys the stream.

## DailyRotatingFileStream#end()

Flushes the data and ends the stream.

## License

[MIT](./LICENSE)
