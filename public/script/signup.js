function validateForm() {
		
    const email = document.getElementById('email').value.trim()
    const name = document.getElementById('name').value.trim()
    const password = document.getElementById('password').value.trim()
    const passwordConfirm = document.getElementById('Password_Confirm').value.trim()


    if(email === ''){
        document.getElementById('messageShow').innerHTML =("Please fill email address")
        return false
    }
    else if(name === ''){
        document.getElementById('messageShow').innerHTML =("Please fill name")
        return false
    }
    else if(password === ''){
        document.getElementById('messageShow').innerHTML = ("Please fill password")
        return false
    }

    else if (password.length < 8) {
    document.getElementById('messageShow').innerHTML = 'The password must contain at least 8 characters.';
    return false; 
    }
    else if (password.length > 20) {
    document.getElementById('messageShow').innerHTML = 'The password must contain at most 20 characters.';
    return false; 
    }

    else if (!/[A-Z]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The password must contain at least one Capital letter.';
    return false;
    }
    else if (!/[a-z]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The password must contain at least one small letter.';
    return false;		
    }
    else if (!/\d/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The password must contain at least one Number.';
    return false;		
    }
    else if (!/[$@$!%*?&]/.test(password)) {
        document.getElementById('messageShow').innerHTML = 'The password must contain at least one symbol.';
    return false;		
    }
    else if(password !== passwordConfirm){
        document.getElementById('messageShow').innerHTML = "The password must match with confirm password."
        return false;
    }

    return true;
}