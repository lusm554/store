path=src/server/index.js
pids=$(lsof -t -i:80);

run_production_server() {
  if [ -z "$pids" ]
  then
    echo '**Server is running**'
    echo
    (node $path)&
    open http://localhost
  else
    echo "**Server is already running**"
    open http://localhost
  fi
}

exit_nodemon() {
  if [[ $? -eq 130 ]]
  then 
    exit 0
  else 
    exit $?
  fi
}

if [[ $1 == "kill" ]]
then 
  if [ -z "$pids" ]
  then
    echo "**Server not running**"
  else
    kill $pids
  fi
elif [[ $1 == 'product' ]]
then
  run_production_server
elif [[ $1 == 'node' ]]
then
  node $path
elif [[ $1 == 'build' ]]
then
  mv ./src/config/.example_env ./src/config/.env
  echo "You need to set your fields in src/config/.env"
  echo "After that run command - npm run server"
else 
  nodemon $path
  exit_nodemon
fi
