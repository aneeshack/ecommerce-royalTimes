function validatePassword() {
    const password = document.getElementById('newpassword').value.trim()
    const passwordConfirm = document.getElementById('Password_Confirm').value.trim()
    const messageShow = document.getElementById('messageShow');

    messageShow.classList.add('d-none'); 

    if(password === ''){
        document.getElementById('messageShow').innerHTML = ("Please fill New password")
        messageShow.classList.remove('d-none');
        return false
    }

    else if (password.length < 8) {
    document.getElementById('messageShow').innerHTML = 'The New password must contain at least 8 characters.';
    messageShow.classList.remove('d-none');
    return false; 
    }
    else if (password.length > 20) {
    document.getElementById('messageShow').innerHTML = 'The New password must contain at most 20 characters.';
    messageShow.classList.remove('d-none');
    return false; 
    }

    else if (!/[A-Z]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The New password must contain at least one Capital letter.';
        messageShow.classList.remove('d-none');
        return false;
    }
    else if (!/[a-z]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The New password must contain at least one small letter.';
        messageShow.classList.remove('d-none');
        return false;		
    }
    else if (!/\d/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The New password must contain at least one Number.';
        messageShow.classList.remove('d-none');
        return false;		
    }
    else if (!/[$@$!%*?&]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The New password must contain at least one symbol.';
        messageShow.classList.remove('d-none');
        return false;		
    }
    else if(password !== passwordConfirm){
        document.getElementById('messageShow').innerHTML = "The New password must match with confirm password."
        messageShow.classList.remove('d-none');
        return false;
    }

    return true;

}