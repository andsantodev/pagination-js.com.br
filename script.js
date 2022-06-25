/* ============= data backend ============= */
const data = []
for (let index = 0; index < 100; index++) {
  data.push(`Item ${index + 1}`) 
}  
/* ============= data backend ============= */


// state
let page = 1
let perPage = 5
let maxVisibleButtons = 5
const state = {
  page,
  perPage,
  totalPage: Math.ceil(data.length / perPage)
}

// assistant get element html
function htmlElement(element){
  return document.querySelector(element)
}

// list items
const listItems = {
  createItem(item){
    const div = document.createElement('div')
    div.classList.add('item')
    div.innerHTML = item
    htmlElement('.list').appendChild(div)
  },
  updateList(){
    htmlElement('.list').innerHTML = ''
    let page = state.page - 1
    let start = page * state.perPage
    let end = start + state.perPage
    const paginatedItems = data.slice(start, end)
    paginatedItems.forEach(listItems.createItem)
  },
}

// controls buttons
const controlButtons = {
  prevPage(){
    state.page--
    if (state.page < 1) {
      state.page++
    }
  },
  nextPage(){
    state.page++
    if (state.page > state.totalPage) {
      state.page--
    }
  },
  goTo(page){
    // if negative number
    if (page < 1) {
      page = 1
    }

    // if number greater totalPage
    state.page = +page
    if (page > state.totalPage) {
      state.page = state.totalPage
    }
  },
  createListeners(){
    // first page
    htmlElement('.first').addEventListener('click', () => {
      controlButtons.goTo(1)
      globalUpdate()
    })

    // last page
    htmlElement('.last').addEventListener('click', () => {
      controlButtons.goTo(state.totalPage)
      globalUpdate()
    })

    // prev page
    htmlElement('.prev').addEventListener('click', () => {
      controlButtons.prevPage()
      globalUpdate()
    })

    // next page
    htmlElement('.next').addEventListener('click', () => {
      controlButtons.nextPage()
      globalUpdate()
    })
  }
}

// buttons
const buttons = {
  createButtons(numberPage){
    const button = document.createElement('div')
    button.innerHTML = numberPage
    if (state.page == numberPage) button.classList.add('active')
    button.addEventListener('click', (event) => {
      const page = event.target.innerText
      controlButtons.goTo(page)
      globalUpdate()
    })
    htmlElement('.numbers').appendChild(button)
  },
  updateButtons(){
    htmlElement('.numbers').innerHTML = ''
    const {maxLeft, maxRight} = buttons.maxButtonsVisible()
    for (let page = maxLeft; page <= maxRight; page++) {
      buttons.createButtons(page)
    }
  },
  maxButtonsVisible(){
    let buttons = Math.floor(maxVisibleButtons / 2)
    let maxLeft = (state.page - buttons)
    let maxRight = (state.page + buttons)

    if (maxLeft < 1) {
      maxLeft = 1
      maxRight = maxVisibleButtons
    }

    if (maxRight > state.totalPage) {
      maxLeft = state.totalPage - (maxVisibleButtons - 1)
      maxRight = state.totalPage

      // avoiding negative paging in case of little data
      if(maxLeft < 1) maxLeft = 1
    }

    return {maxLeft, maxRight}
  }
}

// global updates
function globalUpdate() {
  listItems.updateList()
  buttons.updateButtons()
}

// init app
function initApp() {
  globalUpdate()
  controlButtons.createListeners()
}

initApp()
