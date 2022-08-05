const userDb = require("./user.mongo.schema");

const exludeMongoDefaultFields = {
  __v: 0,
  _id: 0,
};

async function findExistingUser(userName) {
  const existingUser = await userDb.findOne({
    userName: userName,
  });

  return existingUser;
}

async function createUser(userData) {
  const user = Object.assign(userData, {
    userId: Math.random(1, 100),
  });
  return await userDb.create(user);
}

module.exports = {
  findExistingUser,
  createUser,
};
