export interface VisionAnalysisResult {
    [key: string]: any;
}
/**
 * VisionLLM simulates vision-based analysis. Replace with actual model calls as needed.
 */
export declare class VisionLLM {
    analyzeImage(imageData: any): Promise<VisionAnalysisResult>;
}
