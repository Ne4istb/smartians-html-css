async function initData() {
  const storage = new SmartogramStorage();
  const posts = await storage.getAllPosts();

  posts.sort((a, b) => b.time - a.time);
  posts.forEach(post => createPostElement(post));
}

function removeNode(element, selector) {
  const nodeToremove = element.querySelector(selector);
  nodeToremove.parentNode.removeChild(nodeToremove);
}

function createPostElement(post) {
  const postTemplate = document.querySelector('#post');
  var content = document.importNode(postTemplate.content, true);

  const postElement = content.querySelector('.post');
  postElement.dataset.postId = post.id;

  fillInfo();
  fillImage();
  fillPostText();
  fillPublishTime();
  configureActions();
  prepareCommentsBlock();

  var section = document.getElementsByTagName('section')[0];
  section.appendChild(content);

  function fillInfo() {
    const author = new HeroUser(post.authorId);
    content
      .querySelector('.info .avatar')
      .setAttribute('src', author.avatarSrc);
    content.querySelector('.info .name').textContent = author.name;

    if (post.location)
      content.querySelector('.info .location').textContent = post.location;
    else removeNode(content, '.info .location');
  }

  function fillImage() {
    const pictureElement = content.querySelector('.picture');
    pictureElement.setAttribute('src', post.image);

    let filterClass = 'no-filter';

    switch (post.filter) {
      case '1':
        filterClass = 'invert-filter';
        break;
      case '2':
        filterClass = 'grey-filter';
        break;
      case '3':
        filterClass = 'sepia-filter';
        break;
    }

    pictureElement.classList.add(filterClass);
  }

  function configureActions() {
    const buttons = content.querySelectorAll('.actions .icon-button');
    buttons.forEach(button => (button.dataset.postId = post.id));

    let selectorToHide = post.isLike ? '.like-button' : '.unlike-button';
    postElement.querySelector(selectorToHide).classList.add('hidden');

    selectorToHide = post.isFavorite ? '.fav-button' : '.unfav-button';
    postElement.querySelector(selectorToHide).classList.add('hidden');
  }

  function fillPostText() {
    if (!post.text) {
      removeNode(content, '.text');
      return;
    }

    const textElement = content.querySelector('.text');
    if (post.text.length <= 100) {
      textElement.querySelector('summary .summary').textContent = post.text;
      textElement.querySelector('summary .more').classList.add('hidden');
    } else {
      textElement.querySelector(
        'summary .summary'
      ).textContent = `${post.text.substr(0, 100)}...`;
    }

    textElement.querySelector('p').textContent = post.text;
  }

  function fillPublishTime() {
    const formattedTime = new Intl.DateTimeFormat('ru', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(post.time);
    content.querySelector('.publish-time').textContent = formattedTime;
  }

  function prepareCommentsBlock() {
    if (!post.allowComments) {
      removeNode(content, '.comments');
      removeNode(content, '.new-comment');

      return;
    }

    const commentsElement = content.querySelector('.comments');
    if (!post.comments) {
      commentsElement.classList.add('hidden');
    } else {
      post.comments.forEach(comment =>
        addCommentElement(commentsElement, comment)
      );
    }

    content.querySelector('.add-comment-btn').dataset.postId = post.id;
  }
}

window.addComment = event => {
  event.preventDefault();

  const postId = event.target.dataset.postId;
  const postElement = document.querySelector(`.post[data-post-id="${postId}"]`);

  const input = postElement.querySelector('.new-comment input');
  const value = input.value;
  if (!value) return;

  const comment = {
    authorId: HeroUser.getRandomUserId(),
    text: value
  };

  const storage = new SmartogramStorage();
  storage
    .addComment(postId, comment)
    .then(() => {
      const commentsElement = postElement.querySelector('.comments');
      commentsElement.classList.remove('hidden');
      addCommentElement(commentsElement, comment);
      input.value = '';
    })
    .catch(error => alert(error));
};

window.markLike = (event, isLike) => {
  const postId = event.currentTarget.dataset.postId;
  const postElement = getPostElement(postId);

  const storage = new SmartogramStorage();
  storage
    .markAsLiked(postId, isLike)
    .then(() => {
      const selectorToHide = isLike ? '.like-button' : '.unlike-button';
      postElement.querySelector(selectorToHide).classList.add('hidden');

      const selectorToShow = !isLike ? '.like-button' : '.unlike-button';
      postElement.querySelector(selectorToShow).classList.remove('hidden');
    })
    .catch(error => alert(error));
};

window.markFavorite = function(event, isFavorite) {
  const postId = event.currentTarget.dataset.postId;
  const postElement = getPostElement(postId);

  const storage = new SmartogramStorage();
  storage
    .markAsFavorite(postId, isFavorite)
    .then(() => {
      const selectorToHide = isFavorite ? '.fav-button' : '.unfav-button';
      postElement.querySelector(selectorToHide).classList.add('hidden');

      const selectorToShow = !isFavorite ? '.fav-button' : '.unfav-button';
      postElement.querySelector(selectorToShow).classList.remove('hidden');
    })
    .catch(error => alert(error));
};

function getPostElement(postId) {
  return document.querySelector(`.post[data-post-id="${postId}"]`);
}

function addCommentElement(commentsElement, comment) {
  const commentTemplate = document.querySelector('#comment');
  var content = document.importNode(commentTemplate.content, true);

  const author = new HeroUser(comment.authorId);
  content.querySelector('.author').textContent = author.name;
  content.querySelector('.text').textContent = comment.text;

  commentsElement.appendChild(content);
}

initData();
