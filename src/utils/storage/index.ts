
// Re-export all storage-related functions
export * from './base';
export * from './users';
export * from './classrooms'; // This now points to our refactored classrooms/index.ts
export * from './assignments';
export * from './liveClasses';

// App initialization function
export const initializeAppData = () => {
  // Initialize classrooms
  const { initializeClassrooms } = require('./classrooms');
  initializeClassrooms();

  // Initialize assignments
  const { initializeAssignments } = require('./assignments');
  initializeAssignments();
  
  // Initialize default user if not authenticated
  const { initializeDefaultUser } = require('./users');
  initializeDefaultUser();
  
  // Initialize live classes
  const { initializeLiveClasses } = require('./liveClasses');
  initializeLiveClasses();
};
