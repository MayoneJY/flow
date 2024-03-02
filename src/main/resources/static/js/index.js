let fixedItems = {};
let customItems = [];
const $customInputText = $("#custom-input-text");


const NO_FILE_GUIDE = '업로드된 파일이 없습니다.';
const ERROR_FILE_GUIDE = '파일 정보를 가져오는데 실패했습니다.';
const ERROR_CUSTOM_GUIDE = '커스텀 확장자를 가져오는데 실패했습니다.';
const ERROR_FIXED_GUIDE = '고정 확장자를 가져오는데 실패했습니다.';
const ERROR_FILE_DELETE_MESSAGE = '파일을 삭제하지 못했습니다.';
const ERROR_FIXED_UPDATE_MESSAGE = '고정 확장자를 변경하지 못했습니다.';
const SUCCESS_FILE_DELETE_MESSAGE = '성공적으로 파일을 삭제했습니다.';
const ERROR_FIXED_ALL_CLEAR_MESSAGE = '고정 확장자를 모두 해제하지 못했습니다.';
const ERROR_CUSTOM_ALL_CLEAR_MESSAGE = '커스텀 확장자를 모두 삭제하지 못했습니다.';

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


// AllLoad
function allLoad(){
    getFixedItems();
    getCustomItems();
    getFileInformation();
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
function setCursor($input, i){
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

    for(let i = 0; i < text.length; i++){
        if(!/^[a-zA-Z0-9ㄱ-힣]{0,20}$/.test(text[i])){
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
function insertCustomExtension(text){
    try {
        $.ajax({
            url: "/insertCustomExtension",
            type: "POST",
            data: {extension: text},
            traditional: true,
            success: function (data) {
                if(data !== true){
                    if(confirm("서버에 업로드 된 파일중에 이미 존재하는 확장자가 있습니다. 제거하시겠습니까?\n" + data.join(", "))){
                        deleteFileByExtension(text);
                    }
                }
                customItems.push(text);
                viewCustomItemCount();
                const $customList = $("#custom-list");
                $customList.prepend(
                    `<button class="custom-item" id="${text}">
                        ${text}
                        <span class="material-symbols-outlined custom-trash-icon">
                            delete
                        </span>
                    </button>`
                );
                deleteCustomItem();
                $customInputText.text("");
            },
            error: function (error) {
                console.error(error);
                alert(error.responseText)
                allLoad();
                $customInputText.text("");
            }
        });
    }
    catch (e) {
        console.error(e);
        alert("커스텀 확장자를 추가하지 못했습니다.")
    }
}

/* 커스텀 확장자를 가져오는 함수 */
function getCustomItems(){
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
                $('.custom-field').append(guideBox(ERROR_CUSTOM_GUIDE));
            }
        })
    }
    catch (e) {
        console.log(e);
        $('.custom-field').append(guideBox(ERROR_CUSTOM_GUIDE));
    }
}

/* 커스텀 확장자를 삭제하는 함수 */
function deleteCustomItem(){
    const $customItems = $(".custom-item");
    $customItems.off("click");
    $customItems.on("click", function(){
        const object = this;
        try {
            $.ajax({
                url: "/deleteCustomExtension",
                type: "DELETE",
                data: {extension: object.id},
                traditional: true,
                success: function () {
                    $(object).remove();
                    customItems.splice(customItems.indexOf(object.id), 1);
                    viewCustomItemCount();
                },
                error: function (error) {
                    alert(error.responseText);
                    allLoad();
                }
            })
        } catch (e) {
            console.log(e);
        }
    })
}

/* 커스텀 확장자를 그리는 함수 */
function viewCustomItems(){
    viewCustomItemCount();
    const $customList = $("#custom-list");
    $customList.empty();
    customItems.forEach(item => {
        $customList.append(
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
function getFixedItems(){
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
                $('#fixed-list').append(guideBox(ERROR_FIXED_GUIDE));
            }})
    }
    catch (e) {
        console.log(e);
        $('.fixed-field').append(guideBox(ERROR_FIXED_GUIDE));
    }
}
getFixedItems();

/* 고정 확장자를 그리는 함수 */
function viewFixedItems(){
    const $fixedList = $("#fixed-list");
    $fixedList.empty();
    fixedItems.forEach(item => {
        $fixedList.append(`
            <input type="checkbox" id="${item.extension}" ${item.status ? 'checked' : ''}/>
            <label class="input-check" for="${item.extension}">
                ${item.extension}
            </label>`
        );

    })
    selectFixedItem();
}

/* 고정 확장자를 선택하는 함수 */
function selectFixedItem(){
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
                    } else if (data === false) {
                        alert(ERROR_FIXED_UPDATE_MESSAGE)
                    } else {
                        if(confirm("서버에 업로드 된 파일중에 이미 존재하는 확장자가 있습니다.\n제거하시겠습니까?\n" + data.join(", "))){
                            deleteFileByExtension(checkBox.id);
                        }
                    }
                },
                error: function (error) {
                    console.error(error);
                    alert(ERROR_FIXED_UPDATE_MESSAGE)
                }
            })
        }
        catch (e) {
            console.log(e);
            alert(ERROR_FIXED_UPDATE_MESSAGE)
        }
    });
}


