import * as indexeddb from 'fake-indexeddb';
import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);
global.indexedDB = indexeddb;
//# sourceMappingURL=setup.js.map