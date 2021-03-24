#!/usr/bin/env node

class Component {
    constructor(fullyQualifiedName, files) {
        this.fullyQualifiedName = fullyQualifiedName
        this.files = files
    }
}

const yargs = require("yargs");
const fs = require('fs');

const options = yargs
    .usage("Usage: code-component-definer --of <outputFile> --ftg <filesToGroup>")
    .option("of", {
        alias: "outputFile",
        describe: "Output file to write your results to",
        type: "string",
        demandOption: true
    })
    .option("ftg", {
        alias: "filesToGroup",
        describe: "A file containing all files the plugin should group into components (one file per line)",
        type: "string",
        demandOption: true
    })
    .argv;

const filesToGroup = options.ftg

const allFiles = fs.readFileSync(filesToGroup, {encoding: 'UTF-8'}).toString().split("\n").filter(file => file.length !== 0)

const topfolders = allFiles.filter(f => f.endsWith(".go") || f.endsWith(".java") || f.endsWith(".c") || f.endsWith(".jsp")
    || f.endsWith(".py") || f.endsWith(".go") || f.endsWith(".js")
    || f.endsWith(".rs") || f.endsWith(".swift") || f.endsWith(".sh")
    || f.endsWith(".rb") || f.endsWith(".kt") || f.endsWith(".ts")).map(f => f.substring(0, f.indexOf("/")+1)).filter(file => file.length !== 0)

const uniqueArray = topfolders.filter(function(elem, pos) {
    return topfolders.indexOf(elem) == pos;
})

const components = uniqueArray.map(folder => new Component(folder.substring(0, folder.length - 1), []))

const defaultComponent = new Component("@", [])

allFiles.forEach(file => {
        const component = components.find(c => file.startsWith(c.fullyQualifiedName))
        if (component)
            component.files.push(file)
        else
            defaultComponent.files.push(file)
    }
)

components.push(defaultComponent)

console.log(components)

fs.writeFileSync(options.of, JSON.stringify(components))
