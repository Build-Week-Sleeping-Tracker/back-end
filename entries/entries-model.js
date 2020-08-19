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
    return db("entries").insert(entry, "id")
                .then(ids => {
                    return findById(ids[0]);
                });
}

function update(changes, id) {
    return db("entries").where({ id: id })
                .update(changes)
                .then(() => {
                    return findById(id);
                });
}

function remove(id) {
    return db("entries").where({ id: id }).del();
}