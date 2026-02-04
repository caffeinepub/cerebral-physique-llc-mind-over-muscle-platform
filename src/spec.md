# Cerebral Physique LLC   Mind Over Muscle Platform

## Overview
A modern, high-performance company website for Cerebral Physique LLC featuring a dark minimalist design with focus on mind-muscle connection, breathwork, and longevity training. Content language: English.

## Design Requirements
- Dark minimalist UI with color palette: black, deep blue, medium gray, neon purple (accent)
- Responsive, mobile-first design using Tailwind CSS
- Strong typography and visual hierarchy
- Subtle futuristic accents with motion effects
- Fast load times and smooth user experience
- **Perfectly centered header layout**: New logo (file_00000000f71471f5a1db16ce8a907948(1).png) positioned dead center of header with "CEREBRAL PHYSIQUE, LLC" text directly underneath in clean gradient font, symmetrical and balanced across all viewports
- **"Creator Dashboard" button** in header navigation **always visible** to authenticated admin users with **centered style consistent with other navigation elements**, **clear hover effects**, and **tooltip hints** displaying "Access your editing tools for exercises, breathwork, and blogs" for easy access from desktop view
- **Always accessible Creator Dashboard** from header when logged in as creator/admin with prominent positioning and **correct routing to `/creator-dashboard`**
- Gradient overlays (deep blue to neon purple) on background sections for depth and brand consistency
- **Enhanced gym and workout-themed background imagery** with people training, stretching, and moving applied with **increased visibility and clarity** while maintaining readability
- **More vibrant and visible background images** with adjusted opacity for better visual impact
- **Tasteful fitness quote overlays** featuring discipline, breath, and longevity themes at section transitions
- Smooth looping background animations that are minimal and non-distracting
- **Active background music** with soft ambient/motivational tracks
- **Music toggle control** easily accessible in header for on/off functionality

## Visual Assets Integration
- **Perfectly centered new logo** (file_00000000f71471f5a1db16ce8a907948(1).png) in header with "CEREBRAL PHYSIQUE, LLC" text underneath across all pages
- All images employ responsive behavior, **lighter dark overlays for increased background visibility**, and compositional balance
- **Accurate muscle group visuals** and real gym photos with proper muscle group correspondence
- **Factual demonstrative images** for each exercise matching correct muscle groups using provided assets
- Consistent alt text for accessibility
- **More prominent and vibrant gym and workout-themed background images** with enhanced visibility
- **Fitness quote overlays** strategically placed at section transitions
- **Smooth looping animations** on background elements for dynamic but non-distracting effect

## Pages Structure

### Home Page
- Headline focused on mind-muscle connection
- Subheadline emphasizing mindset, breath, and longevity
- Primary CTAs: "7-Day Challenge," "Audiobook," and "Email Sign-Up"
- **Perfectly centered new logo and brand text** in header
- **More vibrant energetic gym-themed hero background** with enhanced visibility
- **Active background music with toggle control**

### About Page
- Founder story of Stefan Philip Sweeting
- Position as disciplined guide in mind-body performance
- Confident, disciplined, and intelligent tone
- **Perfectly centered header branding** consistent across all pages
- **Enhanced background visuals** with improved visibility

### Workout Library
- **Single main "Workout Library" card** as primary entry point
- **Seven expandable cards** within the main library card:
  - **Six muscle group sub-cards** for: Chest, Back, Legs, Shoulders, Arms, Core
  - **Breathwork Station card** for breathing practices and mind-muscle connection
