//html elements
const postSection = document.querySelector("#posts"),
  postText = document.querySelector("#post-text"),
  postName = document.querySelector("#post-name"),
  submitButton = document.querySelector("#submitButton"),
  commentButton = document.querySelector("#commentButton"),
  commentSection = document.querySelector("div#comments");

class Post {
  constructor(user, text) {
    this.user = user;
    this.text = text;
  }

  generateMarkup(i) {
    return `
      <div id="new-post">
      <p class="lead">${this.text}</p>
      <small>Post by: <strong>${this.user}</strong></small>
      <div class="d-flex justify-content-space-between">
      <button id="commentButton" class="btn btn-sm d-block m-3" onclick="createCommentInput()">Add Comment</button>
      <button id="deletePost" class="btn btn-sm m-3 btn-danger " onclick="deletePost(${i})">Delete</button>
      <button id="editPost" onclick="editPost(${i})" class="btn btn-sm btn-info m-3">Edit post</button>
      </div>
      <div id="comments">
      </div>
      <hr>
      </div>
      `;
  }
}

class Comment {
  constructor(user, text) {
    this.user = user;
    this.text = text;
  }

  generateMarkup(i) {
    return `
      <div id="new-comment"
      <p>${this.text}</p>
      <small>Comment by: ${this.user}</small>
      <button id="deleteComment" class="btn btn-danger btn-sm" onclick="deleteComment(${i})">X</button>
      </div>
      `;
  }
}

let posts = [];
let comments = [];

//SYNOPSIS -- creates a post, calls upon that post's generateMarkup method (rendering markup), returns a closure to allow edits to be made to post
const createPost = () => {
  //create to instance of Post
  let post = new Post(postName.value, postText.value);
  //add post to posts array (immutably)
  posts = [...posts, post];
  //reset inputs
  (postName.value = ""), (postText.value = "");
  //generate UI/markup for the post
  postSection.innerHTML = posts
    .map((post, i) => post.generateMarkup(i))
    .join("");
  //create closure to edit post
  return (editPost = i => {
    //sets input values = to post's properties
    postName.value = posts[i].user;
    postText.value = posts[i].text;
    //grabs edit button on DOM & displays it
    const finishEdittingButton = document.querySelector("#finishEditting");
    finishEdittingButton.style.display = "inherit";
    //creates function to pass as callback to listener attached to editting button created above
     const createEdittedPost = () => {
       //CURRENT BUG: in an array of 2 posts, making an edit to one of them works fine but it offsets the value of position setting it equal to 0 rather than 1, if the second edit is intended for the 2nd of 2 posts
      debugger;
      const position = posts.indexOf(posts[i]);
      finishEdittingButton.style.display = "none";
      posts[i].user = postName.value;
      posts[i].text = postText.value;
      //case: post is the first in the posts array & there's more than 1 post
      if (posts.length > 1 && position === 0) {
        posts = [posts[i], ...posts.slice(1)];
        //case: post is the 2nd of 2 total posts
      } else if (position > 0 && posts.length === 2) {
        posts = [...posts.slice(0, position), posts[i]];
      } else {
        //case: post isn't the first post in posts array & there's more than 2 posts
        posts = [
          ...posts.slice(0, position),
          post,
          ...posts.slice(position + 1)
        ];
      }
      postSection.innerHTML = posts
        .map((post, i) => post.generateMarkup(i))
        .join("");
      (postName.value = ""), (postText.value = "");
    };

    finishEdittingButton.addEventListener("click", createEdittedPost);
  });
};

//generates comment input box below post and appends it to the DOM (via the comment section)
const createCommentInput = () => {
  const commentBox = document.createElement("div");
  commentBox.setAttribute("id", "commentBox");
  commentBox.innerHTML = `<input id="commentText" type="text" class="form-control w-25 mb-2" placeholder="Comment text">
  <input id="commentName" type="text" class="form-control w-25 mb-2" placeholder="Your name">
  <button class="btn btn-info btn-sm" id="commentSubmit">Comment</button>
   `;
  const commentSection = document.querySelector("div#comments");
  const commentSubmitButton = commentBox.querySelector("#commentSubmit");
  commentSubmitButton.addEventListener("click", createComment);
  commentSection.appendChild(commentBox);
};

//creates comments and appends them to the input area created by createCommentInput
const createComment = () => {
  const commentBox = document.querySelector("#commentBox");
  const commentText = commentBox.querySelector("#commentText");
  const commentName = commentBox.querySelector("#commentName");
  const commentSection = document.querySelector("div#comments");
  const comment = new Comment(commentName.value, commentText.value);
  commentSection.removeChild(commentBox);
  comments = [...comments, comment];
  commentSection.innerHTML = comments
    .map((comment, i) => comment.generateMarkup(i))
    .join("");
};

const deletePost = i => {
  //grabs all posts within the post markup section
  const currentPosts = [...postSection.querySelectorAll("div#new-post")];
  //post to delete
  const post = currentPosts[i];

  if (currentPosts.length === 1) {
    posts = [];
    return (postSection.innerHTML = "");
  } else {
    posts = posts.filter((post, index) => index !== i);
    return postSection.removeChild(post);
  }
};

//deletes comment by removing it from the DOM (via the comment section)
const deleteComment = i => {
  const commentSection = document.querySelector("div#comments");
  const comment = commentSection.querySelector("#new-comment");
  if (comments.length === 1) {
    commentSection.removeChild(comment);
    comments = [];
  }
  return (commentSection.innerHTML = comments
    .filter((comment, index) => index !== i)
    .map((comment, i) => comment.generateMarkup(i))
    .join(""));
};

submitButton.addEventListener("click", createPost);
