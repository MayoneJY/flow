// const customItems = ["a","b","c","d","chadasdadasdasdasdasdasdasddasdasd","e","f","g","h","i","j","k","l"];
const fixedItems = ["bat", "cmd", "com", "cpl", "exe", "scr", "js", "jsd"];
let customItems = [];
const $customInputText = $("#custom-input-text");

$(document).on("selectstart", function(e){
    if (!e.target.closest('[contenteditable="true"]')) {
        e.preventDefault();
        $customInputText.blur();
    }
})

$customInputText.on("click", function(){
    $(this).focus();
})

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

$customInputText.on("keydown", function(e){
    if(e.key === "Enter"){
        e.preventDefault();
        $("#custom-add").click();
    }
});


const getCustomItems = () => {
    $.ajax({
        url: "/customExtensions",
        type: "GET",
        traditional: true,
    }).then(data => {
        customItems = data;
        viewCustomItems();
    })
}
getCustomItems();

const viewCustomItems = () => {
    customItems.forEach(item => {
        $("#custom-list").append(
            `<button class="custom-item">
                ${item}
                <span class="material-symbols-outlined custom-trash-icon">
                    delete
                </span>
            </button>`
        );

        $(".custom-item").on("click", function(){
            $(this).remove();
            customItems.splice(customItems.indexOf($(this).text()), 1);
        })
    })
}


fixedItems.forEach(item => {
    $("#fixed-list").append(
        `
        <input type="checkbox" id="${item}"/>
        <label class="input-check" for="${item}">
            ${item}
        </label>`
    );

})


$("#custom-add").on("click", function(){
    if(customItems.length >= 200){
        // TODO: 알림박스로 교체
        alert("최대 200개까지 추가할 수 있습니다.")
        return;
    }
    const text = $customInputText.text();
    if(text.length > 0){
        if(customItems.includes(text)){
            alert("이미 존재하는 확장자입니다.")
            // TODO: 알림박스로 교체
        }
        else{
            try {
                $.ajax({
                    url: "/insertCustomExtension",
                    type: "POST",
                    data: {extension: text},
                    traditional: true,
                }).then(data => {
                    if (data === true) {
                        customItems.push(text);
                        $("#custom-list").append(
                            `<button class="custom-item">
                                ${text}
                                <span class="material-symbols-outlined custom-trash-icon">
                                    delete
                                </span>
                            </button>`
                        );
                        $(".custom-item").on("click", function () {
                            $(this).remove();
                            customItems.splice(customItems.indexOf($(this).text()), 1);
                        })
                        $customInputText.text("");
                    } else {
                        //     TODO: db에 추가하지 못했을 때의 처리
                    }

                }).catch((error) => {
                    console.error(error);
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    else{
        // TODO: 아무것도 입력하지 않았을 때의 처리
    }
    $customInputText.focus();
})

$(".btn-check").on("click", function(){
    if($(this).hasClass("btn-checked")){
        $(this).removeClass("btn-checked");
        $(this).find("span").text("check_box_outline_blank")
    }
    else{
        $(this).addClass("btn-checked");
        $(this).find("span").text("check_box")
    }
})