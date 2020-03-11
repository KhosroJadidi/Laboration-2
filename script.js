window.addEventListener('load', () => {
    let newlistButton = document.getElementById('new_list_button');
    newlistButton.onclick = loadNewList;

    function loadNewList() {
        //load a new list here
        newlistButton.innerHTML='change text';//denna func är en test
    };
    let addBookButton = document.getElementById('add_book-button');
    addBookButton.onclick = addBook;

    function addBook() {
        //add book here
    };
    let filterBooks = document.getElementById('filter_button');
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
    };
    let changeBook = document.getElementById('change_book_button');
    changeBook.onclick = changeSelectedBook;

    function changeSelectedBook() {
        //change book here
    };
    let removeBook = document.getElementById('remove_book_button');
    removeBook.onclick = removeSelectedBook;

    function removeSelectedBook() {
        //remove selected book here
    };    
});