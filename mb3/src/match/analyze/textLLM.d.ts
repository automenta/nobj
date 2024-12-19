export interface TextAnalysisResult {
    summary: string;
    entities: any[];
}
export declare class TextLLM {
    private summarizer;
    private ner;
    constructor();
    init(): Promise<void>;
    analyze(text: string): Promise<TextAnalysisResult>;
}
