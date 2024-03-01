let fixedItems = {};
let customItems = [];
const $customInputText = $("#custom-input-text");


const noFileGuide = '업로드된 파일이 없습니다.';
const errorFileGuide = '파일 정보를 가져오는데 실패했습니다.';
const errorCustomGuide = '커스텀 확장자를 가져오는데 실패했습니다.';
const errorFixedGuide = '고정 확장자를 가져오는데 실패했습니다.';

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



// 드래그 방지
$(document).on("selectstart", function(e){
    if (!e.target.closest('[contenteditable="true"]')) {
        e.preventDefault();
        $customInputText.blur();
    }
})

// 커스텀 확장자 입력창 이벤트
$customInputText.on("click", function(){
    $(this).focus();
})

// 커스텀 확장자 입력창 포커스 이벤트
$customInputText.on("focus", function(){
    setCursor($(this));
})

// 입력칸 클릭시 커서 마지막으로 이동
const setCursor = ($input, i) => {
    const length = i || $input.text().length;
    if(length !== 0) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart($input[0].childNodes[0], length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

/*
 * 커스텀 확장자 입력창 이벤트
 * 글자수 제한
 */
$customInputText.on("input", function (){
    const $this = $(this);
    const text = $this.text();
    //[a-zA-Z0-9가-힣]{0,20}
    for(let i = 0; i < text.length; i++){
        if(!/^[a-zA-Z0-9가-힣]{0,20}$/.test(text[i])){
            $this.text(text.substring(0, i) + text.substring(i + 1));
            setCursor($this, i);
        }
    }
})

/*
 * 커스텀 확장자 입력창 이벤트
 * 엔터, 탭키 입력시 추가
 */
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
            success: function (data) {
                if (data === true) {
                    customItems.push(text);
                    viewCustomItemCount();
                    $customList = $("#custom-list");
                    $customList.append(
                        `<button class="custom-item" id="${text}">
                            ${text}
                            <span class="material-symbols-outlined custom-trash-icon">
                                delete
                            </span>
                        </button>`
                    );
                    deleteCustomItem();
                    $customInputText.text("");
                    animateScrollTop($customList);
                } else {
                    // TODO: db에 추가하지 못했을 때의 처리
                }
            },
            error: function (error) {
                console.error(error);
                alert("커스텀 확장자를 추가하지 못했습니다.")
            }
        });
    }
    catch (e) {
        console.error(e);
        alert("커스텀 확장자를 추가하지 못했습니다.")
    }
}

