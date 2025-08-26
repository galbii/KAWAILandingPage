// Test script for Calendly event tracking
// Paste this in browser console to test all event tracking

console.log('🧪 Testing Calendly Event Tracking');

// Function to simulate Calendly events in sequence
function testCalendlyFunnel() {
  console.group('🎯 Testing Complete Calendly Funnel');
  
  const events = [
    {
      event: 'calendly.profile_page_viewed',
      payload: { timestamp: new Date().toISOString() }
    },
    {
      event: 'calendly.event_type_viewed', 
      payload: { event_type: 'Piano Consultation' }
    },
    {
      event: 'calendly.date_and_time_selected',
      payload: { 
        selected_time: '2025-09-15T14:00:00Z',
        duration: 60
      }
    },
    {
      event: 'calendly.invitee_scheduled',
      payload: {
        invitee: {
          name: 'Test User',
          email: 'test@example.com'
        },
        scheduled_time: '2025-09-15T14:00:00Z'
      }
    }
  ];
  
  console.log('🚀 Simulating complete booking funnel...');
  
  events.forEach((eventData, index) => {
    setTimeout(() => {
      console.log(`📨 Step ${index + 1}/${events.length}: ${eventData.event}`);
      window.postMessage(eventData, '*');
    }, index * 3000); // 3 second delay between events
  });
  
  console.log('✅ All events scheduled - watch console for tracking results');
  console.groupEnd();
}

// Function to test just the time selection event
function testTimeSelection() {
  console.group('📅 Testing Time Selection Event');
  
  const timeSelectionEvent = {
    event: 'calendly.date_and_time_selected',
    payload: {
      selected_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      duration: 60,
      timezone: 'America/Chicago'
    }
  };
  
  console.log('Simulating time selection:', timeSelectionEvent);
  window.postMessage(timeSelectionEvent, '*');
  
  console.log('✅ Time selection event sent');
  console.groupEnd();
}

// Function to check PostHog events
function checkPostHogEvents() {
  console.group('📊 Checking PostHog Events');
  
  if (window.postHogDebug && window.postHogDebug.monitor) {
    const events = window.postHogDebug.monitor.getEvents();
    console.log(`Total PostHog events captured: ${events.length}`);
    
    // Show Calendly-related events
    const calendlyEvents = events.filter(e => 
      e.eventName.includes('calendly') || 
      e.eventName.includes('consultation') ||
      e.eventName.includes('booking')
    );
    
    console.log(`Calendly-related events: ${calendlyEvents.length}`);
    calendlyEvents.forEach(event => {
      console.log(`- ${event.eventName}:`, event.properties);
    });
  } else {
    console.warn('PostHog debug not available');
  }
  
  console.groupEnd();
}

// Make functions available globally
window.testCalendlyFunnel = testCalendlyFunnel;
window.testTimeSelection = testTimeSelection;
window.checkPostHogEvents = checkPostHogEvents;

console.log('🎯 Available test functions:');
console.log('- testCalendlyFunnel() - Test complete booking flow');
console.log('- testTimeSelection() - Test just the time selection');
console.log('- checkPostHogEvents() - View captured PostHog events');
console.log('');
console.log('📊 To test the new tracking:');
console.log('1. Run: testTimeSelection()');
console.log('2. Check console for tracking confirmations');
console.log('3. Run: checkPostHogEvents() to see captured data');