- **Automatic demo exercise population on load** with **sample exercises displayed for each muscle group** instead of showing 0 items
- **Grid-based exercise layout** within each muscle group sub-card featuring:
  - **25-30 distinct and verified chest exercises** with comprehensive variety and factual accuracy including:
    - **Correct exercise names**: Barbell Bench Press, Incline Barbell Bench Press, Decline Barbell Bench Press, Dumbbell Bench Press, Incline Dumbbell Press, Decline Dumbbell Press, Dumbbell Flyes, Incline Dumbbell Flyes, Decline Dumbbell Flyes, Cable Crossover, High Cable Crossover, Low Cable Crossover, Cable Fly, Cable Chest Press, Push-Ups, Incline Push-Ups, Decline Push-Ups, Wide-Grip Push-Ups, Diamond Push-Ups, Archer Push-Ups, Chest Dips, Pec Deck, Machine Chest Press, Landmine Press, Svend Press, and additional distinct chest exercises
    - **Unique factual demonstrative media** (image or short video clip) from provided assets that accurately demonstrates each specific exercise movement
    - **Factual movement descriptions** explaining proper form, setup, execution technique, and safety considerations
    - **Detailed benefits text** for each exercise explaining:
      - Primary and secondary muscle targets (pectoralis major, anterior deltoids, triceps)
      - Stability and core engagement benefits
      - Mind-muscle connection aspects and focus points
      - Longevity benefits including joint health, posture improvements, and functional strength
      - Movement pattern benefits and real-world applications
  - **10+ exercise cards for other muscle groups** (Back, Legs, Shoulders, Arms, Core) with comprehensive variety
  - **Unique demonstrative image** for each exercise using provided assets with accurate exercise-image matching
  - **Accurate exercise names** corresponding to proper muscle groups with comprehensive variety
  - **Detailed movement instructions** explaining proper form and execution for each exercise
  - Checkbox to add exercise to "My Routines" section
- **Breathwork Station card** featuring:
  - **Multiple breathwork practices**: Diaphragmatic Breathing, Box Breathing, Alternate Nostril Breathing, Performance Breathing
  - **Clean, dark-themed interface** consistent with site aesthetic
  - **Demonstrative images or calm looping video backgrounds** using assets like breathing-visual.dim_400x400.jpg
  - **Detailed descriptions** explaining how to perform each breathing technique
  - **Recommended exercise pairings** from existing Workout Library (e.g., Box Breathing → Push-ups, Diaphragmatic Breathing → Bench Press)
  - **Mindfulness and focus benefits** section for each practice
  - **Calm, intuitive, and instructional design** aligned with "Mind Over Muscle" philosophy
  - Checkbox to add breathwork practices to "My Routines" section
  - **Integration with background music** for ambient immersion
- **Proper muscle group-exercise correspondence**: Each muscle group displays only exercises that target that specific muscle group
- **No duplicate or placeholder media**: Each exercise uses a unique, factual image or video that accurately matches the movement and equipment type
- **Connected routine management**: Checked exercises and breathwork practices automatically appear in user's Routines section
- **Immediate initialization with demo content**: Library loads instantly with exercises and breathwork practices properly categorized and visible
- Filtering and search capabilities within muscle groups and breathwork practices

### Programs Page
- Showcase offerings with **perfectly centered header branding**
- **Enhanced background visuals** with improved visibility and vibrancy

### Blog / Insights
- Educational articles section
- **Perfectly centered logo and brand text** in header
- **More vibrant background imagery** with enhanced visibility

### Contact Page
- Simple contact form with **perfectly centered header branding**
- **Enhanced background visuals** with improved contrast and visibility

### Creator Editing Section
- **Admin-only authenticated dashboard** with dark minimalist UI consistent with site aesthetic
- **Always accessible from header** when logged in as creator/admin with **clear navigation instructions and tooltips** and **correct routing to `/creator-dashboard`**
- **Fully functional subpages** with clear edit/add/delete interfaces for:
  - **Exercises Management**
  - **Breathwork Management** 
  - **Blog Management**
- **Visible guidance text and empty-state messages** in each tab:
  - "No blog posts yet — click 'Add Blog' to create one"
  - "No custom exercises yet — click 'Add Exercise' to create one"
  - "No custom breathwork practices yet — click 'Add Practice' to create one"
- **Enhanced Exercise Management**:
  - Add new exercises with name, instructions, muscle group, benefits list, and video/image upload/selection
  - Edit existing exercises (modify name, instructions, muscle group assignment, benefits, replace videos/images)
  - Remove exercises from the library with confirmation dialogs
  - **Video and image upload and replacement functionality** with drag-and-drop interface
  - **Real-time preview** of exercise cards before publishing changes
  - **Integrated validation** to ensure exercise names match muscle groups and videos/images correspond accurately
  - **Error handling** with clear feedback messages for invalid inputs or failed uploads
  - Add or remove muscle group categories
  - Reorder exercises within muscle groups
