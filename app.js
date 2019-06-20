const stocklist= ['MSFT','TSLA','TACO','GOOG'];
const token="pk_957f699ea136490e9fcc6de83cdb82e9"

const displayStock = function() { //need to create evenly spaced rows so articles don't bleed together.
    const stock = $(this).attr('data-name');
    const queryURL = `https://cloud.iexapis.com/stable/stock/${stock}/batch?token=${token}&types=quote,news&range=1m&last=15`;

    $.ajax({
    url: queryURL,
    method: 'GET'
}).then(function(response) {
    console.log(response)

    const stockDiv = $('<div>').addClass('stock');

    const companyName = response.quote.companyName;
    const nameP = $('<p>').text(`Company Name: ${companyName}`);
    stockDiv.append(nameP);

    const stockSymbol = response.quote.symbol;
    const symbolP = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
    stockDiv.append(symbolP);

    const stockPrice = response.quote.latestPrice;
    const priceP = $('<p>').text(`Stock Price: ${stockPrice}`);
    stockDiv.append(priceP);

    $('#logoBox').prepend(stockDiv);
    for ( let i = 0; i < 10; i++) {
        console.log(response.news[i]);
    let companyNews = response.news[i].summary;
    let articleLink = response.news[i].url;
        if (companyNews === "No summary available.") {
            $('#articleBox').prepend(`<h6><a href=${articleLink}>${response.news[i].headline}</a></h6>`)
        } else {
    $('#articleBox').prepend(`<h6><a href=${articleLink}>${companyNews}</a></h6>`);
    }
}

});

}

const render = function () {
    $('#btnBar').empty();

    for(i = 0; i < stocklist.length; i++) {

        const newButton = $(`<button>${stocklist[i]}</button>`);

        newButton.addClass('btn btn-success stock-btn');

        newButton.attr('data-name',stocklist[i]);

        $('#btnBar').append(newButton);
    }
}


const addButton = function(e) {
    e.preventDefault();
    let validationURL = `https://cloud.iexapis.com/stable/ref-data/symbols?token=${token}`;
    let validationList = [];
    $.ajax({
        url: validationURL,
        method: 'GET'
    }).then(function(response) {
        for (let i = 0; i < response.length; i++) {
        validationList.push(response[i].symbol);
        }

        const stock = $('#stock-input').val().trim().toUpperCase();
        
        for (let i = 0; i < validationList.length; i++) {
            if (validationList[i] === stock) {
                stocklist.push(stock);
                $('#stock-input').val("");
                render();
                return
            }
        }
        alert("please enter a valid stock symbol");
})

}


$('#submitBtn').on("click", addButton);

$('#btnBar').on("click", ".stock-btn", displayStock);

render();