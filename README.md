Company: CODTECH IT SOLUTIONS

Name: SANIKA GADGE

Intern ID: CTISAK69

Domain: MERN Stack Development

Duration: 4 Weeks

Mentor: NEELA SANTOSH

# About the Project

This is a Productivity Management Chrome Extension that tracks the time a user spends on different websites, allows blocking distracting websites, and stores usage data securely using a backend built with Node.js and MongoDB.

I created this project to understand how browser extensions interact with user activity, how real-time data can be tracked on the client side, and how that data can be stored and managed securely using authentication (JWT). Before this project, I had mainly worked on simple frontend applications. This project helped me understand how background scripts, browser APIs, authentication, and backend services work together in a real-world scenario.

The extension tracks active website usage, displays daily usage statistics in a popup dashboard, allows users to block distracting sites, and syncs data to the backend for persistence.

# Technologies Used

## Chrome Extension (Frontend)

JavaScript (ES6+) – Core logic for tracking, blocking, and UI handling

Chrome Extension APIs (Manifest V3) –

tabs API for tracking and blocking websites

storage API for local data storage

HTML & CSS – Popup UI and blocked page design

## Backend

Node.js – Runtime environment

Express.js – Backend framework

MongoDB – Database for storing user data and usage statistics

Mongoose – ODM for MongoDB

JWT (JSON Web Token) – User authentication and data isolation

# Features

User authentication (Register & Login)

Tracks time spent on each website

Daily usage dashboard in extension popup

Block distracting websites

Redirects blocked sites to a custom blocked.html page

Data stored per user using JWT-based authentication

Backend sync for usage tracking

Clean and simple popup interface

# How the Extension Works

The user registers or logs in through the extension popup.

After login, a JWT token is stored securely in Chrome storage.

The background script tracks the active website using Chrome APIs.

Time spent on each site is calculated when the user switches tabs or navigates.

Usage data is:

Stored locally for fast display

Periodically synced to the backend

If a website is added to the blocked list:

The extension intercepts navigation events

The user is redirected to a blocked page

The popup dashboard displays:

Total time spent today

Per-site usage breakdown

Blocked websites list

# Where This Extension Can Be Used

Improving focus and productivity

Monitoring daily browsing habits

Blocking distracting websites

Learning Chrome Extension development

Understanding real-time activity tracking

Full-stack learning projects

# What I Learned From This Project

How Chrome extensions work internally (background scripts, popup, storage)

How to track user activity using Chrome APIs

How to block and redirect websites safely

How JWT authentication ensures per-user data isolation

How frontend extensions communicate with backend services

How to design event-based logic instead of time-based polling

How to structure a full-stack project properly

How to manage Git and push a complete project to GitHub

# Limitations

Time tracking is based on active tab usage (not background tabs)

No analytics charts (text-based dashboard only)

Backend is hosted locally (not deployed online)

Designed primarily for learning and academic use

# Future Improvements

Add productivity score visualization (charts/graphs)

Allow categorization of websites (productive vs distracting)

Weekly and monthly reports

Cloud deployment of backend

Improve UI/UX of the popup

Cross-device data sync

Add export/download reports feature

# Final Note

This project helped me understand how real-world productivity tools are built using browser extensions and backend services. It strengthened my understanding of Chrome APIs, event-driven programming, authentication, and full-stack development. This project served as a strong foundation for building more advanced productivity and analytics applications in the future.


<img width="1918" height="975" alt="Image" src="https://github.com/user-attachments/assets/bfa62460-5515-440a-bd20-f197d4f4fc24" />





