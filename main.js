//html elements
const ul = document.querySelector("ul");
const select = document.querySelector("select");
const container = document.querySelector(".container");
const catButton = document.querySelector("#poker-cat");
const selfText = document.querySelector("#selfText");
const readMoreButton = document.querySelector("#readMore");
//const postRangeSelector = document.querySelector("#postRangeSelector");

//brings the cat image back; admittedly stupid
catButton.addEventListener("click", () => {
  ul.innerHTML = `<li class="text-center"><img src="http://www.guzer.com/pictures/poker-cat.jpg" alt="poker-cat" class="text-center m-auto col-sm-12 col-md-12 col-lg-10 col-xl-8"></li>
          <li class="text-center text-light">"Pick a sub, any sub, but make it quick!"</li>`;
});

//handles either reddit's format of links (linktitle)[url] or inline links 'https//...'
const linkFormatter = linkStr => {
  const redditLink = /(\[.+\])(\(.+\))/gi;
  const inlineLink = /(https|http)(\W*)(\w+)(\.com.*?)/gi;
  linkStr = linkStr
    .replace(redditLink, `<a href='\$2' class="selfTextLink">\$1</a>`)
    .replace(/\[|\]|\(|\)/g, "");
  return linkStr.replace(
    inlineLink,
    `<a href='\$1\$2\$3\$4' class="selfTextLink">\$3\$4</a>`
  );
};

//forms (mm/dd time of post) format
const dateFormatter = timeStamp => {
  const date = new Date(timeStamp * 1000).toLocaleDateString().split("/");
  const time = new Date(timeStamp * 1000).toLocaleTimeString().split(":");
  return `${date[0]}/${date[1]} ${time[0]}:${time[1]}pm`;
};

const fetchTopFive = async sub => {
  const netStart = window.performance.now();
  const URL = `https://www.reddit.com/r/${sub}/top/.json?limit=5`;
  const fetchResult = fetch(URL);
  const response = await fetchResult;
  const jsonData = await response.json();
  const posts = jsonData.data.children;

  const mapStart = window.performance.now();
  ul.innerHTML = posts
    .map((post, i) => {
      const {
        permalink,
        title,
        author,
        score,
        num_comments,
        created_utc,
        selftext,
        preview
      } = post.data;
      //if there is no image to display, display just the text
      if (!preview) {
        return `
        <li class='list-group-item'>
        <strong><a id="postTitleLink" href='https://reddit.com${permalink}' target='_blank'>${i +
          1}) "${title}"</strong></a><a href='https://reddit.com${permalink}'><i class='fas fa-link'></i></a>
        <small class='text-right'>(/u/${author})</small>
        <div class='container justify-content-end row'>
         <button disabled class="btn mx-3 p-2"><strong><i class="fas fa-arrow-up"></i> ${score}</strong></button>
         <button disabled class="btn mx-3 p-2"><strong><i class="fas fa-comments"></i> ${num_comments}</strong></button>
        </div>
        <small class="d-block text-muted">${dateFormatter(created_utc)}
        </small>
         <div id="selfText" style="display: inherit; overflow: scroll;">
         <hr>
         <p class="postText lead">${
           selftext
             ? linkFormatter(selftext)
             : `<p class='text-muted small d-inline'>There's no text or media to display for this post</p>`
         }</p>   
       
         </div> 
      </li>
      `; //if there is an image, display the image
      } else {
        const { url } = preview.images[0].source;
        console.log(preview.images);
        return `
      <li class='list-group-item'>
        <strong><a id="postTitleLink" href='https://reddit.com${permalink}' target='_blank'>${i +
          1}) "${title}"</strong></a><a href='https://reddit.com${permalink}'><i class='fas fa-link'></i></a>
        <small class='text-right'>(/u/${author})</small>
        <div class='container justify-content-end row'>
         <button disabled class="btn mx-3 p-2"><i class="fas fa-arrow-up"></i> ${score}</strong></button>
         <button disabled class="btn mx-3 p-2"><strong><i class="fas fa-comments"></i> ${num_comments}</strong></button>
        </div>
        <small class="d-block text-muted">${dateFormatter(created_utc)}
        </small>
         <div id="selfText" style="display: inherit; overflow: scroll;">
         <hr>
         <p class="postText lead">${
           selftext ? linkFormatter(selftext) : ``
         }</p>   
         <div class='container m-auto justify-content-center'>
            <a href='${url}'><img src=${url} width=100% height=auto class='img-fluid' id='postImg'></a>
        </div>
        </div> 
      </li>
      `;
      }
    })
    .join("");
  const end = window.performance.now();
  console.log(
    "netStart",
    netStart,
    "mapStart",
    mapStart,
    "end",
    end,
    "network time",
    mapStart - netStart,
    "processing time",
    end - mapStart
  );

  console.log(checkPerformance(mapStart - netStart, end - mapStart));
};

//monitor speed/performance
const checkPerformance = (networkTime, processingTime) => `Network time: ${networkTime}ms, Processing time: ${processingTime}ms`;
//MDN ref: "https://developer.mozilla.org/en-US/docs/Web/API/Performance/now"

// passes selected sub to fetchTopFive()
function selectSub() {
  fetchTopFive(this.value);
}

select.addEventListener("change", selectSub);
//readMoreButton.addEventListener('click', () => postText.style.display === 'inherit');
