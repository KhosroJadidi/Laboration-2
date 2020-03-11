window.addEventListener('load', () => {
    function removeClass(id,classToRemove){
        let element=document.getElementById(id);
        element.classList.remove(classToRemove);
    };

    function addClass(id,classToAdd){
        let element=document.getElementById(id);
        element.classList.add(classToAdd);
    };

    let newlistButton = document.getElementById('new_list_button');
    newlistButton.onclick = loadNewList;

    function loadNewList() {
        //load a new list here
    };
    let addBookButton = document.getElementById('add_book-button');
    addBookButton.onclick = addBook;

    function addBook() {
        //add book here
        removeClass('author_and_title_input_fields invisible_id', 'invisible');
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

    let testJavaScript = document.getElementsByClassName('change_and_remove_buttons');
    window.addEventListener('load', testingthings);

    function testingthings() {
        testJavaScript.innerHTML = '<p>test test test</p>';
    };
});