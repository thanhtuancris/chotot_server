const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv');
const db = require('./config/connect.database');
const routes = require('./routes/index.router');
dotenv.config();
const host = "0.0.0.0";
const port = process.env.PORT || 4000;
const cron = require('cron').CronJob;
let crawldata = require("./controller/data.controller")
app.use(bodyParser.urlencoded({
    extended: false 
}));
app.use(bodyParser.json());

db.connect()
//routes init
routes(app);


app.get('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
    res.render("login")
})
app.post('*', function (req, res) {
    res.status(404).json({
        message: "Trang không tồn tại, vui lòng thử lại"
    });
})
const job1 = new cron({
    cronTime: '00 30 23 * * 0-6', 
    onTick: async function () {
            setTimeout(() => {
                var request = require('request');
                var options = {
                    'method': 'POST',
                    'url': 'http://45.32.113.69:4000/api/keep',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                };
                request(options, function (error, response) {
                    console.log("deleted");
                });
            },1000);
    },
    start: true,
    timeZone: 'Asia/Ho_Chi_Minh'
});
job1.start()


function myFunction() {
    var min = 2,
      max = 4;
    var rand = Math.floor(Math.random() * (max - min + 1) + min); 
    console.log('Wait for ' + rand + ' seconds');
    crawldata.loadbalance()
    setTimeout(myFunction, rand * 1000);
  }
  
  myFunction()




app.listen(port, host, () => {
    console.log("Server running - port" + port);
});