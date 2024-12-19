export interface SemanticAnnotation {
    objectId: string;
    concepts: string[];
}
/**
 * SemanticIndex indexes objects by their associated concepts for quick semantic queries.
 */
export declare class SemanticIndex {
    private index;
    private textLLM;
    constructor();
    addAnnotation(annotation: SemanticAnnotation): void;
    addAnnotationWithText(annotation: {
        objectId: string;
        text: string;
    }): Promise<void>;
    querySimilar(concept: string): string[];
    queryByConcept(concept: string): string[];
    getAllObjectIds(): string[];
}
