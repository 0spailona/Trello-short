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
  for(const container of document.querySelectorAll('.cardsContainer')){
    container.style.paddingBottom = '0';
  }
}

export function onDragEnterElem(e, cardWrapper) {
  cardWrapper.style.paddingTop = draggedElem.getBoundingClientRect().height + 'px';
  targetElem = cardWrapper;
}

export function onDragLeaveElem(e, cardWrapper) {
  if (e.target === cardWrapper) {
    cardWrapper.style.paddingTop = '0';
    targetElem = null;
  }
}

export function onBlockDragOver(e,container) {
  e.preventDefault();

  if (e.target.classList.contains('cardWRP')) {
    container.style.paddingBottom = '0';
  }
  else {
    container.style.paddingBottom = draggedElem.getBoundingClientRect().height + 'px';
  }
}

export function onDragLeaveBlock(e, container){

  if(e.target.classList.contains('block')){
    container.style.paddingBottom = '0';
  }
}

export function onBlockDrop(e, container) {
  if (!draggedElem) {
    return;
  }
  const elementToMove = draggedElem.closest('.cardWRP')

  e.preventDefault();

  if (targetElem) {
    container.insertBefore(elementToMove, targetElem);
    targetElem.style.paddingTop = '0';
    targetElem = null;
  } else {
    container.appendChild(elementToMove);
  }
  container.style.paddingBottom = '0';
}

