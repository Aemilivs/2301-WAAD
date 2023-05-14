Alpine
  .store(
    'app',
    {
      stickers: Alpine.reactive([]),
      getNotesAmountInRow() {
        const board = document.querySelector('#board');
        const boardWidth = board.clientWidth;
        const children = board.children;
        // The number 2 is put because first elemnt is always template element.
        if (children.length < 2)
          return 0;
        const noteWidth = board.children[1].clientWidth;
        return Math.floor(boardWidth/noteWidth); 
      },
      addSticker() {
        if (this.stickers.length >= 50) {
          alert("Too many stickers! Sticker board is limited up to 50 stickers.");
          return;
        }

        const sticker = {
          content: '',
          colorIndex: 0
        };

        if (this.stickers.length === 0)
        {
          this.stickers.push(sticker);
          this.saveStickers();
          return;
        }

        const notes = document.activeElement.parentElement.children
        const currentIndex = Array.from(notes).indexOf(document.activeElement) - 1;
        
        if (currentIndex === 0 && event.shiftKey)
          this.stickers.unshift(sticker)

        if (this.stickers.length - 1 !== currentIndex)
          return;

        if (event.shiftKey)
          return;

        this.stickers.push(sticker)
        this.saveStickers();
      },
      removeSticker() {
        const element = document.activeElement;

        if (element.classList.contains('note') === false)
          return;

        const notes = document.activeElement.parentElement.children;
        const index = Array.from(notes).indexOf(document.activeElement) - 1;

        if (this.stickers[index].content !== '')
          return;

        this.stickers = this.stickers.filter(it =>it !== this.stickers[index]);
        this.saveStickers();
      },
      focusElement() {
        event.target.focus();
      },
      swap() {
        const source = document.activeElement;

        const notes = source.parentElement.children;
        // Accounting for template element.
        const sourceIndex = Array.from(notes).indexOf(source) - 1;

        const target = event.target.closest('.note');
        const targetIndex = Array.from(notes).indexOf(target) - 1;

        const temp = this.stickers[sourceIndex];
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
      async loadStickers(id) {
        var response = await fetch('/boards/' + id);

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
      processCommand(sticker) {
        const input = sticker.content;

        if (input.startsWith('/') === false)
          return;
        
        if (input === '/export')
        {
          this.stickers = this.stickers.filter(it => it !== sticker)
          var url = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.stickers));
          var node = document.createElement('a');
          node.setAttribute("href", url);
          node.setAttribute("download", "stickers.json");
          document.body.appendChild(node);
          node.click();
          node.remove();
        }
        
        if (input === '/import')
        {
          sticker.content = '';
          const upload = document.querySelector('#upload');
          upload.click();
         }
      },
      handleUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = event => this.stickers = JSON.parse(event.target.result);
        
        reader.readAsText(file);
      },
      shiftFocusOneRowBelow() {
        const notes = document.activeElement.parentElement.children;
        const amount = this.getNotesAmountInRow();

        if (notes.length <= amount)
          return;

        const currentIndex = Array.from(notes).indexOf(document.activeElement)

        if (currentIndex + amount > notes.length)
          return;

        notes[currentIndex + amount].focus();
      },
      shiftFocusOneRowAbove() {
        const notes = document.activeElement.parentElement.children;
        const amount = this.getNotesAmountInRow();

        if (notes.length <= amount)
          return;

        const currentIndex = Array.from(notes).indexOf(document.activeElement)

        if (currentIndex - amount < 0)
          return;

        notes[currentIndex - amount].focus();
      },
      async shiftColor(sticker) {
        const index = sticker.colorIndex;

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