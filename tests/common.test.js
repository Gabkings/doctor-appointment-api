const User = require("../models/Usersmodel");
const express = require("../server");

module.exports = request = require("supertest")(express);
// module.exports = chai = require("chai");
// module.exports = should = chai.should();

// const defaultUser = { name: "Default User", email: "test@techbrij.com", password: "test123" };
const defaultUser = { email: "gabworks51@gmail.com", password: "123456" };

const createUser = async() => {
    const UserModel = new User(defaultUser);
    await UserModel.save();
};

const getDefaultUser = async() => {
    let users = await User.find({ "username": defaultUser.username });
    if (users.length === 0) {
        await createUser();
        return getDefaultUser();
    } else {
        return users[0];
    }
};

const loginWithDefaultUser = async() => {
    let user = await getDefaultUser();
    return request.post("/api/user/login")
        .send({ email: defaultUser.email, password: defaultUser.password })
        .expect(200);
};

const cleanExceptDefaultUser = async() => {
    let user = await getDefaultUser();
    await User.deleteMany({ "username": { $ne: user.username } });
};

module.exports = { cleanExceptDefaultUser, loginWithDefaultUser }