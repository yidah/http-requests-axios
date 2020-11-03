const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

// Axios uses promises therefore no need to configure a promise  so use it within async function after await is ok
// Axios does not expect a method (POST,DELETE, etc) to pass on
async function fetchPosts() {
  try {
    const response = await axios.get(
      'https://jsonplaceholder.typicode.com/posts'
    );
    // We get in the response ready to be used "data" we do not need to parse json
    // we get the response status
    console.log(response);
    const listOfPosts = response.data;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector('h2').textContent = post.title.toUpperCase();
      postEl.querySelector('p').textContent = post.body;
      postEl.querySelector('li').id = post.id;
      listElement.append(postEl);
    }
  } catch (error) { // Axios automatically throws an error for both server and client side errors
    alert(error.message);
    console.log(error.response);
  }
}

async function createPost(title, content) {
  const userId = Math.random();
  
  const post = {
    title: title,
    body: content,
    userId: userId
  };

  const fd = new FormData(form);
  // fd.append('title', title);
  // fd.append('body', content);
  fd.append('userId', userId);

  // We do not need to add headers we can send any type of data as axios discovers this 
  const response = await axios.post(
    'https://jsonplaceholder.typicode.com/posts',
    fd
  );
  console.log(response);
}

fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', event => {
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector('#title').value;
  const enteredContent = event.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
});

postList.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`);
  }
});
