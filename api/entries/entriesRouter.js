const router = require("express").Router();
const Entries = require("./entries-model.js");

router.get("/", (req, res, next) => {
    Entries.findAll()
        .then(entries => {
            const userEntries = entries.filter(entry => entry.user_id === req.jwt.subject);
            res.status(200).json(userEntries);
        })
        .catch(err => next({ code: 500, message: "Error retrieving entries", err }));
});

router.post("/", (req, res, next) => {
    const entry = req.body;
    entry.user_id = req.jwt.subject;

    if(!(entry.sleep_start && entry.user_id)) {
        next({ code: 400, message: "Missing required data: Sleep Start Date and Time, User Id" });
    } else {
        Entries.add({
                sleep_start: entry.sleep_start,
                sleep_end: entry.sleep_end,
                user_id: entry.user_id
            }, entry.moods)
            .then(entry => {
                res.status(201).json(entry);
            })
            .catch(err => next({ code: 500, message: "Error adding sleep entry", err }));
    }
});

router.get("/:id", (req, res, next) => {
    const { id } = req.params;

    Entries.findById(id)
        .then(entry => {
            if(entry) {
                if(entry.user_id === req.jwt.subject) {
                    res.status(200).json(entry);
                } else {
                    next({ code: 401, message: "The sleep id does not belong to the logged on account" });
                }
            } else {
                next({ code: 404, message: "Sleep Data not found!"})
            }
        })
        .catch(err => next({ code: 500, message: "Error retrieving sleep entry", err }));
});

router.put("/:id", (req, res, next) => {
    const { id } = req.params;
    const changes = req.body;

    Entries.findById(id)
        .then(entry => {
            if(entry && entry.user_id === req.jwt.subject) {
                const updates = {
                    ...entry,
                    ...changes,                    
                    //sleep_time_total: changes.sleep_end ? parseInt((changes.sleep_end - entry.sleep_start) / 1000 / 60 / 60) : null
                }

                /* updates.sleep_start = new Date(updates.sleep_start);
                updates.sleep_end =  new Date(updates.sleep_end); */

                Entries.update(updates, entry.moods, id)
                    .then(updated => {
                        res.status(200).json(updated);
                    })
                    .catch(err => next({ code: 500, message: "Error updating sleep data", err }));
            } else if (!entry) {
                next({ code: 404, message: "Sleep Data not found!"})
            } else {
                next({ code: 401, message: "The sleep id does not belong to the logged on account" });
            }
        })
        .catch(err => next({ code: 500, message: "Error retrieving sleep data", err }));
});

router.delete("/:id", (req, res, next) => {
    const { id }= req.params;

    Entries.findById(id)
        .then(entry => {
            if(entry && entry.user_id === req.jwt.subject){
                Entries.remove(id)
                    .then(() => {
                        res.status(204).end();
                    })
                    .catch(err => next({ code: 500, message: "Error removing sleep data", err }));
            } else if (!entry) {
                next({ code: 404, message: "Sleep Data not found!"})
            } else {
                next({ code: 401, message: "The sleep id does not belong to the logged on account" });
            }
        })
        .catch(err => next({ code: 500, message: "Error retrieving Sleep Data", err }));
});

module.exports = router;