window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    var viewDataRequestStatus = null;
    var viewDataRecievedArray = null;
    let selectedBook = null;

    function removeClassFromId(id, classToRemove) {
        let element = document.getElementById(id);
        element.classList.remove(classToRemove);
    }

    function addClassFromID(id, classToAdd) {
        let element = document.getElementById(id);
        element.classList.add(classToAdd);
    }

    function addClassfromClass(className, classToAdd) {
        let element = document.getElementsByClassName(className);
        element.classList.add(classToAdd);
    }

    function setInnerHTML(id, HTML_Content) {
        let element = document.getElementById(id);
        element.innerHTML = HTML_Content;
    }
    
    async function APIRequest(querystring) {
        for (let i = 0; i < 10; i++) {
            let respons = await fetch(apiURL + querystring)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    data.countrequests = i;
                    console.log(data)
                    return data;
                }
            })
            .catch(message => {
                console.log('Error message!');
                return {'status': 'error'}.json()
            })
            return respons;
        }
    }
    
    let newlistButton = document.getElementById("new_list_button");
    newlistButton.onclick = getNewAPIkey;

    async function getNewAPIkey() {
        let jsonRespons = await APIRequest('?requestKey')
        if (jsonRespons.status != 'success') {
            console.log('No new APIkey!')
        }
        else {
            console.log('New key!');
        }
    }

    let bookList = document.getElementById('books');
    bookList.onchange = showChangeAndRemoveSection;

    function showChangeAndRemoveSection() {
        //addClassfromClass('confirm_section', 'invisible')
        removeClassFromId("change_and_remove_buttons_id", "invisible");
        console.log(bookList.value);
    }

    let addBookButton = document.getElementById("add_book-button_id");
    addBookButton.onclick = addBook;

    function addBook() {
        removeClassFromId("input_fields_id", "invisible");
        removeClassFromId("add_confirm_section", "invisible");
    }

    let filterBooks = document.getElementById("filter_button_id");
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
        removeClassFromId("author_and_title_input_fields_id", "invisible");
    }
    let changeBook = document.getElementById("change_book_button");
    changeBook.onclick = changeSelectedBook;

    function changeSelectedBook() {
        removeClassFromId("input_fields_id", "invisible");
        removeClassFromId("change_confirm_section", "invisible");
    }
    let removeBook = document.getElementById("remove_book_button");
    removeBook.onclick = removeSelectedBook;

    function removeSelectedBook() {
        removeClassFromId("input_fields_id", "invisible");
        removeClassFromId("remove_confirm_section", "invisible");
    }

    let AddConfirmButton = document.getElementById('add_confirm_button');
    AddConfirmButton.onclick = addBookConfirmation;

    function addBookConfirmation() {
        let titleName = document.getElementById('title_input').value.trim();
        let authorName = document.getElementById('author_input').value.trim();
        if (titleName === "" || authorName === "") {
           console.log('Minst ett fält är tomt!');
           return;
        }
        let addBookQueryString = `?op=insert&key=${apiKey}&title=${titleName}&author=${authorName}`;
        let APIrespons = APIRequest(addBookQueryString);

        console.log(APIrespons)

        //if (condition) console.log('Boken är tillagd!');
        //else console.log('Error, boken lades inte till!')
    }

    let changeConfirmButton = document.getElementById('change_confirm_button');
    changeConfirmButton.onclick = changeBookConfirmation;
    
    function changeBookConfirmation() {
        
    }
    
    let removeConfirmButton = document.getElementById('remove_confirm_button');
    removeConfirmButton.onclick = removeBookConfirmation;
    
    function removeBookConfirmation() {
        
    }

    let resetInputFields = document.getElementById("filter_reset_button");
    resetInputFields.onclick = resetEnteredText;

    function resetEnteredText() {
        let authorField = document.getElementById("author_id");
        let titleField = document.getElementById("title_id");
        authorField.value = titleField.value = "";
    }
});