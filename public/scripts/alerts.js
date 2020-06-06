
const hideSuccess = () => {
    let message = document.querySelector('.success')
    if(message)
        message.hidden = true;
}

setTimeout( hideSuccess, 3000);