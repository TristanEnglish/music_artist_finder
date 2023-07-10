function getArtist()
{
    var artist = document.getElementById("artist").value;
    if (!artist)
    {
        document.getElementById("artist_card").innerHTML = 
        `
        <div class="alert alert-danger"style="padding: 1%">Please Enter an Artist Name</div>
        `
        return;
    }

    console.log(artist);
    var url =`https://theaudiodb.com/api/v1/json/2/search.php?s=${artist}`; 
    $.ajax({url:url, dataType:"json"}).then(data => {
        console.log(data); //Review all of the data returned

        if (!data.artists)
        {
            document.getElementById("artist_card").innerHTML = 
            `
            <div class="alert alert-danger"style="padding: 1%">No Results Found for Artist: ${artist} </div>
            `
            return;
        }

        var image = data.artists[0].strArtistThumb;
        var artist_name = data.artists[0].strArtist;
        var genre = data.artists[0].strGenre;
        var country = data.artists[0].strCountry;
        var biography = data.artists[0].strBiographyEN;

        if (!image)
        {
            image = '-'
        }
        if (!artist_name)
        {
            artist_name = '-'
        }
        if (!genre)
        {
            genre = '-'
        }
        if (!country)
        {
            country = '-'
        }
        if (!biography)
        {
            biography = '-'
        }

        document.getElementById("artist_card").innerHTML = 
        `
        <div class="card">
        <img class="card-img-top" src="${image}" alt="Card image cap" id="img">
        <div class="card-body">
          <h2 class="card-title" id="name">${artist_name}</h2>
          <p class="card-text"> 
          <div id="genre">${genre}</div>
          <div id="country">${country}</div>
          <br>
          <div id ="biography">${biography}</div>
        </p>
        </div>
        <div class="col" style="padding-bottom: 2%">
            <button type="button" class="btn btn-dark" data-toggle="modal" data-target="#exampleModal">
                Add Search Result
            </button>
            </div>
        </div>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Are you sure you would like to add this artist to the Search History?</h5>
      </div>
      <div class="modal-body">
      <button type="button" class="btn btn-primary" data-dismiss="modal" onclick="addSearch()">Yes</button>
      <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
      </div>
    </div>
  </div>
</div>
        `

    })
}

function addSearch()
{
    console.log("Hello");
    console.log(document.getElementById("name").innerHTML);
    console.log(document.getElementById("img").src);
    console.log(document.getElementById("genre").innerHTML);
    console.log(document.getElementById("country").innerHTML);
    console.log(document.getElementById("biography").innerHTML);
    $.ajax({
        url: '/main',
        type: 'POST',
        dataType: 'json', // type of response data
        data: {
            artist_name: document.getElementById("name").innerHTML,
            artist_img: document.getElementById("img").src,
            artist_genre: document.getElementById("genre").innerHTML,
            artist_country: document.getElementById("country").innerHTML,
            artist_biography: document.getElementById("biography").innerHTML,
        },
    });
    document.getElementById("success").innerHTML = `<div class="alert alert-success">
    <strong>Successfully added search to search history!</strong>
    </div>`;
}