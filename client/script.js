import bot from './assets/bot.svg';
import user from './assets/user.svg';


const form = document.querySelector('form');
const chatContainer = document.querySelector("#chat_container");

//DOT LOADER STARTS
let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}
// DOT LOADER ENDS

//TEST TYPING STARTS

function typeText(element, text){
  let index = 0;

  let interval = setInterval(() => {
    if(index < text.length){
    element.innerHTML += text.charAt(index);
    index++;
  } else {
      clearInterval(interval);
    }
  }, 50)
}

//TEXT TYPING ENDS

//GENERATING UNIQUE ID FOR EACH MESSAGE
function generateUniqueId(){
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16)

  return `id-${timeStamp}-${hexaDecimalString}`;

}
//ENDS


//CHAT STRIPE STARTS
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img
                      src=${isAi ? bot : user}
                      alt="${isAi ? 'bot' : 'user'}"
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form)

  //user's chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //Bot's chatStripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

const response = await fetch('http://localhost:5000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application.json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})
clearInterval(loadInterval)
messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();

  typeText(messageDiv, parsedData);
} else{
  const err = await response.text();

  messageDiv.innerHTML = "Something went wrong";
  alert(err)
}
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){ // keycode 13 is for enter
    handleSubmit(e);
  }
})
//CHAT STRIPE ENDS
