

// selektujemo dugme n kojem cemo  klikom napraviti neki EVENTS
var searchButton = document.querySelector('.search button');
// selektujemo video listu u koju cemo da dodajemo video
var videoList = document.querySelector('.video-list')
// selektujemo VIDEO PREWIEW gde cemo da reprodukujemo videos
var videoPreview = document.querySelector('.video-preview');
// selektujemo RELATED VIDEO gde cemo da reprodukujemo videos
var videoRelated = document.querySelector('.video-related');
// selektujemo RELATED PREWIEW gde cemo otvarati srodne video zapise
var videoRelatedPreview = document.querySelector('.video-related-preview')
// selektujemo lOADER
var loader = document.querySelector('#load');
// KEY smo dobili u postupku kreiranja na YOUTUBE API
var key = 'AIzaSyDR8O--7xOInxlPVPuyfYjBtR5SRgkxCAs';




// f-ja ONSEARCH treba da pokupi vrednost iz SEARCH polja
// i da posalje REQUEST sa tom vrednoscu
function onSearch() {
  // selektujemo polje INPUT iz kojeg uzimamo vrednost koju saljemo
  var searchField = document.querySelector('.search input');

  searchField.value.trim() && getVideos(searchField.value);
  console.log(searchField.value)
  searchField.value = ''; // da ispraznimo search prilikom nove pretrage
  videoList.style.display = "block";
  videoRelatedPreview.style.display = "none";

}

// f-ja koja salje REQUEST
function getVideos(searchValue) {
  var req = new XMLHttpRequest();

  req.open('GET', 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=' + searchValue  + '&key=' + key);

  req.onload = function () {
    listVideos(JSON.parse(req.responseText).items);
                              // ako je ARRAY onda ide responseText
                              // ako je OBJECT pa u njemu ARRAY
                              // onda ide responseText.value
                              // console.log(req.responseText)

  }
  req.send();
}

function listVideos(videos) {
  // ovo koristimo kada hocemo da izlistamo nove snimke
  // da nam se oni ne dodaju na snimke iz prethodne pretrage
  videoList.innerHTML = '';
  videos.forEach(function (video) {
    addVideo(video);
  })
}


function addVideo(videoData) {
  var videoElement = document.createElement('div');
  videoElement.classList.add('video');

  var img = '<div class=img-container><img src="' + videoData.snippet.thumbnails.medium.url + '"/></div>';
  var title = '<h3>' + videoData.snippet.title + '</h4>';
  var desc = '<div class="description">' + videoData.snippet.description + '</div>'

  videoElement.innerHTML = img + '<section>' + title + desc + '</section>';

  videoList.appendChild(videoElement);

  // ovim selektujemo NASLOV i SLIKU da kad kliknemo na njih otvorimo VIDEO
  // posto imamo listu VIDEA u ARRAY-u
  // prolazimo petljom kroz njih i onda definisemo EVENT
  videoElement.querySelectorAll('h3, img').forEach(function(element, i) {
      element.addEventListener('click', function() {
        // f-ja OPENVIDEO ce se izvrsiti kad se klikne i pokrene f-ja u kojoj se nalazi
          openVideo(videoData.id.videoId); // prosledjujemo ID iz requesta koji smo dobili od YT API
      });
  })
}

function openVideo(id) {
  console.log(id)

  videoPreview.innerHTML = '<iframe width="100%" height="600" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  // console.log(id)

  videoPreview.style.display = "none";
  loader.style.display = "block";

  setTimeout(() => {
    loader.style.display = "none";
    videoPreview.style.display = "block";
  }, 2000)

  // kada pokrenemo video saljemo novi REQUEST koji nam salje povratne imformacije sa oficijelnog kanala
  var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCEuOwB9vSL1oPKGNdONB4ig&maxResults=5&key=' + key;

  newReq = new XMLHttpRequest();

  newReq.open('GET', url);

  newReq.onload = function() {
    channelList(JSON.parse(newReq.responseText).items);
  }

  newReq.send();
}

function channelList(channelVideos) {

  channelVideos.forEach(function (channelVideos) {
    addChannelVideo(channelVideos);
  })
}

function addChannelVideo(videoChannelData) {
  var channelElement = document.createElement('div');
  channelElement.classList.add('channel-video');


  var img = '<img class="image-video" src="' + videoChannelData.snippet.thumbnails.medium.url + '"/>';
  var title = '<h4>' + videoChannelData.snippet.title + '</h4>';
  var desc = '<p class="description">' + videoChannelData.snippet.description + '</p>'

  channelElement.innerHTML = img + '<section>' + title + desc + '</section>';

  videoRelated.appendChild(channelElement);

  videoList.style.display = "none";
  setTimeout(() => {
    videoRelated.style.display = "block";
  }, 2000)
  console.log(videoChannelData)

  videoRelated.querySelectorAll('h4, img').forEach(function(element, i) {
      element.addEventListener('click', function() {
        // f-ja OPENVIDEO ce se izvrsiti kad se klikne i pokrene f-ja u kojoj se nalazi
          openRelatedVideo(videoChannelData.id.videoId); // prosledjujemo ID iz requesta koji smo dobili od YT API
          console.log(videoChannelData.id.videoId)
      });
  })
}

function openRelatedVideo(id) {
    videoRelatedPreview.innerHTML = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
    videoPreview.style.display = "none";
    videoRelated.style.display = "none";
    videoRelatedPreview.style.display = "block";

}


// init
searchButton.addEventListener('click', onSearch);
