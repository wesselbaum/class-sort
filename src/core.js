'use strict';

//External
const fs = require('fs');
const path = require('path');

class Sorter {


  constructor() {

  }

  processArgument(argument) {
    if (typeof argument === "string") {
      if (fs.existsSync(argument)) {
        let allFilePathsInDirectory;
        let filePathsToProcess = [];

        if (fs.statSync(argument).isDirectory) {
          allFilePathsInDirectory = this.getFilePathsFromDirectoryPath(argument);
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

  /*getFilePathsFromDirectoryPath(directoryPath) {
    let result = [];
    fs.readdirSync(directoryPath).forEach(file => {
      if(this.isFileInConfigFileTypes(file)){
        result.push(directoryPath + file)
      }
      //TODO wenn ordner rekursion
    })

    return result;
  }*/

  processFiles(filePaths) {
    for (let i = 0; i < filePaths.length; i++) {
      this.processFile(filePaths[i]);
    }
  }

  processFile(filePath) {
    let fileContent = fs.readFileSync(filePath, 'utf8');

    const regexFindAllClass = /class="(.|\n)*?"/g;
    let match = fileContent.replace(regexFindAllClass, this.sort);

    fs.writeFileSync(filePath+ "_sorted.html", match, "utf8");
  }

  static sort(match) {
    let classesString = match.replace('class=', '');
    const quotes = classesString[0];
    // classesString = classesString.replace(quotes, '');

    const regex = new RegExp(quotes, 'g');
    classesString = classesString.replace(regex, '');
    let classesArray = classesString.split(' ');
    classesArray = classesArray.sort();

    const sortedClasses = classesArray.join(' ');

    return "class=" + quotes + sortedClasses + quotes;
  }

  getFilePathsFromDirectoryPath(path) {
    let files = this.walkSync(path);
    console.log(files);
    return files;
  }

  static isFileInConfigFileTypes(file) {
    const fileTypes = [
      ".html",
      ".vm"
    ];

    // TODO prüfen ob die Endung in den Erlaubten ist.
    return (fileTypes.indexOf(path.extname(file)) > -1);
  }

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