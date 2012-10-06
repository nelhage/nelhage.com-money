var express = require('express'),
    fs      = require('fs'),
    path    = require('path'),
    http    = require('http');
var config  = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
var stripe  = require('stripe')(config.secret_key);

var app = express();
app.configure(
    function() {
        app.use(express.bodyParser());
});

app.post("/money/ajax/pay", function (req,res) {
    var amt = req.body.amount;
    var token = req.body.token;
    if (!amt || !token) {
        res.send(400, {error: "Missing parameter"});
        return;
    }
    console.log("Charging %s", token);
    stripe.charges.create({
            amount: amt,
            currency: 'usd',
            card: token,
            description: 'Charge from nelhage.com/money'
        }, function (error, response) {
            if (error) {
                res.send(error, {
                        error: response.error.message,
                        });
                console.log("Failed charge: %j", response);
            } else {
                res.send(200, {});
            }
        });
});

http.createServer(app).listen(19080);
