// Global event system for real-time updates
export const dispatchDataUpdate = () => {
  window.dispatchEvent(new CustomEvent('dataUpdated'));
};

export const dispatchUserUpdate = () => {
  window.dispatchEvent(new CustomEvent('userUpdated'));
};

export const dispatchFastingUpdate = () => {
  window.dispatchEvent(new CustomEvent('fastingUpdated'));
};

export const addEventListener = (eventName, callback) => {
  window.addEventListener(eventName, callback);
  return () => window.removeEventListener(eventName, callback);
};

export const removeEventListener = (eventName, callback) => {
  window.removeEventListener(eventName, callback);
};