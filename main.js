//html elements
const ul = document.querySelector('ul');
const select = document.querySelector('select');
const container = document.querySelector('.container');
const catButton = document.querySelector('#poker-cat');
const score100 = document.querySelector('#hundred');
const score50 = document.querySelector('#fifty');
const score25 = document.querySelector('#twentyFive');



//no functional significance
catButton.addEventListener('click', () => {
  ul.innerHTML = `<li class="text-center"><img src="http://www.guzer.com/pictures/poker-cat.jpg" alt="poker-cat" class="text-center m-auto col-sm-12 col-md-12 col-lg-10 col-xl-8"></li>
          <li class="text-center">"Pick a sub, any sub, but make it quick!"</li>`
});


//get top 5 posts (no filter)
const fetchTopFive = async sub => {
  const URL = `https://www.reddit.com/r/${sub}/top/.json?limit=5`;
  const fetchResult = fetch(URL);
  const response = await fetchResult;
  const jsonData = await response.json();
  const posts = jsonData.data.children;
  const content = posts.map((post, i) => (`<li class='list-group-item'><strong>Post ${i + 1}: </strong><em>"${post.data.title}"</em> (/u/${post.data.author}) <a href='${post.data.url}' class='badge badge-info' target="_blank">link to post</a></li>`)).join('');
  ul.innerHTML = content;


}


// passes selected sub to fetchTopFive()
function selectSub() {
  fetchTopFive(this.value);
}



select.addEventListener('change', selectSub);


 //filter listeners
 //trying to find a way to apply filters to json after it's already on the page--difficult


 //fetchTopFive('javascript');
