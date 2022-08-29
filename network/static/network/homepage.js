document.querySelector('#compose-post').style.display = "none";
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#compose-post').style.display = "none";

    document.querySelector('#post-bar').addEventListener('click', new_post);
})

function new_post() {

    document.querySelector('#post-bar').style.display = 'none';
    document.querySelector('#compose-post').style.display = "block";
   
    document.querySelector('#post-form').addEventListener('submit', event => {
        event.preventDefault();

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        fetch('/new_post', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify({
                location: document.querySelector('#location-input').value,
                content: document.querySelector('#compose-content').value,
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
