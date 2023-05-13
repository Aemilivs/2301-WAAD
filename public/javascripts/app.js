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
        this.stickers = this.stickers.filter(it =>it.content != '');
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
      async saveStickers() {
        const raw = {
          id: this.id,
          stickers: this.stickers.filter(it => it.content != '')
        };
        const payload = JSON.stringify(raw);
        const response = 
          await fetch(
              '/boards/',
              {
                method: 'PUT',
                headers: {
                  "Content-Type": "application/json",
                },
                body: payload,
              }
          );
      },
      async loadStickers() {
        const url = document.URL;

        if (url.includes('new'))
          document.cookie = 'key=; Max-Age=-99999999;';  
          
        if (url.includes('delete')) {
          const id = url.split('/').pop();
          document.cookie = 'key=; Max-Age=-99999999;';
          await fetch(
            `/boards/delete/${id}`,
            {
              method: 'DELETE',
            }
          );
          this.stickers = Alpine.reactive([])
        }

        let response = await fetch('/boards/');

        if (response.status === 404)
        {
          const stickers = {
            'stickers': []
          };
          const payload = JSON.stringify(stickers);
          response = 
            await fetch(
                '/boards/',
                {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: payload,
                }
            );
        }

        const payload = await response.json();
        this.id = payload._id;
        this.stickers = Alpine.reactive(payload.stickers);
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
      async shiftColor(sticker) {
        let index = sticker.colorIndex;

        sticker.colorIndex += 1;

        if (index >= this.colorMap.length - 1)
          sticker.colorIndex = 0;
        await this.saveStickers();
      },
      colorMap: [
        'red',
        'orange',
        'blue',
        'green'
      ]
    }
  )