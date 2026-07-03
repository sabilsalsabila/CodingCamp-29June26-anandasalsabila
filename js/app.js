// Life Dashboard Application
// Main JavaScript file for all interactive functionality

// ==============================================
// Greeting Module
// ==============================================

/**
 * Format a Date object to "HH:MM:SS AM/PM" format with zero-padding
 * @param {Date} date - The date object to format
 * @returns {string} Formatted time string (e.g., "09:05:03 AM")
 */
function formatTime(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "-- : -- : -- --";
    }
    
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Determine AM/PM
    const period = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours; // 0 becomes 12
    
    // Zero-pad all components
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    
    return `${hoursStr}:${minutesStr}:${secondsStr} ${period}`;
}

/**
 * Format a Date object to "DayOfWeek, Month DD, YYYY" format
 * @param {Date} date - The date object to format
 * @returns {string} Formatted date string (e.g., "Friday, July 03, 2026")
 */
function formatDate(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return "Date unavailable";
    }
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

/**
 * Get appropriate greeting based on the hour of day
 * @param {number} hour - Hour value (0-23)
 * @returns {string} Greeting message
 */
function getGreeting(hour) {
    if (hour >= 5 && hour < 12) {
        return "Good morning";
    } else if (hour >= 12 && hour < 17) {
        return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
        return "Good evening";
    } else {
        return "Good night";
    }
}

// Initialize greeting module on page load
function initGreeting() {
    // Implementation will be added in subsequent tasks
    console.log('Greeting module initialized');
}

// ==============================================
// Focus Timer Module
// ==============================================

// Timer state object
const timerState = {
    totalSeconds: 1500,      // 25 minutes (1500 seconds)
    remainingSeconds: 1500,  // Current countdown value
    state: 'stopped',        // "stopped" | "running" | "paused"
    intervalId: null         // Reference to setInterval
};

/**
 * Format seconds into MM:SS display format
 * @param {number} seconds - Non-negative integer from 0 to 1500
 * @returns {string} Formatted time string in "MM:SS" format with zero-padding
 */
function formatTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Zero-pad to ensure MM:SS format
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(remainingSeconds).padStart(2, '0');
    
    return `${minutesStr}:${secondsStr}`;
}

// Initialize focus timer on page load
function initTimer() {
    // Implementation will be added in subsequent tasks
    console.log('Focus timer initialized');
}

// ==============================================
// Local Storage Helper Functions
// ==============================================

/**
 * Persist tasks array to Local Storage
 * @param {Array} tasks - Array of task objects to save
 * @returns {boolean} - True if successful, false if failed
 */
function persistTasks(tasks) {
    try {
        // Validate input is an array
        if (!Array.isArray(tasks)) {
            console.error('persistTasks: Input must be an array');
            return false;
        }
        
        // Serialize tasks array to JSON and save to Local Storage
        const serializedTasks = JSON.stringify(tasks);
        localStorage.setItem('dashboard_tasks', serializedTasks);
        return true;
    } catch (error) {
        // Handle quota exceeded, privacy mode, or other storage errors
        console.error('Failed to persist tasks:', error);
        
        // Check for specific error types
        if (error.name === 'QuotaExceededError') {
            displayErrorMessage('Unable to save tasks. Storage quota exceeded.');
        } else if (error.name === 'SecurityError') {
            displayErrorMessage('Unable to save tasks. Storage access denied (privacy mode may be enabled).');
        } else {
            displayErrorMessage('Unable to save tasks. An error occurred.');
        }
        
        return false;
    }
}

/**
 * Load tasks array from Local Storage
 * @returns {Array} - Array of task objects, or empty array if none found or error occurred
 */
