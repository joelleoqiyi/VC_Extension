window.addEventListener('DOMContentLoaded', () => {
    const result = document.getElementById('result');
    const form = document.getElementById('voice-form');
    const speak = document.getElementById('speak-button');

    if(form){
        form.addEventListener('submit', event => {
            event.preventDefault();
            const toSay = result.innerHTML.trim();
            const utterance = new SpeechSynthesisUtterance(toSay);
            speechSynthesis.speak(utterance);
            result.value = '';
          });
    }
})