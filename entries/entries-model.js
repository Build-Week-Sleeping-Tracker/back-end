const db = require("../data/dbConfig.js");

module.exports = {
    findAll,
    findBy,
    findById,
    add,
    update,
    remove
}

function findAll() {
    return db("entries");
}

function findBy(filter) {
    return null;
}

function findById(id) {
    return db("entries").where({ id: id }).first();
}

function add(entry) {
    validateMoodValues(entry);

    return db("entries").insert(entry, "id")
                .then(ids => {
                    return findById(ids[0]);
                });
}

function update(changes, id) {

    validateMoodValues(changes);

    return db("entries").where({ id: id })
                .update(changes)
                .then(() => {
                    return findById(id);
                });
}

function remove(id) {
    return db("entries").where({ id: id }).del();
}



/* validateMoodValues() - Checks mood values to make sure are within range of 1 - 4, or set to null
*  @params - entry - takes the entry object to validate
*/
function validateMoodValues(entry) {
    if (entry.daytime_mood && (entry.daytime_mood < 1 || entry.daytime_mood > 4) ) {
        if(entry.daytime_mood < 1) {
            entry.daytime_mood = 1;
        } else if(entry.daytime_mood > 4) {
            entry.daytime_mood = 4;
        }
    }

    if (entry.sleep_start_mood && (entry.sleep_start_mood < 1 || entry.sleep_start_mood > 4) ) {
        if(entry.sleep_start_mood < 1) {
            entry.sleep_start_mood = 1;
        } else if(entry.sleep_start_mood > 4) {
            entry.sleep_start_mood = 4;
        }
    }
    if (entry.sleep_end_mood && (entry.sleep_end_mood < 1 || entry.sleep_end_mood > 4) ) {
        if(entry.sleep_end_mood < 1) {
            entry.sleep_end_mood = 1;
        } else if(entry.sleep_end_mood > 4) {
            entry.sleep_end_mood = 4;
        } 
    }
}