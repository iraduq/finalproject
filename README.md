
---

### Setup Steps
1. Install Node.js, npm, Visual Studio Code, and Git.
2. Clone the project repository using Git.
3. Open the project in VS Code.
4. Install the project dependencies.
5. Update IP configurations.
6. Run the application.
7. Access the application.

---

### Detailed Instructions

To run the application locally, make sure the following tools are installed on your machine:

- **Node.js and npm (Node Package Manager)**
  - Node.js allows JavaScript applications to run outside of a browser.
  - npm is used to install and manage project dependencies.

**Verify Node.js and npm installation**: After installation, check if they’re functioning by opening Command Prompt or Terminal and running the following commands:
   ```bash
   node -v
   npm -v
   ```
   If these commands don’t return the installed versions, there may have been a configuration issue.

- **Visual Studio Code (VS Code)**
  - VS Code will be the main code editor for this project.
  - Download from the official site: [Visual Studio Code](https://code.visualstudio.com/download).

- **Git**
  - Git manages code versioning and collaboration, allowing repository cloning and seamless teamwork.
  - Download from the official site: [Git](https://git-scm.com/downloads).

### Cloning the Project Repository
If the project isn’t already downloaded, clone the GitHub repository with these steps:

1. Open Command Prompt or Terminal, then run:
   ```bash
   git clone https://github.com/iraduq/finalproject.git
   ```
2. After cloning, navigate to the project’s root directory:
   ```bash
   cd finalproject
   ```

### Open Project in VS Code
1. Launch Visual Studio Code.
2. From the top menu, go to **File** -> **Open Folder** and select the project folder (`finalproject`).

### Install Project Dependencies
In the VS Code terminal, run the following command to install dependencies:
   ```bash
   npm install
   ```

### Update IP Configurations
Before running the application, ensure the IPs and ports on the server are configured correctly:
1. Open the file `config.ts` located in the project’s `src` directory (`finalproject/src/config.ts`).
2. Update the IP address to match the server's IP.

### Run the Application
Once dependencies are installed and IP configurations are updated, you can run the application locally:
   ```bash
   npm run dev
   ```
If everything is configured correctly, you should see links to the online site. Click the link containing "localhost" to access the application.

--- 

