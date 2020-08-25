
exports.seed = function(knex) {
    return knex('users').insert([
      {
        id: 1,
        fname: "Test",
        lname: "Tester",
        email: "tester@testing.com",
        username: "tester",
        password: "$2a$10$4f.x3sW7MIM7Ldi2TB7JOeEpz03sd6Unq.9NuwlnFbuhXKoH9zhwK"
      }
    ])
    .then(() => console.log("\n**Users Seeded Successfully!**\n"))
};
