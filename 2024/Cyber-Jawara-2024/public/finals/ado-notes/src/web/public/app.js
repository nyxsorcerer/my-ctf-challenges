const API_BASE_URL = window.origin // Replace with your actual API base URL

const app = document.getElementById("app")

// Authentication helpers
function isAuthenticated() {
    return localStorage.getItem("isAuthenticated") === "true"
}

function setAuthenticated(value) {
    localStorage.setItem("isAuthenticated", value)
}

// Router
function navigate(route) {
    const routes = {
        "/": checkAuthAndRedirect,
        "/login": renderLoginForm,
        "/register": renderRegisterForm,
        "/notes": checkAuthAndRenderNotes,
        "/notes/create": checkAuthAndRenderCreateNote,
        "/notes/edit": checkAuthAndRenderEditNote,
    }

    const routeFunction = routes[route]
    if (routeFunction) {
        routeFunction()
    } else if (route.startsWith("/notes/edit")) {
        const noteId = route.split("/")[3]
        checkAuthAndRenderEditNote(noteId)
    }else if (route.startsWith("/notes/")) {
        const noteId = route.split("/")[2]
        checkAuthAndViewNote(noteId)
    } else {
        checkAuthAndRedirect()
    }

    history.pushState(null, "", route)
}

// Handle browser back/forward buttons
window.onpopstate = () => {
    const path = window.location.pathname
    navigate(path)
}

// Authentication check and redirect
function checkAuthAndRedirect() {
    if (isAuthenticated()) {
        navigate("/notes")
    } else {
        navigate("/login")
    }
}

function checkAuthAndRenderNotes() {
    if (isAuthenticated()) {
        renderNotesList()
    } else {
        navigate("/login")
    }
}

function checkAuthAndRenderCreateNote() {
    if (isAuthenticated()) {
        renderCreateNoteForm()
    } else {
        navigate("/login")
    }
}

function checkAuthAndRenderEditNote(id) {
    if (isAuthenticated()) {
        renderEditNoteForm(id)
    } else {
        navigate("/login")
    }
}

function checkAuthAndViewNote(id) {
    if (isAuthenticated()) {
        viewNote(id)
    } else {
        navigate("/login")
    }
}

// API calls
async function apiCall(endpoint, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include", // This is crucial for including cookies in the request
    }

    if (body) {
        options.body = new URLSearchParams(body).toString();
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

    if (!response.ok) {
        if (response.status === 401) {
            setAuthenticated(false)
            navigate("/login")
            throw new Error("Authentication required")
        }
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
}

// User actions
async function login(username, password) {
    try {
        await apiCall("/api/user/login", "POST", { username, password })
        setAuthenticated(true)
        navigate("/notes")
    } catch (error) {
        alert("Login failed: " + error.message)
    }
}

async function register(username, password) {
    try {
        await apiCall("/api/user/register", "POST", { username, password })
        alert("Registration successful. Please login.")
        navigate("/login")
    } catch (error) {
        alert("Registration failed: " + error.message)
    }
}

async function logout() {
    try {
        await apiCall("/api/user/logout", "POST")
        setAuthenticated(false)
        navigate("/login")
    } catch (error) {
        alert("Logout failed: " + error.message)
        // Even if the logout fails on the server, we'll log out the user locally
        setAuthenticated(false)
        navigate("/login")
    }
}

// Note actions
async function createNote(title, content) {
    try {
        await apiCall("/api/notes", "POST", { title, content })
        navigate("/notes")
    } catch (error) {
        alert("Failed to create note: " + error.message)
    }
}

async function updateNote(id, title, content) {
    try {
        await apiCall(`/api/notes/${id}`, "PUT", { title, content })
        navigate("/notes")
    } catch (error) {
        alert("Failed to update note: " + error.message)
    }
}

async function deleteNote(id) {
    try {
        await apiCall(`/api/notes/${id}`, "DELETE")
        navigate("/notes")
    } catch (error) {
        alert("Failed to delete note: " + error.message)
    }
}

async function searchNotes(query, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const data = (await apiCall(`/api/notes/search?search=${encodeURIComponent("%"+query+'%')}&page=1`)).data;
            renderNotesList(data);
            return; // Success, exit the function
        } catch (error) {
            retries++;
            if (retries >= maxRetries) {
                alert(`Failed to search notes after ${maxRetries} attempts: ${error.message}`);
            } else {
                console.log(`Search attempt ${retries} failed, retrying...`);
                await new Promise(resolve => setTimeout(resolve, 1000 * retries)); // Wait before retrying
            }
        }
    }
}

function downloadNote(id) {
    window.open(`${API_BASE_URL}/download/${id}`, "_blank")
}

