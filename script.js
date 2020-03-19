window.addEventListener("load", () => {
    const apiURL = "https://www.forverkliga.se/JavaScript/api/crud.php";
    var apiKey = null;
    var viewDataRequestStatus = null;
    var viewDataRecievedArray = null;
    let selectedBook = null;

    function removeClass(id, classToRemove) {
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

    let newlistButton = document.getElementById("new_list_button");
    newlistButton.onclick = loadNewList;

    function fetchNewKey() {
        fetch(apiURL + "?requestKey")
            .then(response => {
                return response.json();
            })
            .then(data => (apiKey = data.key))
            .catch(message => console.log(message));
        console.log(`Key is : ${apiKey}`);
    }

    function loadNewList() {
        fetchNewKey();
        if (apiKey) {
            for (let index = 0; index <= 10; index++) {
                fetch(`${apiURL}?op=select&key=${apiKey}`)
                    .then(response => {
                        return response.json()
                    })
                    .then(json => {
                        viewDataRequestStatus = json.status;
                        viewDataRecievedArray=json.data;
                    })
                    .catch(message => console.log(message));

                if (viewDataRequestStatus === 'success') {
                    console.log(`status after ${index+1} try(s): ${viewDataRequestStatus}`);
                    console.log('Successfully connected to API.');
                    console.log(viewDataRecievedArray);
                    //varför ingen print? kanske array length =0???
                    for (const iterator of viewDataRecievedArray) {
                        console.log(`Författare: ${iterator.author}, Title: ${iterator.title}`)
                    }
                    break;
                }
                if (index >= 10) {
                    console.log(`status after ${index} try(s): ${viewDataRequestStatus}`);
                    console.log(`We failed to contact tha API after ${index} tries. Please try again in a few seconds.`)
                }
            }
        } else {
            console.log('"loadNewList" does not have a key to work with. Try again.');
        };
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
        removeClass("author_and_title_input_fields_id", "invisible");
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