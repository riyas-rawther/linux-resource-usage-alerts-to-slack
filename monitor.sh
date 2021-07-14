#!/bin/bash

now=`date -u -d"+8 hour" +'%Y-%m-%d %H:%M:%S'`
#cpu use threshold
cpu_warn='7'
 #mem idle threshold
mem_warn='150'
client="Client Name"
environment="Production"
public_ip="$(dig +short myip.opendns.com @resolver1.opendns.com)"


#---cpu
item_cpu () {
cpu_idle=`top -b -n 1 | grep Cpu | awk '{print $8}'|cut -f 1 -d "."`
cpu_use=`expr 100 - $cpu_idle`

mem_free=`free -m | grep "Mem" | awk '{print $4+$6}'`

if [ $cpu_use -gt $cpu_warn ]
    then
        echo "cpu warning!!!"
        curl \
    --header "Content-type: application/json" \
    --request POST \
    --data '{"type": "CPU","memoryvalue": "'"$mem_free"'","cpuvalue": "'"$cpu_use"'","client": "'"$client"'","env": "'"$environment"'","ip": "'"$public_ip"'"}' \
    https://alerts.yourdomain.com/alerts
    else
        echo "cpu ok!!!"
fi
}
#---mem
item_mem () {
 #MB units
## get total free memory size in megabytes(MB) 
free=$(free -mt | grep Total | awk '{print $4}')

if [[ "$free" -le $mem_warn  ]]; then
        ## get top processes consuming system memory and save to temporary file 
##        ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%mem | head >/tmp/top_proccesses_consuming_memory.txt

#        file=/tmp/top_proccesses_consuming_memory.txt

 echo "Memory warning!!!"
curl \
    --header "Content-type: application/json" \
    --request POST \
    --data '{"type": "ram","memoryvalue": "'"$mem_free"'","cpuvalue": "'"$cpu_use"'","client": "'"$client"'","env": "'"$environment"'","ip": "'"$public_ip"'"}' \
    https://alerts.yourdomain.com/alerts

fi

}
item_cpu
item_mem
