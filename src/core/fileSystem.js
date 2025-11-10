// src/core/fileSystem.js

const fileSystem = {
  '~': {
    type: 'dir',
    children: {
      'welcome.txt': {
        type: 'file',
        content: `
Welcome to my terminal portfolio!
-----------------------------------
My name is Aniket.

Type 'guide' to see all available commands.
Type 'ls' to see all files and directories.
        `,
      },
      'about.md': {
        type: 'file',
        content: `
# About Me

I am skilled in problem-solving, critical thinking, and collaboration.
I am adaptable and a quick learner in fast-changing environments.

## Core Competencies
- Data Analysis
- Database Management
- Data Visualization
- Statistical Analysis
- ETL Processes

## Technical Skills
- **Languages**: Python (NumPy, Pandas, SciPy, Stats), R (Basics), SQL (MySQL)
- **BI Tools**: Microsoft Power BI, Tableau, Microsoft Excel
- **Developer**: Git, Jupyter Notebook, Collab, Flutter
        `,
      },
      
      'experience.md': {
        type: 'file',
        content: `
# Professional Experience
- **Data Analyst**
  Diensten Tech Limited
  (June 2025 - Sept 2025)

  - Designed interactive Power BI Dashboards to track vehicle performance and project status.
  - Utilized Power Query and DAX to clean, transform, and model complex datasets.
  - Developed custom KPIs for testing efficiency, vehicle downtime, and project progress.
  - Created detailed user guides and trained team members on dashboard maintenance.
        `,
      },

      'education.md': {
        type: 'file',
        content: `
# My Education
- **Master of Science - Informatics** (currently)
  Institute of Informatics & Communication, University of Delhi

- **Bachelor of Science**
  Deen Dayal Upadhyaya College, University Of Delhi
        `,
      },

      'certificates.md': {
        type: 'file',
        content: `
# Certifications
(You can add your certifications here)

- **[Certificate Name 1]**
  Issued by: [Issuing Body]
  Date: [Month Year]
        `,
      },

      'resume.pdf': {
        type: 'file',
        url: 'aniket_resume.pdf',
        description: 'Opens my professional resume in a new tab.',
      },
      'projects': {
        type: 'dir',
        children: {
          'uber-data-analysis.md': {
            type: 'file',
            content: `
# Uber Data Analysis and Visualisation
- **Tech**: Power BI, DAX, Power Query
- Cleaned and transformed raw Uber trip data using Power Query.
- Developed an interactive Power BI dashboard showing trip trends.
- Implemented DAX measures for KPIs like total trips, average fare, and peak-hour demand.
            `,
          },
          'movie-recommender.md': {
            type: 'file',
            content: `
# Movie Recommender System
- **Tech**: jupyter notebook, SQL, python
- Developed a content-based recommendation system using Python and Pandas.
- Engineered feature extraction from movie metadata to compute similarity scores.
- Implemented cosine similarity for recommending top-N similar movies.
- Built a simple web interface using Django for real-time recommendations.
            `,
          },
          'data-warehouse.md': {
            type: 'file',
            content: `
# Data Warehouse Development
- **Tech**: SQL, PostgresSQL
- Designed and implemented an ETL pipeline using Medallion Architecture.
- Developed data modelling strategies to enhance query efficiency.
- Standardized naming conventions and optimized table structures for BI applications.
- Built a scalable data warehouse to support cross-platform analytics.
            `,
          },
        },
      },
      'socials.txt': {
        type: 'file',
        content: `
GitHub:   https://github.com/bytealche
Email:    bytealche@email.com
Phone:    +91-8295476005
        `,
      },
    },
  },
};

export default fileSystem;