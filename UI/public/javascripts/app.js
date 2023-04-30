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