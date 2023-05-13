Alpine
  .store(
    'app',
    {
      stickers: Alpine.reactive([]),
      getNotesAmountInRow() {
        let board = document.querySelector('#board');
        let boardWidth = board.clientWidth;
        let children = board.children;
        // The number 2 is put because first elemnt is always template element.
        if (children.length < 2)
          return 0;
        let noteWidth = board.children[1].clientWidth;
        return Math.floor(boardWidth/noteWidth); 
      },
      addSticker() {
        const sticker = {
          content: '',
          colorIndex: 0
        };

        if (this.stickers.length === 0)
        {
          sticker.focus = true;
          this.stickers.push(sticker);
          this.saveStickers();
          return;
        }

        let notes = document.activeElement.parentElement.children
        let currentIndex = Array.from(notes).indexOf(document.activeElement) - 1;
        
        if (currentIndex === 0 && event.shiftKey)
          this.stickers.unshift(sticker)

        if (this.stickers.length - 1 !== currentIndex)
          return;

        if (event.shiftKey)
          return;

        this.stickers.push(sticker)
        this.focusedNote += 1;
        this.saveStickers();
      },
      removeSticker() {
        this.stickers = this.stickers.filter(it => it.focus === false && it.content != '');
        this.saveStickers();
      },
      focusElement() {
        event.target.focus();
      },
      swap() {
        let source = document.activeElement;

        let notes = source.parentElement.children;
        // Accounting for template element.
        let sourceIndex = Array.from(notes).indexOf(source) - 1;

        let target = event.target.closest('.note');
        let targetIndex = Array.from(notes).indexOf(target) - 1;

        let temp = this.stickers[sourceIndex];
        this.stickers[sourceIndex] = this.stickers[targetIndex];
        this.stickers[targetIndex] = temp;
        target.focus();
        this.saveStickers();
      },
      saveStickers() {
        const content =
          this
            .stickers
            .filter(it => it.content != "");
        const raw = JSON.stringify(content);
        localStorage.setItem('stickers', raw);
      },
      loadStickers() {
        const content = localStorage.getItem('stickers');

        if (content === null
          || content === undefined
          || content === "undefined"
          || content === ""
        ) {
          localStorage.setItem('stickers', []);
          return [];
        }

        return JSON.parse(content);
      },
      shiftFocusOneRowBelow() {
        let notes = document.activeElement.parentElement.children;
        let amount = this.getNotesAmountInRow();

        if (notes.length <= amount)
          return;

        let currentIndex = Array.from(notes).indexOf(document.activeElement)

        if (currentIndex + amount > notes.length)
          return;

        notes[currentIndex + amount].focus();
      },
      shiftFocusOneRowAbove() {
        let notes = document.activeElement.parentElement.children;
        let amount = this.getNotesAmountInRow();

        if (notes.length <= amount)
          return;

        let currentIndex = Array.from(notes).indexOf(document.activeElement)

        if (currentIndex - amount < 0)
          return;

        notes[currentIndex - amount].focus();
      },
      shiftColor(sticker) {
        let index = sticker.colorIndex;

        sticker.colorIndex += 1;

        if (index >= this.colorMap.length - 1)
          sticker.colorIndex = 0;
      },
      colorMap: [
        'red',
        'orange',
        'blue',
        'green'
      ]
    }
  )