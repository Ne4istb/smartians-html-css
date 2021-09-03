window.changeFilter = () => {
  const image = document.querySelector('.preview-image');
  image.className = 'preview-image';

  let filterClass = 'no-filter';

  const value = document.getElementById('filter').value;
  switch (value) {
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

  image.classList.add(filterClass);
};

window.selectFile = evt => {
  const [file] = evt.srcElement.files;
  if (!file) return;

  const image = document.querySelector('.preview-image');
  image.style.display = 'block';
  image.src = URL.createObjectURL(file);
};

window.submitForm = evt => {
  evt.preventDefault();

  const uploader = document.getElementById('uploader');
  const [file] = uploader.files;
  if (!file) {
    alert('Обязательно добавьте изображение');
    return;
  }

  upload(file).then(imageUrl => submitData(imageUrl));
};

function upload(file) {
  const formData = new FormData();
  formData.append('UPLOADCARE_PUB_KEY', '2a613c9663811a54d7a5');
  formData.append('UPLOADCARE_IMAGES_ONLY', true);
  formData.append('UPLOADCARE_DO_NOT_STORE', false);
  formData.append('file', file, file.name);
  formData.append('file_name', file.name);
  formData.append('source', 'local');

  return fetch('https://upload.uploadcare.com/base/', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(json => json.file)
    .then(fileId => storeFile(fileId))
    .then(fileId => getUploadCareUrl(fileId))
    .catch(error => alert(error));
}

function storeFile(fileId) {
  const headers = {
    Accept: 'application/vnd.uploadcare-v0.5+json',
    Authorization: `Uploadcare.Simple 2a613c9663811a54d7a5:86710e8a01b4560a29c9`,
    'Content-Type': 'application/json'
  };
  return fetch('https://api.uploadcare.com/files/storage/', {
    method: 'PUT',
    body: JSON.stringify([fileId]),
    headers: headers
  }).then(() => fileId);
}

function getUploadCareUrl(fileId) {
  return `https://ucarecdn.com/${fileId}/`;
}

function submitData(imageUrl) {
  const data = {
    authorId: HeroUser.getRandomUserId(),
    text: document.getElementById('text').value,
    location: document.getElementById('location').value,
    image: imageUrl,
    filter: document.getElementById('filter').value,
    allowComments: document.getElementById('comments').checked,
    time: new Date()
  };

  const storage = new SmartogramStorage();
  storage
    .addPost(data)
    .then(() => {
      alert('Добавлено!');
      window.open('index.html', '_self');
    })
    .catch(error => alert(error));
}
