"use strict";

const base_url = 'https://www.googleapis.com/books/v1/volumes?q=';

function extract() {
    let author = document.getElementById('author').value;
    let title = document.getElementById('title').value;
    let publish_date = document.getElementById('publish_date').value;
    let isbn = document.getElementById('isbn').value;

    return {'author' : author, 'title' : title, 'publish_date' : publish_date, 'isbn' : isbn};
}

function add_cards(response) {
    for (var i=0; i < response.items.length; i++) {
        let title = response.items[i].volumeInfo['title'];
        let authors = response.items[i].volumeInfo['authors'];
        let description = response.items[i].volumeInfo['description'];
        let image = response.items[i].volumeInfo['imageLinks']['thumbnail'];
        let link = response.items[i].volumeInfo['previewLink'];
        let isbn = response.items[i].volumeInfo['industryIdentifiers']; // list

        var myCol = $('<div class="col-sm-3 col-md-3 pb-2"></div>');
        // var myPanel = $('</div><p>Some text in '+i+' </p><img src="//placehold.it/50/eeeeee" class="rounded rounded-circle"></div></div>');

        var myPanel = $(`
            <div class="card card-outline-info" id="'+i+'Panel">
                <img src="${image}">
                <div class="card-title">
                    <span>${title}</span>
                </div>
                <div class="card-block">
                <!-- <p >${description}</p> -->
                </div>
            </div>
        `);
        myPanel.appendTo(myCol);
        myCol.appendTo('#booksPanel');
    }
    
    // console.log(response.totalItems);
}

function get_books() {
    let values = extract();

    if (values['isbn']) {
        let url = base_url + values['isbn'];
        fetch(base_url + values['isbn']).then(r => r.json()).then(r => add_cards(r));
    }
    
}