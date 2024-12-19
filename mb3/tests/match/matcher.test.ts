import {expect, it} from 'vitest';
import {Matcher} from '@/match/matcher';
import {SemanticIndex} from '@/match/semanticIndex';

const mockSemanticIndex = new SemanticIndex();
const matcher = new Matcher(mockSemanticIndex);

it('findMatches should return matches for AI concepts', async () => {
    mockSemanticIndex.addAnnotation({ objectId: 'obj2', concepts: ['AI'] });
    const obj = { id: 'obj1', concepts: ['AI'] };
    const matches = matcher.findMatches(obj);
    expect(matches).toEqual([{ target: 'obj2', score: 0.8 }]);
});

it('generateMatch should produce a GeneratedMatch', () => {
    const match = matcher.generateMatch('obj1', 'obj2');
    expect(match.source).toBe('obj1');
    expect(match.target).toBe('obj2');
});
