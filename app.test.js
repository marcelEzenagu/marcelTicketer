const request = require("supertest")
const start = require('./index')
const express = require("express")
const app = require("./index")
const connectDB = require("./db/db")
const Order = require("./model/Order")

beforeAll(() => {
    return connectDB(process.env.MONGODB)
})

beforeEach(() => {
    return Order.deleteMany({})
})

describe("Place Orders API", () => {
    describe("when origin or destination is not passed", () => {
        const bodies = [{origin:["origin"]},
                        {destination:["destination"]},
                    {}]
        for (const body of bodies ) {
            it('POST /orders --> validate request body', () => {

                return request(app).post('/orders')
                .send(body)
                .expect("Content-Type", /json/).expect(400)
                .then(response => {
                    expect(response.body).toEqual(
                        expect.objectContaining({error: "You have to provide both origin and destination"})
                        )
                    })
                })

        }
    });

    describe("when request body is available", () =>{
        it("POST /orders ==> create order", () => {
            return request(app).post("/orders")
            .send({origin: "1234", 
                    destination:"3456"})
                    .expect("Content-Type", /json/).expect(200)
                    .then((response) => {
                        expect(response.body.status).toBe("UNASSIGNED")
                    })
        })
    })
})

describe("Take Order API", () => {
    describe("Request body has status", () => {
        it.skip("PATCH /orders/:id --> take order", () => {
            return request(app).patch("/orders/618d115d2348c2c423d11302")
            .send({status: "TAKEN"})
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body.status).toBe("SUCCESS")
            })
        })
    })

    describe("order already taken", () => {
        it.skip("PATCH /orders/:id --> take order again",() => {
            return request(app).patch("/orders/618d115d2348c2c423d11302")
            .send({status: "TAKEN"})
                .expect("Content-Type", /json/)
                .expect(400)
                .then(res => {
                    expect(res.body.error).toBe("Order already taken")
                })
        })
    })

      describe("Request body has status", () => {
        it("PATCH /orders/:id --> take order with wrong id", () => {
            return request(app).patch("/orders/618d115d2348c2pc423d11302")
            .send({status: "TAKEN"})
                .expect("Content-Type", /json/)
                .expect(404)
                .then(res => {
                    expect(res.body.error).toBe("That Order does not exist")
                })
        })
    })

    describe("Order list", () => {
        it("GET /orders?page=:page&limit=:limit", () =>{
            return request(app).get('/orders?page=1&limit=5')
                .expect("Content-Type", /json/)
                .expect(200)
                // .then(res => {
                //     expect(res.body).toEqual(
                //         expect.arrayContaining([

                //         ])
                //     )
                // })
        })
    })
})