// 커스텀 확장자를 추가하는 함수
$("#custom-add").on("click", function(){
    try{
        if(customItems.length >= 200){
            alert("최대 200개까지 추가할 수 있습니다.")
            return;
        }
        const text = $customInputText.text();
        if(text.length > 0){
            if(customItems.includes(text)){
                alert("이미 존재하는 확장자입니다.")
            }
            else if(text.length > 20){
                alert("최대 20자까지 입력할 수 있습니다.")

            }
            else if(fixedItems.find(item => item.extension === text)){
                alert("고정 확장자는 추가할 수 없습니다.")
                $customInputText.text("");
            }
            else{
                insertCustomExtension(text.toLowerCase());
            }
        }
        $customInputText.focus();
        setCursor($customInputText);

    }
    catch (e){
        console.error(e);
        alert("커스텀 확장자를 추가하지 못했습니다.")
    }
})

// 커스텀 확장자를 모두 삭제하는 함수
$('.clear-block').on("click", function(){
    if($(this).hasClass("custom-clear")) {
        if(customItems.length === 0){
            return;
        }
        if(confirm("커스텀 확장자를 모두 삭제하시겠습니까?")){
            try {
                $.ajax({
                    url: "/clearCustomExtensions",
                    type: "DELETE",
                    success: function (data) {
                        if (data === true) {
                            customItems = [];
                            $("#custom-list").empty();
                            viewCustomItemCount();
                        } else {
                            alert(ERROR_CUSTOM_ALL_CLEAR_MESSAGE)
                        }
                    },
                    error: function (error) {
                        console.error(error);
                        alert(ERROR_CUSTOM_ALL_CLEAR_MESSAGE)
                    }
                })
            }
            catch (e) {
                console.log(e);
                alert(ERROR_CUSTOM_ALL_CLEAR_MESSAGE)
            }
        }
    }
    else if($(this).hasClass("fixed-clear")){
        if(fixedItems.find(item => item.status === true)){
            if(confirm("고정 확장자를 모두 해제하시겠습니까?")){
                try {
                    $.ajax({
                        url: "/clearFixedExtensions",
                        type: "PUT",
                        success: function (data) {
                            if (data === true) {
                                fixedItems.forEach(item => item.status = false);
                                $('input[type="checkbox"]').prop("checked", false);
                            } else {
                                alert(ERROR_FIXED_ALL_CLEAR_MESSAGE)
                            }
                        },
                        error: function (error) {
                            console.error(error);
                            alert(ERROR_FIXED_ALL_CLEAR_MESSAGE)
                        }
                    })
                }
                catch (e) {
                    console.log(e);
                    alert(ERROR_FIXED_ALL_CLEAR_MESSAGE)
                }
            }
        }
    }
})




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
        if(customItems.includes(extension.toLowerCase()) || fixedItems.find(item => item.extension === extension.toLowerCase() && item.status === true)){
            alert("허용되지 않은 확장자입니다.")
            return;
        }
        // 용량 제한
        if(bytesToMegabytes(file.size) > 128){
            alert("128mb 이하의 파일만 업로드 가능합니다.")
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
    if(uploadFiles.length === 0 || uploadFilesId.length === 0){
        return;
    }
    $.ajax({
        url: "/uploadFile",
        type: "POST",
        data: uploadFiles,
        processData: false,
        contentType: false,
        success: function () {
            alert("파일 업로드에 성공했습니다.")
            animateScrollTop($("#uploaded-files"));
            uploadFiles.delete("file");
            $fileList.empty();
            uploadFilesId.splice(0, uploadFilesId.length);
            $dropArea.removeClass("display-none");
            allLoad();
        },
        error: function (error) {
            alert(error.responseText)
            console.error(error);
            allLoad();

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
    $fileUploaded.children('.guide-box').remove();
    if($fileUploaded.has("#uploaded-files").length !== 0){
        $("#uploaded-files").remove();
    }
    $.ajax({
        url: "/fileInformation",
        type: "GET",
        success: function (data) {
            if(data.length === 0){
                $fileUploaded.append(guideBox(NO_FILE_GUIDE));
            }
            else{

                let $uploadedFiles;
                if($fileUploaded.has("#uploaded-files").length === 0){
                    $uploadedFiles = $(`<div id="uploaded-files" class="content-border"></div>`);
                }
                else{
                    $uploadedFiles = $("#uploaded-files");
                    $uploadedFiles.empty();
                }

                data.forEach(file => {
                    const $file = $(
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
                                        alert(SUCCESS_FILE_DELETE_MESSAGE)
                                        if($uploadedFiles.children().length === 0) {
                                            $fileUploaded.append(guideBox(NO_FILE_GUIDE));
                                            $uploadedFiles.remove();
                                        }
                                    }
                                    else{
                                        alert(ERROR_FILE_DELETE_MESSAGE)
                                    }
                                },
                                error: function (error) {
                                    console.error(error);
                                    alert(ERROR_FILE_DELETE_MESSAGE)
                                }
                            })
                        }
                    })
                })
            }
        },
        error: function () {
            $fileUploaded.append(guideBox(ERROR_FILE_GUIDE));
        }
    })
}

function deleteFileByExtension(extension){
    $.ajax({
        url: "/deleteFileByExtension",
        type: "DELETE",
        data: {extension: extension},
        traditional: true,
        success: function (data) {
            if(data === true){
                alert(SUCCESS_FILE_DELETE_MESSAGE)
                allLoad()
            }
            else{
                alert(ERROR_FILE_DELETE_MESSAGE)
            }
        },
        error: function (error) {
            console.error(error);
            alert(ERROR_FILE_DELETE_MESSAGE)
        }
    })
}


allLoad();