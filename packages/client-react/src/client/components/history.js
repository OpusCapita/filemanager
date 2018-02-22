function createHistory() {
  return ({ stack: [], currentPointer: null });
}

function pushToHistory({ stack, currentPointer }, item) {
  if (stack[currentPointer] === item) {
    return ({ stack, currentPointer });
  }

  return ({
    stack: stack.slice(0, currentPointer + 1).concat([item]),
    currentPointer: currentPointer === null ? 0 : currentPointer + 1
  });
}

/*
 * FIXME: currentPointer should be stored in newCurrentPointer form from the very beginning because behaviour of null in arithmetic/logical/array-access operations is ambiguous
 */
function getHistoryIndex({ stack, currentPointer }, step) {
  let newCurrentPointerCandidate = currentPointer + step;

  let newCurrentPointer;
  if (newCurrentPointerCandidate < 0) {
    newCurrentPointer = 0;
  } else if (newCurrentPointerCandidate >= stack.length - 1) {
    newCurrentPointer = stack.length - 1;
  } else {
    newCurrentPointer = newCurrentPointerCandidate;
  }

  return newCurrentPointer;
}

function isHistoryStepPossible({ stack, currentPointer }, step) {
  let newCurrentPointerCandidate = currentPointer + step;
  return !((newCurrentPointerCandidate < 0) || (newCurrentPointerCandidate > stack.length - 1));
  /*
   * FIXME: negated statements is harder to read than confirmatory ones.
   * return newCurrentPointerCandidate >= 0 && newCurrentPointerCandidate <= stack.length - 1;
   */
}

function doHistoryStep({ stack, currentPointer }, step) {
  if (isHistoryStepPossible({ stack, currentPointer }, step)) {
    let newCurrentPointer = getHistoryIndex({ stack, currentPointer }, step);
    // let newCurrentComponentId = stack[newCurrentPointer];

    return ({
      stack,
      currentPointer: newCurrentPointer // FIXME: changing a pointer is transactional and should be changed only after havigation success.
    });
  }

  return ({ stack, currentPointer });
}

export {
  createHistory,
  pushToHistory,
  getHistoryIndex,
  doHistoryStep,
  isHistoryStepPossible
}
