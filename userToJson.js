const fs = require("fs");
const { parse } = require("csv-parse");

const createUsersFromFile = (_filename) => {
  const userCollection = {
    users: [],
  };
  fs.createReadStream(_filename)
    .pipe(parse({ delimiter: ",", from_line: 1 }))
    .on("data", function (row) {
      userCollection.users.push({
        name: row[0],
        email: row[3],
        username: row[3],
        password: "default",
      });
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      fs.writeFileSync(
        "./content/users/index.json",
        JSON.stringify(userCollection, null, "\t")
      );
    });
};

createUsersFromFile("./users.csv");
