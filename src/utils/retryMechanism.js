/**
 * Executes a function with exponential backoff retry mechanism
 * @param {Function} fn - The async function to retry
 * @param {Number} maxRetries - Maximum number of retries
 * @param {Number} initialDelay - Initial delay in milliseconds
 * @param {Function} shouldRetry - Function that determines if retry should be attempted based on error
 * @returns {Promise} - Result of the function or throws an error after all retries fail
 */
async function withRetry(fn, maxRetries = 3, initialDelay = 1000, shouldRetry = () => true) {
  let retries = 0;
  let lastError;

  while (retries <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if we should retry based on the error
      if (!shouldRetry(error) || retries >= maxRetries) {
        break;
      }
      
      // Calculate delay with exponential backoff and some jitter
      const delay = initialDelay * Math.pow(2, retries) + Math.random() * 100;
      console.log(`Retry attempt ${retries + 1}/${maxRetries}. Waiting ${delay.toFixed(0)}ms before next attempt.`);
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }

  throw new Error(`Operation failed after ${retries} retries. Last error: ${lastError.message}`);
}

module.exports = {
  withRetry,
};