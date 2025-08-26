// Calendly Event Testing Script - UPDATED FOR JAVASCRIPT API
// Paste this into your browser console on http://localhost:3001 to test Calendly tracking

console.log('🔧 Calendly Debug Script Loaded - Updated for JavaScript API');
console.log('Available commands:');
console.log('- testCalendlyEvent() - Simulate a booking completion');
console.log('- checkPostHogStatus() - Check if PostHog is loaded');
console.log('- monitorCalendlyEvents() - Start monitoring all Calendly events');
console.log('- checkCalendlyAPI() - Check if Calendly JavaScript API is loaded');
console.log('- testAllEvents() - Test all Calendly events in sequence');
console.log('- forceLoadCalendly() - Manually load Calendly script');
console.log('- initManualWidget() - Try to initialize widget manually');

// Test Calendly event simulation
function testCalendlyEvent() {
  console.group('🧪 Testing Calendly Event');
  
  // Simulate the corrected event name
  const testEvent = {
    event: 'calendly.invitee_scheduled',
    payload: {
      invitee: {
        name: 'Test User',
        email: 'test@example.com'
      },
      event_type: {
        name: 'Piano Consultation'
      }
    }
  };
  
  console.log('Simulating Calendly event:', testEvent);
  
  // Post the message to simulate Calendly
  window.postMessage(testEvent, '*');
  
  console.groupEnd();
}

// Check PostHog status
function checkPostHogStatus() {
  console.group('📊 PostHog Status Check');
  
  if (typeof window.postHogDebug !== 'undefined') {
    window.postHogDebug.status();
  } else {
    console.log('PostHog Debug not available');
  }
  
  console.log('PostHog available:', !!window.posthog);
  console.log('PostHog capture function:', typeof window.posthog?.capture);
  
  if (window.posthog) {
    console.log('PostHog distinct ID:', window.posthog.get_distinct_id?.());
  }
  
  console.groupEnd();
}

// Monitor all Calendly events
function monitorCalendlyEvents() {
  console.log('🔍 Starting Calendly event monitoring...');
  
  // Override the postMessage listener temporarily for debugging
  const originalListener = window.addEventListener;
  
  window.addEventListener('message', function(e) {
    if (e.data && e.data.event && e.data.event.indexOf('calendly') === 0) {
      console.group('📨 Calendly Event Received');
      console.log('Event type:', e.data.event);
      console.log('Full event data:', e.data);
      console.log('Origin:', e.origin);
      console.groupEnd();
    }
  });
  
  console.log('✅ Monitoring active - all Calendly events will be logged');
}

// Test date/time selection event
function testDateTimeSelection() {
  console.group('📅 Testing Date/Time Selection');
  
  const testEvent = {
    event: 'calendly.invitee_date_time_selected',
    payload: {
      selected_time: '2025-09-15T14:00:00Z'
    }
  };
  
  console.log('Simulating date/time selection:', testEvent);
  window.postMessage(testEvent, '*');
  
  console.groupEnd();
}

// Check Calendly JavaScript API
function checkCalendlyAPI() {
  console.group('🔍 Calendly API Status Check');
  
  console.log('Calendly object available:', !!window.Calendly);
  console.log('Calendly.initInlineWidget available:', typeof window.Calendly?.initInlineWidget);
  
  // Check for Calendly script
  const calendlyScript = document.querySelector('script[src*="calendly.com"]');
  console.log('Calendly script loaded:', !!calendlyScript);
  if (calendlyScript) {
    console.log('Script src:', calendlyScript.src);
  }
  
  // Check for containers
  const containers = document.querySelectorAll('.calendly-inline-widget, .calendly-inline-widget-container');
  console.log('Calendly containers found:', containers.length);
  containers.forEach((container, index) => {
    console.log(`Container ${index + 1}:`, container);
  });
  
  console.groupEnd();
}

