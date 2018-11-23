'use strict';

//internal
const Errors = require("./errors");

//External
const fs = require('fs');
const path = require('path');
const findUp = require('find-up');
const jsonTryParse = require('json-try-parse');

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
        } else {
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
  }

  /**
   * Sorts a class tag.
   * Removes the class.
   * Gets the quotes.
   * Removes the quotes.
   * Makes the string to an array separated by spaces.
   * Sorts the class array.
   * Joins the sorted array and reconstructs the class tag.
   * @param unsortedString String which contains class="..."
   * @returns {string} sorted class
   */
  sort(unsortedString) {
    const doubleSpaces = /\s\s+/g;
    let classesString = unsortedString.replace('class=', '');
    classesString = (classesString.replace(doubleSpaces, ' '));
    const quotes = classesString[0];
    const regex = new RegExp(quotes, 'g');
    classesString = classesString.replace(regex, '');
    let classesArray = classesString.split(' ');
    classesArray = classesArray.sort();

    const sortedClasses = classesArray.join(' ').trim();

    return "class=" + quotes + sortedClasses + quotes;
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
    if (typeof argument === "string") {
      if (fs.existsSync(argument)) {
        let allFilePathsInDirectory;
        let filePathsToProcess = [];

        if (fs.statSync(argument).isDirectory()) {
          allFilePathsInDirectory = this.walkSync(argument);
        } else {
          allFilePathsInDirectory = [argument];
        }

        if (allFilePathsInDirectory.length > 0) {
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
      console.log("Unable to process " + argument);
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

    const regexFindAllClass = /class=["|'](.|\n)*?["|']/g;

    let sortedContent = fileContent.replace(regexFindAllClass, this.sort);

    if (isTestCase) {
      return sortedContent;
    } else {
      fs.writeFile(filePath + "_sorted.html", sortedContent, "utf8", function (err) {
        if (err) {
          console.log(err);
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


}

module.exports = Sorter;