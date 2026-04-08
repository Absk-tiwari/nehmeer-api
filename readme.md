I am going to build a household project in which there will be workers like maid, cook, babysitter, and the ones who will be hiring these workers by creating a post, and sending the worker profiles a hire request, it will be having location tracking, feedback, notifications (push also), verified profiles, otp verification and all. what should i prefer mongoDB of mysql ? i want to go with full security using helmet, and jwt salt security

backend/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── knex.js
│   │   ├── redis.js
│   │   ├── env.js
│   │   └── constants.js
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── models/
│   │       ├── BaseModel.js
│   │       ├── User.js
│   │       ├── WorkerProfile.js
│   │       ├── JobPost.js
│   │       ├── HireRequest.js
│   │       ├── Contract.js
│   │       ├── Review.js
│   │       ├── Notification.js
│   │       └── Location.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.routes.js
│   │   │   └── auth.validation.js
│   │   │
│   │   ├── users/
│   │   ├── workers/
│   │   ├── employers/
│   │   ├── jobs/
│   │   ├── hires/
│   │   ├── reviews/
│   │   ├── notifications/
│   │   └── location/
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── services/
│   │   ├── jwt.service.js
│   │   ├── otp.service.js
│   │   ├── notification.service.js
│   │   └── cache.service.js
│   │
│   ├── utils/
│   │   ├── logger.js
│   │   ├── response.js
│   │   └── helpers.js
│   │
│   └── routes/
│       └── index.js
│
├── knexfile.js
├── package.json
└── .env