// Test all events in sequence
function testAllEvents() {
  console.group('🧪 Testing All Calendly Events');
  
  const events = [
    'calendly.profile_page_viewed',
    'calendly.event_type_viewed', 
    'calendly.invitee_date_time_selected',
    'calendly.invitee_scheduled'
  ];
  
  events.forEach((eventType, index) => {
    setTimeout(() => {
      console.log(`Testing event ${index + 1}/${events.length}: ${eventType}`);
      
      window.postMessage({
        event: eventType,
        payload: {
          timestamp: new Date().toISOString(),
          test: true
        }
      }, '*');
    }, index * 2000); // 2 second delay between events
  });
  
  console.log('✅ All events scheduled, watch console for results');
  console.groupEnd();
}

// Force load Calendly script
function forceLoadCalendly() {
  console.group('🔧 Force Loading Calendly Script');
  
  // Remove existing script if present
  const existing = document.querySelector('script[src*="calendly.com"]');
  if (existing) {
    console.log('Removing existing script...');
    existing.remove();
  }
  
  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  
  script.onload = () => {
    console.log('✅ Calendly script loaded manually!');
    console.log('Calendly object available:', !!window.Calendly);
    console.log('initInlineWidget method:', typeof window.Calendly?.initInlineWidget);
  };
  
  script.onerror = (error) => {
    console.error('❌ Failed to load Calendly script:', error);
  };
  
  document.head.appendChild(script);
  console.log('📥 Script loading initiated...');
  console.groupEnd();
}

// Try to initialize widget manually
function initManualWidget() {
  console.group('🚀 Manual Widget Initialization');
  
  const container = document.querySelector('.calendly-inline-widget-container');
  console.log('Container found:', !!container);
  console.log('Calendly available:', !!window.Calendly);
  
  if (container && window.Calendly) {
    try {
      container.innerHTML = ''; // Clear existing content
      
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/kawaipianogallery/shsu-piano-sale',
        parentElement: container,
        utm: {
          utmSource: 'manual-test',
          utmMedium: 'debug-console',
          utmCampaign: 'testing'
        }
      });
      
      console.log('✅ Widget initialized manually!');
    } catch (error) {
      console.error('❌ Failed to initialize widget:', error);
    }
  } else {
    console.warn('⚠️ Missing dependencies:');
    console.warn('  - Container:', !!container);
    console.warn('  - Calendly:', !!window.Calendly);
  }
  
  console.groupEnd();
}

// Make functions globally available
window.testCalendlyEvent = testCalendlyEvent;
window.checkPostHogStatus = checkPostHogStatus;
window.monitorCalendlyEvents = monitorCalendlyEvents;
window.testDateTimeSelection = testDateTimeSelection;
window.checkCalendlyAPI = checkCalendlyAPI;
window.testAllEvents = testAllEvents;
window.forceLoadCalendly = forceLoadCalendly;
window.initManualWidget = initManualWidget;

// Test PostHog consultation_booking_attempt event directly
function testPostHogEvent() {
  console.group('🧪 Testing PostHog Event Directly');
  
  const testEventData = {
    booking_source: 'test',
    calendly_status: 'completed', 
    user_type: 'new',
    completion_timestamp: new Date().toISOString(),
    is_test_event: true
  };
  
  console.log('Sending test consultation_booking_attempt event...');
  console.log('Event data:', testEventData);
  
  try {
    // Send via PostHog directly
    if (window.posthog) {
      window.posthog.capture('consultation_booking_attempt', testEventData);
      console.log('✅ Test event sent via window.posthog');
    }
    
    console.log('Check your PostHog dashboard for the test event!');
  } catch (error) {
    console.error('❌ Failed to send test event:', error);
  }
  
  console.groupEnd();
}

window.testPostHogEvent = testPostHogEvent;

console.log('🚀 Calendly debug functions are now available globally!');
console.log('New function: testPostHogEvent() - Test PostHog directly');