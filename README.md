#  SkillGrid - Local Services Marketplace

SkillGrid is a comprehensive MERN Stack web application designed to bridge the gap between daily-wage workers (electricians, plumbers, painters, etc.) and local clients. Built specifically with local communities in mind, it eliminates middlemen and provides a transparent, digital platform for employment and service booking.

##  Key Features
* **Role-Based Access Control:** Separate secure portals for Clients and Workers using JWT authentication.
* **Direct Booking System:** Clients can browse local professionals and book them instantly for specific issues.
* **Worker Dashboard:** Real-time job requests appear on the worker's dashboard with options to Accept or Decline.
* **Live Status Tracking:** Clients can track the status of their service requests (Pending, Accepted, Declined) seamlessly.
* **Responsive UI:** A clean, modern, and fully responsive user interface designed with React.

##  Tech Stack
* **Frontend:** React.js, React Router DOM, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Security:** JSON Web Tokens (JWT), bcrypt.js

##  How to Run Locally

### 1. Clone the repository
```bash
git clone [https://github.com/Magicalcode004/Skill-Grid.git](https://github.com/Magicalcode004/Skill-Grid.git)

2. Setup Backend
Bash
cd backend
npm install
nodemon server.js

3. Setup Frontend
Bash
cd frontend
npm install
npm start
