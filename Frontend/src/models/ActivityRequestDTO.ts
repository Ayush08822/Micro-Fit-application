export class Activity {
    type: string;
    duration: number;
    caloriesBurned: number;
    timestamp: string;
    additionalMetrics: { [key: string]: any };
  
    constructor(
      type: string,
      duration: number,
      caloriesBurned: number,
      additionalMetrics: { [key: string]: any } = {}
    ) {
      this.type = type;
      this.duration = duration;
      this.caloriesBurned = caloriesBurned;
      this.timestamp = new Date().toISOString();
      this.additionalMetrics = additionalMetrics;
    }
  }
  