import Tesseract from 'tesseract.js';
/**
 * OCRTool uses tesseract.js to perform OCR operations.
 */
export class OCRTool {
    async extractText(imageData) {
        const result = await Tesseract.recognize(imageData, 'eng', // Language
        {
            logger: (m) => console.log(m),
        });
        return result.data.text;
    }
}
//# sourceMappingURL=ocr.js.map