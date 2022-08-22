
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
                        e.preventDefault();
                        console.log(post.id);
                        console.log(textarea.value);
                
                        fetch(`edit_post/${curr_id}`, {
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

    num = document.createElement('div');
    btn = document.createElement('button');
    p = document.createElement('p');

    if( button === "like"){
        num.setAttribute('id', 'likes-num');
        btn.setAttribute('id', 'like-btn');
        btn.innerHTML = `Like`;
        p.innerHTML = `${post.likes}`;
    } else if (button === "comment") {
        num.setAttribute('id', 'comments-num');
        btn.setAttribute('id', 'comment-btn');
        btn.innerHTML = `Comment`;
        p.innerHTML = `${post.comments}`;
    }
    

    num.appendChild(btn);
    num.appendChild(p);

    btns.appendChild(num);

}

function editPost(post){
    
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