# Git Leaderboard  

## Overview  
Git Leaderboard is a web application that analyzes a Git repository and generates a leaderboard showcasing contributors ranked by their commit count. This tool provides insights into the contributions of developers in a project, along with links to their GitHub profiles.  

## Features  
- Clone and analyze any public Git repository.  
- Display contributors' usernames, commit counts, and profile links.  
- Sort leaderboard by commit count in descending order.  

## How It Works  
1. **Clone Repository**: The specified Git repository is cloned locally.  
2. **Analyze Commits**: Commits are retrieved, and commit counts are summed by contributors' emails.
3. **Remove the Cloned Repository** The cloned repository is removed.
4. **Retrieve Profiles**: GitHub profiles and usernames are fetched using contributors' emails.
5. **Summarize Data**: Commit counts are aggregated by profile links.
6. **Display Leaderboard**: Contributors are ranked based on their commit counts.

## Tech Stack  
- **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.dev/)  
- **Backend**: [tRPC](https://trpc.io/)  
- **Git Integration**: [simple-git](https://github.com/steveukx/git-js)  

## Setup  

### Prerequisites  
- Node.js >= 18  
- Git installed on your system  

### Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/LucasWongC/git-repo-scraper  
   cd git-repo-scraper  
   ```  

2. Install dependencies:  
   ```bash  
   yarn install  
   ```  

3. Start the development server:  
   ```bash  
   yarn dev  
   ```  

4. Access the application at:  
   ```
   http://localhost:3000  
   ```  

### Environment Variables  
Create a `.env.local` file in the root directory and configure the following variables:  
```env  
# Example:  
GITHUB_TOKEN=<your_github_personal_access_token>  
```  
> The GitHub API token is used to fetch profile links and usernames for contributors.  

## Usage  
1. Input the Git repository URL in the application.  
2. View the contributors' leaderboard with commit counts and profile links sorted by commit count.  
