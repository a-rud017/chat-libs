const categorySelect = document.getElementById('category')
const generateBtn = document.getElementById('generateBtn')
const chatlibContainer = document.getElementById('chatlibContainer')
const submitBtn = document.getElementById('submitBtn')
const outputContainer = document.getElementById('outputContainer')
const voiceSelect = document.getElementById('voiceSelect')

generateBtn.addEventListener('click', generateChatLib)
submitBtn.addEventListener('click', speakChatLib)

let currentChatlib = null
let voicesLoaded = false

function loadVoices() {
    const voices = speechSynthesis.getVoices()

    voices.forEach((voice) => {
        const option = document.createElement('option')
        option.value = voice.name
        option.text = `${voice.name} (${voice.lang})`
        voiceSelect.appendChild(option)
    })

    voicesLoaded = true
}

voiceSelect.addEventListener('change', () => {
    const selectedVoice = voiceSelect.value
    setVoice(selectedVoice)
})

function setVoice(voiceName) {
    const voices = speechSynthesis.getVoices()
    const selectedVoice = voices.find((voice) => voice.name === voiceName)
    if (selectedVoice) {
        speechSynthesis.cancel()
        speechSynthesis.voice = selectedVoice
    }
}

window.speechSynthesis.onvoiceschanged = loadVoices

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
    // if (!voicesLoaded) {
    //     alert('Voices are still loading. Please wait a moment and try again.')
    //     return
    // }
    const inputs = chatlibContainer.querySelectorAll('input');
    const title = currentChatlib.title
    let finalChatLib = currentChatlib.template;
  
    inputs.forEach((input) => {
        const value = input.value;
        const placeholder = input.getAttribute('placeholder');
        finalChatLib = finalChatLib.replace(`[${placeholder}]`, value);
    });

    const selectedVoice = voiceSelect.value
    const voices = speechSynthesis.getVoices()
    const voice = voices.find((v) => v.name === selectedVoice)
  
    if (voice) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `${title}. ${finalChatLib}`
        utterance.rate = 0.8
        utterance.voice = voice

        utterance.addEventListener('start', () => {
            setTimeout(() => {
                speechSynthesis.resume()
            }, 500)
        })

        speechSynthesis.speak(utterance);
        outputContainer.textContent = finalChatLib;
    } else {
        alert('Selected voice is not available.')
    }
}