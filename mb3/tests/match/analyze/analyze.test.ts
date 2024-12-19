import {expect, it, vi} from 'vitest';
import {OCRTool} from '@/match/analyze/ocr';
import {VisionLLM} from '@/match/analyze/visionLLM';

it('OCRTool should extract text', async () => {
    const ocr = new OCRTool();
    ocr.extractText = vi.fn().mockResolvedValue('Extracted Text');
    const text = await ocr.extractText('fakeImageData');
    expect(text).toBe('Extracted Text');
});

it('VisionLLM should analyze image data', async () => {
    const visionLLM = new VisionLLM();
    visionLLM.analyzeImage = vi.fn().mockResolvedValue({ objects: ['AI'] });
    const analysis = await visionLLM.analyzeImage('fakeImageData');
    expect(analysis.objects).toContain('AI');
});
