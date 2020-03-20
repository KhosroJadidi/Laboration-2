window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey;
    var viewDataRequestStatus = null;
    var viewDataRecievedArray = null;
    var bookListArray;
    var selectedBookId;


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

    async function apiRequest(querystring) {
        let apiRespons;
        for (let count = 1; count <= 10; count++) {
            apiRespons = await fetch(apiURL + querystring)
            .then(response => response.json())
            .then(data => {
                    data.countrequests = count;
                    console.log(data.status);
                    return data;
            })
            .catch(() => {
                return {'status': 'catcherror', 'countrequests': count};
            })
            if (apiRespons.status === 'success') {
                return apiRespons;
            }
        }
        return apiRespons;
    }

    
    let newlistButton = document.getElementById("new_list_button");
    newlistButton.onclick = getNewAPIkey;
    
    async function getNewAPIkey() {
        let jsonRespons = await apiRequest('?requestKey')
        if (jsonRespons.status === 'success') {
            apiKey = jsonRespons.key;
            setInnerHTML('status_field', 'Status: Ny lista skapad!')
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
        updateBookList();
    }

    async function updateBookList() {
        let queryString = `?op=select&key=${apiKey}`;
        let apiRespons = await apiRequest(queryString);
        
        if (apiRespons.status === 'success') {
            bookListArray = apiRespons.data
            let bookList= document.getElementById('books');
            setInnerHTML('books','');                            
            console.log(bookListArray);
            for (const iterator of bookListArray) {
                let option= document.createElement('option');
                let optionText= document.createTextNode(`Författare: ${iterator.author}, titel: ${iterator.title}`);
                option.appendChild(optionText);
                bookList.appendChild(option);
            }
            console.log('APIn boklista uppdaterades!');
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    let bookList = document.getElementById('books');
    bookList.onchange = showChangeAndRemoveSection;
    

    function showChangeAndRemoveSection() {
        selectedBookId = bookList.value;

        console.log(bookList.value);
        //addClassfromClass('confirm_section', 'invisible')
        removeClassFromId("change_and_remove_buttons_id", "invisible");
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
        removeClassFromId("input_fields_id", "invisible");
        removeClassFromId("filter_button_section", "invisible");
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

    async function addBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let titleName = document.getElementById('title_input').value.trim();
        let authorName = document.getElementById('author_input').value.trim();
        if (titleName === "" || authorName === "") {
           console.log('Minst ett fält är tomt!');
           return;
        }
        let queryString = `?op=insert&key=${apiKey}&title=${titleName}&author=${authorName}`;
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är sparad!');
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests);
            updateBookList();
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    let changeConfirmButton = document.getElementById('change_confirm_button');
    changeConfirmButton.onclick = changeBookConfirmation;
    
    async function changeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let titleName = document.getElementById('title_input').value.trim();
        let authorName = document.getElementById('author_input').value.trim();
        if (titleName === "" || authorName === "") {
           console.log('Minst ett fält är tomt!');
           return;
        }
        let queryString = `?op=update&key=${apiKey}&id=${selectedBookId}&title=${titleName}&author=${authorName}`;//selectedBookId är problemet!(kanske???)
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är uppdaterad!')
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests)
            updateBookList();
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }
    
    let removeConfirmButton = document.getElementById('remove_confirm_button');
    removeConfirmButton.onclick = removeBookConfirmation;
    
    async function removeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let queryString = `?op=delete&key=${apiKey}&id=${selectedBookId}`;
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är borttagen!')
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests)
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    let resetInputFields = document.getElementById("filter_reset_button");
    resetInputFields.onclick = resetEnteredText;

    function resetEnteredText() {
        let authorField = document.getElementById("author_id");
        let titleField = document.getElementById("title_id");
        authorField.value = titleField.value = "";
    }

    
});

