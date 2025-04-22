# Music Manager 

## Author
**Name**: Yachen Wang (Mason)  
**Class**: CS5610 - Web Development   

**Class Link**: https://johnguerra.co/classes/webDevelopment_spring_2025/     
**Slides**: https://docs.google.com/presentation/d/19iK7HiSdbrnFAYzKF6mAIqpoBfaOTNJ4NIO8h33nHlA/edit?usp=sharing    
**Demo**:  https://music-manager-v2.vercel.app     
**Video**: https://youtu.be/1F8DEJUZHRk  
**Usability Report**: https://docs.google.com/document/d/1oNneqeGpqC3d7IbJnxxzjTz0GYLaVGgVEXRO903RXok/edit?usp=sharing  

## Project Overview
**Music Manager** is a comprehensive web application designed to **help music professionals organize their music projects and tracks in one centralized platform**. Built with **React**, **Node.js**, **Express.js**, and **MongoDB**, the app provides an intuitive interface for managing music production workflows. Users can create projects, upload instrumental tracks, add lyrics, and track collaborators for each song. The application also features a built-in audio player that allows users to listen to their tracks directly within the platform, making it easy to review and share works in progress.

**Frontend Development**: HTML/CSS, JavaScript, React, Tailwind CSS   
**Backend Development**: Node.js, Express  
**Database**: MongoDB, Cloudinary  
**Development Tools**: Trae & VS Code (with ESLint & Prettier)  
**Deployment**: Vercel  

------ Version 2.0 Updates ------
- Enhanced Design: Refine the visual layout and user interface to create a more intuitive and visually engaging experience for music professionals.  
- Improved Accessibility: Ensure the tool is inclusive and usable for all users by adhering to accessibility best practices and standards.  
- Boosted Usability: Integrate insights from previous usability interviews to streamline workflows and make key features easier to discover and use.  


## Screenshots
### Project Overview  
![Project Overview Page Screenshot](./screen-shots/screen-shot(1).png)  

### Project View Page  
![Project View Screenshot](./screen-shots/screen-shot(2).png)  

### Beat Library Page  
![Project View Screenshot](./screen-shots/screen-shot(3).png)  

## Instructions to Build

***Option 1: Live Demo***  

https://music-manager-obf2.vercel.app/    
Backend deployed with Vercel. Database deployed with MongoDB Atlas.

***Option 2: Run Locally***  

**Step 1: Git clone this repository**  
git clone https://github.com/masonwangmason/music-manager.git

**Step 2: Navigate to the project directory**  
cd music-manager

**Step 3: Install dependencies**  
npm install

**Step 4: Create your .env file**  
Create a **.env** file in the root directory and add the following content:  

**PORT=3000**  
**MONGODB_URI=your_mongodb_connection_string**  

Replace **your_mongodb_connection_string** with your actual MongoDB connection string.

**Step 5: Run the server**  
npm start

**Step 6: Visit the following URL in your desired browser**  
http://localhost:3000


## License
This project is licensed under the MIT License. See the LICENSE file for details. 


## LLM Citation
Project structure and design insights:
- "Can you help me ensure the updated color palette is consistent across all components?"
- "What’s the best way to implement keyboard navigation for the audio player?"
- "How do I ensure the font choices are accessible and meet WCAG standards?"
- "Can you help me center elements within a div using Tailwind CSS?"
- "What steps should I take to troubleshoot a 500 error when fetching projects from the server?"
- "What steps should I take to ensure the audio player is fully accessible for screen reader users?"
- "Can you help me center elements within a div using Tailwind CSS?"
- "How can I update my deployed Vercel project using the command line?"