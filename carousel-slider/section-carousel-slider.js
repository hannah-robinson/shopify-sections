const wrapper = document.querySelector('.wrapper')
const slider = document.querySelector('.slider')
const arrowBtns = document.querySelectorAll('.nav-arrow')
const firstCardWidth = slider.querySelector('.card').offsetWidth
const sliderChildren = [...slider.children]
let isDragging = false,
  startX,
  startScrollLeft

// Get number of cards that can fit in the slider at once
let cardsPerView = Math.round(slider.offsetWidth / firstCardWidth)

// Insert copies of last screen-worth of cards to beginning of slider for infinite scrolling
sliderChildren
  .slice(-cardsPerView)
  .reverse()
  .forEach((card) => {
    slider.insertAdjacentHTML('afterbegin', card.outerHTML)
  })

// Insert copies of last screen-worth of cards to end of slider for infinite scrolling
sliderChildren.slice(0, cardsPerView).forEach((card) => {
  slider.insertAdjacentHTML('beforeend', card.outerHTML)
})

arrowBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    slider.scrollLeft +=
      btn.id === 'slider__nav-arrow--left' ? -firstCardWidth : firstCardWidth
  })
})

const dragStart = (e) => {
  isDragging = true
  slider.classList.add('dragging')
  // Get initial cursor and scroll position of slider
  startX = e.pageX
  startScrollLeft = slider.scrollLeft
}

const dragStop = () => {
  isDragging = false
  slider.classList.remove('dragging')
}

const drag = (e) => {
  if (!isDragging) return
  slider.scrollLeft = startScrollLeft - (e.pageX - startX)
}

const autoPlay = () => {
  if (window.innerWidth < 767) return
  timeoutId = setTimeout(() => (slider.scrollLeft += firstCardWidth), 2500)
}
autoPlay()

const infiniteScroll = () => {
  // console.log('you reached the left end')
  if (slider.scrollLeft === 0) {
    slider.classList.add('no-transition')
    slider.scrollLeft = slider.scrollWidth - 2 * slider.offsetWidth
    slider.classList.remove('no-transition')
  }
  // console.log('you reached the right end')
  else if (
    Math.ceil(slider.scrollLeft === slider.scrollWidth - slider.offsetWidth)
  ) {
    slider.classList.add('no-transition')
    slider.scrollLeft = slider.offsetWidth
    slider.classList.remove('no-transition')
  }
  // Clear existing timeout & start autoplay if mouse is not hovering over slider
  clearTimeout(timeoutId)
  if (!wrapper.matches(':hover')) autoPlay()
}

slider.addEventListener('mousedown', dragStart)
slider.addEventListener('mousemove', drag)
document.addEventListener('mouseup', dragStop)
slider.addEventListener('scroll', infiniteScroll)
wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId))
wrapper.addEventListener('mouseleave', autoPlay)
