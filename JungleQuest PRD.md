# **JungleQuest PRD**

## **1\. Overview**

### **1.1 Product Name**

JungleQuest

### **1.2 Purpose**

JungleQuest is a web-based educational platform designed for kids, teens, and hobbyists to explore animals through interactive 3D models, realistic sounds, and engaging facts. Users select animals from a jungle-themed homescreen to access detailed views, including habitat, diet, behavior, and conservation facts, with interactive quizzes and personalization features. Admins manage animal content using templates. Built with Supabase for database and storage and deployed on Vercel’s free tier, JungleQuest delivers a visually stunning, portfolio-ready MVP with interactive widgets, animations, and a kid-friendly UI.

### **1.3 Target Audience**

* **Kids (Ages 6–12)**: Learning about animals through fun, interactive visuals and sounds.  
* **Teens (Ages 13–18)**: Exploring biology and ecology with detailed animal information.  
* **Hobbyists**: Animal enthusiasts engaging with wildlife content.  
* **Parents/Educators**: Teaching kids about biodiversity using an engaging platform.  
* **Admins**: Content creators managing animal data and educational content.

### **1.4 Objectives**

* Provide interactive 3D animal models (Three.js) with facts, sounds, and annotations for engaging learning.  
* Create a jungle-themed homescreen with animated elements and SVG widgets for a vibrant experience.  
* Enable users to personalize their experience with favorite animals and progress tracking.  
* Offer admins simple tools to manage animal content using templates.  
* Deploy on Vercel’s free tier with Supabase for zero-cost hosting and scalability.

## **2\. Functional Requirements**

### **2.1 Core Features**

#### **2.1.1 Jungle-Themed Homescreen**

* **Design**: A visually stunning, interactive homescreen styled as a jungle with animated elements (e.g., moving vines, ambient bird chirps) using Tailwind CSS and SVG illustrations.  
* **Animal Grid**: Display 3D model previews in a grid or carousel with hover effects and SVG icons (e.g., animal silhouettes).  
* **Navigation**: Search bar and filters by species (e.g., mammal, bird) or habitat (e.g., rainforest, savanna) for easy discovery.

#### **2.1.2 Interactive 3D Animal Models**

* **Visualization**: 3D models (.glTF, max 5 MB) rendered with Three.js, supporting rotate, zoom, and pan controls.  
* **Details**: Detailed view includes:  
  * **Cool Facts**: Text on habitat, diet, behavior, and conservation status (e.g., “Lions live in savannas and hunt in prides”).  
  * **Sounds**: MP3 files (max 1 MB) for animal sounds (e.g., lion roar, elephant trumpet).  
  * **Annotations**: Clickable parts on models (e.g., label a tiger’s claws) with hover tooltips for educational insights.  
* **Animations**: Smooth transitions (e.g., fade-in for model loading) and effects (e.g., animated tail wagging).  
* **Storage**: Store models and sounds in Supabase Storage.

#### **2.1.3 Educational Content**

* **Facts Page**: Text-based facts with supporting images and 2D charts (Chart.js) for data like population trends or habitat maps.  
* **Quizzes**: Multiple-choice or interactive (e.g., match animal to habitat, label a 3D model) with animated feedback (e.g., confetti for correct answers).  
* **Fun Facts**: Bite-sized trivia as pop-ups or cards (e.g., “A cheetah can run up to 60 mph\!”).

#### **2.1.4 Personalized User Experience**

* **Favorites**: Save animals to a user’s profile for quick access.  
* **Progress Tracking**: Dashboard showing viewed animals, quiz scores, and badges (e.g., “Jungle Explorer” for completing 5 quizzes).  
* **Customization**: Choose themes (e.g., jungle, savanna) and toggle sound effects on/off.  
* **UI**: Tailwind CSS with animated progress bars, course carousel, and SVG widgets for a kid-friendly experience.

#### **2.1.5 Admin Content Management**

* **Animal Editor**: Interface to add/edit animal data (name, species, facts, 3D model, sound).  
* **Templates**: Pre-built templates for animal profiles (e.g., mammal, bird, reptile) to streamline content creation.  
* **Analytics**: View engagement metrics (e.g., most viewed animals, quiz completion rates).  
* **UI**: Admin dashboard with Tailwind CSS, SVG icons, and hover effects for intuitive navigation.

#### **2.1.6 Basic Platform Functionality**

