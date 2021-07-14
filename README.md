
# Send an Alert to Slack when resource usages are high on a Linux Server.

This app built on NodJS can send an alert to Slack using webhook when resource utilization is high on the server.

## Installation

 - Install NodeJS from nodejs.org.
 - Install PM2:  [guide](https://pm2.keymetrics.io/docs/usage/quick-start/).
 - Clone the repo

```bash
https://github.com/riyas-rawther/linux-resource-usage-alerts-to-slack.git
cd linux-resource-usage-alerts-to-slack
npm i
pm2 start index.js
```
The above commands will install NodeJs and start the nodeJS app on port 8080. 

You may need NGINX as reverse proxy to server the content on a different port (80) or using a domain name.


## Sample NGINX config

```bash
server {
        listen 80;
        listen [::]:80;
        server_name alerts.realtech.dev;
# change the domain name as per your requirement and make sure DNS "A" record is pointed to this server.
        location ^~ /assets/ {
                gzip_static on;
                expires 12h;
                add_header Cache-Control public;
        }

        location / {
                proxy_http_version 1.1;
                proxy_cache_bypass $http_upgrade;

                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;

                proxy_pass http://localhost:8080;
        }
}
```
## Resource Listner
We will use the bash script called monitor.sh located on the root folder to send alerts to the nodeJS app. The nodeJS app will send the alert to Slack using Webhook.

Please make sure to modify the index.js with your [Slack Webhook](https://api.slack.com/messaging/webhooks) and monitor.sh with the nodejs hosting server.

Open your contab and add the monitor.sh to be executed at every 1 minute.
```bash
EDITOR=nano crontab -e
#add the below line to the end of the editor
* * * * * <path-to-the-root-folder>/monitor.sh >/dev/null 2>&1
```

Note: After making any changes on index.js, please restart the pm2 by
```bash
pm2 restart all
```
Advanced PM2 installation: [Guide](https://medium.com/@sobus.piotr/pm2-share-the-same-daemon-process-between-multiple-users-dd7ecae6197a)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
