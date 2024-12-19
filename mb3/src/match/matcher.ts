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
import {SemanticIndex} from './semanticIndex';

export class Matcher {
    constructor(private semanticIndex: SemanticIndex) {}

    findMatches(object: { id: string; concepts?: string[] }): Match[] {
        if (!object.concepts?.length) return [];

        const similarObjectIds = new Set<string>();

        object.concepts.forEach((concept) => {
            this.semanticIndex.queryByConcept(concept).forEach((id) => {
                if (id !== object.id) similarObjectIds.add(id);
            });
        });

        return Array.from(similarObjectIds).map((target) => ({ target, score: 0.8 }));
    }

    generateMatch(sourceId: string, targetId: string): GeneratedMatch {
        return { source: sourceId, target: targetId, similarity: 0.5 };
    }
}
