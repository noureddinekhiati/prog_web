"use strict";

const base_url = 'https://www.googleapis.com/books/v1/volumes?q=';

$("#alert").hide();

function extract_values() {
    let author = $('#author').val().toLocaleLowerCase();
    let title = $('#title').val().toLocaleLowerCase();
    let publish_date = $('#publish_date').val();
    let isbn = $('#isbn').val().toLocaleLowerCase();

    return {'isbn' : isbn, 'author' : author, 'title' : title, 'publish_date' : publish_date};
}

function add_cards(response) {
    // reset

    let constraints = extract_values();

    for (let i=0; i < response.items.length; i++) {
        let volumeInfo = response.items[i].volumeInfo;
        
        let title = 'title' in volumeInfo ? volumeInfo['title'] : "";
        let authors = 'authors' in volumeInfo ? volumeInfo['authors'] : [];
        let description = 'description' in volumeInfo ? volumeInfo['description'] : "";
        let image_links = 'imageLinks' in volumeInfo ? volumeInfo['imageLinks'] : [];
        let image = 'thumbnail' in image_links ? image_links['thumbnail'] : "";
        let link = "previewLink" in volumeInfo ? volumeInfo['previewLink'] : "";
        let published_date = "publishedDate" in volumeInfo ? volumeInfo['publishedDate'] : "";

        let isbns = []; // list
        if ("industryIdentifiers" in volumeInfo)
            volumeInfo['industryIdentifiers'].forEach(element => {
                isbns.push(element['identifier']);
            });

        var col = $('<div class="col-lg-3 mb-3"></div>');
        var books_panel = $(`
            <div class="card" style="width: 15rem; display: inline-block">
                <img class="card-img-top" src="${image}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <div class='description'>
                        ${description.split(' ').slice(0, 10).join(' ')}

                        <p class="card-text collapse" id="more_${i}">
                            ${description.split(' ').slice(10).join(' ')}
                        </p>

                        <a href="#more_${i}" data-toggle="collapse">...more</a>
                    </div>
                    <!--<a href="${link}" target="_blank" class="stretched-link"></a>-->
                </div>
            </div>
        `);

        // filtering
        let m = new Map();
        if(isbns)
            m.set('isbn', isbns);
        if(title)
            m.set('title', [title]);
        if(authors)
            m.set('author', authors);
        
        // m.set(constraints['publish_date'], date); mn b3d
        let add = true;

        for (const [key, value] of Object.entries(constraints)) {  
            if (key == 'publish_date') continue;
            
            if (key && m.has(key)) {
                let possible_vals = m.get(key);

                let is_in = possible_vals.map(function(item) {
                    if (item.toLocaleLowerCase().includes(value)) return true; return false;
                }).some(v => v == true);
                
                add *= is_in;
                
                if(!add)
                    break;
            }
        }

        if (add) {
            books_panel.appendTo(col);
            col.appendTo('#booksPanel');
        }
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