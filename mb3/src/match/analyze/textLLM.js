import { env, pipeline } from '@xenova/transformers';
env.allowLocalModels = false;
export class TextLLM {
    summarizer = null;
    // Named Entity Recognition
    ner = null;
    constructor() {
        this.init();
    }
    async init() {
        this.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
        this.ner = await pipeline('ner', 'Xenova/bert-base-multilingual-cased-ner-hrl');
        if (!this.summarizer || !this.ner) {
            console.error('Failed to initialize summarizer or NER model.');
            throw new Error('Failed to initialize summarizer or NER model.');
        }
    }
    async analyze(text) {
        if (!this.summarizer || !this.ner) {
            await this.init();
        }
        const summaryOutput = await this.summarizer(text, { max_new_tokens: 50 });
        const summary = summaryOutput[0]?.summary_text || '';
        const entityOutput = await this.ner(text);
        const entities = entityOutput.map((entity) => ({
            entity: entity.entity_group,
            word: entity.word,
            start: entity.start,
            end: entity.end,
        }));
        return { summary, entities };
    }
}
//# sourceMappingURL=textLLM.js.map