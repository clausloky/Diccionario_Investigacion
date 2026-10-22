async function init() {
    const conceptKey = window.localStorage.getItem("concept");

    const concepts = await fetch("../definitions/definitions.json")
    .then(res => res.json());

    const concept = Object.entries(concepts)[conceptKey];
    console.log(concept);

    const title = document.getElementById("title");
    const main_title = document.getElementById("main-title");

    title.innerHTML = concept[0];
    main_title.innerHTML = concept[0];

    const definition = document.getElementById("definicion");

    definition.innerHTML = concept[1]?.definicion;

    const ejemplos = document.getElementById("ejemplos");

    const ejemplosText = concept[1]?.ejemplos.join("<br>");

    ejemplos.innerHTML = ejemplosText;

    const gallery = document.getElementById("gallery");

    concept[1]?.imagenes.forEach((img) => {
        console.log(img);

        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img");

        const image = document.createElement("img");
        image.src = img;

        imgContainer.append(image);

        gallery.append(imgContainer);
    });
    
}

if (document.readyState === "complete") init();
else document.addEventListener("DOMContentLoaded", () => {
    init();
});