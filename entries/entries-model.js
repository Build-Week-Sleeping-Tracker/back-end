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
    return null;
}

function add(entry) {
    return null;
}

function update(changes, id) {
    return null;
}

function remove(id) {
    return null;
}