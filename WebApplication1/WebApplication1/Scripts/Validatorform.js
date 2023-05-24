
/**validate form */
function isRequired(selector) {
    var inputElement = document.querySelector(selector)
    var parent = inputElement.parentElement
    if (inputElement) {

        inputElement.onblur = function () {
            if (inputElement.value == "") {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = 'vui lòng nhập trường này'
            }
        }
        inputElement.oninput = function () {
            parent.classList.remove('invalid')
            parent.querySelector('.form-message').innerText = ''
        }
    }
    if (inputElement.value != "") {
        return true
    }
}
//kiểm tra độ dài mật khẩu
function minlength(selector, min) {
    var inputElement = document.querySelector(selector)
    var parent = inputElement.parentElement
    if (inputElement) {
        inputElement.oninput = function () {
            console.log(inputElement.value.length)
            if (inputElement.value.length < min) {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = (`Mật khẩu tối thiểu ${min} kí tự`)
            }
            else {
                parent.classList.remove('invalid')
                parent.querySelector('.form-message').innerText = ""
            }
        }
    }
    if (inputElement.value.length >= min) {
        return true;
    }
}
//kiểm tra giá trị nhập lại mật khẩu
function isConfirm(selector1, selector2) {
    var inputElement1 = document.querySelector(selector1)
    var inputElement2 = document.querySelector(selector2)
    var parent1 = inputElement1.parentElement
    var parent2 = inputElement2.parentElement
    if (inputElement1) {
        inputElement1.onchange = function () {
            if (inputElement1.value !== inputElement2.value) {
                parent1.classList.add('invalid')
                parent1.querySelector('.form-message').innerText = (`Mật khẩu không đúng`)
            }
            else {
                return true;
            }
        }
    }
    if (inputElement1.value == inputElement2.value) {
        return true;
    }
}
//kiểm tra định dạng emmail
function checkEmail(selector) {
    var regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var inputElement = document.querySelector(selector)
    var parent = inputElement.parentElement
    if (inputElement) {
        inputElement.onblur = function () {
            if (inputElement.value == "") {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = 'vui lòng nhập trường này'
            }
            if (!regexEmail.test(inputElement.value)) {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = (`vui lòng nhập đúng định dạng`)
            }
        }
    }
    if (inputElement.value != "" && regexEmail.test(inputElement.value)) {
        return true;
    }
}
function checkPhoneNumber(selector) {
    const regexPhone = /([0]{1})([0-9]{9})/
    var inputElement = document.querySelector(selector)
    var parent = inputElement.parentElement
    if (inputElement) {
        inputElement.onblur = function () {
            if (inputElement.value == "") {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = 'vui lòng nhập trường này'
                return inputElement.value
            }
            if (!regexPhone.test(inputElement.value)) {
                parent.classList.add('invalid')
                parent.querySelector('.form-message').innerText = (`Số điện thoại không đúng`)
                return false
            }
        }
    }
    if (inputElement.value != "" && regexPhone.test(inputElement.value)) {
        return true;
    }
}