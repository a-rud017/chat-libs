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
    let finalChatLib = currentChatlib.template;
  
    inputs.forEach((input) => {
      const value = input.value;
      const placeholder = input.getAttribute('placeholder');
      finalChatLib = finalChatLib.replace(`[${placeholder}]`, value);
    });
  
    const utterance = new SpeechSynthesisUtterance(finalChatLib);
    speechSynthesis.speak(utterance);
    outputContainer.textContent = finalChatLib;
  }
  
  



// function speakChatLib() {
//     const inputs = chatlibContainer.querySelectorAll('input');
//     const chatlibTemplate = chatlibContainer.querySelector('p').innerHTML;
//     let finalChatLib = chatlibTemplate;
  
//     inputs.forEach((input) => {
//       const value = input.value;
//       const placeholder = input.getAttribute('placeholder');
//       finalChatLib = finalChatLib.replace(`[${placeholder}]`, value);
//     });
  
//     finalChatLib = stripHTML(finalChatLib); // Strip HTML tags from the final chatlib
  
//     const utterance = new SpeechSynthesisUtterance(finalChatLib);
//     speechSynthesis.speak(utterance);
//     outputContainer.textContent = finalChatLib;
//   }
  
  

function stripHTML(html) {
    const tmpElement = document.createElement('div');
    tmpElement.innerHTML = html;
    return tmpElement.textContent || tmpElement.innerText || '';
}