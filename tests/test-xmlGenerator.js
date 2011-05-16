var XmlGenerator = require('../lib/xmlGenerator').XmlGenerator; // Konstruktor aufrufen
var underscore = require('underscore');
var async_testing = require('async_testing');
var helper_xmlGenerator = require('./helpers/helper-xmlGenerator.js');

var xmlGenerator = new XmlGenerator();

var thisTimeStamp = helper_xmlGenerator.thisTimeStamp;

// Sample elements for testing
var sample_node = {
    id: 4,
    lat: 4,
    lon: 4,
 //   version: 4,
    uid: 4,
 //   user: "et'ti",
    changesetId: 443654,
 //   timestamp: thisTimeStamp
    tags:[{key:'key1',value:'value1'},{key:'key2',value:'value2'}]
};

var other_node ={
    id: 2,
    lat: 732648,
    lon: 87633
};

var sample_way = {
    id: 45,
//    version: 3,
    uid: 35,
//    user: "irena",
//    changesetId: 7,
    timestamp: thisTimeStamp,
    nodes:[{id:sample_node.id},{id:other_node.id}],
    tags:[{key:'key1',value:'value1'},{key:'key2',value:'value2'}]
};

var sample_rel = {
    id: 655,
//    version: 34,
//    uid: 45,
    user: "kl",
//    changesetId: 765,
//    timestamp: thisTimeStamp,
    members:[{type:'way',reference:sample_way.id,role:'role'}]
};


module.exports = {

    'test_node':function(test){
        test.ok(true);
        var expected_node = helper_xmlGenerator.expected_node(sample_node);
        var created_node = xmlGenerator.createNode(sample_node);
        test.equal(expected_node,created_node,"\n\texpected: " + expected_node + "\n\tcreated:  " + created_node+ "\n");
        test.finish();
    },

    'test_way':function(test){
        var expected_way = helper_xmlGenerator.expected_way(sample_way);
        var created_way = xmlGenerator.createWay(sample_way);
        test.equal(expected_way,created_way,"\n\texpected: " + expected_way + "\n\tcreated:  " + created_way + "\n");
        test.finish();
    },

    'test_rel':function(test){
        var expected_rel = helper_xmlGenerator.expected_rel(sample_rel);
        var created_rel = xmlGenerator.createRelation(sample_rel);
        test.equal(expected_rel,created_rel,"\n\texpected: " + expected_rel + "\n\tcreated:  " + created_rel + "\n");
        test.finish();
    },

//    'test_header':function(test){
//        var created_header = xmlGenerator.createHeader(sample_header);
//        console.log('created header: ' + created_header);
//    }

};

if (module === require.main) {
    require('async_testing').run(__filename, process.ARGV);
}

// vim:set ts=4 sw=4 expandtab: