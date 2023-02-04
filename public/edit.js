const editForm = document.querySelector('#edit-form')
const quizIDInput = document.querySelector('#quizID')
const quizTitleInput = document.querySelector('#quizTitle')
const quizLicenseInput = document.querySelector('#quizLicense')
const quizSubjectInput = document.querySelector('#quizSubject')
const quizQuestionInput = document.querySelector('#quizQuestion')
const btnSave = document.querySelector('#saveEdits')
const btnDelete = document.querySelector('#deleteQuiz')
const btnSaveNew = document.querySelector('#saveNew')
const msgSection = document.querySelector('#messages')
const simplemde = new SimpleMDE({ element: document.querySelector("#quizQuestion") });


const params = window.location.search
const id = new URLSearchParams(params).get('id')


const getQuiz = async () => {
  try {
    const {
      data: { quiz },
    } = await axios.get(`/api/v1/quiz/${id}`)
    const { _id: quizID, title, question, license, subject } = quiz

    // set form values
    quizIDInput.value = quizID
    quizTitleInput.value = title
    quizLicenseInput.value = license
    quizSubjectInput.value = subject
    quizQuestionInput.value = question

    

    simplemde.value(question);

  } catch (error) {
    console.log(error)
  }
}

if (id) {
  getQuiz()

  btnSave.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
      const title = quizTitleInput.value
      const license = quizLicenseInput.value
      const subject = quizSubjectInput.value
      const question = simplemde.value();
  
      const { data: { quiz }} = await axios.patch(`/api/v1/quiz/${id}`, {
        title: title,
        license: license,
        subject: subject,
        question: question
      })
  
      const msg = `<div class="alert alert-success" role="alert">
      Changes Saved! <a href="./index.html">Back to Dashboard</a></div>`
  
      msgSection.innerHTML = msg
  
    } catch (error) {
      console.error(error)
      const msg = `<div class="alert alert-danger" role="alert">
      Error Saving Edits!</div>`
      msgSection.innerHTML = msg
    }
  })

  btnDelete.addEventListener('click', async (e) => {
    e.preventDefault()
    try {
  
      const title = quizTitleInput.value
  
      await axios.delete(`/api/v1/quiz/${id}`)
      window.location.assign(`./index.html?deleted=${title}`)
  
    } catch (error) {
      console.error(error)
      const msg = `<div class="alert alert-danger" role="alert">
      Error Deleting Quiz</div>`
      msgSection.innerHTML = msg
    }
  })
}




btnSaveNew.addEventListener('click', async (e) => {
  e.preventDefault()
  try {
    const title = quizTitleInput.value
    const license = quizLicenseInput.value
    const subject = quizSubjectInput.value
    const question = simplemde.value();

    const { data: { quiz }} = await axios.post(`/api/v1/quiz`, {
      title: title,
      license: license,
      subject: subject,
      question: question
    })

    const msg = `<div class="alert alert-success" role="alert">
    New Quiz Created! <a href="./index.html">Back to Dashboard</a></div>`

    msgSection.innerHTML = msg

    window.location.assign(`./index.html?new=${title}`)

  } catch (error) {
    console.error(error)
    const msg = `<div class="alert alert-danger" role="alert">
    Error Saving Edits!</div>`
    msgSection.innerHTML = msg
  }
})

