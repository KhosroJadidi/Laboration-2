window.addEventListener('load', () => {
    function removeClass(id,classToRemove){
        let element=document.getElementById(id);
        element.classList.remove(classToRemove);
    };

    function addClass(id,classToAdd){
        let element=document.getElementById(id);
        element.classList.add(classToAdd);
    };

    function setInnerHTML(id,HTML_Content){
        let element= document.getElementById(id);
        element.innerHTML=HTML_Content;
    };

    let newlistButton = document.getElementById('new_list_button');
    newlistButton.onclick = loadNewList;

    function loadNewList() {
        //load a new list here
    };
    let addBookButton = document.getElementById('add_book-button_id');
    addBookButton.onclick = addBook;

    function addBook() {
        //add book here
        removeClass('author_and_title_input_fields_id', 'invisible');
        addClass('filter_button_id','invisible');
        addClass('add_book-button_id','invisible');
        setInnerHTML('filter_based_input-id','Lägg till');
    };
    let filterBooks = document.getElementById('filter_button_id');
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
        removeClass('author_and_title_input_fields_id', 'invisible');
        addClass('filter_button_id','invisible');
        addClass('add_book-button_id','invisible');
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

    let resetInputFields = document.getElementById('reset_filter_id');
    resetInputFields.onclick=resetEnteredText;
    
    function resetEnteredText(){
        let authorField= document.getElementById('author_id');
        let titleField= document.getElementById('title_id');
        authorField.value=titleField.value="";
    };
});