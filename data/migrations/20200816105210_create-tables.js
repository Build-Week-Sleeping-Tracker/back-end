
exports.up = function(knex) {
    return knex.schema
            .createTable("users", tbl => {
                tbl.increments();
                tbl.string("fname", 128).notNullable();
                tbl.string("lname", 128).notNullable();
                tbl.varchar("email", 128).notNullable().unique();
                tbl.varchar("username", 128).notNullable().unique();
                tbl.varchar("password", 128).notNullable();
            })
            .createTable("entries", tbl => {
                tbl.increments();
                tbl.datetime("sleep_start").notNullable().unique();
                tbl.datetime("sleep_end").unique();
                tbl.integer("daytime_mood");
                tbl.integer("sleep_start_mood");
                tbl.integer("sleep_end_mood");
                tbl.time("sleep_time_total");
                tbl.integer("user_id")
                    .unsigned()
                    .notNullable()
                    .references("users.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            })
};

exports.down = function(knex) {
    return knex.schema
            .dropTableIfExists("entries")
            .dropTableIfExists("users");
};