* **Search**: Filter animals by name, species, or habitat (e.g., \#mammal, \#rainforest).  
* **User Profiles**: Display favorite animals, badges, and settings (e.g., theme preference).  
* **Accessibility**: Kid-friendly navigation with large buttons, simple text, and high-contrast visuals.

#### **2.1.7 User Authentication**

* **Sign-Up/Sign-In**: Email or GitHub OAuth via Supabase Auth for secure access.  
* **Profile**: Store user data, favorites, progress, and settings in Supabase PostgreSQL.

### **2.2 Non-Functional Requirements**

* **Performance**: Page load time \<2 seconds for homescreen, \<3 seconds for 2D charts, \<5 seconds for 3D models (optimized with Redis caching).  
* **Scalability**: Support up to 10,000 monthly active users on Supabase’s free tier.  
* **Security**: Encrypt data at rest in Supabase. Secure asset uploads with virus scanning.  
* **Accessibility**: Responsive design, WCAG 2.1 compliance, kid-friendly UI with large buttons and simple text.  
* **Aesthetics**: Visually stunning UI with Tailwind CSS, SVG widgets, and animations (e.g., jungle effects, quiz feedback).  
* **Deployment**: Vercel free tier with Supabase integration. Local development with Docker.

## **3\. Technical Requirements**

### **3.1 Tech Stack**

* **Frontend**: Next.js with TypeScript for a fast, SEO-friendly web app. Three.js for 3D animal models. Chart.js for 2D charts (e.g., population data). Tailwind CSS for a vibrant, animated UI.  
* **Backend**: FastAPI for high-performance APIs (e.g., animal data retrieval, quiz scoring). Django as an alternative for rapid development with built-in auth.  
* **Database**: Supabase (PostgreSQL) for user data, animal metadata, and progress tracking. Supabase Storage for .glTF models, images, and MP3 sounds. Redis (Upstash) for caching previews and user sessions.  
* **Deployment**: Vercel free tier with Supabase integration.

### **3.2 Architecture**

* **Frontend**: Next.js with client-side Three.js for 3D models and Chart.js for 2D charts. API routes for server-side data fetching. TypeScript for type safety.  
* **Backend**: FastAPI microservices for endpoints:  
  * `/animals`: Retrieve animal data and 3D models.  
  * `/quizzes`: Submit and score quizzes.  
  * `/admin/animals`: Add/edit animal data.  
  * `/search`: Query animals by name, species, or habitat.  
* **Database Schema**:  
  * **Users**: `id`, `email`, `username`, `preferences` (JSON for theme, sound settings).  
  * **Animals**: `id`, `name`, `species`, `habitat`, `facts` (JSON), `model_url`, `sound_url`.  
  * **Quizzes**: `id`, `animal_id`, `questions` (JSON), `type` (multiple-choice/interactive).  
  * **Progress**: `user_id`, `animal_id`, `status` (viewed), `quiz_score`.  
* **Storage**: Supabase Storage for .glTF models (max 5 MB), images, and MP3 sounds (max 1 MB).  
* **Caching**: Redis (Upstash) for animal previews, user sessions, and quiz data to reduce database load.  
* **Real-Time**: Supabase real-time API for live quiz feedback (optional for MVP).

### **3.3 Deployment**

* **Vercel**: Host Next.js app on free tier (1 GB build size, 10-second function timeout). Use Supabase integration for environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`). Vercel CLI 33.0.0 (latest as of July 24, 2025).  
* **Supabase**: Free tier with 500 MB database and 1 GB storage. Enforce asset size limits (5 MB models, 1 MB sounds).  
* **Local Development**: Run Supabase and Next.js locally with Docker (`docker-compose.yml` for Postgres, Storage, Auth). Use Vercel CLI for frontend testing.

### **3.4 Constraints**

* **Storage Limits**: Supabase’s 1 GB storage may limit assets. Enforce size limits (5 MB models, 1 MB sounds) and compression.  
* **3D Performance**: Three.js rendering may strain low-end devices. Use low-poly .glTF models and server-side pre-processing for optimization.  
* **Vercel Limits**: Free tier restricts build size and function duration. Optimize assets (e.g., minify Three.js) and API responses.  
* **Content Creation**: Sourcing 3D models and sounds may require effort. Start with a small set (e.g., 10 animals) to ensure feasibility.

## **4\. User Stories**

* **As a kid**, I want to interact with a 3D lion model and hear its roar to learn about it.  
* **As a teen**, I want to take a quiz on animal habitats with animated feedback to test my knowledge.  
* **As a hobbyist**, I want to favorite animals and view them in my profile for quick access.  
* **As an admin**, I want to add a new animal with a 3D model and facts using a template.  
* **As a parent**, I want a jungle-themed homescreen to engage my child in learning about wildlife.

## **5\. Success Metrics**

* **User Engagement**: 100 active users within 3 months of MVP launch.  
* **Performance**: Homescreen load time \<2 seconds, 2D charts \<3 seconds, 3D models \<5 seconds.  
* **Retention**: 50% of users return within 7 days.  
* **Portfolio Impact**: Showcase Next.js, FastAPI, Supabase, Three.js, Chart.js, and Tailwind CSS in a visually stunning, kid-friendly MVP.

## **6\. Future Considerations**

* **Mobile App**: Extend to Flutter or React Native for mobile access.  
* **Advanced Visualizations**: Add AR/VR support for 3D animal models.  
* **Social Features**: Share favorite animals or quiz scores with friends.  
* **AI Integration**: Suggest animals based on user interests using machine learning.  
* **Real-Time**: Live quiz results and progress updates with Supabase real-time API.

## **7\. Assumptions**

* Users have basic familiarity with web-based platforms.  
* Assets (3D models, sounds) fit within Supabase’s free tier limits.  
* Most users access via modern browsers (Chrome, Firefox, Safari) with WebGL support.  
* Admins can create content using provided templates.

## **8\. Risks**

* **Storage Overflows**: Large 3D models or sounds may exceed Supabase’s 1 GB storage limit. Mitigate with strict size restrictions and compression.  
* **3D Performance Lag**: Complex models may slow browsers, especially on low-end devices. Optimize with low-poly .glTF models and Redis caching.  
* **Scalability**: High traffic may strain Supabase’s free tier. Cache with Redis and monitor usage.  
* **Content Creation**: Sourcing high-quality 3D models and sounds may delay launch. Start with a small set of animals (e.g., lion, elephant, parrot) and expand later.

