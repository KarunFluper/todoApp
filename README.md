#Getting started with nodejs- Make sure nodejs is installed on your system

###Prepare the app In this step, you will deploy your first nodejs application in you system . To clone the sample application so that you have a local version of the code that you can run on your local system , execute the following commands in your local command shell or terminal: ####git clone https://github.com/excellencetechnologies/tasksystem.git ####cd tasksystem

npm install

Run the app

In this step you will run the app on local.

####$ node bin/www install all the modules that it requires,as you do previously,like $ npm install

now your app is ready to run

###Api's for todoApp

##if you want to use these REST api's you can directly use these  api by changing the url 'http://localhost:3000' to  
'https://todo007.herokuapp.com'

1. create user

http://localhost:3000/users/create

Response: status: 1, id: docs._id, message: "record insert success".

2. user login

http://localhost:3000/users/login

Response: status: 1, id: user._id, message: " success".

3. create todo

http://localhost:3000/todo/create Response: status: 1, userid: userid, task: task, date: date, message: " success".

4. todo fetch

http://localhost:3000/todo/fetch/:userid

Response status: 1, allInfo: allInfo, msg: "success".

5. todo update

http://localhost:3000/users/todo/update

Response status: 1, task: task, date: date, status1: status1, message: " update success".

6. todo remove

http://localhost:3000/users/todo/remove

Response status: 1, message: " success".
