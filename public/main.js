const categorySelect = document.getElementById('category')
const generateBtn = document.getElementById('generateBtn')
const chatlibContainer = document.getElementById('chatlibContainer')
const submitBtn = document.getElementById('submitBtn')
const outputContainer = document.getElementById('outputContainer')

generateBtn.addEventListener('click', generateChatLib)
submitBtn.addEventListener('click', speakChatLib)

function generateChatLib() {
    const selectedCategory = categorySelect.value
    if (selectedCategory) {
        fetch(`/chatlibs/${selectedCategory}`)
            .then((response) => response.json())
            .then((data) => {
                const chatlib = data.chatlib
                renderChatLib(chatlib)
            })
    }
}

function renderChatLib(chatlib) {
    let chatlibHtml = `<h2>${chatlib.title}</h2>`
    chatlibHtml += `<p>${chatlib.template}</p>`
    chatlibHtml = chatlibHtml.replace(/\[(.*?)]/g, '<input type="text" placeholder="$1">')

    chatlibContainer.innerHTML = chatlibHtml
}