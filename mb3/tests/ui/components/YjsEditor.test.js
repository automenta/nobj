import {describe, expect, it} from 'vitest';
import {fireEvent, render} from '@testing-library/vue';
import YjsEditor from '../../../src/ui/components/YjsEditor.vue';

describe('YjsEditor.vue', () => {
    it('updates content when user types', async () => {
        const { getByPlaceholderText, emitted } = render(YjsEditor);
        const textarea = getByPlaceholderText('Enter text...');
        await fireEvent.update(textarea, 'New content');
        expect(textarea.value).toBe('New content');
    });
});
