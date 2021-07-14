var bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Parses the body for POST, PUT, DELETE, etc.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const fetch = require('node-fetch');
const webhookURL = 'https://hooks.slack.com/services/T048BAZUH/B01Q29E45HN/VXvUXXXXXXXXXXXXXXXXXXXXXX';

app.post('/alerts', function(req, res, next) {

    console.log(req.body.type); // req.body contains the parsed body of the request.



    var alertType = req.body.type;

    switch (alertType) {
// format the Slack message using link https://app.slack.com/block-kit-builder/T048BAZUH#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22:warning:*Warning*%20:warning:%20%5Cn%5CnHigh%20*CPU*%20Alert%20on%20InsiderCorp%20Staging%20Server%22%7D%7D,%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Current%20CPU%20Value:%2070%20%5Cn%20IP:%208.8.8.8%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22divider%22%7D%5D%7D

        case "cpu":
        case "CPU":
        case "ram":
        case "RAM":
            console.log("CPU Alert");

            var data = JSON.stringify({
                    "blocks": [{
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": ":warning:*Warning* :warning: \n\nHigh *" + req.body.type + "* Alert on " + req.body.client + " " + req.body.env + " server"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text":  "IP: " + req.body.ip + "\n Client: " + req.body.client,
                                "emoji": true
                            }
                        },
                        {
                            "type": "divider"
                        }
                    ]
                }

            );

            //sending slack message
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: data,
            }).then((response) => {
                console.log(response);
            });
            //sendind slack message
            break;

//WEBSITE DOWN ALERT


        case "web":
        case "website":
            console.log("Website is down");

            var data = JSON.stringify(
                //PayLoad STARTS
                {
                    "blocks": [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": ":warning:*Warning* :warning: \n\n Site " + req.body.website + " is down!"
                            }
                        },
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": "Current CPU Value: 70 \n Current Memory is: 80 \n IP: 8.8.8.8 \n Client: Educadium",
                                "emoji": true
                            }
                        },
                        {
                            "type": "divider"
                        }
                    ]
                }
                //PayLoad ENDS
            
            );

            //sending slack message
            fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: data,
            }).then((response) => {
                console.log(response);
            });
            //sendind slack message

            break;
        default:
            console.log("Unknown Alert");
    }


    res.sendStatus(200)
});

app.listen(8080, 'localhost');
