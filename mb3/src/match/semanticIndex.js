import { TextLLM } from './analyze/textLLM';
/**
 * SemanticIndex indexes objects by their associated concepts for quick semantic queries.
 */
export class SemanticIndex {
    index;
    textLLM;
    constructor() {
        this.index = new Map();
        this.textLLM = new TextLLM();
    }
    addAnnotation(annotation) {
        for (const concept of annotation.concepts) {
            if (!this.index.has(concept)) {
                this.index.set(concept, new Set());
            }
            this.index.get(concept).add(annotation.objectId);
        }
    }
    async addAnnotationWithText(annotation) {
        const { entities } = await this.textLLM.analyze(annotation.text);
        const concepts = entities.map((entity) => entity.entity_group);
        this.addAnnotation({ objectId: annotation.objectId, concepts });
    }
    querySimilar(concept) {
        return []; //TODO
    }
    queryByConcept(concept) {
        return Array.from(this.index.get(concept) || []);
    }
    getAllObjectIds() {
        const allIds = new Set();
        this.index.forEach((objectIds) => objectIds.forEach((id) => allIds.add(id)));
        return [...allIds];
    }
}
//# sourceMappingURL=semanticIndex.js.map