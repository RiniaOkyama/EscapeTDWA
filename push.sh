echo Enter commit message:
read cmtmsg
git add .
git commit -m "$cmtmsg"
git push origin master
sh pull.sh