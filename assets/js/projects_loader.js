const grid = document.getElementById("projectGrid")

const pageName = window.location.pathname.split("/").pop().replace(".html", "")
const jsonPath = `../assets/json/${pageName}.json`

fetch(jsonPath)
    .then(res => res.json())
    .then(projects => {

        projects.forEach(project => {

            const card = document.createElement("a")
            card.classList.add("project-card")
            card.dataset.category = project.category
            card.href = `../projects/project.html?project=${project.slug}&cat=${pageName}`

            card.innerHTML = `
                <img src="${project.image}" loading="lazy">
                <div class="project-title">${project.title}</div>
            `

            grid.appendChild(card)

        })

        const filterButtons = document.querySelectorAll(".filter-btn")

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                if (button.dataset.filter === 'all') {
                    // Clear all other active filters and activate only 'all'
                    filterButtons.forEach(btn => {
                        if (btn === button) {
                            btn.classList.add("active")
                        } else {
                            btn.classList.remove("active")
                        }
                    })
                } else {
                    // Deactivate 'all' button if it was active
                    const allButton = Array.from(filterButtons).find(btn => btn.dataset.filter === 'all')
                    if (allButton && allButton.classList.contains("active")) {
                        allButton.classList.remove("active")
                    }
                    // Toggle current button
                    button.classList.toggle("active")
                }

                const activeButtons = Array.from(filterButtons).filter(btn => btn.classList.contains("active"))
                const activeFilters = activeButtons.map(btn => btn.dataset.filter)

                // Update URL hash to reflect active filters
                if (activeFilters.length === 0 || activeFilters.includes('all')) {
                    history.replaceState(null, "", window.location.pathname)
                } else {
                    window.location.hash = activeFilters.join(",")
                }

                const cards = document.querySelectorAll(".project-card")
                if (activeFilters.length === 0 || activeFilters.includes('all')) {
                    cards.forEach(card => {
                        card.style.display = ""
                    })
                } else {
                    cards.forEach(card => {
                        if (activeFilters.includes(card.dataset.category)) {
                            card.style.display = ""
                        } else {
                            card.style.display = "none"
                        }
                    })
                }
            })
        })

        // Apply filter(s) from URL hash after filters and cards exist
        const hash = window.location.hash.replace("#", "")

        if (hash) {
            const filters = hash.split(",") // allow multiple filters like #editorial,couples

            filters.forEach(filter => {
                const button = document.querySelector(`.filter-btn[data-filter="${filter}"]`)
                if (button) {
                    button.click()
                }
            })
        }

    })
