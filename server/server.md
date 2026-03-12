# Server specifications

# Endpoints

## Arduino endpoint

### POST /api/deposit

This endpoint should be used when a bottle is deposited. It should receive the following parameters:
- The key set on the arduino (for authentication)
- The timestamp of the deposit (optional, if not provided, the server will use the current timestamp)
The server should then store this information and associate it with the user that is currently associated with the next deposit (if any). The server should also update the user's score, streak, and total count of bottles deposited. This endpoint does not require authentication, as the arduino will be sending the requests. However, it should validate the key to ensure that only authorized devices can send deposit information.


## Login and signup endpoints

### JWT Authentication
https://github.com/firebase/php-jwt

### POST /api/signup

This endpoint should be used to create a new user account. It should receive the following parameters:
- The username of the new user
- The password of the new user
- The school email of the new user, we can validate the emails to ensure they are from `@glr.nl`
The server should then create a new user in the database and return a success message. And a JWT token that can be used for authentication in future requests. 

### POST /api/login

This endpoint should be used to log in a user. It should receive the following parameters:
- The username of the user
- The password of the user
The server should then check the credentials against the database and return a success message if the credentials are correct. And a JWT token that can be used for authentication in future requests.

## User endpoints

### GET /api/leaderboard

This endpoint should be used to get the current leaderboard. It should return a list of users and their scores, sorted by score in descending order. The server should also include the user's rank in the leaderboard. This endpoint does not require authentication, as the leaderboard should be visible to everyone.

### GET /api/stats

This endpoint should be used to get the current statistics of the logged in user. It should return the total number of bottles deposited by the user, the user's rank in the leaderboard, deposit streak and any other relevant statistics. This endpoint requires authentication, so the user must include their JWT token in the request headers.

### GET /api/count

This endpoint should be used to get the current total count of bottles deposited by all users. It should return the total count as a number. This endpoint does not require authentication, as the total count should be visible to everyone.

### POST /api/associate

This endpoint should be used to associate a user with the bottle they are about deposit. By either pressing a button in the app before depositing the bottle, or by scanning a QR code on the place they are depositing the bottle. The server should then associate the user with the next deposit that is made from the arduino. This endpoint requires authentication, so the user must include their JWT token in the request headers. 
Additionally, the server should have a timeout mechanism to ensure that the association is only valid for a certain period of time (e.g., 5 minutes) and a timeout so a user can't keep pressing the button to associate themselves with every deposit.

### POST /api/disassociate

This endpoint should be used to disassociate a user from the next deposit. This can be used if the user accidentally pressed the associate button or if they changed their mind. The server should then disassociate the user from the next deposit that is made from the arduino. This endpoint requires authentication, so the user must include their JWT token in the request headers.

### POST /api/predict
This endpoint should be used for users to predict how many bottles will be deposited the following day. It should receive the following parameters:
- The predicted number of bottles to be deposited that day
The server should then store this information and associate it with the user. The server should also update the user's score based on the accuracy of their prediction. This endpoint requires authentication, so the user must include their JWT token in the request headers. The server should also have a mechanism to ensure that users can only make one prediction per day and that predictions are only accepted until a certain time to prevent users from making predictions after they have seen the actual count for the day.g