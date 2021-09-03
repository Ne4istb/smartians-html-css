class SmartogramStorage {
  _initStore() {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open('smartogram', 1);

      openRequest.onupgradeneeded = function(e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('posts')) {
          const postStore = db.createObjectStore('posts', {
            keyPath: 'id',
            autoIncrement: true
          });
          postStore.createIndex('fav_idx', 'isFavorite');
        }
      };

      openRequest.onerror = function() {
        reject(openRequest.error);
      };

      openRequest.onsuccess = function() {
        const db = openRequest.result;
        const transaction = db.transaction('posts', 'readwrite');
        const postsStore = transaction.objectStore('posts');
        resolve(postsStore);
      };
    });
  }

  _executeRequest(action) {
    return new Promise(async (resolve, reject) => {
      const store = await this._initStore();
      const request = await action(store);

      request.onsuccess = event => resolve(event.srcElement.result);
      request.onerror = event => reject(event);
    });
  }

  addPost(data) {
    return this._executeRequest(store => store.add(data));
  }

  getAllPosts() {
    return this._executeRequest(store => store.getAll());
  }

  getFavorites() {
    return this._executeRequest(store => {
      const favoritesIndex = store.index('fav_idx');
      return favoritesIndex.getAll(IDBKeyRange.only(true));
    });
  }

  addComment(postId, comment) {
    return this._updatePost(postId, postToUpdate => {
      const comments = postToUpdate.comments || [];
      comments.push(comment);

      postToUpdate.comments = comments;
      return postToUpdate;
    });
  }

  markAsFavorite(postId, isFavorite) {
    return this._updatePost(postId, postToUpdate => {
      postToUpdate.isFavorite = isFavorite;
      return postToUpdate;
    });
  }

  markAsLiked(postId, isLike) {
    return this._updatePost(postId, postToUpdate => {
      postToUpdate.isLike = isLike;
      return postToUpdate;
    });
  }

  _getPost(id) {
    const postId = parseInt(id);
    return this._executeRequest(store => store.get(postId));
  }

  async _updatePost(id, updatePostAction) {
    const postId = parseInt(id);
    const post = await this._getPost(postId);
    return this._executeRequest(store => store.put(updatePostAction(post)));
  }
}
