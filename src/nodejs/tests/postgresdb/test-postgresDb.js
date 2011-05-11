//make this test standalone
if (module == require.main) {
	require('async_testing').run(__filename, process.ARGV);
}

var PostgresDb = require('../../postgresdb/postgresdb').PostgresDb;
var events = require('events');
module.exports = {
	'test emitter functionality of query/client': function(test) {
		test.numAssertions = 2;
		var myQueryObject = {
			object : 'node'
		};
		var backend = {
				connect : function(connectionString, callback) {
							var client = new events.EventEmitter();
							client.query = function(query) {
								var queryEventEmitter = new events.EventEmitter();
								setTimeout(function() {
                                    //emit row event for this query
									queryEventEmitter.emit('row', {});
								},100);
                                setTimeout(function() {
                                    //emit drain event for this client (end of all queries)
                                    client.emit('drain', {});
                                },110);
								return queryEventEmitter;
							};
							callback(null, client);
						  }

		};
		var databaseModule = new PostgresDb('',backend);
		databaseModule.executeRequest(myQueryObject,function(error, ev){
			console.log(ev);
			ev.on('node', function(node) {
				console.log(node);
				test.ok(true);
			});
            ev.on('end', function() {
                test.ok(true);
                test.finish();
            });
		});
	},
	'test for connection error': function(test) {
		test.numAssertions = 1;
		var myQueryObject = {
			object : 'node'
		};
		var backend = {
				connect : function(connectionString, callback) {
                            callback("Simulated error", null);
                          }
		};
		var databaseModule = new PostgresDb('',backend);
		databaseModule.executeRequest(myQueryObject,function(error, ev){
            test.ok(error);
            test.finish();
		});
	},
	'test emitter functionality for client/query errors': function(test) {
		test.numAssertions = 2;
		var myQueryObject = {
			object : 'node'
		};
		var backend = {
				connect : function(connectionString, callback) {
							var client = new events.EventEmitter();
							client.query = function(query) {
								var queryEventEmitter = new events.EventEmitter();
                                setTimeout(function() {
                                    //emit error event for client
                                    client.emit('error', "clientError");
                                },110);
                                setTimeout(function() {
                                    //emit error event for query; perhaps this should be an own testcase?
                                    queryEventEmitter.emit('error', "queryError");
                                },120);
								return queryEventEmitter;
							};
							callback(null, client);
						  }

		};
		var databaseModule = new PostgresDb('',backend);
		databaseModule.executeRequest(myQueryObject,function(error, ev){
			console.log(ev);
			ev.on('error', function(error) {
                if(error === "clientError") {
                    test.ok(true);
                }
                else if(error === "queryError") {
                    test.ok(true);
                    test.finish();
                }
			});
		});
	}


};
