'use strict';

//internal
const Errors = require('./errors');
const Logger = require('./logger');
const log = new Logger();

//External
const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const jsonTryParse = require('json-try-parse');
const naturalSort = require('natural-sort');
const globby = require('globby');

class Sorter {

  constructor() {
    this.config = {};
    this.readConfig();
  }

  /**
   * Reads config.
   * Checks if the default config could be read.
   * Checks if the custom config could be read.
   * If both could be read merges them to a single object and passes it to the process function.
   * If there is no custom config only the default config will be processed.
   */
  readConfig() {
    // Add parameter for passing own config path

    const defaultConfigRelativePath = '../config/class-sort.json';
    const defaultConfigPath = path.resolve(__dirname, defaultConfigRelativePath);
    const defaultConfigContent = fs.readFileSync(defaultConfigPath, 'utf8');
    const defaultConfig = jsonTryParse(defaultConfigContent);
    const dcDefined = defaultConfig !== undefined;
    if (!dcDefined) {
      Errors.errorHandler(Errors.failedReadingDefaultSettings(), 1)
    }

    let customConfigPath = findUp.sync('class-sort.json');
    if (!customConfigPath) {
      this.processConfig(defaultConfig)
    } else {
      let customConfigContent = null;
      try {
        customConfigContent = fs.readFileSync(customConfigPath, 'utf8');
      } catch (e) {
        console.log(e);
        this.processConfig(defaultConfig);
        return;
      }
      if (typeof customConfigContent === 'string' && customConfigContent) {
        const customConfig = jsonTryParse(customConfigContent);
        const ccDefined = customConfig !== undefined;

        if (ccDefined && dcDefined) {
          const mergedConfig = Object.assign(defaultConfig, customConfig);
          this.processConfig(mergedConfig);
          log.logVerbose('Custom config could be read');
        } else {
          log.logInfo('Custom config could not be read');
          this.processConfig(defaultConfig)
        }
      } else if (!dcDefined) {
        Errors.errorHandler(Errors.norDefaultOrCustomConfigCouldBeRead(), 1);
      }
    }
  }

  /**
   * Assigns properties from the configObject to this.config
   * @param configObject Object with defined attributes
   */
  processConfig(configObject) {
    this.config = {};
    this.config.exclude = configObject.exclude;
    this.config.fileTypes = configObject['file-types'];
    this.config.sortOrder = configObject['sort-order'];
    if (this.config.logLevel) {
      log.setLogLevel(this.config.logLevel);
    }
  }

  /**
   * Sorts a class tag.
   * Removes the class.
   * Gets the quotes.
   * Removes the quotes.
   * Makes the string to an array separated by spaces.
   * Sorts the class array.
   * Joins the sorted array and reconstructs the class tag.
   * @param unsortedString String which contains class='...'
   * @param self String context
   * @returns {string} sorted class
   */
  sort(unsortedString, self = this) {
    const doubleSpaces = /\s\s+/g;
    let classesString = unsortedString.replace('class=', '');
    classesString = (classesString.replace(doubleSpaces, ' '));
    const quotes = classesString[0];
    const regex = new RegExp(quotes, 'g');
    classesString = classesString.replace(regex, '');
    let classesArray = classesString.split(' ');
    // classesArray = classesArray.sort();

    classesArray = Sorter.sortArrayByArray(classesArray, self.config.sortOrder);
    const sortedClasses = classesArray.join(' ').trim();

    return 'class=' + quotes + sortedClasses + quotes;
  }

  /**
   * Checks if the file extension is in fileTypes
   * @param file
   * @returns {boolean}
   */
  isFileInConfigFileTypes(file) {
    return (this.config.fileTypes.indexOf(path.extname(file)) > -1);
  }

  /**
   * Processes an argument.
   * Checks if the argument is a valid path.
   * Checks if the path is a directory or a file.
   * Puts all the directory and subdirectory files or the argument path in an array.
   * Forwards the file path(s) for further processing.
   * @param argument Path to a file or directory.
   * @param isTestCase If set there will be no further working
   * @returns {Array}
   */
  processArgument(argument, isTestCase = false) {
    if (typeof argument === 'string') {
      if (fs.existsSync(argument)) {
        let allFilePathsInDirectory;
        let filePathsToProcess = [];

        if (fs.statSync(argument).isDirectory()) {
          log.logVerbose(`The argument ${argument} is a directory`);
          const options = {
            cwd: argument,
            ignore: this.config.exclude,
            absolute: true,
            deep: true
          };

          allFilePathsInDirectory = globby.sync('**', options);

        } else {
          log.logVerbose(`The argument ${argument} is a file`);
          allFilePathsInDirectory = [argument];
        }

        if (allFilePathsInDirectory.length > 0) {
          log.logVerbose(`Collecting file paths for further processing...`);

          for (let i = 0; i < allFilePathsInDirectory.length; i++) {
            let fileInDirectory = allFilePathsInDirectory[i];

            if (this.isFileInConfigFileTypes(fileInDirectory)) {
              filePathsToProcess.push(fileInDirectory);
            }

          }

          if (!isTestCase) {
            this.processFiles(filePathsToProcess);
          } else {
            return filePathsToProcess;
          }

        }


      } else {
        Errors.errorHandler(Errors.noFileOrDirectory(argument), 1);
      }
    } else {
      log.logError(`Unable to process ${argument}`);
    }
  }

