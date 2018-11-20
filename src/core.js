'use strict';

//internal
const Errors = require("./errors");

//External
const fs = require('fs');
const path = require('path');

class Sorter {


  /**
   * Sorts a class tag.
   * Removes the class.
   * Gets the quotes.
   * Removes the quotes.
   * Makes the string to an array separated by spaces.
   * Sorts the class array.
   * Joins the sorted array and reconstructs the class tag.
   * @param match String which containes class="..."
   * @returns {string} sorted class
   */
  static sort(match) {
    // TODO make it work propperly for multi line
    let classesString = match.replace('class=', '');
    const quotes = classesString[0];
    const regex = new RegExp(quotes, 'g');
    classesString = classesString.replace(regex, '');
    let classesArray = classesString.split(' ');
    classesArray = classesArray.sort();

    const sortedClasses = classesArray.join(' ');

    return "class=" + quotes + sortedClasses + quotes;
  }

  /**
   * Checks if the file extension is in fileTypes
   * @param file
   * @returns {boolean}
   */
  static isFileInConfigFileTypes(file) {
    // TODO Make this array read from config file
    const fileTypes = [
      ".html",
      ".vm"
    ];

    return (fileTypes.indexOf(path.extname(file)) > -1);
  }

  constructor() {

  }

  /**
   * Processes an argument.
   * Checks if the argument is a valid path.
   * Checks if the path is a directory or a file.
   * Puts all the directory and subdirectory files or the argument path in an array.
   * Forwards the file path(s) for further processing.
   * @param argument Path to a file or directory.
   */
  processArgument(argument) {
    if (typeof argument === "string") {
      if (fs.existsSync(argument)) {
        let allFilePathsInDirectory;
        let filePathsToProcess = [];

        if (fs.statSync(argument).isDirectory) {
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

          this.processFiles(filePathsToProcess);

        }


      } else {
        //TODO kein Ordner oder Datei
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
    //let fileContent = fs.readFileSync(filePath, 'utf8');

    this.getFileContentPromise(filePath).then(function () {
      // TODO Make RegEx working with double and single quotes.
      const regexFindAllClass = /class="(.|\n)*?"/g;
      let match = fileContent.replace(regexFindAllClass, this.sort);

      fs.writeFileSync(filePath + "_sorted.html", match, "utf8");

    });

  }

  /**
   * Makes a Promise from readFile
   * @param filePath Path to the file to be read
   * @returns {Promise<any>} Promise from fs.readFile
   */
  getFileContentPromise(filePath) {
    const fileContentPromise = new Promise(function (resolve, reject) {
      fs.readFile(filePath, 'utf', function (err, data) {
        if (err) {
          Errors.errorHandler(Errors.readingFileFailed(filePath, err));
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return fileContentPromise;
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