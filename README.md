<div style="background-color: ; padding: 20px; border-radius: 10px;">
<div style="background-color: ; padding: 15px; border-radius: 8px; margin: 20px 0;">

## <div style="text-align: center;">Group 35 presents</div>
![Group 10](https://github.com/user-attachments/assets/2a2c138a-7ad1-49da-90a3-56b5666403e6)

<div style="display: flex; justify-content: center; gap: 10px; margin: 15px 0;">

[![Coverage Status](https://coveralls.io/repos/github/MpumeleloNtobi/project-tsukuyomi/badge.svg?branch=main)](https://coveralls.io/github/MpumeleloNtobi/project-tsukuyomi?branch=main)  ![GitHub Release](https://img.shields.io/github/v/release/MpumeleloNtobi/project-tsukuyomi)  [![Live Demo](https://img.shields.io/badge/demo-online-green)](https://prd-frontend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io/home)
</div>
</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ;">
Storify is a <span style="color:blue;">Web application</span> that equips small-scale artisans with a platform to not only sell but also showcase the great work of their hands to an ever-growing community.

It bridges the gap between everyday citizens who love to collect and purchase artifacts, and local artisans who profit from exchanging great handmade work. It is developed as a Final Software Design Project for the course: <span style="color:blue;">Software Design - COMS3009A</span>, integrating deliverables from all four sprints.

The main goals of the application are:
- **User registration and secure login**
- **Ability to view, buy, or sell handmade products**
- **Multi-seller purchasing with doorstep delivery**
- **Safe and convenient transaction processing**

Buyers can browse a variety of products, add items from different sellers into a single cart, and receive all items directly at their homes. Meanwhile, artisans can reach more customers and grow their business through a centralized and user-friendly platform.

The platform is built using modern tools and frameworks like  
![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js&logoColor=white),  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white),  
![Microsoft Azure](https://img.shields.io/badge/Microsoft%20Azure-0089D6?logo=microsoftazure&logoColor=white),  
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white).
</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">
Following best practices, we include an overview and links to all relevant resources within this repository.<strong>Click the desired content below:</strong>
 
 - **Table of contents**
    - [Project description](#project-description)
    - [Features](#features)
    - [Demo Video](#demo-video)
    - [Tech stack](#tech-stack)
    - [Installation](#installation)
    - [Project Management(Scrum)](#project-management)
    - [Navigation and resources](#-navigation--resources)
    - [Final submission checklist](#final-submission-checklist)
    - [Group Contributors](#group-contributors)
</div>

<div style="background-color:; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Project Description
This README provides a unified presentation of our project, summarizing the design, implementation, and weekly progress.The project uses Agile/Scrum methodology: tasks were split into multiple sprints with regular retrospective.All task assignments were captured in the Linear platform and can be accessed [here](https://linear.app/sd-project/team/SD/active).Each sprint's goals, tasks, and outcomes are documented on our Scrum board and in sprint reports. The final deliverable is a polished web application; code and resources are on GitHub. A concise overview of features and architecture helps readers quickly grasp the project
</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Features
- 🔐 User registration and login
- 🛒 Users can buy from multiple sellers, but in different carts
- 🎨 Artisans can showcase and sell their handmade goods
- 💳 Secure transactions for both buyers and sellers
- 📈 Centralized platform for art lovers and creators
</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Demo Video
We have included a demo of the application in use and what to expect as a user.The demo highlights and walks through services available to users of various roles.[Watch the video here📹](https://youtu.be/mgVTPLUt3QU?si=_Y9Y60Awh5yh9cX0).A publicly hosted version that is ready for use is available in this through this [link](https://prd-frontend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io/home) ,this is the demo site.You can try the app Yourself in the official site [https://prd-frontend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io/home](https://prd-frontend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io/home).


#### 🧪 Test Data & User Login Credentials

To assist in testing the application, the following sample user accounts have been created. Use these credentials to log in and test various user flows (Buyer, Seller, Admin).

#### 🔐 Test User Accounts

| Role   | Email              | Password     |
|--------|--------------------|--------------|
| Buyer  | buyer@gmail.com    | b123uyer     |
| Seller | gadget@gmail.com   | s123eller    |
| Admin  | admin@gmail.com    | a123d123min  |

> 🔑 These accounts can be used to test different role-based views and functionalities in the application.

### 💳 Test Card

Use the following card details when prompted during the checkout or payment simulation phase:

- **Card Number**: `4032 0354 2108 8592`  
- **Expiration**: Any valid future date  
- **CVV**: Any 3-digit number
> This test card simulates a successful transaction in test mode.

### Store Creation
In order to create a store you need to enter stitch credentials.
Find out about Stitch [here.](https://www.stitch.money/?utm_term=stitch%20payments_e&utm_campaign=JC+%7C+SA+%7C+Search+%7C+Branded+Terms+%7C+E+%26+P&utm_source=google&utm_medium=ppc&utm_content=719471851417&hsa_acc=3806469535&hsa_cam=19660232147&hsa_grp=154438042748&hsa_ad=719471851417&hsa_src=g&hsa_tgt=kwd-1065298859665&hsa_kw=stitch%20payments&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gad_campaignid=19660232147&gclid=Cj0KCQjw_8rBBhCFARIsAJrc9yDDOEKWuOCj8enjRE6eS4hVqFbrs8lL4YigSINMXDIt9RtrXndvUIkaAp_dEALw_wcB)

For testing purposes just use our test credentials.

- **Stitch Client Secret**:
```
PQZn85k9I2P2DqbhifL0h3C0VhLLJhaXWimS6JAmqGWw3AixZ54f0nR1reGL6J/2
```
- **Stitch Client Key**:
```
test-bfd0ab2c-0258-4973-8f4c-06e0e0ad97a3
```

</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Tech stack

**This app was built using the following :**

- #### Frontend Stack
    [![image](https://skillicons.dev/icons?i=typescript,react,tailwindcss,nextjs,docker,azure)](https://skillicons.dev)
  
- #### Backend Stack
  [![image](https://skillicons.dev/icons?i=javascript,express,nodejs,postgres,docker,azure)](https://skillicons.dev)
</div>

<div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Installation

```bash
# 1 Clone the repository
git clone https://github.com/MpumeleloNtobi/project-tsukuyomi

# 2 Navigate into the project folder
cd project-tsukuyomi

# 3.f Open up two terminals then
cd frontend

# 3.b Cd into backend
cd backend

# 4 Install dependencies for both frontend and backend 
npm install 

# 5.f Run the development server
npm run dev
# 5.b
npm run start

#You will need env files, ask contributors. see email below. (for security reasons)
```


</div><div style="background-color: #; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Project Management

We followed **Scrum** to organize weekly work. The project was divided into four sprints with defined goals, tasks, and deliverables.We used a great collaborative platform called [Linear](https://linear.app/sd-project/team/SD/cycles) to achieve convenient collaboration and delegation of tasks.For each sprint:
Unfortantunately we cannot make our linear project public (it is not a feature they support). But here 
are some credentials you can use:
# Add creds (phuteho) 
alternatively, we have exported each sprint and can be found at ```/docs/sprint-exports```
- **Product Backlog :**  All planned feautures broken down into tasks
- **Sprint Planning:** Goals and tasks chosen.
- **Sprint board:** We used a Linear board to manage our sprints and tasks. See the Sprint Board for the Kanban-style view of our development workflow [here](https://linear.app/sd-project/team/SD/cycles).
- **Burndown Chart:** Track progress each sprint (e.g., see Sprint 1 Burndown ).**More information and images of all the burndown charts see `/docs/burndowncharts` which shows images of charts for each sprint**
- **Reviews/Retrospectives:** Demo sessions and feedback after each sprint

To access our full records of all these on Linear and follow-up on this [See here](https://linear.app/sd-project/team/SD/cycles).


### 🔗 Navigation & Resources

The project repository contains:
- 📂 `/docs` – All documentation including architecture and Scrum evidence  
- 📂 `/docs/uml` – Visuals such as class and sequence diagrams    
- 📁 `/frontend` & `/backend` – Full application source code  
- 📄 `README.md` – This document to help you find everything quickly
- 📁 `/docs/Meetings` -All proofs of daily scrum meetings in the form of pictures and minutes for the meetings
</div><div style="background-color: #; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Final Submission Checklist
- 📹 [Screen Recording Demo](https://youtu.be/mgVTPLUt3QU?si=_Y9Y60Awh5yh9cX0)
- 🌐 [Publicly Hosted Application](https://prd-frontend-storify.calmcoast-a309bc31.eastus.azurecontainerapps.io/home)
- 💻 [GitHub Repository](https://github.com/MpumeleloNtobi/project-tsukuyomi)
- 📌 [Scrum Board & Evidence](https://linear.app/sd-project/team/SD/cycles)
- 📄 Documentation: See `/docs`, `/uml`, and `/Meetings` and for a Comprehensive guide of the Code documentation see `docs/architecture.md`.

</div><div style="background-color: ; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Group Contributors
Below are all group members for this project dubbed "Project Tsukuyomi".We provided the names along with student numbers for school purposes.For further communication with indivisuals of the group,emails can be found in the **Contributors tab on the github repo**.

- **Muaaz Bayat :** 2555154
- **Bongani Ofentse Nhlapho:** 2707410
- **Suhail Seedat:** 2586153
- **Mpumelelo Ntobi:** 886289
- **Yanga Peter:** 2617090
- **Phutheho Mtloung:** 2689983

</div><div style="text-align: center; margin-top: 30px;"> <p align="center"> <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20in%20Johannesburg-red" /> <img src="https://img.shields.io/badge/University-Witwatersrand-blue" /> </p> </div></div> ```
