/**
 * Utility to trigger a light tactile vibration (haptic feedback) on devices that support it.
 * Falls back gracefully on desktop or unsupported devices.
 * 
 * @param duration Duration of vibration in milliseconds (default 40ms)
 */
export function triggerVibration(duration = 40) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(duration);
    } catch (e) {
      // Ignore security/user gesture or permission restriction errors
      console.warn('Vibration API not allowed or supported:', e);
    }
  }
}
