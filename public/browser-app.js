const quizList = document.querySelector('#quizList')
const loadingDOM = document.querySelector('.loading-text')
const sortControl = document.querySelector('#sortControl')
const licenseControl = document.querySelector('#licenseControl')
const subjectControl = document.querySelector('#subjectControl')

const params = window.location.search
const deleted = new URLSearchParams(params).get('deleted')
const newQ = new URLSearchParams(params).get('new')


// build queryOptions
const queryOptions = {
  "sort": '-createdAt',
}

// get license value
licenseControl.addEventListener('click', async (e) => {
  const el = e.target
  const value = el.dataset.licensevalue
  const title = el.innerText;
  try {
    document.querySelector('#currentLicense').innerText = title
    if (value === 'Any'){
      delete queryOptions.license
    } else {
      queryOptions.license = value
    }
    showQuizzes(queryOptions)
  } catch (error) {
    console.log(error)
  }
})

// get subject value
subjectControl.addEventListener('click', async (e) => {
  const el = e.target
  const value = el.dataset.subjectvalue
  const title = el.innerText;
  try {
    document.querySelector('#currentSubject').innerText = title
    if (value === 'Any'){
      delete queryOptions.subject
    } else {
      queryOptions.subject = value
    }
    showQuizzes(queryOptions)
  } catch (error) {
    console.log(error)
  }
})

// get sort value
sortControl.addEventListener('click', async (e) => {
  const el = e.target
  const value = el.dataset.sortvalue
  const title = el.innerText;
  try {
    document.querySelector('#currentSort').innerText = title
    queryOptions.sort = value
    showQuizzes(queryOptions)
  } catch (error) {
    console.log(error)
  }
})


// Load quizzes from /api/v1/quiz with search filtering
const showQuizzes = async (opts) => {
  loadingDOM.style.visibility = 'visible'

  const params = new URLSearchParams();
  for (const key in opts) {
    params.append(key, opts[key]);
  }

  try {
    const {
      data: { quizzes },
    } = await axios.get(`/api/v1/quiz`, {params})
    if (quizzes.length < 1) {
      quizList.innerHTML = '<h5 class="empty-list">No quizzes in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    
    const allQuizzes = quizzes
      .map((quiz) => {
        const { _id: quizID, title, license, subject } = quiz
        return `<div class="col">
        <div class="card"">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">License: ${license}</li>
          <li class="list-group-item">Subject: ${subject}</li>
          <li class="list-group-item">ID: ${quizID}</li>
        </ul>
        <div class="card-body">
          <a href="edit.html?id=${quizID}" class="card-link">Edit</a>
          <!--<a href="preview.html?id=${quizID}" class="card-link">Preview</a>-->
        </div>
      </div>
      </div>`
      })
      .join('')
    quizList.innerHTML = allQuizzes
  } catch (error) {
    quizList.innerHTML =
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  loadingDOM.style.visibility = 'hidden'
}

showQuizzes(queryOptions)

// display deleted message if deleted exists
if (deleted) {
  const msg = `<div class="alert alert-success alert-dismissible fade show" role="alert">
  Quiz: <strong>${deleted}</strong> was successfully deleted.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
  `
  document.querySelector('#messages').innerHTML = msg
}

if (newQ) {
  const msg = `<div class="alert alert-success alert-dismissible fade show" role="alert">
  Quiz: <strong>${newQ}</strong> was successfully created.
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
  `
  document.querySelector('#messages').innerHTML = msg
}



// delete task /api/tasks/:id

quizList.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {
      await axios.delete(`/api/v1/quiz/${id}`)
      showTasks()
    } catch (error) {
      console.log(error)
    }
  }
  loadingDOM.style.visibility = 'hidden'
})

// form

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  const title = taskInputDOM.value

  try {
    await axios.post('/api/v1/quiz', { title })
    showTasks()
    taskInputDOM.value = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = `success, task added`
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.innerHTML = `error, please try again`
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
    formAlertDOM.classList.remove('text-success')
  }, 3000)
})
