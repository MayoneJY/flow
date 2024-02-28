const customItems = ["ch","ch","ch","ch","chadasdadasdasdasdasdasdasddasdasd","ch","ch","ch","ch","ch","ch","ch","ch"]

$("#custom-input-text").on("input", function (){
    const $this = $(this);
    const text = $this.text();
    if(text.length > 20){
        $this.text(text.substring(0, 20));
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart($this[0].childNodes[0], 20);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);

    }
})

customItems.forEach(item => {
    $("#custom-list").append(
        `<button class="custom-item">
            ${item}
            <span class="material-symbols-outlined">
                delete
            </span>
        </button>`
    );
})