- **Enhanced Breathwork Management**:
  - Add new breathwork practices with name, description, technique instructions, and image upload/selection
  - Edit existing breathwork practices (modify name, description, instructions, recommended exercise pairings, replace images)
  - Remove breathwork practices with confirmation dialogs
  - **Manage recommended exercise pairings** by selecting from existing Workout Library exercises
  - **Edit mindfulness and focus benefits** sections for each practice
  - **Image upload and replacement functionality** for breathwork practice visuals
  - **Real-time preview** of breathwork practice cards before publishing changes
  - **Integrated validation** to ensure breathwork practice content is complete and accurate
- **Enhanced Blog Management**:
  - Create new blog posts with title, content, and publish status
  - Edit existing blog posts with real-time preview
  - Delete blog posts with confirmation dialogs
  - Publish/unpublish posts with immediate feedback
  - **Media asset management** for blog images and content
  - **Error handling** for failed save/publish operations
- **Media Asset Management**:
  - Upload, replace, and delete videos and images across all content types including breathwork practices
  - **Real-time sync** with backend storage without page refreshes
  - Preview functionality for all media changes
  - **Clear error messages** for upload failures or invalid file types
- **Enhanced User Experience**:
  - **Comprehensive error handling** with user-friendly feedback messages
  - **Real-time updates** reflecting changes immediately without page refreshes and **immediate frontend updates after edits**
  - **Smooth navigation** with all links and buttons functioning correctly
  - **Validation feedback** for all form inputs and file uploads
  - **Loading states** and progress indicators for all operations
  - **Intuitive content management** with clear guidance for creators
- **Access Control**: All editing operations protected behind creator/admin authentication with proper error handling for unauthorized access

## Backend Data Storage
- **User authentication and role management** with creator/admin role designation
- **Comprehensive exercise database** organized by muscle groups with fields:
  - Exercise name (factually accurate and muscle-group appropriate)
  - Movement instructions (detailed form guidance)
  - **Benefits list** (muscle engagement, posture, joint health, mind-muscle connection)
  - Demonstrative video URL (short, professional demonstration clip)
  - Demonstrative image URL (unique image matching correct muscle group and movement)
  - Muscle group category (proper categorization)
  - Equipment type (machine, cable, bodyweight, free weights)
  - Difficulty level
  - **Video and image metadata** for validation and management
- **Breathwork practices database** with fields:
  - Practice name (e.g., Diaphragmatic Breathing, Box Breathing, Alternate Nostril Breathing, Performance Breathing)
  - Technique description (detailed instructions on how to perform)
  - Demonstrative image or video background URL
  - Recommended exercise pairings (references to existing exercises in Workout Library)
  - Mindfulness and focus benefits (detailed benefits section)
  - Practice duration and difficulty level
  - **Image metadata** for validation and management
- **Media asset storage** with file management capabilities for videos and images
- **Pre-seeded demo exercise database** with:
  - **25-30 distinct and verified chest exercises** with correct exercise names, unique factual demonstrative media, factual movement descriptions, and detailed benefits text
  - **10+ unique exercises for other muscle groups** with proper muscle group targeting and no duplicates
  - **Accurate exercise-muscle group mapping** and **unique media mapping** with no placeholders or duplicates
  - **Comprehensive exercise variety** including compound and isolation movements for each muscle group
- **Pre-seeded breathwork practices** with multiple breathing techniques properly categorized with complete content
- **User routine management**: Store user's selected exercises and breathwork practices from checkboxes
- **Blog posts database** with fields:
  - Title, content, author, creation date, last modified date
  - Published status (draft/published)
  - SEO metadata
  - **Associated media assets**
- User accounts and routine associations
- Contact form submissions
- Program information and pricing
- **Background music preferences** per user
- **Error logs** and validation tracking

