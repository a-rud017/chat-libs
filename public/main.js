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
    return new Promise((resolve, reject) => {
        let voices = speechSynthesis.getVoices();
        if (voices.length !== 0) {
            resolve(voices);
        } else {
            setTimeout(() => {
                voices = speechSynthesis.getVoices();
                resolve(voices);
        }, 1000);
        }
    });
}

function populateVoiceSelect(voices) {
    voices.sort((a, b) => {
        if (a.name === "Samantha") return -1
        if (b.name === "Samantha") return 1
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })

    voiceSelect.innerHTML = ''

    voices.forEach((voice) => {
        const option = document.createElement('option')
        option.value = voice.name
        option.text = `${voice.name} (${voice.lang})`
        voiceSelect.appendChild(option)
    })

    voicesLoaded = true
}

function initializeVoices() {
    loadVoices()
        .then((voices) => {
            populateVoiceSelect(voices)
        })
        .catch((error) => {
            console.error('Error loading voices:', error)
        })
}

function setVoice(voiceName) {
    const voices = speechSynthesis.getVoices()
    const selectedVoice = voices.find((voice) => voice.name === voiceName)
    if (selectedVoice) {
        speechSynthesis.cancel()
        speechSynthesis.voice = selectedVoice
    }
}

initializeVoices()

voiceSelect.addEventListener('change', () => {
    const selectedVoice = voiceSelect.value
    setVoice(selectedVoice)
})

window.speechSynthesis.onvoiceschanged = loadVoices

let speaking = false

function stopSpeaking() {
    if (speaking) {
        speechSynthesis.cancel();
        speaking = false
    }
    

    const controlsContainer = document.getElementById('controlsContainer');
    if (controlsContainer) {
        controlsContainer.remove();
    }
}

function resetChatLib() {
    const submittedChatlibContainer = document.getElementById('submittedChatlibContainer');
    if (submittedChatlibContainer) {
        submittedChatlibContainer.textContent = '';
    }

    const generatedChatlibContainer = document.getElementById('chatlibContainer');
    if (generatedChatlibContainer) {
        generatedChatlibContainer.style.display = 'block';
    }

    outputContainer.textContent = '';
}

function generateChatLib() {
    resetChatLib()
    stopSpeaking()

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

    const submittedChatlibContainer = document.createElement('div')
    submittedChatlibContainer.id = 'submittedChatlibContainer'
    chatlibContainer.appendChild(submittedChatlibContainer)
}

function speakChatLib() {
    stopSpeaking()

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
        speaking = true

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

        const generatedChatlibContainer = document.getElementById('chatlibContainer')
        generatedChatlibContainer.style.display = 'none'

        const submittedChatlibContainer = document.getElementById('submittedChatlibContainer')
        submittedChatlibContainer.style.display = 'block'
        submittedChatlibContainer.textContent = finalChatLib

        const stopButton = document.createElement('button');
        stopButton.classList.add('voice-button')
        stopButton.textContent = 'Stop';
        stopButton.addEventListener('click', () => {
            speechSynthesis.pause();
        });
    
        const resumeButton = document.createElement('button');
        resumeButton.classList.add('voice-button')
        resumeButton.textContent = 'Resume';
        resumeButton.addEventListener('click', () => {
            speechSynthesis.resume();
        });
    
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'controlsContainer';
        controlsContainer.appendChild(stopButton);
        controlsContainer.appendChild(resumeButton);
    
        outputContainer.appendChild(controlsContainer)
    } else {
        alert('Selected voice is not available.')
    }
}

window.addEventListener('beforeunload', () => {
    stopSpeaking()
})