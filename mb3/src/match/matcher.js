export class Matcher {
    semanticIndex;
    constructor(semanticIndex) {
        this.semanticIndex = semanticIndex;
    }
    findMatches(object) {
        if (!object.concepts?.length)
            return [];
        const similarObjectIds = new Set();
        object.concepts.forEach((concept) => {
            this.semanticIndex.queryByConcept(concept).forEach((id) => {
                if (id !== object.id)
                    similarObjectIds.add(id);
            });
        });
        return Array.from(similarObjectIds).map((target) => ({ target, score: 0.8 }));
    }
    generateMatch(sourceId, targetId) {
        return { source: sourceId, target: targetId, similarity: 0.5 };
    }
}
//# sourceMappingURL=matcher.js.map