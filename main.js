async function init() {
    const searchInput = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-button");
    const gallery = document.querySelector(".gallery");
    
    const definitions = await fetch("./definitions/definitions.json")
        .then(res => res.json());

    const concepts = [];

    function loadConcepts() {
        Object.entries(definitions).forEach((key, value) => {

            const concept = key[0];

            concepts[value] = concept;

            const card = document.createElement('div');
            card.id = `${concept}`
            card.classList.add("img");
            
            const h2 = document.createElement("h2");
            h2.textContent = `${concept}`;

            const img = document.createElement("img");
            img.src = `${key[1]?.imagenes[0]}` // Url de imagenes

            card.appendChild(img);
            card.appendChild(h2);

            card.onclick = () => openConcept(value);

            gallery.append(card);
        });
    }

    loadConcepts();

    // console.log(concepts.length);
    // console.log(concepts);

    function openConcept(conceptKey) {
        window.localStorage.setItem("concept", conceptKey);
        window.location.href = "./html/concept.html";
    }

    ////// Search engine

    function similarity(a, b) {
        a = a.toLowerCase().trim();
        b = b.toLowerCase().trim();

        const matrix = Array.from(
            { length: a.length + 1 },
            () => Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;

                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }

        const distance = matrix[a.length][b.length];
        const maxLength = Math.max(a.length, b.length);

        return maxLength === 0
            ? 100
            : (1 - distance / maxLength) * 100;
    }

    function searchConcept(text) {
        if (!text.trim()) return null;

        let bestConcept = null;
        let bestScore = 0;

        for (const concept of concepts) {
            const score = similarity(text, concept);

            if (score > bestScore) {
                bestScore = score;
                bestConcept = concept;
            }
        }

        return bestScore >= 50 ? bestConcept : null;
    }

    function search() {
        const result = searchConcept(searchInput.value);

        console.log("Searching:", searchInput.value);
        console.log("Best match:", result);

        if (result) {
            const element = document.getElementById(result);

            if (element) element.scrollIntoView({
                behavior: "smooth"
            });

            // Reset active status
            element.classList.remove("active");

            void element.offsetWidth;
            
            element.classList.add("active");

            console.log(element);
        }
    }

    searchButton.addEventListener("click", () => search());
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") search();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
