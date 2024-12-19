import {TextLLM} from './analyze/textLLM';

export interface SemanticAnnotation {
    objectId: string;
    concepts: string[];
}

/**
 * SemanticIndex indexes objects by their associated concepts for quick semantic queries.
 */
export class SemanticIndex {
    private index: Map<string, Set<string>>;
    private textLLM: TextLLM;

    constructor() {
        this.index = new Map<string, Set<string>>();
        this.textLLM = new TextLLM();
    }

    addAnnotation(annotation: SemanticAnnotation): void {
        for (const concept of annotation.concepts) {
            if (!this.index.has(concept)) {
                this.index.set(concept, new Set());
            }
            this.index.get(concept)!.add(annotation.objectId);
        }
    }

    async addAnnotationWithText(annotation: { objectId: string; text: string }): Promise<void> {
        const { entities } = await this.textLLM.analyze(annotation.text);
        const concepts = entities.map((entity: any) => entity.entity_group);
        this.addAnnotation({ objectId: annotation.objectId, concepts });
    }

    querySimilar(concept: string): string[] {
        return []; //TODO
    }

    queryByConcept(concept: string): string[] {
        return Array.from(this.index.get(concept) || []);
    }

    getAllObjectIds(): string[] {
        const allIds = new Set<string>();
        this.index.forEach((objectIds) => objectIds.forEach((id) => allIds.add(id)));

        return [...allIds];
    }
}
