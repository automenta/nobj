import {describe, expect, it} from 'vitest';
import {render} from '@testing-library/vue';
import ObjectList from "@/ui/components/ObjectList.vue";

describe('ObjectList.vue', () => {
    it('renders a list of objects', () => {
        const objects = [
            { id: 'obj1', title: 'First Object' },
            { id: 'obj2', title: 'Second Object' },
        ];
        const { getByText } = render(ObjectList, {
            props: { objects },
        });
        expect(getByText('First Object')).toBeTruthy();
        expect(getByText('Second Object')).toBeTruthy();
    });
});