## Backend Operations
- **Creator/admin authentication and authorization** for editing operations with proper error handling
- **Enhanced exercise CRUD operations** (Create, Read, Update, Delete) with comprehensive validation and error handling
- **Breathwork practices CRUD operations** (Create, Read, Update, Delete) with comprehensive validation and error handling
- **Video and image upload and management** with file validation, storage, and replacement capabilities
- **Real-time data synchronization** for immediate frontend updates
- **Demo exercise seeding on application initialization** to ensure Workout Library shows sample exercises for each muscle group instead of 0 items
- **Comprehensive validation system**:
  - Exercise name and muscle group correspondence validation
  - Breathwork practice content completeness validation
  - Video and image and exercise/breathwork practice matching validation
  - File type and size validation for uploads
  - Duplicate prevention across all content types
- **Error handling and logging** for all operations with detailed feedback
- **Muscle group management** with ability to add/remove categories
- **Enhanced blog post CRUD operations** with draft/publish workflow and media management
- **Media asset CRUD operations** with upload, replacement, and deletion capabilities for videos and images
- **Content publishing system** with preview and live update capabilities
- **Exercise validation** to ensure no duplicates, placeholders, and accurate muscle group categorization
- **Media mapping validation**: Ensure each exercise and breathwork practice has a unique, corresponding, factual video and image that matches the content
- **Muscle group-exercise correspondence validation**: Verify exercises match their assigned muscle groups
- **Exercise variety validation**: Ensure comprehensive coverage of movement patterns per muscle group
- **User routine management**: Add/remove exercises and breathwork practices from user routines via checkbox selections
- **Routine-exercise-breathwork association** tracking for user accounts
- Exercise and breathwork practice retrieval by category with proper filtering and accurate categorization
- User routine retrieval and management
- **Music preference storage** and retrieval
- **Real-time sync operations** for immediate frontend reflection of backend changes

## Frontend Features
- **Perfectly centered header layout** with new logo (file_00000000f71471f5a1db16ce8a907948(1).png) dead center and "CEREBRAL PHYSIQUE, LLC" text directly underneath on all pages, symmetrical and responsive across all viewports
- **"Creator Dashboard" button** in header navigation **always visible** to authenticated admin users with **centered style consistent with other navigation elements**, **clear hover effects**, **tooltip hints** displaying "Access your editing tools for exercises, breathwork, and blogs", and **correct routing to `/creator-dashboard`**
- **Always accessible Creator Dashboard** from header when logged in as creator/admin
- **Enhanced Creator Editing Dashboard** with:
  - Dark minimalist UI consistent with site aesthetic
  - **Fully functional subpages** with clear edit/add/delete interfaces for Exercises, Breathwork, and Blog management
  - **Visible guidance text and empty-state messages** in each tab for intuitive content management
  - **Advanced exercise management interface** with add/edit/delete capabilities, video and image upload, and benefits editing
  - **Advanced breathwork practice management interface** with add/edit/delete capabilities, image upload, and exercise pairing management
  - **Real-time preview system** for all content changes before publishing
  - **Comprehensive error handling** with clear user feedback messages
  - **Drag-and-drop video and image upload** with progress indicators
  - **Integrated validation feedback** for exercise-muscle group-video-image correspondence and breathwork practice completeness
  - **Blog management interface** with create/edit/delete/publish functionality and media management
  - **Media asset management** with upload, replace, and delete capabilities for videos and images
  - **Smooth navigation** with all links and buttons functioning correctly
  - **Loading states** and progress indicators for all operations
  - **Confirmation dialogs** for destructive actions with clear messaging
  - **Real-time sync** with backend without page refreshes and **immediate frontend updates after all edits**
- **Single main Workout Library card** expanding to show seven cards: six muscle group sub-cards plus Breathwork Station
- **Automatic demo exercise population on load** ensuring sample exercises are displayed for each muscle group instead of 0 items
- **Grid-based exercise display** within each muscle group sub-card with:
  - **25-30 distinct and verified chest exercise cards** with correct exercise names, unique factual demonstrative media, factual movement descriptions, and detailed benefits text
  - **10+ exercise cards for other muscle groups** with comprehensive variety
  - **Unique demonstrative videos and images** from provided assets matching correct muscle groups and movements with no placeholders or duplicates
  - **Accurate exercise names, detailed instructions, and benefits lists** with comprehensive variety per muscle group
  - Checkbox for adding to routine
