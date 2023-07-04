// SharedResource.js
class SharedResource {
    // throttleLimit = 5000
    throttleLimit = 100 
    constructor() {
      if (!SharedResource.instance) {
        // the timestamp when the API can be called again
        // initialize it to the current time so the API can be called immediately
        this.nextAvailableTimestamp = Date.now();
        SharedResource.instance = this;
      }
  
      return SharedResource.instance;
    }

      // This method waits until the API is ready to be called
    async waitForReady() {
        const currentTime = Date.now();
        const waitTime = this.nextAvailableTimestamp - currentTime;

        if (waitTime <= 0) {
            // No need to wait
            this.nextAvailableTimestamp = currentTime + this.throttleLimit;
            return true;
        } 
        else {
            // Wait for the remaining time
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.nextAvailableTimestamp = Date.now() + this.throttleLimit;
                    resolve(true);
                }, waitTime);
            });
        }
    }

}

  
  
  const instance = new SharedResource();
  module.exports = instance; // Singleton instance