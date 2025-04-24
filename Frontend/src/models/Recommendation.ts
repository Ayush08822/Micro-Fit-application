export class Recommendation {
    activityType: string;
    recommendation: string;
    improvements: string[];
    suggestions: string[];
    safety: string[];
  
    constructor(
      activityType: string,
      recommendation: string,
      improvements: string[],
      suggestions: string[],
      safety: string[],
    ) {
      this.activityType = activityType;
      this.recommendation = recommendation;
      this.improvements = improvements;
      this.suggestions = suggestions;
      this.safety = safety;
    }
  }
  