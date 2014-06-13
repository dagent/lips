/* meter object
 * Author: David A. Gent
 * v1.0 complete 8 August 2012
*/

var meters = {

    meter : [
        {
            "name": "left",
            portIn: 7331,
            input: {},
            output: {}, 

        },
        {
            "name": "right",
            portIn: 7332,
            input: {},
            output: {}, 
        },
    ],

    port2name : function(port) {
        var meter = this.meter;
        for (index in meter) {
            if (meter[index].port === port) {
                return meter[index].name;
            }
        }
        return undefined ;
    },

    name2port : function(name) {
        var meter = this.meter;
        for (index in meter) {
            if (meter[index].name === name) {
                return meter[index].port;
            }
        }
        return undefined ;
    },

    setPort : function(name, port) {
        var meter = this.meter;
        for (index in meter) {
            if (meter[index].name === name) {
                meter[index].port = port;
                return meter;
            }
        }

        meter.push({
                "name": name,
                "port": port,
            });
        return meter;

    },

    getMeter : function(name) {
        var meter = this.meter;
        for (index in meter) {
            if (meter[index].name === name) {
                return meter[index];
            }
        }
        return undefined;
    },

    getNames : function() {
        var meter = this.meter;
        var nameArr = [];
        for (index in meter) {
            nameArr.push(meter[index].name);
        }
        return nameArr;
    },


    isNamed : function(nameStr) {
        var meter = this.meter;
        var nameArr = [];
        for (index in meter) {
            if ( meter[index] === nameStr ) {
                return true;
            }
        }
        return false;
    },

};

exports.meters = meters;

