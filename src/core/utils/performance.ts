export class PerformanceTracker {
    private startTime: number = 0;
    private endTime: number = 0;
  
    public start(): void {
      this.startTime = performance.now();
    }
  
    public end(): number {
      this.endTime = performance.now();
      return this.getDuration();
    }
  
    public getDuration(): number {
      return this.endTime - this.startTime;
    }
  
    public reset(): void {
      this.startTime = 0;
      this.endTime = 0;
    }
  }
  
  export function measureAsync<T>(fn: () => Promise<T>): Promise<[T, number]> {
    const tracker = new PerformanceTracker();
    tracker.start();
    
    return fn().then(result => {
      const duration = tracker.end();
      return [result, duration];
    });
  }
  
  export function measure<T>(fn: () => T): [T, number] {
    const tracker = new PerformanceTracker();
    tracker.start();
    
    const result = fn();
    const duration = tracker.end();
    
    return [result, duration];
  }