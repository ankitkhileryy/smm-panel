Remove-Item -Path update.tar -ErrorAction SilentlyContinue
tar -cf update.tar src public tailwind.config.mjs postcss.config.mjs tsconfig.json next.config.ts package.json package-lock.json
scp -i smm-aws.pem update.tar ubuntu@35.154.100.213:/home/ubuntu/update.tar
ssh -i smm-aws.pem ubuntu@35.154.100.213 "tar -xf update.tar -C /home/ubuntu && npm run build && pm2 restart smm"
