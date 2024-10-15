window.onload = function(event) {

    const getForm = document.getElementById('get-user-form');
    getForm.addEventListener('submit', fetchUser);

    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async function(event) {register(event)});
        
    const postForm = document.getElementById('create-post-form');
    postForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        let formData = new FormData(event.target);
        let token = formData.get('token');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    body: formData.get('body')
                })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('post-data').innerHTML = `<p>Post Created Successfully!</p>
                                                                  <p><strong>Title:</strong> ${data.title}, <strong>Body:</strong> ${data.body}</p>`;
                await fetchAllPosts(token);

                document.getElementById('title').value = '';
                document.getElementById('body').value = '';
            }

        } catch (error) {
            console.log(error);
        }
    });

    async function register(event){
        event.preventDefault();

        let formData = new FormData(event.target);
        let token = localStorage.getItem("token");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    password_confirmation: formData.get('password_confirm')
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                fetchUser()
            }

        } catch (error) {
            console.log(error);
        }
    }


    async function fetchAllPosts(token) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const posts = await response.json();

            if (response.ok) {
                const postsContainer = document.getElementById('user-posts');
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    postsContainer.innerHTML += `
                        <div class="post">
                            <p>Title: ${post.title}</p>
                            <p>Body: ${post.body}</p>
                        </div>
                    `;
                });
            
            }
        } catch (error) {
            console.log(error);
        }
    }

    const token = document.getElementById('token').value;
    if (token) {
        fetchAllPosts(token);
    }

    async function fetchUser() {

        let token = localStorage.getItem("token");

        try {
            const response = await fetch('http://127.0.0.1:8000/api/userdata', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (response.ok) {

                document.getElementById('post-auth').classList.remove("invisible");
                document.getElementById('pre-auth').classList.add("invisible");

                document.getElementById('user-data').innerHTML = `<p>User: ${data.name}</p>`;

                await fetchAllPosts(token);
            }

        } catch (error) {
           console.log(error);
        }
    }

    fetchUser();
};
