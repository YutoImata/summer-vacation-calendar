// Calendar JavaScript Functions

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupPrintHandlers();
    setupTouchHandlers();
    optimizeForDevice();
});

// Initialize Calendar
function initializeCalendar() {
    // Add current date highlighting if needed
    highlightToday();
    
    // Setup event tooltips for mobile
    setupEventTooltips();
    
    // Initialize responsive features
    handleResponsiveFeatures();
}

// Highlight today's date
function highlightToday() {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-based (July = 6, August = 7, September = 8)
    const currentDate = today.getDate();
    
    // Only highlight if we're in August (7) or September (8)
    if (currentMonth === 7 || currentMonth === 8) {
        const calendarDays = document.querySelectorAll('.calendar-day');
        
        calendarDays.forEach(day => {
            const dayNumber = day.querySelector('.day-number');
            if (dayNumber && parseInt(dayNumber.textContent) === currentDate) {
                // Check if this day is in the current month section
                const monthSection = day.closest('.month-section');
                const monthTitle = monthSection?.querySelector('.month-title')?.textContent;
                
                if ((currentMonth === 7 && monthTitle === '8月') || 
                    (currentMonth === 8 && monthTitle === '9月')) {
                    day.classList.add('today');
                    dayNumber.style.backgroundColor = '#ff6b6b';
                    dayNumber.style.color = 'white';
                    dayNumber.style.borderRadius = '50%';
                    dayNumber.style.width = '20px';
                    dayNumber.style.height = '20px';
                    dayNumber.style.display = 'flex';
                    dayNumber.style.alignItems = 'center';
                    dayNumber.style.justifyContent = 'center';
                }
            }
        });
    }
}

// Setup event tooltips for better mobile experience
function setupEventTooltips() {
    const events = document.querySelectorAll('.event');
    
    events.forEach(event => {
        // Add touch feedback
        event.addEventListener('touchstart', function() {
            this.style.opacity = '0.8';
        });
        
        event.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
        
        // Add long press for more info (mobile)
        let pressTimer;
        
        event.addEventListener('touchstart', function(e) {
            pressTimer = setTimeout(() => {
                showEventDetails(this);
            }, 500); // 0.5 second long press
        });
        
        event.addEventListener('touchend', function() {
            clearTimeout(pressTimer);
        });
        
        event.addEventListener('touchmove', function() {
            clearTimeout(pressTimer);
        });
    });
}

// Show event details (for long press)
function showEventDetails(eventElement) {
    const eventText = eventElement.textContent;
    const dayElement = eventElement.closest('.calendar-day');
    const dayNumber = dayElement.querySelector('.day-number').textContent;
    
    // Create a simple alert for now (could be enhanced with a modal)
    if (window.confirm(`${dayNumber}日: ${eventText}\n\n詳細を確認しますか？`)) {
        // Could open a modal or navigate to details page
        console.log('Event details requested for:', eventText);
    }
}

// Handle responsive features
function handleResponsiveFeatures() {
    // Adjust font sizes based on viewport
    adjustFontSizes();
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(() => {
            adjustFontSizes();
            optimizeLayout();
        }, 100);
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            adjustFontSizes();
            optimizeLayout();
        }, 250);
    });
}

// Adjust font sizes based on screen size
function adjustFontSizes() {
    const screenWidth = window.innerWidth;
    const events = document.querySelectorAll('.event');
    
    if (screenWidth < 400) {
        // Very small screens
        events.forEach(event => {
            event.style.fontSize = '7px';
            event.style.padding = '1px 2px';
        });
    } else if (screenWidth < 600) {
        // Small screens
        events.forEach(event => {
            event.style.fontSize = '8px';
            event.style.padding = '2px 3px';
        });
    }
    // Larger screens use CSS media queries
}

// Optimize layout for current device
function optimizeLayout() {
    const calendarDays = document.querySelectorAll('.calendar-day');
    const screenWidth = window.innerWidth;
    
    if (screenWidth < 480) {
        // Reduce minimum height for very small screens
        calendarDays.forEach(day => {
            day.style.minHeight = '70px';
        });
    } else if (screenWidth < 768) {
        calendarDays.forEach(day => {
            day.style.minHeight = '80px';
        });
    }
}

