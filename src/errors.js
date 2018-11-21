let errorHandler = function (errorMessage, exitCode) {
  process.stderr.write(errorMessage + '\n');
  if (exitCode >= 1) {
    process.exit(exitCode);
  }
};


module.exports = {
  errorHandler,
  missingAgrumentError() {
    return 'No argument(s) passed! Please provide at least one path.'
  },
  readingFileFailed(filePath, err) {
    return `Failed reading File ${filePath}!\nError:\n ${err}`
  },
  noFileOrDirectory(path) {
    return `Argument ${path} isn't a file or directory!`
  },
  failedReadingDefaultSettings(){
    return `Failed reading the default settings!`
  },
  norDefaultOrCustomConfigCouldBeRead(){
    return `Neither default or custom config could be read!`
  },
};