const Consumption = require('../../db/models/consumption/index');

//get all costs 
module.exports.getAllConsumptions = (req, res, next) => {
    Consumption.find().then(result => {
        res.send({data: result});
    })
}

// create new consumption or error
module.exports.createNewConsumption = (req, res, next) => {
    const body = req.body;
    if (body.hasOwnProperty('score') && body.hasOwnProperty('cost')) {
        const consump = new Consumption(body);
        consump.date = new Date().toISOString().slice(0,10);
        consump.save().then(() => {
            Consumption.find().then(result => {
                res.send({data: result});
            })
        })
    } else {
        res.status(422).send('Error! Params not correct')
    }
}

// change consumption
module.exports.changeThisConsumption = (req, res, next) => {
    const body = req.body;
    if (body.hasOwnProperty('_id') && body.hasOwnProperty('date') && (body.hasOwnProperty('score') || body.hasOwnProperty('cost'))){
        Consumption.updateOne({_id: body._id}, body).then(() => {
            Consumption.find().then(result => {
                res.send({data: result});
            })
        })
    } else {
        res.status(422).send('Error! Params not correct')
    }
}

//delete consumption
module.exports.deleteThisConsumption = (req, res, next) => {
    Consumption.deleteOne({_id: req.query._id}).then(() => {
        Consumption.find().then(result => {
            res.send({data: result});
        })
    })
}

