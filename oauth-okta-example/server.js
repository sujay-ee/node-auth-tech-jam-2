'use strict';

const express = require('express');

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')

const jwtVerifier = require('./jwtVerifier')

const start = function (options) {
    return new Promise(function (resolve, reject) {
        process.on("unhandledRejection", (reason, p) => {
            console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
        });

        if (!options.port) {
            reject(new Error("no port specificed"));
        }

        const app = express();

        app.use(function (error, request, response, next) {
            console.log(error);
            reject(new Error("something went wrong" + error));
            response.status(500).send("something went wrong");
        });

        const schema = buildSchema(`

                            type Employee {
                                id: Int
                                first_name: String
                                last_name: String
                                email: String
                                gender: String
                                ip_address: String
                            }

                            type Employees {
                                employees: [Employee]
                            }          

                            type Query {
                                employees: Employees,
                                employee(id: Int!): Employee
                            }
                    `);

        const root = {
            employees: () => {
                return data;
            },
            employee: (i) => {
                return data.employees.filter((r) => r.id == i.id)[0]
            }
        };

        app.use("/graphQl", ensureAuthenticated, graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        }));

        const server = app.listen(options.port, function () {
            resolve(server);
        });
    });
};

function ensureAuthenticated (request, response, next) {
    return jwtVerifier(request, response, next);
}

const data = {
    "employees": [
        {
            "id": 1,
            "first_name": "Jeanette",
            "last_name": "Penddreth",
            "email": "jpenddreth0@census.gov",
            "gender": "Female",
            "ip_address": "26.58.193.2"
        },
        {
            "id": 2,
            "first_name": "Giavani",
            "last_name": "Frediani",
            "email": "gfrediani1@senate.gov",
            "gender": "Male",
            "ip_address": "229.179.4.212"
        },
        {
            "id": 3,
            "first_name": "Noell",
            "last_name": "Bea",
            "email": "nbea2@imageshack.us",
            "gender": "Female",
            "ip_address": "180.66.162.255"
        },
        {
            "id": 4,
            "first_name": "Willard",
            "last_name": "Valek",
            "email": "wvalek3@vk.com",
            "gender": "Male",
            "ip_address": "67.76.188.26"
        }
    ]
}

module.exports = Object.assign({}, { start });
