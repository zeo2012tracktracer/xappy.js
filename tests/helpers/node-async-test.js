#! /usr/bin/env node

var testing = require('async_testing'),
sys = require('sys'),
fs = require('fs'),
path = require('path');

testing.run(null, process.ARGV, done);

function done(allResults) {
    // we want to have our exit status be the number of problems
    var problems = 0;

    for(var i = 0; i < allResults.length; i++) {
        if (allResults[i].tests.length > 0) {
            problems += allResults[i].numErrors;
            problems += allResults[i].numFailures;
        }
    }

    if (typeof _$jscoverage === 'object') {
        // dump coverage data into coverage.json
        writeCoverage(_$jscoverage);
    }

    process.exit(problems);
}

function reformatCoverageData(data) {
    // reformat jscoverage data to save it with JSON.stringify
    var validData = {};
    for (var key in data) {
        validData[key] = {};
        for (var line in data[key]) {
            if (data[key][line] != null) {
                validData[key][line] = data[key][line];
            }
        }

        validData[key]['source'] = data[key].source;
    }

    return validData;
}

function writeCoverage(data) {
    var filename = path.join(path.dirname(__filename),
                             '..', '..', 'coverage.json');

    var fp = fs.openSync(filename, 'w');
    fs.writeSync(fp, JSON.stringify(reformatCoverageData(data)), null);
    fs.closeSync(fp);
}