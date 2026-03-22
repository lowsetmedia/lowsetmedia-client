function applyMasonry() {
  const gallery = document.querySelector('.project-gallery')
  if (!gallery) return

  const images = gallery.querySelectorAll('img')

  images.forEach(img => {
    const gap = 16
    const height = img.getBoundingClientRect().height
    const span = Math.ceil((height + gap) / 1)
    img.style.gridRowEnd = `span ${span}`
  })
}

let masonryResizeTimer = null
window.addEventListener('resize', () => {
  clearTimeout(masonryResizeTimer)
  masonryResizeTimer = setTimeout(() => requestAnimationFrame(() => applyMasonry()), 150)
})

const params = new URLSearchParams(window.location.search)
const slug = params.get('project')
const category = params.get('cat')

fetch(`../assets/json/${category}.json`)
  .then(res => res.json())
  .then(projects => {
    const project = projects.find(p => p.slug === slug)
    if (!project) return

    document.getElementById('project-title').textContent = project.title

    const gallery = document.querySelector('.project-gallery')

    // Create loading bar
    const loadingBarContainer = document.createElement('div')
    loadingBarContainer.className = 'loading-bar'
    const loadingProgress = document.createElement('div')
    loadingProgress.className = 'loading-progress'
    loadingBarContainer.appendChild(loadingProgress)
    document.body.appendChild(loadingBarContainer)

    let loadedImages = 0
    let masonryTimer = null

    function scheduleMasonry() {
      clearTimeout(masonryTimer)
      masonryTimer = setTimeout(() => applyMasonry(), 50)
    }

    for (let i = 1; i <= project.imageCount; i++) {
      const img = document.createElement('img')
      img.src = `${project.folder}/${i}.jpg`
      img.loading = 'lazy'
      img.decoding = 'async'
      img.style.opacity = 0
      img.style.transition = 'opacity 0.5s ease'

      if (project.fullImages.includes(i)) {
        img.classList.add('full')
      }

      // append immediately
      gallery.appendChild(img)

      img.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox')
        const lightboxImg = document.getElementById('lightbox-img')

        lightbox.style.display = 'flex'
        lightboxImg.src = img.src
      })

      // apply masonry right away so layout doesn't wait
      scheduleMasonry()

      img.addEventListener('load', () => {
        // fade in image
        img.style.opacity = 1

        // update loaded count
        loadedImages++

        // progressive masonry (already scheduled above, optional to re-run)
        scheduleMasonry()

        // update loading bar
        const percent = Math.round((loadedImages / project.imageCount) * 100)
        loadingProgress.style.width = percent + '%'

        // hide loading bar when done
        if (loadedImages === project.imageCount) {
          loadingBarContainer.style.display = 'none'
          gallery.classList.add('loaded')
        }
      })
    }
  })

// Lightbox controls
const lightbox = document.getElementById('lightbox')
const lightboxImg = document.getElementById('lightbox-img')
const closeBtn = document.getElementById('lightbox-close')

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none'
  })
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      lightbox.style.display = 'none'
    }
  })
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox) {
    lightbox.style.display = 'none'
  }
})