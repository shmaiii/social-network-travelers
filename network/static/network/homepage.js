document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#compose-post').style.display = "none";

    document.querySelector('#post-bar').addEventListener('click', new_post);
})

function new_post(event) {

    document.querySelector('#post-bar').style.display = 'none';
    document.querySelector('#compose-post').style.display = "block";
   
    document.querySelector('#post-form').addEventListener('submit', event => {
        event.preventDefault();

        const location = document.querySelector('#location-input').value;
        console.log(location);
        const content = document.querySelector('#compose-content').value;
        console.log(content);
        const img = document.querySelector('.new-post-images').value;
        console.log(img);
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/new_post', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({
                location: document.querySelector('#location-input').value,
                content: document.querySelector('#compose-content').value,
                image: document.querySelector('.new-post-images').value
            }),
            headers: {'X-CSRFToken': csrftoken},
            mode: 'same-origin',
        })
        .then(result => {
            console.log(result);
            window.location.reload();
        })
        .catch(error => console.log(error));

    });


    return false;
}

function auto_grow(element) {
    element.style.height = auto;
    element.style.height = (element.scrollHeight) + "px";
}
