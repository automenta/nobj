export interface CodeAnalysisResult {
    [key: string]: any;
}
/**
 * CodeAnalyzer simulates code analysis for complexity or style.
 */
export declare class CodeAnalyzer {
    analyze(code: string): Promise<CodeAnalysisResult>;
}
