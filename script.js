window.addEventListener('load', () => {

    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    
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
        fetch(apiURL + '?requestKey')
        .then(function(response) {
            return response.json(); 
        })
        .then(function(data) {
            apiKey = data.key;
        })
        .catch(function(message) {
            console.log(message)
        });
        console.log(apiKey);
    };

    let addBookButton = document.getElementById('add_book-button_id');
    addBookButton.onclick = addBook;

    function addBook() {
        //add book here
        removeClass('input_fields_id', 'invisible');
        removeClass('add_confirm_section', 'invisible')
    };
    
    let filterBooks = document.getElementById('filter_button_id');
    filterBooks.onclick = filterBooksInList;

    function filterBooksInList() {
        //filter books here
        removeClass('author_and_title_input_fields_id', 'invisible');
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

    let resetInputFields = document.getElementById('filter_reset_button');
    resetInputFields.onclick=resetEnteredText;
    
    function resetEnteredText(){
        let authorField= document.getElementById('author_id');
        let titleField= document.getElementById('title_id');
        authorField.value=titleField.value="";
    };
});