window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    var bookListArray;
    var filterListArray = [];
    var selectedIndexInBookListField;
    var filterActive = false;

    let newlistButton = document.getElementById("new_list_button");
    newlistButton.onclick = getNewAPIkey;
    
    let bookList = document.getElementById('books');
    bookList.onchange = onSelectedBook;

    let addBookButton = document.getElementById("add_book-button_id");
    addBookButton.onclick = addBook;

    let filterBooks = document.getElementById("filter_button_id");
    filterBooks.onclick = filterBooksInList;

    let changeBook = document.getElementById("change_book_button");
    changeBook.onclick = changeSelectedBook;

    let removeBook = document.getElementById("remove_book_button");
    removeBook.onclick = removeSelectedBook;

    let AddConfirmButton = document.getElementById('add_confirm_button');
    AddConfirmButton.onclick = addBookConfirmation;

    let changeConfirmButton = document.getElementById('change_confirm_button');
    changeConfirmButton.onclick = changeBookConfirmation;

    let removeConfirmButton = document.getElementById('remove_confirm_button');
    removeConfirmButton.onclick = removeBookConfirmation;

    let filterConfirmButton = document.getElementById('filter_confirm_button');
    filterConfirmButton.onclick = filterBookList;

    let resetInputFields = document.getElementById("filter_reset_button");
    resetInputFields.onclick = resetFilter;

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
    };
    siteLoad();

    function showTagById(id) {
        let element = document.getElementById(id);
        if (element.classList.contains("invisible")) {
            element.classList.remove("invisible");
        }
    }

    function hideTagById(id) {
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
        }
        else {
            setInnerHTML('status_field', 'Status: Uppdateringsfel, tryck F5!')
        }
    }

    function updateBookListField(listArray) {
        setInnerHTML('books','');
        for (const iterator of listArray) {
            let option = document.createElement('option');
            option.setAttribute('id', iterator.id);
            option.appendChild(document.createTextNode(`Författare: ${iterator.author}, titel: ${iterator.title}`));
            bookList.appendChild(option);
        }
    }

    function onSelectedBook() {
        setInnerHTML('status_field', 'Status:')
        setInnerHTML('request_field', 'Antal försök: ');
        selectedIndexInBookListField = bookList.selectedIndex;
        showTagById("change_remove_section_id");
        document.getElementById('author_input').value = bookListArray[selectedIndexInBookListField].author;
        document.getElementById('title_input').value = bookListArray[selectedIndexInBookListField].title;
    }

    function addBook() {
        hideTagById("filter_clear_section_id");
        hideTagById("change_confirm_button");
        hideTagById("remove_confirm_button");
        showTagById("input_fields_section_id");
        showTagById("add_confirm_button");
    }

    function filterBooksInList() {
        //filter books here
        hideTagById("add_confirm_button");
        hideTagById("change_confirm_button");
        hideTagById("remove_confirm_button");
        showTagById("input_fields_section_id");
        showTagById("filter_clear_section_id");
    }

    function changeSelectedBook() {
        hideTagById("add_confirm_button");
        hideTagById("filter_clear_section_id");
        hideTagById("remove_confirm_button");
        showTagById("input_fields_section_id");
        showTagById("change_confirm_button");
    }

    function removeSelectedBook() {
        hideTagById("add_confirm_button");
        hideTagById("filter_clear_section_id");
        hideTagById("change_confirm_button");
        showTagById("input_fields_section_id");
        showTagById("remove_confirm_button");
    }

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
            hideTagById("add_confirm_button");
            hideTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }
    
    async function changeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let bookId;
        if (filterActive) {
            bookId = filterListArray[selectedIndexInBookListField].id;
        }
        else {
            bookId  = bookListArray[selectedIndexInBookListField].id;
        }
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
            hideTagById("change_confirm_button");
            hideTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
            selectedIndexInBookListField = null;
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }
    
    async function removeBookConfirmation() {
        setInnerHTML('status_field', 'Status: Vänta...')
        let bookId;
        if (filterActive) {
            bookId = filterListArray[selectedIndexInBookListField].id;
        }
        else {
            bookId  = bookListArray[selectedIndexInBookListField].id;
        }
        let queryString = `?op=delete&key=${apiKey}&id=${bookId}`;
        let apiRespons = await apiRequest(queryString);

        if (apiRespons.status === 'success') {
            setInnerHTML('status_field', 'Status: Boken är borttagen!');
            setInnerHTML('request_field', 'Antal försök: ' + apiRespons.countrequests);
            updateBookList();
            hideTagById("remove_confirm_button");
            hideTagById("input_fields_section_id");
            document.getElementById('author_input').value = '';
            document.getElementById('title_input').value = '';
            selectedIndexInBookListField = null;
        }
        else {
            setInnerHTML('status_field', 'Status: Serverfel, försök igen!')
        }
    }

    function filterBookList() {
        filterActive = true;
        let authorField = document.getElementById('author_input').value.trim();
        let titleField = document.getElementById('title_input').value.trim();
        for (const book of bookListArray) {
            if (book.author.includes(authorField) || book.title.includes(titleField)) {
                filterListArray.push(book);
            }
        }
        updateBookListField(filterListArray);
    }

    function resetFilter() {
        filterListArray = [];
        hideTagById("input_fields_section_id");
        hideTagById("filter_clear_section_id");
        document.getElementById("author_input").value = '';
        document.getElementById("title_input").value = '';
        updateBookList();
    }
});

