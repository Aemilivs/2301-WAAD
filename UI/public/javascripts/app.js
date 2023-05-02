Alpine
  .store(
    'app',
    {
      stickers: Alpine.reactive([]),
      addSticker() {
        let sticker = {
          title: '',
          content: '',
          dragging: false,
          focus: false
        }
        this.stickers.push(sticker)
        this.saveStickers();
      },
      removeSticker() {
        this.stickers = this.stickers.filter(it => it.focus === false);
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

        let sourceIndex = source.children[0].children[0].lastChild.textContent;

        let target = event.target.closest('.note');
        let targetIndex = target.children[0].children[0].lastChild.textContent;

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
      shiftFocusLeft() {

      }
    }
  )

function undrag() {
  const notes = document.querySelectorAll('.note');
  Array
    .from(notes)
    .map((it, index) => it.classList.contains('dragging') ? index : -1)
    .filter(it => it >= 0)
    .forEach(it => sticker[it].dragging = false);
}


// pressing tab key on last stickie adds a new stickie at the end
// pressing shift+tab on the first stickie adds a new stickie at the beginning
// pressing option / alt key will change colour of stickie currently in focus
// deleting all text from a stickie + pressing a delete key will result in current stickie deletion
// A curser must be place in appropriate focus regardless of operation. there should be no need for a mouse click.