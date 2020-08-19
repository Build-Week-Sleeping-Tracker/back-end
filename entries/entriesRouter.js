const router = require("express").Router();
const Entries = require("./entries-model.js");

router.get("/", (req, res, next) => {
    Entries.findAll()
        .then(entries => {
            res.status(200).json(entries);
        })
        .catch(err => next({ code: 500, message: "Error retrieving entries", err }));
});

module.exports = router;