// Render functions
function renderLoginForm() {
    app.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div class="p-8">
                <h2 class="text-2xl font-bold mb-4">Login</h2>
                <form id="login-form">
                    <input type="text" id="login-username" placeholder="username" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                    <input type="password" id="login-password" placeholder="Password" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                    <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline">Login</button>
                </form>
                <p class="mt-4 text-center">
                    Don't have an account? <a href="#" onclick="navigate('/register'); return false;" class="text-blue-500">Register</a>
                </p>
            </div>
        </div>
    `
    document.getElementById("login-form").addEventListener("submit", (e) => {
        e.preventDefault()
        const username = document.getElementById("login-username").value
        const password = document.getElementById("login-password").value
        login(username, password)
    })
}

function renderRegisterForm() {
    app.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div class="p-8">
                <h2 class="text-2xl font-bold mb-4">Register</h2>
                <form id="register-form">
                    <input type="username" id="register-username" placeholder="username" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                    <input type="password" id="register-password" placeholder="Password" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                    <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline">Register</button>
                </form>
                <p class="mt-4 text-center">
                    Already have an account? <a href="#" onclick="navigate('/login'); return false;" class="text-blue-500">Login</a>
                </p>
            </div>
        </div>
    `
    document.getElementById("register-form").addEventListener("submit", (e) => {
        e.preventDefault()
        const username = document.getElementById("register-username").value
        const password = document.getElementById("register-password").value
        register(username, password)
    })
}

async function renderNotesList(notes = null) {
    if (!notes) {
        try {
            notes = (await apiCall("/api/notes/search?search=%25%25&page=1")).data
        } catch (error) {
            alert("Failed to fetch notes: " + error.message)
            return
        }
    }

    app.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold">Notes</h2>
                <button onclick="logout()" class="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline">Logout</button>
            </div>
            <div class="mb-4">
                <input type="text" id="search-input" placeholder="Press Enter to Search Notes" class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
            </div>
            <button onclick="navigate('/notes/create')" class="mb-4 px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline">Create New Note</button>
            <div id="notes-list" class="space-y-4"></div>
        </div>
    `

    const notesList = document.getElementById("notes-list")
    if(notes !== undefined){
        notes.forEach((note) => {
            const noteElement = document.createElement("div")
            noteElement.className =
                "bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            noteElement.innerHTML = `
              <div class="p-4">
                  <h3 class="text-xl font-semibold mb-2">${note.title}</h3>
                  <p class="text-gray-600 mb-4">${note.content.substring(0, 100)}</p>
              </div>
          `
            noteElement.addEventListener("click", () => navigate(`/notes/${note.id}`))
            notesList.appendChild(noteElement)
        })
    }

    document.getElementById("search-input").addEventListener("keyup", (e) => {
        if(e.key === 'Enter'){
            searchNotes(e.target.value)
        }
    })
}

function renderCreateNoteForm() {
    app.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
            <div class="p-8">
                <h2 class="text-2xl font-bold mb-4">Create Note</h2>
                <form id="create-note-form">
                    <input type="text" id="note-title" placeholder="Title" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline">
                    <textarea id="note-content" placeholder="Content" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" rows="5"></textarea>
                    <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline">Create Note</button>
                </form>
                <button onclick="navigate('/notes')" class="mt-4 w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline">Cancel</button>
            </div>
        </div>
    `
    document.getElementById("create-note-form").addEventListener("submit", (e) => {
        e.preventDefault()
        const title = document.getElementById("note-title").value
        const content = document.getElementById("note-content").value
        createNote(title, content)
    })
}

async function renderEditNoteForm(id) {
    try {
        const note = (await apiCall(`/api/notes/${id}`)).data
        app.innerHTML = `
          <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
              <div class="p-8">
                  <h2 class="text-2xl font-bold mb-4">Edit Note</h2>
                  <form id="edit-note-form">
                      <input type="text" id="edit-note-title" placeholder="Title" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" value="${note.title}">
                      <textarea id="edit-note-content" placeholder="Content" required class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" rows="5">${note.content}</textarea>
                      <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline">Update Note</button>
                  </form>
                  <button onclick="navigate('/notes')" class="mt-4 w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline">Cancel</button>
              </div>
          </div>
      `
        document.getElementById("edit-note-form").addEventListener("submit", (e) => {
            e.preventDefault()
            const title = document.getElementById("edit-note-title").value
            const content = document.getElementById("edit-note-content").value
            updateNote(note.id, title, content)
        })
    }catch (error) {
        alert("Failed to fetch note: " + error.message)
        navigate("/notes")
    }
}

async function viewNote(id) {
    try {
        const note = (await apiCall(`/api/notes/${id}`)).data
        app.innerHTML = `
            <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4">
                <div class="p-8">
                    <h2 class="text-3xl font-bold mb-4">${note.title}</h2>
                    <p class="text-gray-700 mb-6">${note.content}</p>
                    <div class="flex justify-between">
                        <button onclick="navigate('/notes/edit/${note.id}');" class="px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline">Edit</button>
                        <button onclick="deleteNote(${note.id})" class="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline">Delete</button>
                        <button onclick="downloadNote(${note.id})" class="px-4 py-2 font-bold text-white bg-purple-500 rounded-full hover:bg-purple-700 focus:outline-none focus:shadow-outline">Download</button>
                    </div>
                    <button onclick="navigate('/notes')" class="mt-4 w-full px-4 py-2 font-bold text-white bg-gray-500 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline">Back to Notes</button>
                </div>
            </div>
        `
    } catch (error) {
        alert("Failed to fetch note: " + error.message)
        navigate("/notes")
    }
}

// Initialize the app
function init() {
    const path = window.location.pathname
    navigate(path)
}

init()

