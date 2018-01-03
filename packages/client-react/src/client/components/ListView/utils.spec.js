import { expect } from 'chai';
import { findIndex } from 'lodash';
import {
  addToSelection,
  removeFromSelection,
  selectRange,
  selectNext,
  selectPrev,
  addNextToSelection,
  addPrevToSelection,
  removeLastFromSelection,
  removeFirstFromSelection,
  selectFirstItem,
  selectLastItem
} from './utils';

describe('<ListView /> utils', () => {
  const selection = [
    'one',
    'two',
    'three',
    'four',
    'five'
  ];

  const newThing = 'six';

  const items = selection.map(id => ({ id }));

  describe('addToSelection', () => {
    it('should add not present id to the tail of selection', () => {
      const id = newThing;
      const result = addToSelection({ selection, id });
      expect(result.length).to.equal(selection.length + 1);
      expect(result).to.deep.equal([...selection, id]);
    });

    it('should add not present id to the head of selection if toHead = true', () => {
      const id = newThing;
      const result = addToSelection({ selection, id, toHead: true });
      expect(result.length).to.equal(selection.length + 1);
      expect(result).to.deep.equal([id, ...selection]);
    });

    it('should not add already present id to selection', () => {
      const id = selection[1];
      const result = addToSelection({ selection, id });
      expect(result.length).to.equal(selection.length);
      expect(result).to.deep.equal(selection);
    })
  });

  describe('removeFromSelection', () => {
    it('should remove present id from selection', () => {
      const id = selection[1];
      const result = removeFromSelection({ selection, id });
      expect(result.length).to.equal(selection.length - 1);
      expect(result).to.deep.equal(selection.filter(el => el !== id));
    });

    it('should return initial selection if requested to delete not present element', () => {
      const id = newThing;
      const result = removeFromSelection({ selection, id });
      expect(result.length).to.equal(selection.length);
      expect(result).to.deep.equal(selection);
    })
  });

  describe('selectRange', () => {
    it('should select proper range', () => {
      const fromId = selection[1];
      const toId = selection[3];
      const result = selectRange({ items, fromId, toId });
      expect(result.length).to.equal(3);
      expect(result).to.deep.equal(selection.slice(1, 4));
    });

    it('should select proper range given reverse ordered keys', () => {
      const fromId = selection[3];
      const toId = selection[1];
      const result = selectRange({ items, fromId, toId });
      expect(result.length).to.equal(3);
      expect(result).to.deep.equal(selection.slice(1, 4));
    })
  });

  describe('selectNext', () => {
    it('should select next id', () => {
      const lastSelectedIndex = 2;
      const lastSelected = items[lastSelectedIndex].id;
      const result = selectNext({ items, lastSelected });
      const newIndex = lastSelectedIndex + 1;
      expect(result).to.deep.equal({
        selection: [items[newIndex].id],
        scrollToIndex: newIndex
      });
    });

    it('should select the same last selected element if it is the last one', () => {
      const lastSelectedIndex = items.length - 1;
      const lastSelected = items[lastSelectedIndex].id;
      const result = selectNext({ items, lastSelected });
      expect(result).to.deep.equal({
        selection: [lastSelected],
        scrollToIndex: lastSelectedIndex
      });
    });
  });

  describe('selectPrev', () => {
    it('should select previous id', () => {
      const lastSelectedIndex = 3;
      const lastSelected = items[lastSelectedIndex].id;
      const result = selectPrev({ items, lastSelected });
      const newIndex = lastSelectedIndex - 1;
      expect(result).to.deep.equal({
        selection: [items[newIndex].id],
        scrollToIndex: newIndex
      });
    });

    it('should select the same last selected element if it is the first one', () => {
      const lastSelectedIndex = 0;
      const lastSelected = items[lastSelectedIndex].id;
      const result = selectPrev({ items, lastSelected });
      expect(result).to.deep.equal({
        selection: [lastSelected],
        scrollToIndex: lastSelectedIndex
      });
    });
  });

  describe('addNextToSelection', () => {
    it('should add next id to selection', () => {
      const subSelection = items.slice(0, 3).map(({ id }) => id);
      const lastSelected = subSelection.slice(-1).pop();
      const result = addNextToSelection({
        selection: subSelection,
        items,
        lastSelected
      });

      expect(result).to.deep.equal({
        selection: [...subSelection, items[3].id],
        scrollToIndex: 3
      });
    });

    it(`should return unchanged selection if there's no next element`, () => {
      const subSelection = items.slice(2).map(({ id }) => id);
      const lastSelected = subSelection.slice(-1).pop();
      const result = addNextToSelection({
        selection: subSelection,
        items,
        lastSelected
      });

      expect(result).to.deep.equal({
        selection: subSelection,
        scrollToIndex: items.length - 1
      });
    });
  });

  describe('addPrevToSelection', () => {
    it('should add previous id to the head of selection', () => {
      const subSelection = items.slice(3).map(({ id }) => id);
      const lastSelected = subSelection[0];
      const result = addPrevToSelection({
        selection: subSelection,
        items,
        lastSelected
      });

      expect(result).to.deep.equal({
        selection: [items[2].id, ...subSelection],
        scrollToIndex: 2
      });
    });

    it(`should return unchanged selection if there's no previous element`, () => {
      const subSelection = items.slice(0, 3).map(({ id }) => id);
      const lastSelected = subSelection[0];
      const result = addPrevToSelection({
        selection: subSelection,
        items,
        lastSelected
      });

      expect(result).to.deep.equal({
        selection: subSelection,
        scrollToIndex: 0
      });
    });
  });

  describe('selectFirstItem', () => {
    it('should select first item', () => {
      const result = selectFirstItem({ items });
      expect(result).to.deep.equal({
        selection: [items[0].id],
        scrollToIndex: 0
      });
    });

    it('should return [] given []', () => {
      const result = selectFirstItem({ items: [] });
      expect(result).to.deep.equal({
        selection: [],
        scrollToIndex: null
      });
    });
  });

  describe('selectLastItem', () => {
    it('should select last item', () => {
      const result = selectLastItem({ items });
      expect(result).to.deep.equal({
        selection: [items[items.length - 1].id],
        scrollToIndex: items.length - 1
      });
    });

    it('should return [] given []', () => {
      const result = selectLastItem({ items: [] });
      expect(result).to.deep.equal({
        selection: [],
        scrollToIndex: null
      });
    });
  });

  describe('removeLastFromSelection', () => {
    it('should remove last item', () => {
      const result = removeLastFromSelection({ selection, items });
      const newSelection = selection.slice(0, selection.length - 1);
      expect(result).to.deep.equal({
        selection: newSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === newSelection.slice(-1).pop())
      });
    });

    it('should not remove anything for a single-element array', () => {
      const newSelection = selection.slice(2, 3)
      const result = removeLastFromSelection({ selection: newSelection, items });
      expect(result).to.deep.equal({
        selection: newSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === newSelection[0])
      });
    });
  });

  describe('removeFirstFromSelection', () => {
    it('should remove first item', () => {
      const newSelection = selection.slice(1, 4)
      const result = removeFirstFromSelection({ selection: newSelection, items });
      const afterSelection = newSelection.slice(1);
      expect(result).to.deep.equal({
        selection: afterSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === afterSelection[0])
      });
    });

    it('should not remove anything for a single-element array', () => {
      const newSelection = selection.slice(2, 3)
      const result = removeFirstFromSelection({ selection: newSelection, items });
      expect(result).to.deep.equal({
        selection: newSelection,
        scrollToIndex: findIndex(items, ({ id }) => id === newSelection[0])
      });
    });
  });
});
