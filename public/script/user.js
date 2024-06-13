function validateUser() {
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const mobileNumber = document.getElementById('mobileNumber').value.trim()

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileNumPattern = /^[0-9]+$/;
    const namePattern = /^[A-Za-z\s]+$/;

    if (!namePattern.test(name)) {
        document.getElementById('messageShow').innerHTML = 'The name should not contain numbers or special characters.';
        return false; 
    }
    else if(name.length <2 ){
        document.getElementById('messageShow').innerHTML = ("The name should contain more than one character.")
        return false
    }
    if (!emailPattern.test(email)) {
        errorMessageContainer.innerHTML = 'Please enter a valid email address.';
        return false;
    }
    if (!mobileNumPattern.test(mobileNumber)) {
    document.getElementById('messageShow').innerHTML = 'The mobile number should contain numbers only.';
    return false; 
    }
    else if (mobileNumber.length > 10 || mobileNumber.length < 10) {
    document.getElementById('messageShow').innerHTML = 'The mobile number should contain exactly 10 numbers.';
    return false; 
    }

    return true;

}