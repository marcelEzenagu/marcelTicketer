const express = require('express')
const Order = require('./model/Order')

const orderRouter = express.Router()


orderRouter.get("/orders", async(req, res) => {
    const {page, limit} = req.query
    try {
        // checking that query params are not invalid
        
        if ((page == parseInt(page) && Number(page) != 1) || !(limit == parseInt(limit) && page == parseInt(page))) {
            return res.status(400).send({error:"Wrong query parameters"})
        
        }

        result = await Order.find()
        
        return res.status(200).json(result)
    } catch (e) {
        console.log("error:", e)
        
    }
} )

orderRouter.post("/orders", async(req, res) => {
    const {origin, destination} = req.body
    if(!origin || !destination) {
        return res.status(400).json({error: "You have to provide both origin and destination"})
    }
    distance = Number(destination - origin)
    data = {distance, status:"UNASSIGNED"}
    const result = await new Order(data).save()
    const newOrder = {id:result._id,
        status: result.status,
        distance : result.distance
    }
    return res.send(newOrder)
})

orderRouter.patch("/orders/:id", async(req, res) => {
    const id = req.params.id
    try {

        // const result = await Order.findByIdAndUpdate(id,{status:"TAKEN"}, {new:true}).select('status')
       
        // return res.send(result)
       let result = await Order.findById(id)
       console.log("result from db search:", result)
       if(!result) {
           return res.status(404).send({error:"That Order does not exist"})
       }
       if(result.status === "SUCCESS") {
           return res.status(400).send({error:"Order already taken"})
       }
       result.status = "SUCCESS"
       const order = await result.save()
      const status = order.status
       res.send({status})

    } catch (e) {
        console.log("error", e)
         return res.status(404).send({error:"That Order does not exist"})
    }

})


module.exports = orderRouter