/* 커스텀 확장자를 가져오는 함수 */
const getCustomItems = () => {
    try {
        $.ajax({
            url: "/customExtensions",
            type: "GET",
            traditional: true,
            success: function (data) {
                customItems = data;
                viewCustomItems();
            },
            error: function (error) {
                console.error(error);
                $('.custom-field').append(guideBox(errorCustomGuide));
            }
        })
    }
    catch (e) {
        console.log(e);
        $('.custom-field').append(guideBox(errorCustomGuide));
    }
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

/* 고정 확장자를 가져오는 함수 */
const getFixedItems = () => {
    try {
        $.ajax({
            url: "/fixedExtensions",
            type: "GET",
            traditional: true,
            success: function (data) {
                fixedItems = data;
                viewFixedItems();
            },
            error: function (error) {
                console.error(error);
                $('#fixed-list').append(guideBox(errorFixedGuide));
            }})
    }
    catch (e) {
        console.log(e);
        $('.fixed-field').append(guideBox(errorFixedGuide));
    }

}
getFixedItems();

/* 고정 확장자를 그리는 함수 */
const viewFixedItems = () => {
    fixedItems.forEach(item => {
        $("#fixed-list").append(
            `
            <input type="checkbox" id="${item.extension}" ${item.status ? 'checked' : ''}/>
            <label class="input-check" for="${item.extension}">
                ${item.extension}
            </label>`
        );

    })
    selectFixedItem();
}

/* 고정 확장자를 선택하는 함수 */
const selectFixedItem = () => {
    if(fixedItems.length === 0){
        return;
    }
    const $inputCheckbox = $('input[type="checkbox"]');
    $inputCheckbox.off("click");
    $inputCheckbox.on("click", function(e){
        e.preventDefault();
        const checkBox = this;
        try {
            $.ajax({
                url: "/updateFixedExtension",
                type: "PUT",
                contentType: "application/json",
                data: JSON.stringify({extension: checkBox.id, status: checkBox.checked}),
                traditional: true,
                success: function (data) {
                    if (data === true) {
                        fixedItems.find(item => item.extension === checkBox.id).status = !checkBox.checked;
                        checkBox.checked = !checkBox.checked;

                    } else {
                        alert("고정 확장자를 변경하지 못했습니다.")
                    }
                },
                error: function (error) {
                    console.error(error);
                    alert("고정 확장자를 변경하지 못했습니다.")
                }
            })
        }
        catch (e) {
            console.log(e);
            alert("고정 확장자를 변경하지 못했습니다.")
        }
    });
}


// 커스텀 확장자를 추가하는 함수
$("#custom-add").on("click", function(){
    try{
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
            else if(text.length > 20){
                alert("최대 20자까지 입력할 수 있습니다.")

            }
            else if(fixedItems.find(item => item.extension === text)){
                alert("고정 확장자는 추가할 수 없습니다.")
                $customInputText.text("");
            }
            else{
                insertCustomExtension(text);
            }
        }
        else{
            // TODO: 아무것도 입력하지 않았을 때의 처리
        }
        $customInputText.focus();
        //     커서 마지막으로 이동
        setCursor($customInputText);

    }
    catch (e){
        console.error(e);
        alert("커스텀 확장자를 추가하지 못했습니다.")
    }
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
const uploadFilesId = [];

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
    if(uploadFilesId.length !== 0){
        $dropArea.addClass("display-none");
    }
}

function handleDrop(e) {
    // TODO: 중복된 파일이 있는지 확인

    unHighlight(e);

    const dt = e.originalEvent.dataTransfer;
    const files = dt.files;


    handleFiles(files);

}

function animateScrollTop($list) {
    if ($list) {
        $list.animate({ scrollTop: $list.prop("scrollHeight")}, 500);
    }
}

function handleFiles(files) {
    // 확장자 제한
    for(let i = 0; i < files.length; i++){
        const file = files[i];
        const extension = file.name.split('.').pop();
        if(customItems.includes(extension) || fixedItems.find(item => item.extension === extension && item.status === true)){
            alert("허용되지 않은 확장자입니다.")
            return;
        }
    }

    for(let i = 0; i < files.length; i++){
        uploadFiles.append("file", files[i]);
        uploadFilesId.push({name: files[i].name, id: uploadFilesId.length + 1})
    }
    files = [...files];
    $dropArea.addClass("display-none");
    files.forEach(previewFile);
}

function previewFile(file) {
    renderFile(file);
    animateScrollTop($fileList);
}

function renderFile(file) {
    const id = uploadFilesId.find(item => item.name === file.name).id;
    $fileList.append(
        `<div class="file" id="file-${id}">
            <div class="thumbnail">
                <span class="material-symbols-outlined uploaded-file-icon">
                    description
                </span>
            </div>
            <div class="details">
                <header class="header">
                    <span class="name">${file.name}</span>
                    <div class="file-info">
                        <span class="material-symbols-outlined file-trash-icon content-border" 
                            id="file-trash-${id}">
                            delete
                        </span>
                        <span class="size">${bytesToMegabytes(file.size)} mb</span>
                    </div>
                </header>
            </div>
        </div>`
    );
    $(`#file-trash-${id}`).on("click", function(){
        if(confirm("파일을 제거하시겠습니까?")){
            // file.name 과 같은 이름을 가진 파일을 제거
            const tempFiles = [];
            for(const [key, value] of uploadFiles.entries()){
                if(value.name !== file.name) {
                    tempFiles.push(value);
                }
            }
            uploadFilesId.splice(uploadFilesId.findIndex(item => item.name === file.name), 1);
            uploadFiles.delete("file");
            for(let i = 0; i < tempFiles.length; i++){
                uploadFiles.append("file", tempFiles[i]);
            }
            $(`#file-${id}`).remove();
            if(uploadFilesId.length === 0){
                $dropArea.removeClass("display-none");
            }

        }
    })
    animateScrollTop();
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
const $fileUploaded = $("#file-uploaded");
function getFileInformation(){
    $.ajax({
        url: "/fileInformation",
        type: "GET",
        success: function (data) {
            if(data.length === 0){
                $fileUploaded.append(guideBox(noFileGuide));
            }
            else{
                $uploadedFiles = $(`<div id="uploaded-files" class="content-border"></div>`)
                data.forEach(file => {

                    $file = $(
                        `<div class="file" id="uploaded-${file.idx}">
                            <div class="thumbnail">
                                <span class="material-symbols-outlined uploaded-file-icon">
                                    description
                                </span>
                            </div>
                            <div class="details">
                                <header class="header">
                                    <span class="name">${file.originalName}</span>
                                    <div class="file-info">
                                        <span class="material-symbols-outlined file-trash-icon content-border" 
                                            id="uploaded-trash-${file.idx}">
                                            delete
                                        </span>
                                        <span class="size">${bytesToMegabytes(file.size)} mb</span>
                                        <span class="date">${file.createdDate.split('T')[0]}</span>
                                    </div>
                                </header>
                            </div>
                        </div>`
                    );
                    $file.on("click", function(){
                        window.open(`/downloadFile/${file.idx}`, "_blank");
                    });
                    $uploadedFiles.append($file);
                    $fileUploaded.append($uploadedFiles)
                    $("#uploaded-trash-" + file.idx).on("click", function(e){
                        e.stopPropagation();
                        if(confirm("파일을 삭제하시겠습니까?")){
                            $.ajax({
                                url: "/deleteFile",
                                type: "DELETE",
                                contentType: "application/json",
                                data: JSON.stringify(file),
                                success: function (data) {
                                    if(data === true){
                                        $("#uploaded-" + file.idx).remove();
                                        alert("성공적으로 파일을 삭제했습니다.")
                                        if($("#uploaded-files").children().length === 0) {
                                            $fileUploaded.append(guideBox(noFileGuide));
                                            $uploadedFiles.remove();
                                        }
                                    }
                                    else{
                                        alert("파일을 삭제하지 못했습니다.")
                                    }
                                },
                                error: function (error) {
                                    console.error(error);
                                    alert("파일을 삭제하지 못했습니다.")
                                }
                            })
                        }
                    })
                })
            }
        },
        error: function (error) {
            $fileUploaded.append(guideBox(errorFileGuide));
        }
    })
}

getFileInformation();