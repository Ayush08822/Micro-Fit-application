export class ActivityResponseDTO {
    id: string;
    type: string;
    duration: number;
    caloriesBurned: number;
    startTime: string;
    additionalMetrics: { [key: string]: any };
    createdAt: string;
    ready?: boolean;
  
    constructor(
      id: string,
      type: string,
      duration: number,
      caloriesBurned: number,
      startTime: string,
      additionalMetrics: { [key: string]: any },
      createdAt: string,
    ) {
      this.id = id;
      this.type = type;
      this.duration = duration;
      this.caloriesBurned = caloriesBurned;
      this.startTime = startTime;
      this.additionalMetrics = additionalMetrics;
      this.createdAt = createdAt;
      this.ready = false; // default
    }
}  