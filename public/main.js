const categorySelect = document.getElementById('category')
const generateBtn = document.getElementById('generateBtn')
const chatlibContainer = document.getElementById('chatlibContainer')
const submitBtn = document.getElementById('submitBtn')
const outputContainer = document.getElementById('outputContainer')

generateBtn.addEventListener('click', generateChatLib)
submitBtn.addEventListener('click', speakChatLib)

let currentChatlib = null

function generateChatLib() {
    const selectedCategory = categorySelect.value
    if (selectedCategory) {
        fetch(`/chatlibs/${selectedCategory}`)
            .then((response) => response.json())
            .then((data) => {
                const chatlib = data.chatlib
                currentChatlib = chatlib
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

function speakChatLib() {
    const inputs = chatlibContainer.querySelectorAll('input');
    const title = currentChatlib.title
    let finalChatLib = currentChatlib.template;
  
    inputs.forEach((input) => {
        const value = input.value;
        const placeholder = input.getAttribute('placeholder');
        finalChatLib = finalChatLib.replace(`[${placeholder}]`, value);
    });
  
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = `${title}. ${finalChatLib}`

    utterance.addEventListener('start', () => {
        setTimeout(() => {
            speechSynthesis.resume()
        }, 500)
    })

    speechSynthesis.speak(utterance);
    outputContainer.textContent = finalChatLib;
}