  /**
   * Loops all forwarded files and forwards to processing function
   * @param filePaths
   */
  processFiles(filePaths) {
    for (let i = 0; i < filePaths.length; i++) {
      this.processFile(filePaths[i]);
    }
  }

  /**
   * Reads the file content.
   * Forwards the content to the sort function.
   * Writes new file content after being sorted.
   * @param filePath
   */
  processFile(filePath) {
    log.logVerbose(`Processing ${filePath}`);

    const self = this;

    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        throw err;
      } else {
        self.processContent(data, filePath);
      }
    })

  }

  /**
   * Searches the class attribute and replaces it with it's sorted version.
   * Then a file will be written, or if isTestCase is true the value will be returned
   * @param fileContent Content which contains class attributes
   * @param filePath Path to the file which gets processed. Is used to write the new file
   * @param isTestCase If set no file will be written but the content will be returned
   * @returns {String|void} Nothing | Content of the file
   */
  processContent(fileContent, filePath, isTestCase = false) {
    log.logVerbose(`${filePath} could be read and is processing now`);

    const regexFindAllClass = /class=["|'](.|\n)*?["|']/g;

    // let sortedContent = fileContent.replace(regexFindAllClass, this.sort(m, p1, p2));

    const self = this;
    let sortedContent = fileContent.replace(regexFindAllClass, function (match) {
      return self.sort(match, self);
    });

    if (isTestCase) {
      return sortedContent;
    } else {
      let writeFilePath = filePath;
      if (this.config.test === true) {
        writeFilePath = filePath + '_sorted.html';
      }
      log.logInfo(`${filePath} read and will be written now to ${writeFilePath}`);

      fs.writeFile(writeFilePath, sortedContent, 'utf8', function (err) {
        if (err) {
          Errors.errorHandler(Errors.writingFileFailed(writeFilePath, err));
        }
      });
    }
  }

  /**
   * Walks over the files in directory and gets all files recursively
   * @param dir Directory to be walked over
   * @param filelist
   * @returns {Array}
   */
  walkSync(dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
      const dirFile = path.join(dir, file);
      try {
        filelist = this.walkSync(dirFile, filelist);
      }
      catch (err) {
        if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
        else throw err;
      }
    });
    return filelist;
  }

  /**
   * Returns the version of class-sort
   * @returns {String} Current version
   */
  getVersion() {
    const package_json_path = path.join(__dirname, './../package.json');
    const package_json_content = fs.readFileSync(package_json_path, 'utf8');
    const package_json_object = JSON.parse(package_json_content);
    return package_json_object['version'];
  }

  /**
   * Adds a configuration entry to configuration.
   * @param key Key to be added
   * @param value Value to be added
   */
  addConfiguration(key, value) {
    this.config[key] = value;
  }

  /**
   * Changes the log level
   * @param level Level to be set
   */
  changeLogLevel(level) {
    log.setLogLevel(level);
    this.addConfiguration('logLevel', level);
  }


  static sortArrayByArray(unsortedArray, sortArray) {
    let leftOver = unsortedArray.sort(naturalSort());
    let sortedArray = [];

    for (let i = 0; i < sortArray.length; i++) {
      let sortElement = sortArray[i] + '$';
      let regex = new RegExp(sortElement, '');
      let currentSortElementMatches = [];

      for (let i = 0; i < leftOver.length; i++) {
        let unsortedElement = leftOver[i];
        if (regex.test(unsortedElement)) {
          currentSortElementMatches.push(unsortedElement);
          sortedArray.push(unsortedElement);


        }
      }

      for (let i = 0; i < currentSortElementMatches.length; i++) {
        const index = unsortedArray.indexOf(currentSortElementMatches[i]);
        if (index !== -1) {
          unsortedArray.splice(index, 1);
        }
      }

    }

    return sortedArray.concat(leftOver);
  }
}

module.exports = Sorter;
