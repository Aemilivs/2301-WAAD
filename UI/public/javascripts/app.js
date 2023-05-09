Alpine
  .store(
    'app',
    {
      stickers: Alpine.reactive([]),
      focusedNote: 0,
      getNotesAmountInRow() {
        let board = document.querySelector('.board');
        let boardWidth = board.clientWidth;

        let children = board.children;

        // The number 2 is put because first elemnt is always template element.
        if (children.length < 2)
          return 0;

        let noteWidth = board.children[1].clientWidth;
        return Math.floor(boardWidth/noteWidth); 
      },
      // TODO Fix the issue with accessibility focus.
      addSticker() {
        const sticker = {
          title: '',
          content: '',
          colorIndex: 0,
          dragging: false,
          focus: false
        };

        if (this.stickers.length === 0)
        {
          sticker.focus = true;
          this.stickers.push(sticker);
          this.saveStickers();
          return;
        }

        if (this.focusedNote === 0 && event.shiftKey)
          this.stickers.unshift(sticker)

        if (this.stickers.length - 1 !== this.focusedNote)
          return;
        
        this.stickers.push(sticker)
        this.focusedNote += 1;
        this.saveStickers();
      },
      removeSticker() {
        this.stickers = this.stickers.filter(it => it.focus === false && it.content != '');
        this.saveStickers();
      },
      drag(sticker) {
        sticker.dragging = true; 
        sticker.focus = true;
        this.unfocus(); 
      },
      swap() {
        let source = document.querySelector('.dragging');

        if (source === null)
          return;

        let sourceIndex = source.parentNode.children[0].textContent;

        let target = event.target.closest('.note');
        let targetIndex = target.parentNode.children[0].textContent;

        let temp = this.stickers[sourceIndex];
        this.stickers[sourceIndex] = this.stickers[targetIndex];
        this.stickers[targetIndex] = temp;
        this.saveStickers();
      },
      unfocus() {
        const target = event.target

        if (target.classList.contains('focus'))
          return;

        this
          .stickers
          .filter(it => it.focus)
          .forEach(it => it.focus = false);
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
      shiftFocusUp() {
        let shift = this.getNotesAmountInRow();
        this.shiftFocus(-shift);
      },
      shiftFocusRight() {
        this.shiftFocus(1);
      },
      shiftFocusDown() {
        let shift = this.getNotesAmountInRow();
        this.shiftFocus(shift);
      },
      shiftFocusLeft() {
        this.shiftFocus(-1);
      },
      shiftFocus(shift) {
        let currentValue = this.focusedNote;

        if (currentValue + shift < 0)
          return;
        
        let currentLimit = this.stickers.length - 1;
        if (currentValue + shift > currentLimit)
          return;

        this.focusedNote += shift;
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
      ],
      undrag() {

      }
    }
  )

// pressing option / alt key will change colour of stickie currently in focus
// A curser must be place in appropriate focus regardless of operation. there should be no need for a mouse click.