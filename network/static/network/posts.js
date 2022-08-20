
function postLayout (posts) {
    document.querySelector('#all-posts').innerHTML = "";

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
            }

            const content = document.createElement('div');
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