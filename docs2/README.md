Documentation Overview
This folder contains all project documentation, diagrams, and API references to help developers understand and maintain the system.

/docs
The root documentation folder. It contains the following:

api.md
Lists all backend API endpoints

Includes:

HTTP methods (GET, POST, etc.)

Routes

Input parameters

Expected output

Status codes



architecture.md (Pending)


//To be completed


/sprint-sequence diagrams
Contains subfolders for each sprint. Each includes sequence diagrams showing key feature workflows for that sprint.

sprint 2 sequence diagrams

sprint 3 sequence diagrams

sprint 4 sequence diagrams

These diagrams help track how user actions are handled from frontend to backend.

uml
Main folder for all UML diagrams used to explain the system.

classdiagram.png
Shows main components (services, controllers, models)

Highlights relationships like inheritance and associations

deployment.png / deployment.pdf
Visualizes how the app is deployed (e.g., Vercel frontend, Railway backend, Clerk auth)

physical.png
Shows infrastructure or container setup


Notes
All diagrams are stored inside /docs/uml/ and its subfolders.

architecture.md will include and reference these images to explain system behavior.