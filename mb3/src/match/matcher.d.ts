export interface Match {
    target: string;
    score: number;
}
export interface GeneratedMatch {
    source: string;
    target: string;
    similarity: number;
}
/**
 * Matcher uses concepts to find semantically similar objects.
 */
import { SemanticIndex } from './semanticIndex';
export declare class Matcher {
    private semanticIndex;
    constructor(semanticIndex: SemanticIndex);
    findMatches(object: {
        id: string;
        concepts?: string[];
    }): Match[];
    generateMatch(sourceId: string, targetId: string): GeneratedMatch;
}
