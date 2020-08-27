
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
                tbl.timestamp("sleep_start").notNullable().unique();
                tbl.timestamp("sleep_end").unique();
                tbl.float("sleep_time_total");
                tbl.integer("user_id")
                    .unsigned()
                    .notNullable()
                    .references("users.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
            })
            .createTable("moods", tbl => {
                tbl.increments();
                tbl.integer("entry_id")
                    .unsigned()
                    .notNullable()
                    .unique()
                    .references("entries.id")
                    .onUpdate("CASCADE")
                    .onDelete("CASCADE");
                tbl.enu("before_sleep", [1, 2, 3, 4]);
                tbl.enu("after_sleep", [1, 2, 3, 4]);
                tbl.enu("daytime", [1, 2, 3, 4]);
            })
};

exports.down = function(knex) {
    return knex.schema
            .dropTableIfExists("moods")
            .dropTableIfExists("entries")
            .dropTableIfExists("users");
};
