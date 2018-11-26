class Logger {

  constructor() {
    this.logLevel = 'info';
    this.availableLogLevels = [
      'verbose',
      'info',
      'warning',
      'error',
    ]
  }

  /**
   * Sets the log level.
   * @param logLevel
   */
  setLogLevel(logLevel) {
    if (this.availableLogLevels.indexOf(logLevel) > -1) {
      this.logLevel = logLevel;
    }
  }

  /**
   * Logs information, which might be only useful for developers
   * @param text Text to be logged
   */
  logVerbose(text) {
    if (this.availableLogLevels.indexOf(this.logLevel) <= this.availableLogLevels.indexOf('verbose')) {
      console.log(`Verbose: ${text}`);
    }
  }

  /**
   * Logs information, which might be interesting while running
   * @param text Text to be logged
   */
  logInfo(text) {
    if (this.availableLogLevels.indexOf(this.logLevel) <= this.availableLogLevels.indexOf('info')) {
      console.log(`Info   : ${text}`);
    }
  }

  /**
   * Logs warnings
   * @param text Text to be logged
   */
  logWarning(text) {
    if (this.availableLogLevels.indexOf(this.logLevel) <= this.availableLogLevels.indexOf('warning')) {
      console.log(`Warning: ${text}`);
    }
  }

  /**
   * Logs errors
   * @param text Text to be logged
   */
  logError(text) {
    if (this.availableLogLevels.indexOf(this.logLevel) <= this.availableLogLevels.indexOf('error')) {
      console.log(`Error  : ${text}`);
    }
  }
}

module.exports = Logger;