// Setup print handlers
function setupPrintHandlers() {
    // Before print
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
        
        // Optimize for print
        const events = document.querySelectorAll('.event');
        events.forEach(event => {
            event.style.fontSize = '8px';
            event.style.padding = '2px 3px';
            event.style.lineHeight = '1.1';
        });
    });
    
    // After print
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
        
        // Restore original styles
        adjustFontSizes();
    });
}

// Setup touch handlers for better mobile experience
function setupTouchHandlers() {
    // Prevent zoom on double tap for calendar days
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    calendarDays.forEach(day => {
        day.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
    
    // Add smooth scrolling for mobile
    if (isMobileDevice()) {
        document.body.style.webkitOverflowScrolling = 'touch';
        document.body.style.overflowScrolling = 'touch';
    }
}

// Detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Optimize for specific device
function optimizeForDevice() {
    // iOS Safari specific optimizations
    if (isiOS()) {
        optimizeForIOS();
    }
    
    // Android specific optimizations
    if (isAndroid()) {
        optimizeForAndroid();
    }
    
    // Add device class to body for CSS targeting
    document.body.classList.add(getDeviceClass());
}

// Detect iOS
function isiOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Detect Android
function isAndroid() {
    return /Android/.test(navigator.userAgent);
}

// Get device class for CSS
function getDeviceClass() {
    if (isiOS()) return 'ios-device';
    if (isAndroid()) return 'android-device';
    return 'desktop-device';
}

// iOS specific optimizations
function optimizeForIOS() {
    // Fix iOS viewport issues
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Prevent iOS Safari from adjusting font sizes
    document.body.style.webkitTextSizeAdjust = '100%';
    
    // Fix iOS Safari scroll bounce
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Add iOS safe area padding if needed
    if (window.CSS && window.CSS.supports && window.CSS.supports('padding-top: env(safe-area-inset-top)')) {
        document.body.style.paddingTop = 'env(safe-area-inset-top)';
        document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
    }
}

// Android specific optimizations
function optimizeForAndroid() {
    // Fix Android Chrome address bar height changes
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Utility function to create print-friendly version
function createPrintVersion() {
    const printButton = document.createElement('button');
    printButton.textContent = '印刷';
    printButton.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4a90e2;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Only show print button on larger screens
    if (window.innerWidth >= 768) {
        document.body.appendChild(printButton);
    }
}

// Add print button after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createPrintVersion();
});

// Performance optimization for older devices
function optimizePerformance() {
    // Reduce animations on older devices
    if (isOlderDevice()) {
        document.body.classList.add('reduced-motion');
    }
    
    // Lazy load non-critical features
    requestIdleCallback(() => {
        setupAdvancedFeatures();
    });
}

// Detect older devices (simple heuristic)
function isOlderDevice() {
    // Check for older iOS versions
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const iOSVersion = iOS && parseFloat(navigator.userAgent.match(/OS (\d+_\d+)/)[1].replace('_', '.'));
    
    if (iOS && iOSVersion < 12) return true;
    
    // Check for older Android versions
    const android = /Android/.test(navigator.userAgent);
    const androidVersion = android && parseFloat(navigator.userAgent.match(/Android (\d+\.\d+)/)[1]);
    
    if (android && androidVersion < 8) return true;
    
    return false;
}

// Setup advanced features for modern devices
function setupAdvancedFeatures() {
    if (!isOlderDevice()) {
        // Add subtle animations
        addAnimations();
        
        // Setup advanced touch gestures
        setupAdvancedGestures();
    }
}

// Add subtle animations
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .calendar-day {
            transition: transform 0.1s ease;
        }
        
        .calendar-day:hover {
            transform: scale(1.02);
        }
        
        .event {
            transition: all 0.2s ease;
        }
        
        .event:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .reduced-motion * {
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);
}

// Setup advanced touch gestures
function setupAdvancedGestures() {
    // Add pinch-to-zoom prevention while allowing scroll
    document.addEventListener('touchstart', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Add swipe gestures for month navigation (future feature)
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });
    
    function handleSwipeGesture() {
        const swipeThreshold = 100;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe right - could navigate to previous month
                console.log('Swipe right detected');
            } else {
                // Swipe left - could navigate to next month
                console.log('Swipe left detected');
            }
        }
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    optimizePerformance();
});

// Export functions for potential external use
window.CalendarApp = {
    highlightToday,
    adjustFontSizes,
    optimizeLayout,
    isMobileDevice,
    isiOS,
    isAndroid
};