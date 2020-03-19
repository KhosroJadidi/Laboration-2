window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    var viewDataRequestStatus = null;
    var viewDataRecievedArray = null;
    let selectedBook = null;


    function removeClassFromId(id, classToRemove) {
        let element = document.getElementById(id);
        if (element.classList.contains(classToRemove)) {
            element.classList.remove(classToRemove);
        }
    }

    function addClassFromID(id, classToAdd) {
        let element = document.getElementById(id);
        if (!element.classList.contains(classToAdd)) {

            element.classList.add(classToAdd);
        }
    }

    function addClassfromClass(className, classToAdd) {
        let element = document.getElementsByClassName(className);
        if (!element.classList.contains(classToAdd)) {
            element.classList.add(classToAdd);
        }
    }

    function setInnerHTML(id, HTML_Content) {
        let element = document.getElementById(id);
        element.innerHTML = HTML_Content;
    }

    let newlistButton = document.getElementById("new_list_button");
    newlistButton.onclick = function () {
        return interactWithAPI(createViewDataString('3jxM9'));//kan använda fetchkey senare, testar med denna key nu
        //return interactWithAPI(createAddDataString('3jxM9','Min Book','Min Författare'));
        //return interactWithAPI(createModifyDataString('3jxM9',103379,'modifierad titel','modifierad författare'));
        //return interactWithAPI(createDeleteDataString('3jxM9',103379));
    }

    function fetchNewKey() {
        fetch(apiURL + "?requestKey")
            .then(response => {
                return response.json();
            })
            .then(data => (apiKey = data.key))
            .catch(message => console.log(message));
        console.log(`Key is : ${apiKey}`);
    }

    async function interactWithAPI(fetchString) {
        console.log('running "interactWithAPI..."')
        let count = 0;
        for (let index = 0; index < 10; index++) {
            let recievedJson = await fetch(fetchString)
                .then(response => response.json())
                .then(json => {
                    console.log(json);//kontroll, returnerar en data array
                    count++;
                    return {
                        "numberOfAttempts": index + 1,//+1 eftersom denna är en zero-based aray. "Number of attempts 0" har ingen betydelse.
                        "recievedJson": json
                    }
                })
                .catch(error => {
                    console.log(error)
                });
            if (recievedJson.recievedJson.status === 'success') {
                console.log(`Number of attempts: ${recievedJson.numberOfAttempts}`); //kontroll
                console.log(`${recievedJson.recievedJson.id}`); //kontroll, returnerar undefind om inga böcker finns, eller om operationen returnerar inegn id.
                break;
            } else if(recievedJson.recievedJson.message==='Bad API key, use "requestKey" to request a new one.'){
                console.log('Your key is invalid. Terminating requests. Please use "requestKey" to request a new and try again.');
                break;
            }else if (count >= 10) {
                console.log(`We failed to connect to API after ${count} tries. Please try again in a few seconds.`)
            }
            

        }
    }

    function createViewDataString(key) {
        return `${apiURL}?op=select&key=${key}`;
    }

    function createAddDataString(key, title, author) {
        return `${apiURL}?op=insert&key=${key}&title=${title}&author=${author}`;
    }

    function createModifyDataString(key, id, title, author) {
        return `${apiURL}?op=update&key=${key}&id=${id}&title=${title}&author=${author}`
    }

    function createDeleteDataString(key, id) {
        return `${apiURL}?op=delete&key=${key}&id=${id}`
    }



    let bookList = document.getElementById('books');
    bookList.onchange = showChangeAndRemoveSection;

    function showChangeAndRemoveSection() {
        //addClassfromClass('confirm_section', 'invisible')
        removeClass("change_and_remove_buttons_id", "invisible");
        console.log(bookList.value);
    }

    let addBookButton = document.getElementById("add_book-button_id");
    addBookButton.onclick = addBook;

    function addBook() {
        //add book here
        removeClass("input_fields_id", "invisible");
        removeClass("add_confirm_section", "invisible");
    }

    let filterBooks = document.getElementById("filter_button_id");
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
        removeClassFromId("filter_button_id", "invisible");
    }
    let changeBook = document.getElementById("change_book_button");
    changeBook.onclick = changeSelectedBook;

    function changeSelectedBook() {
        //change book here
    }
    let removeBook = document.getElementById("remove_book_button");
    removeBook.onclick = removeSelectedBook;

    function removeSelectedBook() {
        //remove selected book here
    }

    let resetInputFields = document.getElementById("filter_reset_button");
    resetInputFields.onclick = resetEnteredText;

    function resetEnteredText() {
        let authorField = document.getElementById("author_id");
        let titleField = document.getElementById("title_id");
        authorField.value = titleField.value = "";
    }
});