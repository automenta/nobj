import {expect, it} from 'vitest';
import {SemanticIndex} from '@/match/semanticIndex';

const index = new SemanticIndex();

it('should add and query annotations', () => {
    const annotation = { objectId: 'obj1', concepts: ['AI', 'Machine Learning'] };
    index.addAnnotation(annotation);
    expect(index.queryByConcept('AI')).toContain('obj1');
    expect(index.queryByConcept('Cooking')).not.toContain('obj1');
});

it('should query similar objects', () => {
    index.addAnnotation({ objectId: 'obj2', concepts: ['AI', 'Deep Learning'] });
    const similar = index.querySimilar('obj1');
    expect(similar).toContain('obj2');
});
