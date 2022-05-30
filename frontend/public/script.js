const parseJSON = async (url) => {
    const response = await fetch(url);
    return response.json();
};

const swiperComponent = (data, comp) => {
    return `
    <section id="homepage"></section>
    <section id="gallery">
        <div class="swiper">
            <div class="swiper-wrapper">
                ${data.map(img => comp(img)).join("")}
            </div>
        </div>
    </section>
    `
};

const swiperSlideComponent = ({fileName, title}) => {
    return `
    <div class="swiper-slide">
        <h2>${title}</h2>
        <img src="./public/images/${fileName}"/>
    </div>
    `
};

function addImgComponent() {
    return `
        <form id="form">
            <input type="file" name="fileName" id="fileName" placeholder="Filename">
            <input type="text" name="title" id="title" placeholder="Image's title">
            <input type="text" name="photographersName" id="photographersName" placeholder="Photographer's name">
            <button id="button">Upload</button>
        </form>
    `
};

const loadEvent = async () => {

    const result = await parseJSON("/data");
    
    const rootElement = document.getElementById("root");

    rootElement.insertAdjacentHTML("beforeend", swiperComponent(result, swiperSlideComponent), result.map(img => swiperSlideComponent(img)).join(""));

    rootElement.insertAdjacentHTML("afterend", addImgComponent());

    const swiper = new Swiper(".swiper", {
        loop: true, 
    });

    const button = document.getElementById(`button`);
    const formElement = document.getElementById('form');

    formElement.addEventListener('submit', e => {
        e.preventDefault();

        const today = new Date();

        const formData = new FormData();
        formData.append("fileName", e.target.querySelector(`input[name="fileName"]`).files[0]);
        formData.append("title", e.target.querySelector(`input[name="title"]`).value);
        formData.append("uploadDate", today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate());
        formData.append("photographersName", e.target.querySelector(`input[name="photographersName"]`).value);


        const fetchSettings = {
            method: 'POST',
            body: formData
        };

        fetch("/", fetchSettings)
        .then(async data => {
            if(data.status === 200){
                const res = await data.json()
                e.target.outerHTML = `<img src="images/${res.pictureName}">`
                console.dir(data);
            }
        })
        .catch(err => {
            e.target.outerHTML = `Error!`;
            console.dir(err);
        })

    })

};

window.addEventListener("load", loadEvent);
