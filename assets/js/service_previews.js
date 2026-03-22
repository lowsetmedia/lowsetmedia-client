const jsonCache = {}

// Load a category JSON once and cache it
async function loadCategory(category) {
    if (jsonCache[category]) return jsonCache[category]

    const res = await fetch(`../assets/json/${category}.json`)
    const data = await res.json()

    jsonCache[category] = data
    return data
}

// Pick random item from array
function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

// Apply preview image to card
function setPreview(card, image) {
    const img = new Image()
    // Resolve the image relative to the site root
    img.src = new URL(image, window.location.origin).href

    img.onload = () => {
        card.style.setProperty("--preview", `url('${img.src}')`)
    }
}

// Attach hover listeners
document.querySelectorAll(".service-card").forEach(card => {

    card.addEventListener("mouseenter", async () => {

        const category = card.dataset.json
        if (!category) return

        const projects = await loadCategory(category)
        if (!projects || projects.length === 0) return

        // Check if card has a specific filter
        const filter = card.dataset.filter

        let filteredProjects = projects

        if (filter) {
            filteredProjects = projects.filter(p => p.category === filter)
        }

        if (!filteredProjects.length) return

        const project = randomItem(filteredProjects)
        const preview = project.image

        if (!preview) return

        setPreview(card, preview)
    })

})
