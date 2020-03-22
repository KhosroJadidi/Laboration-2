window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    var bookListArray;
    var filterListArray = [];
    var selectedIndexInBookListField;
    
    async function siteLoad() {
        if (document.cookie.includes('booklist=')) {
            let apiKeyIndex = document.cookie.indexOf('booklist=') + 9;
            apiKey = document.cookie.substring(apiKeyIndex, apiKeyIndex + 5);
        }
        else {
            await getNewAPIkey();
            document.cookie = 'booklist=' + apiKey;
        }
        updateBookList();
        console.log('Cookie contains: ' + document.cookie);
    };
    siteLoad();

    function addTagById(id) {
        let element = document.getElementById(id);
        if (element.classList.contains("invisible")) {
            element.classList.remove("invisible");
        }
    }

    function removeTagById(id) {
        let element = document.getElementById(id);
        if (!element.classList.contains("invisible")) {
            element.classList.add("invisible");
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
            else if (apiRespons.message.substring(0,11) ==='Bad API key') {
                await getNewAPIkey();
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
            document.cookie = 'booklist=' + apiKey;
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
            let bookList = document.getElementById('books');
            updateBookListField(bookListArray)
            
            console.log('APIn boklista uppdaterades!');
        }
        else {
            setInnerHTML('status_field', 'Status: Uppdateringsfel, tryck F5!')
        }
    }

    function updateBookListField(listArray) {
        setInnerHTML('books','');                            
        console.log(listArray);
        for (const iterator of listArray) {
            let option = document.createElement('option');
            option.setAttribute('id', iterator.id)
            option.appendChild(document.createTextNode(`Författare: ${iterator.author}, titel: ${iterator.title}`));
            bookList.appendChild(option);
        }
    }

    let bookList = document.getElementById('books');
    bookList.onchange = onSelectedBook;

    function onSelectedBook() {
        setInnerHTML('status_field', 'Status:')
        setInnerHTML('request_field', 'Antal försök: ');
        selectedIndexInBookListField = bookList.selectedIndex;
        addTagById("change_remove_section_id");
        document.getElementById('author_input').value = bookListArray[selectedIndexInBookListField].author;
        document.getElementById('title_input').value = bookListArray[selectedIndexInBookListField].title;
    }

    let addBookButton = document.getElementById("add_book-button_id");
    addBookButton.onclick = addBook;

    function addBook() {
        removeTagById("filter_clear_section_id");
        removeTagById("change_confirm_button");
        removeTagById("remove_confirm_button");
        addTagById("input_fields_section_id");
        addTagById("add_confirm_button");
    }

    let filterBooks = document.getElementById("filter_button_id");
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
        removeTagById("add_confirm_button");
        removeTagById("change_confirm_button");
        removeTagById("remove_confirm_button");
        addTagById("input_fields_section_id");
        addTagById("filter_clear_section_id");
    }
    let changeBook = document.getElementById("change_book_button");
    changeBook.onclick = changeSelectedBook;

    function changeSelectedBook() {
        removeTagById("add_confirm_button");
        removeTagById("filter_clear_section_id");
        removeTagById("remove_confirm_button");
        addTagById("input_fields_section_id");
        addTagById("change_confirm_button");
    }
    let removeBook = document.getElementById("remove_book_button");
    removeBook.onclick = removeSelectedBook;

    function removeSelectedBook() {
        removeTagById("add_confirm_button");
        removeTagById("filter_clear_section_id");
        removeTagById("change_confirm_button");
        addTagById("input_fields_section_id");
        addTagById("remove_confirm_button");
    }

    let AddConfirmButton = document.getElementById('add_confirm_button');
    AddConfirmButton.onclick = addBookConfirmation;

    async function addBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let titleName = document.getElementById('title_input').value.trim();
        let authorName = document.getElementById('author_input').value.trim();
        if (titleName === "" || authorName === "") {
            setInnerHTML('status_field', 'Status: Minst ett fält är tomt!');
            return;
        }
        let queryString = `?op=insert&key=${apiKey}&title=${titleName}&author=${authorName}`;
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är sparad!');
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests);
            updateBookList();
            removeTagById("add_confirm_button");
            removeTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    let changeConfirmButton = document.getElementById('change_confirm_button');
    changeConfirmButton.onclick = changeBookConfirmation;
    
    async function changeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let bookId = bookListArray[selectedIndexInBookListField].id;
        let titleName = document.getElementById('title_input').value.trim();
        let authorName = document.getElementById('author_input').value.trim();
        if (titleName === "" || authorName === "") {
            setInnerHTML('status_field', 'Status: Minst ett fält är tomt!');
            return;
        }
        let queryString = `?op=update&key=${apiKey}&id=${bookId}&title=${titleName}&author=${authorName}`;//selectedBookId är problemet!(kanske???)
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är uppdaterad!')
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests)
            updateBookList();
            removeTagById("change_confirm_button");
            removeTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
            selectedIndexInBookListField = null;
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }
    
    let removeConfirmButton = document.getElementById('remove_confirm_button');
    removeConfirmButton.onclick = removeBookConfirmation;
    
    async function removeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let bookId = bookListArray[selectedIndexInBookListField].id;
        let queryString = `?op=delete&key=${apiKey}&id=${bookId}`;
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är borttagen!');
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests);
            updateBookList();
            removeTagById("remove_confirm_button");
            removeTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
            selectedIndexInBookListField = null;
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    let filterConfirmButton = document.getElementById('filter_confirm_button');
    filterConfirmButton.onclick = filterBookList;

    function filterBookList() {
        let authorField = document.getElementById('author_input').value.trim();
        let titleField = document.getElementById('title_input').value.trim();
        for (const book of bookListArray) {
            if (book.author.includes(authorField) || book.title.includes(titleField)) {
                filterListArray.push(book);
            }
        }
        updateBookListField(filterListArray);
    }

    let resetInputFields = document.getElementById("filter_reset_button");
    resetInputFields.onclick = resetFilter;

    function resetFilter() {
        let authorField = document.getElementById("author_id");
        let titleField = document.getElementById("title_id");
        authorField.value = titleField.value = "";
        updateBookList();
    }

    
});

