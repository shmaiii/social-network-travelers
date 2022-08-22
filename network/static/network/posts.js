
function postLayout (posts) {
    document.querySelector('#all-posts').innerHTML = "";
    console.log(posts);

        posts.forEach(post => {
            const eachPost = document.createElement('div');
            eachPost.setAttribute('id', 'each-post');

            const label = document.createElement('label');
            //var a = document.createElement('a');
            //a.setAttribute('href', `{% url 'profile' ${post.post_author} ${post.post_author.id} %}`);
            label.innerHTML = `${post.post_author.username}`;
            label.onclick = function() {
                location.href = `/profile/${post.post_author.username}/${post.post_author.id}`;
            }
            //label.append(a);
            eachPost.appendChild(label);

            if (parseInt(document.querySelector('#view-post').dataset.current_user_id) === parseInt(post.post_author.id)) {
                const editButton = document.createElement('button');
                editButton.innerHTML = 'Edit';
                editButton.setAttribute('id', 'edit-btn');
                eachPost.appendChild(editButton);

                editButton.addEventListener('click', function() {
                    console.log(post.id);
                    console.log(post.content);
                    curr_id = post.id;
                    console.log(curr_id);
                 
                    editForm = document.createElement('form');
                    editForm.setAttribute('id', 'edit-form');
                    textarea = document.createElement('textarea');
                    textarea.classList.add('form-control');
                    textarea.value = `${post.content}`;
                    editForm.append(textarea);
                
                    post = document.createElement('input');
                    post.type = 'submit';
                    post.classList.add('btn', 'btn-primary');
                    post.value = 'Post';
                    editForm.append(post);
                    content.innerHTML = "";
                    content.append(editForm);
                
                    editForm.onsubmit = function(e) {
                        //submit form will auto reload the page, preventDefault to stop automatic reloading
                        e.preventDefault();
                        console.log(post.id);
                        console.log(textarea.value);
                
                        fetch(`http://127.0.0.1:8000/edit_post/${curr_id}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                content: textarea.value
                            }),
                            mode: 'same-origin',
                        })
                        .then(response => {
                            console.log(response);
                            content.innerHTML = `<br>
                            <p>${textarea.value}</p>
                            <hr>`;
                        });
                    }                    
                
                });
            }

            const content = document.createElement('div');
            content.setAttribute('id', 'post-content');
            content.innerHTML = `<br>
            <p>${post.content}</p>
            <hr>`;
            eachPost.appendChild(content);

            btns = document.createElement('div');
            btns.setAttribute('id', 'posts-btns');
            eachPost.appendChild(btns);
            
            button("like", post, btns);
            button("comment", post, btns);


            document.querySelector('#all-posts').appendChild(eachPost);
        });

}

function button (button, post, btns) {

    if( button === "like"){
        numLike = document.createElement('div');
        btnLike = document.createElement('button');
        pLike = document.createElement('p');
        numLike.setAttribute('id', `likes-num`);
        btnLike.setAttribute('id', `like-btn-${post.id}`);

        var url = `http://127.0.0.1:8000/edit_post/${post.id}`;
        fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.liked === "false") {
                document.querySelector(`#like-btn-${post.id}`).innerHTML = `Like`;
            } else {
                document.querySelector(`#like-btn-${post.id}`).innerHTML = `Unlike`;
            }
        })
        

        pLike.setAttribute('class', `pLike`);
        pLike.innerHTML = `${post.likes}`;

        numLike.appendChild(btnLike);
        numLike.appendChild(pLike);
        btns.appendChild(numLike);

        btnLike.addEventListener('click', function(e) {

            e.preventDefault();
            curr_id = post.id;
            var parent = this.closest('#likes-num');
            var pl = parent.lastChild;
            
            if (this.innerText == `Like`){
                fetch(`http://127.0.0.1:8000/edit_post/${curr_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        like: "like"
                    }),
                    mode: 'same-origin',
                })
                .then(response => {
                    likes = parseInt(pl.innerHTML);
                    likes = likes + 1;
                    parent.lastChild.innerHTML = likes;
                    this.innerHTML = `Unlike`;
                });
            }
            else {
                console.log('unlike');
                fetch(`http://127.0.0.1:8000/edit_post/${curr_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        like: "unlike"
                    }),
                    mode: 'same-origin',
                })
                .then(response => {
                    likes = parseInt(pl.innerHTML);
                    likes = likes - 1;
                    parent.lastChild.innerHTML = likes;
                    this.innerHTML = `Like`;
                    
                });

            }
            

        });

    } else if (button === "comment") {
        numComment = document.createElement('div');
        btnComment = document.createElement('button');
        pComment = document.createElement('p');
        numComment.setAttribute('id', 'comments-num');
        btnComment.setAttribute('id', 'comment-btn');
        btnComment.innerHTML = `Comment`;
        pComment.innerHTML = `${post.comments}`;
        numComment.appendChild(btnComment);
        numComment.appendChild(pComment);
        btns.appendChild(numComment);
    }
    

    
    

}

function likePost(post) {
    
}

function paginationSetup(result) {
    if (result.page_num > 1) {

        let current_page = 1;
        console.log(current_page);
        
        let prev = document.createElement('li');
        prev.innerHTML = `<a class="page-link" href="#">Previous</a>`;
        prev.classList.add("page-item");
        prev.onclick = function() {
            current_page --;
            load_posts(current_page);
            // is no previous
            if (current_page === 1) {
                prev.style.display = 'none';
                next.style.display = 'block';
            }
        }
            
        let next = document.createElement('li');
        next.innerHTML = `<a class="page-link" href="#">Next</a>`;
        next.classList.add("page-item");
        next.onclick = function() {
            current_page = current_page + 1;
            console.log(current_page);
            load_posts(current_page);
            // if no next
            if (current_page === result.page_num) {
            prev.style.display = 'block';
            next.style.display = 'none';
        }
        }

        document.querySelector('#pagination').append(prev);
        document.querySelector('#pagination').append(next);

        prev.style.display = 'none';
        next.style.display = 'block';

    } 
}