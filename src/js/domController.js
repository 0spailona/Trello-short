import {onBlockDragOver, onBlockDrop, onDragEnd, onDragEnterElem, onDragLeaveElem, onDragStart} from "./dragging";

export function by(keyFn) {
  return (x, y) => {
    const keyX = keyFn(x);
    const keyY = keyFn(y);
    return keyX > keyY ? 1 : keyX < keyY ? -1 : 0;
  }
}

export default class domController {

  constructor(storage) {
    this.stateService = storage;
    this.saveData = this.loadStorage() || [[], [], []]

    this.drawSaveCards();
  }

  drawSaveCards() {
    for (let i = 0; i < this.saveData.length; i++) {
      const blockEl = document.querySelector(`.block[data-num='${i + 1}']`);
      const cardsContainer = blockEl.querySelector('.cardsContainer');
      for (const value of this.saveData[i]) {
        const card = this.getCardEl(value, blockEl);
        cardsContainer.appendChild(card)
      }
    }
  }

  loadStorage() {
    let state;
    try {
      state = this.stateService.load();
    } catch (e) {
      state = null;
    }
    return state
  }

  addListeners() {
    const blockEls = document.querySelectorAll('.block')

    const cardsContainers = document.querySelectorAll('.cardsContainer');

    for (const blockEl of blockEls) {
      const addCardBtn = blockEl.querySelector('.addCard');
      const addCardFormEl = blockEl.querySelector('.addCardForm');
      const btnCancelEl = addCardFormEl.querySelector('.btnCansel');

      addCardBtn.addEventListener('click', () => {
        addCardFormEl.style.display = 'flex';
        addCardBtn.style.display = 'none';
      })

      btnCancelEl.addEventListener('click', () => {
        addCardFormEl.style.display = 'none';
        addCardBtn.style.display = 'block';
      })

      addCardFormEl.addEventListener('submit', e => {
        e.preventDefault();
        const blockEl = e.target.closest('.block');
        const container = blockEl.querySelector('.cardsContainer')
        const value = e.target.querySelector('.inputTextCard').value;
        const elem = this.getCardEl(value, blockEl)
        container.appendChild(elem)
        this.savingData()

        addCardFormEl.reset()
        addCardFormEl.style.display = 'none';
        addCardBtn.style.display = 'block';
      })
    }

    for (const container of cardsContainers) {
      container.addEventListener('dragover', e => onBlockDragOver(e, container));
      container.addEventListener('drop', e => onBlockDrop(e, container));
    }
  }

  getCardEl(value) {
    const cardWRP = document.createElement('div');
    cardWRP.classList.add('cardWRP')

    const cardEl = document.createElement('div');
    cardEl.setAttribute('draggable', 'true');
    cardEl.classList.add('card')

    const cardValueEl = document.createElement('span');
    cardValueEl.classList.add('value');
    cardValueEl.textContent = value;
    cardEl.appendChild(cardValueEl)

    const cardRemoveEl = document.createElement('button');
    cardRemoveEl.classList.add('customBtn', 'cardRemoveBtn');
    cardRemoveEl.textContent = '\u{2A09}';
    cardEl.appendChild(cardRemoveEl);

    cardEl.addEventListener('mouseenter', () => {
      cardRemoveEl.style.display = 'block'
    })

    cardEl.addEventListener('mouseleave', () => {
      cardRemoveEl.style.display = 'none'
    })

    cardRemoveEl.addEventListener('click', () => {
      cardWRP.remove();
      cardWRP.removeEventListener('dragover', e => onDragEnterElem(e, cardWRP));
      cardWRP.removeEventListener('dragleave', e => onDragLeaveElem(e, cardWRP));
      cardEl.removeEventListener('dragstart', e => onDragStart(e, cardEl))
      cardEl.removeEventListener('dragend', e => {
        onDragEnd(e, cardEl);
        this.savingData();
      })
      cardEl.removeEventListener('mouseenter', () => {
        cardRemoveEl.style.display = 'block'
      })

      cardEl.removeEventListener('mouseleave', () => {
        cardRemoveEl.style.display = 'none'
      })

      this.savingData()
    })

    cardEl.addEventListener('dragstart', e => onDragStart(e, cardEl))
    cardEl.addEventListener('dragend', e => {
      onDragEnd(e, cardEl);
      this.savingData();
    })

    cardWRP.appendChild(cardEl)

    cardWRP.addEventListener('dragover', e => onDragEnterElem(e, cardWRP));
    cardWRP.addEventListener('dragleave', e => onDragLeaveElem(e, cardWRP));

    return cardWRP
  }

  savingData() {
    this.saveData = [...document.querySelectorAll('.block')]
      .map(block => [...block.querySelectorAll('.card>.value')].map(el => el.textContent));
    this.stateService.save(this.saveData)
  }
}










