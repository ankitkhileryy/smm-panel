scp -i smm-aws.pem update.tar ubuntu@35.154.100.213:/home/ubuntu/update.tar
ssh -i smm-aws.pem ubuntu@35.154.100.213 "tar -xf update.tar -C /home/ubuntu && cd /home/ubuntu && npm run build && pm2 restart smm"
