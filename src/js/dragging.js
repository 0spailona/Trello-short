let draggedElem;
let targetElem;

export function onDragStart(e, card) {
  card.classList.add('dragging');
  draggedElem = card;

  card.closest('.cardWRP').classList.add('dragging');
  return true;
}

export function onDragEnd(e, card) {
  card.classList.remove('dragging');
  card.closest('.cardWRP').classList.remove('dragging');
  draggedElem = null;
}

export function onDragEnterElem(e, cardWrapper) {
  cardWrapper.style.paddingTop = draggedElem.getBoundingClientRect().height + "px";
  targetElem = cardWrapper;
}

export function onDragLeaveElem(e, cardWrapper) {
  if (e.target === cardWrapper) {
    cardWrapper.style.paddingTop = '0';
    targetElem = null;
  }
}

export function onBlockDragOver(e) {
  e.preventDefault();
}

export function onBlockDrop(e, block) {
  if (!draggedElem) {
    return;
  }
  const elementToMove = draggedElem.closest('.cardWRP')

  e.preventDefault();

  if (targetElem) {
    block.insertBefore(elementToMove, targetElem);
    targetElem.style.paddingTop = '0';
    targetElem = null;
  } else {
    block.appendChild(elementToMove);
  }
}

