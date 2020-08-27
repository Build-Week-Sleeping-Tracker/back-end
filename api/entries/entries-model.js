const db = require("../../data/dbConfig.js");

module.exports = {
    findAll,
    findBy,
    findById,
    add,
    update,
    remove
}

function findAll() {
    if(process.env.NODE_ENV === "production") {
        // For PostgreSQL database
        return db("entries as e")
            .with("md", qb => {
                qb.select("m.entry_id as entry_id", db.raw("JSON_BUILD_OBJECT('before_sleep', m.before_sleep, 'after_sleep', m.after_sleep, 'daytime', m.daytime) as moods"))
                    .from("moods as m")
            })
            .leftJoin("md", "md.entry_id", "e.id")
            .select("e.*", "md.moods")
            .then(entries => {
                return entries.map(entry => {
                    if(!entry.moods) {
                        entry.moods = {
                            before_sleep: null,
                            after_sleep: null,
                            daytime: null
                        }
                    }
                    return entry;
                })
            })
    } else {
        // For SQLITE database
        return db("entries as e")
            .with("md", qb => {
                qb.select("entry_id", db.raw("JSON_OBJECT('before_sleep', m.before_sleep, 'after_sleep', m.after_sleep, 'daytime', m.daytime) as moods"))
                    .from("moods as m")
            })
            .leftJoin("md", "md.entry_id", "e.id")
            .select("e.*", "md.moods")
            .then(entries => {
                return entries.map(entry => {
                    
                    if(entry.moods) {
                        entry.moods = JSON.parse(entry.moods);
                    } else {
                        entry.moods = {
                            before_sleep: null,
                            after_sleep: null,
                            daytime: null
                        }
                    }
                    return entry;
                })
            });
    }
}

function findBy(filter) {
    return null;
}

function findById(id) {
    if(process.env.NODE_ENV === "production") {
        // For PostgreSQL database
        return db("entries as e")
            .with("md", qb => {
                qb.select("m.entry_id as entry_id", db.raw("JSON_BUILD_OBJECT('before_sleep', m.before_sleep, 'after_sleep', m.after_sleep, 'daytime', m.daytime) as moods"))
                    .from("moods as m")
            })
            .leftJoin("md", "md.entry_id", "e.id")
            .select("e.*", "md.moods")
            .where({ id: id })
            .first()
            .then(entry => {
                if(entry) {
                    if(!entry.moods) {
                        entry.moods = {
                            before_sleep: null,
                            after_sleep: null,
                            daytime: null
                        }
                    }
                    return entry;
                } else {
                    return null;
                }
                
            })
    } else {
        // For SQLITE Database
        return db("entries as e")
                .with("md", qb => {
                    qb.select("entry_id", db.raw("JSON_OBJECT('before_sleep', m.before_sleep, 'after_sleep', m.after_sleep, 'daytime', m.daytime) as moods"))
                    .from("moods as m")
                })
                .leftJoin("md", "md.entry_id", "e.id")
                .select("e.*", "md.moods")
                .where({ id: id })
                .first()
                .then(entry => {
                    if(entry) {
                        if(entry.moods) {
                            entry.moods = JSON.parse(entry.moods);
                        } else {
                            entry.moods = {
                                before_sleep: null,
                                after_sleep: null,
                                daytime: null
                            }
                        }
                        return entry;
                    } else {
                        return null;
                    }
                });
    }
}

function add(entry, moods) {
    const time_total = new Date(entry.sleep_end).getTime() - new Date(entry.sleep_start).getTime();

    return db.transaction(trx => {
        return trx
            .insert({
                sleep_start: entry.sleep_start,
                sleep_end: entry.sleep_end,
                sleep_time_total: time_total < 0 ? null : time_total / 1000 / 60 / 60,
                user_id: entry.user_id
            }, "id")
            .into("entries")
            .then(async ([id]) => {
                if(!moods) {
                    await db("moods").insert({entry_id: id, before_sleep: null, after_sleep: null, daytime: null}).transacting(trx);
                    return id;
                }

                moods = {
                    ...moods,
                    entry_id: id
                }

                await db("moods").insert(moods).transacting(trx);
                return id;
            });
    })
    .then(id => findById(id));
}

function update(entry, moods, id) {
    const time_total = new Date(entry.sleep_end).getTime() - new Date(entry.sleep_start).getTime();
    
    return db.transaction(trx => {
        return db("entries")
            .transacting(trx)
            .where({id: id})
            .update({
                sleep_start: entry.sleep_start,
                sleep_end: entry.sleep_end < entry.sleep_start ? null : entry.sleep_end,
                sleep_time_total: time_total < 0 ? null : time_total / 1000 / 60 / 60,
                user_id: entry.user_id
            }, "id")
            .then(async () => {
                if(!entry.moods) return id;

                await db("moods").transacting(trx).where({entry_id: entry.id}).del();

                const moodChanges = {
                    ...moods,
                    ...entry.moods,
                    entry_id: id
                    
                }
                
                await db("moods").insert(moodChanges).transacting(trx);
                return id;
            });
    })
    .then(id => findById(id))
}

function remove(id) {
    return db("entries").where({ id: id }).del();
}