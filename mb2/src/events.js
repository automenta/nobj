export function mitt(target = Object.create(null)) {
    const handlers = new WeakMap();
    const store = new Map();
    handlers.set(target, store);
    const get = (type) => {
        let entry = store.get(type);
        if (!entry) {
            entry = {
                ons: new Set(),
                wild: type === '*' || (typeof type === 'string' && type.endsWith('*'))
            };
            store.set(type, entry);
        }
        return entry;
    };
    const getHandlers = (type) => {
        const result = [];
        // Exact handlers first
        const exact = store.get(type);
        if (exact)
            exact.ons.forEach(h => result.push([h, false]));
        // Pattern match handlers
        store.forEach((entry, pattern) => {
            if (entry.wild && pattern !== '*') {
                const prefix = pattern.slice(0, -1);
                if (type.startsWith(prefix))
                    entry.ons.forEach(h => result.push([h, true]));
            }
        });
        // Global handlers last
        const global = store.get('*');
        if (global)
            global.ons.forEach(h => result.push([h, true]));
        return result;
    };
    return {
        on(type, handler) {
            const entry = get(type);
            let ons = entry.ons;
            ons.add(handler);
            return () => {
                ons.delete(handler);
                if (!ons.size)
                    store.delete(type);
            };
        },
        off(type, handler) {
            const entry = store.get(type);
            if (entry) {
                if (handler) {
                    entry.ons.delete(handler);
                    if (!entry.ons.size)
                        store.delete(type);
                }
                else {
                    store.delete(type);
                }
            }
        },
        emit(type, event) {
            //if (typeof type !== 'string') return;
            getHandlers(type).forEach(([handler, isGlobal]) => {
                try {
                    isGlobal ? handler(type, event) : handler(event);
                }
                catch (e) {
                    console.error('EventEmitter:', e);
                }
            });
        },
        clear() {
            store.clear();
        }
    };
}
/** default emitter */
export const events = mitt();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQStCQSxNQUFNLFVBQVUsSUFBSSxDQUF1QyxTQUFpQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUMzRixNQUFNLFFBQVEsR0FBc0IsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUNsRCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBa0QsQ0FBQztJQUN4RSxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU1QixNQUFNLEdBQUcsR0FBRyxDQUFDLElBQTRCLEVBQTBCLEVBQUU7UUFDakUsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDVCxLQUFLLEdBQUc7Z0JBQ0osR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFO2dCQUNkLElBQUksRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDekUsQ0FBQztZQUNGLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBRyxDQUFDLElBQVksRUFBb0MsRUFBRTtRQUNuRSxNQUFNLE1BQU0sR0FBcUMsRUFBRSxDQUFDO1FBRXBELHVCQUF1QjtRQUN2QixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksS0FBSztZQUNMLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFD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QUNOLENBQUM7QUFFRCxzQkFBc0I7QUFDdEIsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbkV2ZW50IEVtaXR0ZXIgd2l0aCBXZWFrTWFwIGZvciBhdXRvLWNsZWFudXAgYW5kIHBhdHRlcm4gbWF0Y2hpbmcuICBEZXJpdmVkIGZyb20gJ21pdHQnXG4qIC0gTWVtb3J5LXNhZmUgd2l0aCBXZWFrTWFwIGhhbmRsZXJzXG4qIC0gUGF0dGVybiBtYXRjaGluZyAoJ25ldHdvcms6KicsICdhdXRoOionLCAnKicpXG4qIC0gVHlwZS1zYWZlIGV2ZW50cyBhbmQgaGFuZGxlcnNcbiogLSBBdXRvLWNsZWFudXAgb24gaGFuZGxlciByZW1vdmFsXG4qIC0gRXJyb3IgYm91bmRhcnkgcHJvdGVjdGlvblxuKi9cbmV4cG9ydCB0eXBlIEV2ZW50VHlwZSA9IHN0cmluZyB8IHN5bWJvbDtcbmV4cG9ydCB0eXBlIEhhbmRsZXI8VCA9IHVua25vd24+ID0gKGV2ZW50OiBUKSA9PiB2b2lkO1xuZXhwb3J0IHR5cGUgV2lsZGNhcmRIYW5kbGVyPFQgPSBSZWNvcmQ8RXZlbnRUeXBlLCB1bmtub3duPj4gPSAodHlwZToga2V5b2YgVCwgZXZlbnQ6IFRba2V5b2YgVF0pID0+IHZvaWQ7XG5cbnR5cGUgRXZlbnRTdG9yZTxUPiA9IHtcbiAgICBvbnM6IFNldDxIYW5kbGVyPFQ+PixcbiAgICB3aWxkOiBib29sZWFuXG59O1xuXG50eXBlIEhhbmRsZXJTdG9yZTxUIGV4dGVuZHMgUmVjb3JkPEV2ZW50VHlwZSwgdW5rbm93bj4+ID0gTWFwPFxuICAgIGtleW9mIFQgfCAnKicgfCBzdHJpbmcsXG4gICAgRXZlbnRTdG9yZTxUW2tleW9mIFRdPlxuPjtcblxudHlwZSBXZWFrSGFuZGxlck1hcDxUIGV4dGVuZHMgUmVjb3JkPEV2ZW50VHlwZSwgdW5rbm93bj4+ID0gV2Vha01hcDxvYmplY3QsIEhhbmRsZXJTdG9yZTxUPj47XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW1pdHRlcjxUIGV4dGVuZHMgUmVjb3JkPEV2ZW50VHlwZSwgdW5rbm93bj4+IHtcbiAgICBvbjxLIGV4dGVuZHMga2V5b2YgVD4odHlwZTogSyB8ICcqJyB8IHN0cmluZywgaGFuZGxlcjogSyBleHRlbmRzICcqJyA/IFdpbGRjYXJkSGFuZGxlcjxUPiA6IEhhbmRsZXI8VFtLXT4pOiAoKSA9PiB2b2lkO1xuICAgIG9mZjxLIGV4dGVuZHMga2V5b2YgVD4odHlwZTogSyB8ICcqJyB8IHN0cmluZywgaGFuZGxlcj86IEsgZXh0ZW5kcyAnKicgPyBXaWxkY2FyZEhhbmRsZXI8VD4gOiBIYW5kbGVyPFRbS10+KTogdm9pZDtcbiAgICBlbWl0PEsgZXh0ZW5kcyBrZXlvZiBUPih0eXBlOiBLLCBldmVudD86IFRbS10pOiB2b2lkO1xuICAgIGNsZWFyKCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXR0PFQgZXh0ZW5kcyBSZWNvcmQ8RXZlbnRUeXBlLCB1bmtub3duPj4odGFyZ2V0OiBvYmplY3QgPSBPYmplY3QuY3JlYXRlKG51bGwpKTogRW1pdHRlcjxUPiB7XG4gICAgY29uc3QgaGFuZGxlcnM6IFdlYWtIYW5kbGVyTWFwPFQ+ID0gbmV3IFdlYWtNYXAoKTtcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBNYXA8a2V5b2YgVCB8ICcqJyB8IHN0cmluZywgRXZlbnRTdG9yZTxUW2tleW9mIFRdPj4oKTtcbiAgICBoYW5kbGVycy5zZXQodGFyZ2V0LCBzdG9yZSk7XG5cbiAgICBjb25zdCBnZXQgPSAodHlwZToga2V5b2YgVCB8ICcqJyB8IHN0cmluZyk6IEV2ZW50U3RvcmU8VFtrZXlvZiBUXT4gPT4ge1xuICAgICAgICBsZXQgZW50cnkgPSBzdG9yZS5nZXQodHlwZSk7XG4gICAgICAgIGlmICghZW50cnkpIHtcbiAgICAgICAgICAgIGVudHJ5ID0ge1xuICAgICAgICAgICAgICAgIG9uczogbmV3IFNldCgpLFxuICAgICAgICAgICAgICAgIHdpbGQ6IHR5cGUgPT09ICcqJyB8fCAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnICYmIHR5cGUuZW5kc1dpdGgoJyonKSlcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdG9yZS5zZXQodHlwZSwgZW50cnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbnRyeTtcbiAgICB9O1xuXG4gICAgY29uc3QgZ2V0SGFuZGxlcnMgPSAodHlwZTogc3RyaW5nKTogW0hhbmRsZXI8VFtrZXlvZiBUXT4sIGJvb2xlYW5dW10gPT4ge1xuICAgICAgICBjb25zdCByZXN1bHQ6IFtIYW5kbGVyPFRba2V5b2YgVF0+LCBib29sZWFuXVtdID0gW107XG5cbiAgICAgICAgLy8gRXhhY3QgaGFuZGxlcnMgZmlyc3RcbiAgICAgICAgY29uc3QgZXhhY3QgPSBzdG9yZS5nZXQodHlwZSk7XG4gICAgICAgIGlmIChleGFjdClcbiAgICAgICAgICAgIGV4YWN0Lm9ucy5mb3JFYWNoKGggPT4gcmVzdWx0LnB1c2goW2gsIGZhbHNlXSkpO1xuXG4gICAgICAgIC8vIFBhdHRlcm4gbWF0Y2ggaGFuZGxlcnNcbiAgICAgICAgc3RvcmUuZm9yRWFjaCgoZW50cnksIHBhdHRlcm4pID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRyeS53aWxkICYmIHBhdHRlcm4gIT09ICcqJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IChwYXR0ZXJuIGFzIHN0cmluZykuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlLnN0YXJ0c1dpdGgocHJlZml4KSlcbiAgICAgICAgICAgICAgICAgICAgZW50cnkub25zLmZvckVhY2goaCA9PiByZXN1bHQucHVzaChbaCwgdHJ1ZV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gR2xvYmFsIGhhbmRsZXJzIGxhc3RcbiAgICAgICAgY29uc3QgZ2xvYmFsID0gc3RvcmUuZ2V0KCcqJyk7XG4gICAgICAgIGlmIChnbG9iYWwpIGdsb2JhbC5vbnMuZm9yRWFjaChoID0+IHJlc3VsdC5wdXNoKFtoLCB0cnVlXSkpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIG9uKHR5cGUsIGhhbmRsZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gZ2V0KHR5cGUpO1xuICAgICAgICAgICAgbGV0IG9ucyA9IGVudHJ5Lm9ucztcbiAgICAgICAgICAgIG9ucy5hZGQoaGFuZGxlcik7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIG9ucy5kZWxldGUoaGFuZGxlcik7XG4gICAgICAgICAgICAgICAgaWYgKCFvbnMuc2l6ZSkgc3RvcmUuZGVsZXRlKHR5cGUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuICAgICAgICBvZmYodHlwZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgY29uc3QgZW50cnkgPSBzdG9yZS5nZXQodHlwZSk7XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5vbnMuZGVsZXRlKGhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVudHJ5Lm9ucy5zaXplKSBzdG9yZS5kZWxldGUodHlwZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RvcmUuZGVsZXRlKHR5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBlbWl0KHR5cGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAvL2lmICh0eXBlb2YgdHlwZSAhPT0gJ3N0cmluZycpIHJldHVybjtcbiAgICAgICAgICAgIGdldEhhbmRsZXJzKHR5cGUpLmZvckVhY2goKFtoYW5kbGVyLCBpc0dsb2JhbF0pID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpc0dsb2JhbCA/IChoYW5kbGVyIGFzIFdpbGRjYXJkSGFuZGxlcjxUPikodHlwZSwgZXZlbnQhKSA6IGhhbmRsZXIoZXZlbnQhKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0V2ZW50RW1pdHRlcjonLCBlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICBjbGVhcigpIHtcbiAgICAgICAgICAgIHN0b3JlLmNsZWFyKCk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG4vKiogZGVmYXVsdCBlbWl0dGVyICovXG5leHBvcnQgY29uc3QgZXZlbnRzID0gbWl0dCgpO1xuIl19