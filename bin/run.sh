path=src/server/index.js

echo '**Server is running**'
echo
node $path

if [[ $? -eq 130 ]]; then 
  exit 0
else 
  exit $?
fi