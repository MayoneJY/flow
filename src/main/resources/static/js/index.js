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
    if(e.key === "Enter" || e.key === "Tab"){
        e.preventDefault();
        $("#custom-add").click();
    }
});

/* 커스텀 확장자를 추가하는 함수 */
const insertCustomExtension = (text) => {
    try {
        $.ajax({
            url: "/insertCustomExtension",
            type: "POST",
            data: {extension: text},
            traditional: true,
        }).then(data => {
            if (data === true) {
                customItems.push(text);
                viewCustomItemCount();
                $("#custom-list").append(
                    `<button class="custom-item" id="${text}">
                        ${text}
                        <span class="material-symbols-outlined custom-trash-icon">
                            delete
                        </span>
                    </button>`
                );
                deleteCustomItem();
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

/* 커스텀 확장자를 가져오는 함수 */
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

/* 커스텀 확장자를 삭제하는 함수 */
const deleteCustomItem = () => {
    const $customItems = $(".custom-item");
    $customItems.off("click");
    $customItems.on("click", function(){
        try {
            $.ajax({
                url: "/deleteCustomExtension",
                type: "DELETE",
                data: {extension: this.id},
                traditional: true,
            }).then(data => {
                if (data === true) {
                    $(this).remove();
                    customItems.splice(customItems.indexOf(this.id), 1);
                    viewCustomItemCount();
                } else {
                    //     TODO: db에서 삭제하지 못했을 때의 처리
                }
            }).catch((error) => {
                console.error(error);

            })
        } catch (e) {
            console.log(e);
        }
    })
}

/* 커스텀 확장자를 그리는 함수 */
const viewCustomItems = () => {
    viewCustomItemCount();
    customItems.forEach(item => {
        $("#custom-list").append(
            `<button class="custom-item" id="${item}">
                ${item}
                <span class="material-symbols-outlined custom-trash-icon">
                    delete
                </span>
            </button>`
        );
    })
    deleteCustomItem();
}

/* 커스텀 확장자의 개수를 보여주는 함수 */
const viewCustomItemCount = () => {
    $("#list-count").find("span").text(customItems.length);
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
            insertCustomExtension(text);
        }
    }
    else{
        // TODO: 아무것도 입력하지 않았을 때의 처리
    }
    $customInputText.focus();
})

// $(".btn-check").on("click", function(){
//     if($(this).hasClass("btn-checked")){
//         $(this).removeClass("btn-checked");
//         $(this).find("span").text("check_box_outline_blank")
//     }
//     else{
//         $(this).addClass("btn-checked");
//         $(this).find("span").text("check_box")
//     }
// })

// 파일 업로드
function bytesToMegabytes(bytes) {
    const megabytes = bytes / 1024 / 1024;
    return Math.round(megabytes * 10) / 10;
}

const $dropArea = $("#drop-file");
const $fileList = $("#files");
const uploadFiles = new FormData();

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    preventDefaults(e);
    $dropArea.addClass("highlight");
    if($dropArea.hasClass("display-none")){
        $dropArea.removeClass("display-none");
    }
}

function unHighlight(e) {
    preventDefaults(e);
    $dropArea.removeClass("highlight");
    if(uploadFiles.length !== 0){
        $dropArea.addClass("display-none");
    }
}

function handleDrop(e) {
    // TODO: 중복된 파일이 있는지 확인
    unHighlight(e);
    const dt = e.originalEvent.dataTransfer;
    const files = dt.files;
    $dropArea.addClass("display-none");
    handleFiles(files);

    animateFileList();
}

function animateFileList() {
    if ($fileList) {
        $fileList.animate({ scrollTop: $fileList.prop("scrollHeight")}, 500);
    }

}

function handleFiles(files) {
    for(let i = 0; i < files.length; i++){
        uploadFiles.append("file", files[i]);
    }
    files = [...files];
    $dropArea.addClass("display-none");
    files.forEach(previewFile);
}

function previewFile(file) {
    renderFile(file);
    animateFileList();
}

function renderFile(file) {
    $fileList.append(
        `<div class="file">
            <div class="thumbnail">
                <span class="material-symbols-outlined uploaded-file-icon">
                    description
                </span>
            </div>
            <div class="details">
                <header class="header">
                    <span class="name">${file.name}</span>
                    <span class="size">${bytesToMegabytes(file.size)} mb</span>
                </header>
            </div>
        </div>`
    );
}

function uploadFile() {
    if(uploadFiles.length === 0){
        return;
    }
    $.ajax({
        url: "/uploadFile",
        type: "POST",
        data: uploadFiles,
        processData: false,
        contentType: false,
        success: function (data) {
            alert("파일 업로드에 성공했습니다.")
            console.log(data);
        },
        error: function (error) {
            alert("파일 업로드에 실패했습니다.")
            console.error(error);
        },
        complete: function () {
            uploadFiles.delete("file");
            $fileList.empty();
            $dropArea.removeClass("display-none");
        }
    })
}

$("#file-upload").on("click", uploadFile);

$dropArea.on("dragenter", highlight);
$fileList.on("dragenter", highlight);
$dropArea.on("dragover", highlight);
$fileList.on("dragover", highlight);
$dropArea.on("dragleave", unHighlight);
$dropArea.on("drop", handleDrop);


// 파일 정보 가져오기
const noFileGuide = '업로드된 파일이 없습니다.';
const errorFileGuide = '파일 정보를 가져오는데 실패했습니다.';

function guideBox(guideMessage){
    return $(`
        <div class="guide-box">
            <span class="material-symbols-outlined custom-guide-icon">
                error
            </span>
            <span>
                ${guideMessage}
            </span>
        </div>
    `);
}
const $fileUploaded = $("#file-uploaded");
function getFileInformation(){
    $.ajax({
        url: "/fileInformation",
        type: "GET",
        success: function (data) {
            console.log(data);
            if(data.length === 0){
                $fileUploaded.append(guideBox(noFileGuide));
            }
            else{
                $uploadedFiles = $(`<div id="uploaded-files" class="content-border"></div>`)
                data.forEach(file => {

                    $uploadedFiles.append(
                        `<div class="file">
                            <div class="thumbnail">
                                <span class="material-symbols-outlined uploaded-file-icon">
                                    description
                                </span>
                            </div>
                            <div class="details">
                                <header class="header">
                                    <span class="name">${file.originalName}</span>
                                    <div class="file-info">
                                        <span class="size">${bytesToMegabytes(file.size)} mb</span>
                                        <span class="date">${file.timeStamp.split(' ')[0]}</span>
                                    </div>
                                </header>
                            </div>
                        </div>`
                    );
                    $fileUploaded.append($uploadedFiles)
                })
            }
        },
        error: function (error) {
            $fileUploaded.append(guideBox(errorFileGuide));
        }
    })
}

getFileInformation();