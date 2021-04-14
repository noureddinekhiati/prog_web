function bookSearch(){
    var search = document.getElementById('search')

    $.ajax({
        url = "https://www.googleapis.com/books/v1/volumes?q="+search,
        dataType : "json",
        success : function(data)
    })
}
document.getElementById('button').addEventListener('click',bookSearch,false);