//html elements
const ul = document.querySelector("ul");
const select = document.querySelector("select");


//NOT FUNCTIONAL YET
// const textFormatter = postText => {
//   return postText.replace(/^(\*\*)(\w+)(\*\*)$/ig, `<strong>\$2</strong>`)
// }

//handles either reddit's format of links (linktitle)[url] or inline links 'https//...'
const linkFormatter = linkStr => {
  let result = linkStr.replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" class="selfTextLink">$1</a>');
  return result.replace(/(?: |^)(https?\:\/\/[a-zA-Z0-9/.(]+)/g, '<a href="$1" class="selfTextLink">$1</a>');
}

//eliminate '/r/' from each select option and then sort them alphabetically
//nice in theory, tricky to implement; trying to avoid generating more template literals
const alphabetize = list => {
  const nodeList = list.children;
  return [...nodeList]
    .map(sub => sub.innerHTML)
    .join("")
    .split(/\/r\//)
    .sort();
};

//forms (mm/dd time of post) format
const dateFormatter = timeStamp => {
  const date = new Date(timeStamp * 1000).toLocaleDateString().split("/");
  const time = new Date(timeStamp * 1000).toLocaleTimeString().split(":");
  return `${date[0]}/${date[1]} ${time[0]}:${time[1]}pm`;
};

const fetchData = url => {
  return fetch(url)
    .then(res => res.json())
    .catch(err => console.log("problem: ", err));
};

//fetch the top 5 posts of selected subreddit, deconstruct the post JSON, pulling out needed objects, generate
//HTML using said object data via template literals
const fetchTopFive = sub => {
  return fetchData(`https://www.reddit.com/r/${sub}/top/.json?limit=5`).then(
    res => generateHTML(res.data.children, ul)
  );
};

const generateHTML = (data, element) => {
  element.innerHTML = data
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
           <div id="selfText">
           <hr>
           <p class="postText">${
             selftext
               ? linkFormatter(selftext)
               : `<p class='text-muted small d-inline'>There's no text or media to display for this post</p>`
           }</p>   
         
           </div> 
        </li>
        `; //if there is an image, display the image
      } else {
        const { url } = preview.images[0].source;
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
           <div id="selfText">
           <hr>
           <p class="postText">${selftext ? linkFormatter(selftext) : ``}</p>   
           <div class='container m-auto justify-content-center'>
              <a href='${url}'><img src=${url} width=100% height=auto class='img-fluid' id='postImg'></a>
          </div>
          </div> 
        </li>
        `;
      }
    })
    .join("");
};

// passes selected sub to fetchTopFive()
function selectSub() {
  fetchTopFive(this.value);
}

//handles change event for select dropdown
select.addEventListener("change", selectSub);
