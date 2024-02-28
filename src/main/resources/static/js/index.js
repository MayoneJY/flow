const customItems = ["a","b","c","d","chadasdadasdasdasdasdasdasddasdasd","e","f","g","h","i","j","k","l"]

const $customInputText = $("#custom-input-text");

$customInputText.on("input", function (){
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

$(".custom-item").on("click", function(){
    $(this).remove();
    customItems.splice(customItems.indexOf($(this).text()), 1);
})

$("#custom-add").on("click", function(){
    const text = $customInputText.text();
    if(text.length > 0){
        // TODO: 중복된 아이템이 있는지 확인
        $("#custom-list").append(
            `<button class="custom-item">
                ${text}
                <span class="material-symbols-outlined">
                    delete
                </span>
            </button>`
        );
        customItems.push(text);
        $("#custom-input-text").text("");
    }
    else{
        // TODO: 아무것도 입력하지 않았을 때의 처리
    }
})