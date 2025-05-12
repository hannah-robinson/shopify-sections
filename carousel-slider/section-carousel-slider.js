document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.querySelector('.featured-collections__wrapper')
  const slider = document.querySelector('.featured-collections__slider')
  const cards = slider.querySelectorAll('.featured-collections__card')
  const dotsContainer = document.querySelector('.featured-collections__dots')
  const arrowBtns = document.querySelectorAll('.nav-arrow')
  const firstCardWidth = slider.querySelector('.featured-collections__card')
    .offsetWidth
  const sliderChildren = [...slider.children]
  let isDragging = false,
    startX,
    startScrollLeft,
    dragDistance = 0

  let dragThreshold = 10 // pixels

  // Get number of cards that can fit in the slider at once
  let cardsPerView = Math.round(slider.offsetWidth / firstCardWidth)
  const totalOriginalCards = cards.length

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

  // Dot Navigation Setup
  const createDots = () => {
    for (let i = 0; i < totalOriginalCards; i++) {
      const dot = document.createElement('span')
      dot.classList.add('featured-collections__dot')
      if (i === 0) dot.classList.add('active')
      dot.addEventListener('click', () => {
        slider.scrollLeft = i * firstCardWidth
        updateDots()
      })
      dotsContainer.appendChild(dot)
    }
  }

  const updateDots = () => {
    const currentIndex =
      Math.round(slider.scrollLeft / firstCardWidth) % totalOriginalCards
    const dots = dotsContainer.querySelectorAll('.featured-collections__dot')
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex)
    })
  }

  const isScrollable = totalOriginalCards > cardsPerView

  if (!isScrollable) {
    dotsContainer.style.display = 'none'
  } else {
    createDots()
  }

  const dragStart = (e) => {
    e.preventDefault()
    isDragging = true
    slider.classList.add('dragging')
    // Get initial cursor and scroll position of slider
    startX = e.pageX
    startScrollLeft = slider.scrollLeft
    dragDistance = 0
  }

  const dragStop = (e) => {
    if (!isDragging) return
    e.preventDefault()
    isDragging = false
    slider.classList.remove('dragging')
    updateDots()
  }

  const drag = (e) => {
    if (!isDragging) return
    const deltaX = e.pageX - startX
    dragDistance = Math.abs(deltaX)
    slider.scrollLeft = startScrollLeft - deltaX
  }

  // Prevent navigation on drag for <a> tags
  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (dragDistance > dragThreshold) {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  })

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
  // Update dots / progress bar navigation when scrolling manually
  slider.addEventListener('scroll', () => {
    requestAnimationFrame(updateDots)
  })
})