function loadTasks() {
    try {
        // Retrieve stored data
        const storedData = localStorage.getItem('dashboard_tasks');
        
        // Return empty array if no data stored (first visit or cleared storage)
        if (storedData === null || storedData === undefined) {
            return [];
        }
        
        // Parse JSON data
        const parsedData = JSON.parse(storedData);
        
        // Validate that parsed data is an array
        if (!Array.isArray(parsedData)) {
            console.warn('loadTasks: Stored data is not an array, initializing with empty array');
            return [];
        }
        
        // Validate each task object has required properties
        const validTasks = parsedData.filter(task => {
            if (typeof task !== 'object' || task === null) {
                console.warn('loadTasks: Invalid task object found, skipping');
                return false;
            }
            
            // Check for required properties: id, description, completed
            if (!task.hasOwnProperty('id') || 
                !task.hasOwnProperty('description') || 
                !task.hasOwnProperty('completed')) {
                console.warn('loadTasks: Task missing required properties, skipping', task);
                return false;
            }
            
            return true;
        });
        
        return validTasks;
    } catch (error) {
        // Handle JSON parse errors or other exceptions
        console.warn('Failed to parse stored tasks:', error);
        return [];
    }
}

/**
 * Persist quick links array to Local Storage
 * @param {Array} links - Array of quick link objects to save
 * @returns {boolean} - True if successful, false if failed
 */
function persistQuickLinks(links) {
    try {
        // Validate input is an array
        if (!Array.isArray(links)) {
            console.error('persistQuickLinks: Input must be an array');
            return false;
        }
        
        // Serialize links array to JSON and save to Local Storage
        const serializedLinks = JSON.stringify(links);
        localStorage.setItem('dashboard_quicklinks', serializedLinks);
        return true;
    } catch (error) {
        // Handle quota exceeded, privacy mode, or other storage errors
        console.error('Failed to persist quick links:', error);
        
        // Check for specific error types
        if (error.name === 'QuotaExceededError') {
            displayErrorMessage('Unable to save quick links. Storage quota exceeded.');
        } else if (error.name === 'SecurityError') {
            displayErrorMessage('Unable to save quick links. Storage access denied (privacy mode may be enabled).');
        } else {
            displayErrorMessage('Unable to save quick links. An error occurred.');
        }
        
        return false;
    }
}

/**
 * Load quick links array from Local Storage
 * @returns {Array} - Array of quick link objects, or empty array if none found or error occurred
 */
function loadQuickLinks() {
    try {
        // Retrieve stored data
        const storedData = localStorage.getItem('dashboard_quicklinks');
        
        // Return empty array if no data stored (first visit or cleared storage)
        if (storedData === null || storedData === undefined) {
            return [];
        }
        
        // Parse JSON data
        const parsedData = JSON.parse(storedData);
        
        // Validate that parsed data is an array
        if (!Array.isArray(parsedData)) {
            console.warn('loadQuickLinks: Stored data is not an array, initializing with empty array');
            return [];
        }
        
        // Validate each link object has required properties
        const validLinks = parsedData.filter(link => {
            if (typeof link !== 'object' || link === null) {
                console.warn('loadQuickLinks: Invalid link object found, skipping');
                return false;
            }
            
            // Check for required properties: id, name, url
            if (!link.hasOwnProperty('id') || 
                !link.hasOwnProperty('name') || 
                !link.hasOwnProperty('url')) {
                console.warn('loadQuickLinks: Link missing required properties, skipping', link);
                return false;
            }
            
            return true;
        });
        
        return validLinks;
    } catch (error) {
        // Handle JSON parse errors or other exceptions
        console.warn('Failed to parse stored quick links:', error);
        return [];
    }
}

/**
 * Display error message to user
 * @param {string} message - Error message to display
 */
function displayErrorMessage(message) {
    // This is a placeholder function that will be properly implemented
    // when the UI error display mechanism is created in a future task
    console.error('Error:', message);
    // TODO: Display error message in UI
}

// ==============================================
// Task Manager Module
// ==============================================

// Initialize task manager on page load
function initTaskManager() {
    // Implementation will be added in subsequent tasks
    console.log('Task manager initialized');
}

// ==============================================
// Quick Links Module
// ==============================================

// Initialize quick links on page load
function initQuickLinks() {
    // Implementation will be added in subsequent tasks
    console.log('Quick links initialized');
}

// ==============================================
// Application Initialization
// ==============================================

// Initialize all modules when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Life Dashboard loading...');
    
    initGreeting();
    initTimer();
    initTaskManager();
    initQuickLinks();
    
    console.log('Life Dashboard loaded successfully');
});
