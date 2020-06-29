## VC\_Xtension

This repository's `src/server` folder contains the **completed** code for the server which is hosted on heroku

---

## Server-side events:
### /rooms
- `initHandShake`: initial data transfer from server to client(ALL)
- `escalationRequestCleared`: escalation/query has been sent (ALL)
- `escalationRequestSent`: receive escalation/query (SPEAKER ONLY)
- `escalationRequestFailed`: escalation was unsuccessful, check value of `type` in response for reason (ALL)
- `transcriptUpdateCleared`: update of transcript was successful (SPEAKER ONLY)
- `transcriptUpdateFailed`: updating was unsuccessful, check value of `type` in response for reason (ALL)
- `checkStatusCleared`: user is proStatus = true
- `checkStatusFailed`: user is proStatus = false
- `speakerEnteredCleared`: speaker entered room (ALL)
- `speakerEnteredFailed`: database failed to update speaker's entry (SPEAKER ONLY)
### /auth
- `authProSigninCleared`: authentication for pro users has succeeded, pro user signed in (WEBSITE)
- `authProSigninFailed`: authentication for pro users failed, check value of `type` in response for reason (WEBSITE)
- `authProLogoutCleared`: log out for pro users has succeeded (WEBSITE)
- `authProLogoutFailed`: log out for pro users failed, check value of `type` in response for reason (WEBSITE)
### /create
- `createRoomCleared`: user created room successfully (WEBSITE); if userToken + username + password is incorrect, non-PRO room created (WEBSITE)
- `createRoomFailed`: user room failed to create, check value of `type` in response for reason (WEBSITE)
### /data
- `dataProCleared`: fetching pro data is successful, outputting an array of user's currently active rooms
- `dataProFailed`: fetch of pro data failed, check value of `type` in response for reason (WEBSITE)
### /register
- `signUpCleared`: user sucessfully create new PRO account (WEBSITE)
- `signUpFailed`: user failed to create new PRO account, check value of `type` in response for reason (WEBSITE)

