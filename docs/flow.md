admin-managers.js           =>  calls the fetch function with payload
api.fetch.managers.js       =>  calls the API route. The payload is passed in the body
managers.routes.js          =>  calling the route handler in controllers.
                                The payload is passed automatically by Express that pass (req, res) to the controller
managers.controllers.js     =>  do the business logic calling a function in models 
                                and passing the body. The function will call the sql
managers.model.js           =>  destracture the body and calls the sql