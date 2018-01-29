import { findIndex } from 'lodash';

export const
  isDef = thing => thing !== undefined,

  noop = _ => {},

  addToSelection = ({ selection, id, toHead = false }) => selection.indexOf(id) === -1 ?
    toHead ?
      [id, ...selection] :
      [...selection, id] :
    selection,

  removeFromSelection = ({ selection, id }) => selection.filter(sid => sid !== id),

  // TODO: when needed, refactor utils to accept idPropName argument
  // which defined unique key (currently only 'id' is supported)
  selectRange = ({ items, fromId, toId }) => {
    const fromIdIndex = findIndex(items, ({ id }) => id === fromId);
    const toIdIndex = findIndex(items, ({ id }) => id === toId);
    const selectionDirection = toIdIndex > fromIdIndex ? 1 : -1;
    const itemsSlice = selectionDirection === 1 ?
        items.slice(fromIdIndex, toIdIndex + 1) :
        items.slice(toIdIndex, fromIdIndex + 1);

    const selection = itemsSlice.map(({ id }) => id)

    return selection
  },

  selectNext = ({ items, lastSelected: currentId }) => {
    const currentIndex = findIndex(items, ({ id }) => id === currentId);
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
    const nextId = items[nextIndex].id;
    return {
      selection: [nextId],
      scrollToIndex: nextIndex
    };
  },

  selectPrev = ({ items, lastSelected: currentId }) => {
    const currentIndex = findIndex(items, ({ id }) => id === currentId);

    if (currentIndex <= -1) {
      // Fix for fast selection updates
      return {
        selection,
        scrollToIndex: 0
      }
    }

    const prevIndex = currentIndex === 0 ? currentIndex : currentIndex - 1;
    const prevId = items[prevIndex].id;
    return {
      selection: [prevId],
      scrollToIndex: prevIndex
    }
  },

  addNextToSelection = ({ selection, items, lastSelected }) => {
    const nextSelectionData = selectNext({ items, lastSelected });
    return {
      selection: addToSelection({ selection, id: nextSelectionData.selection[0] }),
      scrollToIndex: nextSelectionData.scrollToIndex
    }
  },

  addPrevToSelection = ({ selection, items, lastSelected }) => {
    const prevSelectionData = selectPrev({ items, lastSelected });
    return {
      selection: addToSelection({ selection, id: prevSelectionData.selection[0], toHead: true }),
      scrollToIndex: prevSelectionData.scrollToIndex
    }
  },

  removeLastFromSelection = ({ selection, items }) => {
    if (selection.length > 1) {
      const nextSelection = selection.slice(0, selection.length - 1);
      return {
        selection: nextSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === nextSelection[nextSelection.length - 1])
      }
    } else {
      return {
        selection,
        scrollToIndex: findIndex(items, ({ id }) => id === selection[0])
      }
    }
  },

  removeFirstFromSelection = ({ selection, items }) => {
    if (selection.length > 1) {
      const nextSelection = selection.slice(1);
      return {
        selection: nextSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === nextSelection[0])
      }
    } else {
      return {
        selection,
        scrollToIndex: findIndex(items, ({ id }) => id === selection[0])
      }
    }
  },

  selectFirstItem = ({ items }) => ({
    selection: items.length ? [items[0].id] : [],
    scrollToIndex: items.length ? 0 : null
  }),

  selectLastItem = ({ items }) => ({
    selection: items.length ? [items[items.length - 1].id] : [],
    scrollToIndex: items.length ? items.length - 1 : null
  });
