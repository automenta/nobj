import { SemanticIndex } from './semanticIndex';
import { Matcher } from './matcher';
import { NObject } from '../core/object';

export class SemanticService {
    private semanticIndex: SemanticIndex;
    private matcher: Matcher;

    constructor() {
        this.semanticIndex = new SemanticIndex();
        this.matcher = new Matcher(this.semanticIndex);
    }

    async addAnnotation(object: NObject): Promise<void> {
        if (object.data.content) {
            await this.semanticIndex.addAnnotationWithText({ objectId: object.data.id, text: object.data.content });
        }
    }

    async queryByConcept(concept: string): Promise<string[]> {
        return this.semanticIndex.queryByConcept(concept);
    }

    async matchObjects(object: NObject): Promise<any[]> {
        return this.matcher.findMatches(object.data);
    }
}