- **Breathwork Station interface** with:
  - **Clean, dark-themed design** consistent with site aesthetic
  - **Multiple breathwork practice cards** (Diaphragmatic Breathing, Box Breathing, Alternate Nostril Breathing, Performance Breathing)
  - **Demonstrative images or calm looping video backgrounds** using breathing-visual.dim_400x400.jpg and other subtle visuals
  - **Detailed technique descriptions** explaining how to perform each breathing practice
  - **Recommended exercise pairings** section showing connections to existing Workout Library exercises
  - **Mindfulness and focus benefits** section for each practice
  - **Calm, intuitive, and instructional design** aligned with "Mind Over Muscle" philosophy
  - Checkbox for adding breathwork practices to routine
  - **Integration with background music** for ambient immersion during practice
- **Proper muscle group organization**: Each sub-card contains only exercises targeting that specific muscle group
- **No duplicate or placeholder media**: Each exercise and breathwork practice displays a unique, factual video and image that accurately corresponds to the content
- **Comprehensive exercise variety**: Full range of compound and isolation movements per muscle group
- **Connected Routines section** showing user's selected exercises and breathwork practices grouped appropriately
- **Immediate library initialization with demo content** ensuring comprehensive exercise and breathwork content is properly categorized and visible on load
- **Active background music system** with ambient/motivational tracks
- **Music toggle control** in header for easy on/off access
- **Enhanced visual contrast** with more vibrant and visible background imagery
- **Accurate muscle group imagery** throughout the interface with proper correspondence
- Email capture UI
- **Fitness quote overlays** at section transitions
- **Smooth looping background animations**
- **Consistent logo positioning** across all pages with responsive layout integrity and perfect centering
- **Comprehensive error handling** throughout the application with user-friendly messages
- **Real-time feedback** for all user actions and form submissions

## UX Guidelines
- Confident, intelligent, disciplined tone
- **Admin-only access control** with clear authentication requirements for creator features
- **Always accessible Creator Dashboard** with **clear navigation instructions and tooltips** for easy creator access and **correct routing to `/creator-dashboard`**
- **Enhanced editing interface** with comprehensive error handling and real-time feedback
- **Intuitive content management** with visible guidance text and empty-state messages in each dashboard tab
- **Fully functional subpages** in Creator Dashboard with clear edit/add/delete interfaces
- **Immediate frontend updates** after all content edits with proper saving functionality
- **Automatic demo exercise population** ensuring users see sample exercises for each muscle group instead of empty displays
- **Factual and accurate exercise representation** with proper muscle group correspondence throughout
- **Calm and instructional breathwork experience** aligned with "Mind Over Muscle" philosophy
- **Integrated validation system** ensuring exercise names, muscle groups, videos, images, benefits, and breathwork content match accurately
- **Unique media mapping**: Each exercise and breathwork practice paired with its corresponding unique demonstration video and image with no placeholders or duplicates
- **Comprehensive exercise variety** ensuring users have full workout options per muscle group
- **Enhanced visual impact** with more vibrant backgrounds while maintaining readability
- **Perfectly centered branding** for professional and balanced appearance across all viewports
- **Active audio experience** with easy toggle control
- **Comprehensive exercise and breathwork library** with proper categorization, accurate targeting, and no duplicates or placeholders
- **No empty displays**: All muscle groups and breathwork practices show proper content with full variety on load
- Science-informed content approach
- **Fast, reliable Workout Library experience** with immediate exercise and breathwork visibility and proper organization
- **Accurate muscle group visuals** supporting educational content with proper correspondence
- **Seamless content management** with real-time updates and comprehensive error handling
- **Clear user feedback** for all actions, uploads, and validation errors
- **Smooth navigation** with all links and buttons functioning correctly across the application
