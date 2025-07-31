# ❄ Full-Stack JS engineer test assessment - the Quiz Builder - Backend ❄

## Getting started

Run the following commands inside the project folder:

`npm install`

Make sure you have your **DATABASE_URL** env properly setted and run `npx prisma migrate deploy`. 

Then run `npm run start:dev`

To view the project open `http://localhost:4433`

### Tech Stack

- **Node.js (Nest.js)** 
- **TypeScript**
- **PostgreSQL (via Prisma)**

### Features

- **POST > /quizzes** — Create a new quiz
- **GET > /quizzes** — Return a list of all quizzes with titles and number of questions
- **GET > /quizzes/:id** — Return full details of a quiz including all questions
- **DELETE > /quizzes/:id** — Delete a quiz.

### Envs

- **DATABASE_URL** — PostgreSQL Database connection URL.
- **DIRECT_URL** — Direct connection to the database. Used for migrations (If using SUPABASE).
- **PORT** — APP listening port

&nbsp;

Made with 💙 by [Gustavo Brun](https://github.com/Gustavo-Brun/)  
🐈‍⬛
