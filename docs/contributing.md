
## Contributing

Please note that the main branch is protected for security purposes. 
This means that you cannot push changes directly to the main branch. 
Instead, you should create a pull request (PR) to propose and merge your changes. 

Therefore, follow these steps to propose any changes:

###u Clone the Repository
  - If you haven’t already, clone the remote repository: `https://github.com/MpumeleloNtobi/project-tsukuyomi.git`

### Sync the Main Branch
Ensure your local main branch is up to date: `git pull`

### Create a New Branch
You can create and switch to a new branch using one of the following methods:
- Single Command: `git checkout -b <new-branch-name>`
- Separate Commands: `git branch <new-branch-name>` followed by `git checkout <new-branch-name>`

At this point, you are ready to make changes—whether modifying existing code, writing new code, adding files, or fixing bugs.

### Stage Your Changes
- Stage all changes in the working directory: `git add .`
- Stage changes in a specific file: `git add <file-name>`
- Stage selected changes in a specific file: `git add -p <file-name>`
- Stage selected changes in the entire working directory: `git add -p`

### Commit Your Changes
- Commit all staged changes: `git commit -m "<commit message>"`
- Alternatively, stage and commit in one command (only works for tracked files): `git commit -am "<commit message>"`

### Push Your Changes
Push your changes to an upstream feature branch. 
- This command creates a new remote branch if it doesn’t already exist: `git push --set-upstream origin <remote-feature-branch-name>`
- Or equivalently: `git push -u origin <remote-feature-branch-name>`

### Create a Pull Request
On GitHub, create a Pull Request from your feature branch and add at least one reviewer to propose merging your changes into the main branch.

### Review and Merge
- Wait for your changes to be reviewed and approved.
- Once approved, merge the changes into the main branch.
- If there are any merge conflicts, resolve them, then wait for another review before trying again.