import Tesseract from 'tesseract.js';

/**
 * OCRTool uses tesseract.js to perform OCR operations.
 */
export class OCRTool {
    async extractText(imageData: any): Promise<string> {
        const result = await Tesseract.recognize(
            imageData,
            'eng' // Language
        );
        return result.data.text;
    }
}
