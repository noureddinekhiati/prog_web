"use strict";

const base_url = 'https://www.googleapis.com/books/v1/volumes?q=';

$("#alert").hide();

function extract_values() {
    let author = $('#author').val();
    let title = $('#title').val();
    let publish_date = $('#publish_date').val();
    let isbn = $('#isbn').val();

    return {'author' : author, 'title' : title, 'publish_date' : publish_date, 'isbn' : isbn};
}

function add_cards(response) {
    // reset

    let constraints = extract_values()

    for (var i=0; i < response.items.length; i++) {
        let title = response.items[i].volumeInfo['title'];
        let authors = response.items[i].volumeInfo['authors'];
        let description = response.items[i].volumeInfo['description'];
        let image = response.items[i].volumeInfo['imageLinks']['thumbnail'];
        let link = response.items[i].volumeInfo['previewLink'];
        let isbn = response.items[i].volumeInfo['industryIdentifiers']; // list

        var col = $('<div class="col-lg-3"></div>');
        var books_panel = $(`
            <div class="card" style="width: 15rem; display: inline-block">
                <img class="card-img-top" src="${image}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <!--<p class="card-text">${description}</p>-->
                    <a href="${link}" target="_blank" class="stretched-link"></a>
                </div>
            </div>
        `);
        
        books_panel.appendTo(col);
        col.appendTo('#booksPanel');
    }
}

function decide_keyword(values) {
    // this function will take all the values from the form and will decide which keyword we'll use to
    // perform the search.
    // Priority: ISBN, Title, Author, Publish date
    // this will return the url that we'll be used to get the books.

    if (values['isbn'])
        return base_url + values['isbn'];
    
    if (values['title'])
        return base_url + values['title'];

    if (values['author'])
        return base_url + values['author'];

    if (values['publish_date'])
        return base_url + values['publish_date'];

    return false; // all empty
}

function get_books() {
    $("#booksPanel").empty();

    let url = decide_keyword(extract_values());
    
    if (url) {
        $("#alert").hide();

        fetch(url).then(r => {
            if (r.ok) {
                r.json().then(r => {
                    if (r.totalItems > 0)
                        add_cards(r);
                    else 
                        show_error_msg("Empty response ! found no book with these constraints !")
                });
            }
            else 
               show_error_msg("Something went wrong. Please try with another value.")
        });
    }
    else 
        show_error_msg("Please fill out one of the fields above.")
}

function show_error_msg(msg) {
    $("#alert").html(msg);
    $("#alert").show();
}