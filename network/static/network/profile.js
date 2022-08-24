//const user_id = document.querySelector('#personal-info').dataset.user_id;
//console.log(user_id);

function followButton () {
    let follow_btn = document.querySelector('#follow-btn');

    //follow_btn.addEventListener('click', function() {
        if (follow_btn.innerText !== 'Follow') {
           follow_btn.innerHTML = 'Follow';


            fetch(`/follow/${user_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    follow: "unfollow"
                }),
                mode: 'same-origin',
            })
            .then(response => console.log(response));
        }
        else {
            follow_btn.innerHTML = 'Unfollow';

            fetch(`/follow/${user_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    follow: "follow"
                }),
                mode: 'same-origin',
            })
            .then(response => console.log(response));
        }
    //});
}

function load_posts(current_page) {
    fetch(`${user_id}/posts?page=${current_page}`)
    .then(response => response.json())
    .then (posts => {
        console.log(posts);
        postLayout(posts);
    });
}

function pagination() {
    fetch(`${user_id}/page`)
    .then(response => response.json())
    .then(result => {
        console.log(result);
        paginationSetup(result);
    })
}

