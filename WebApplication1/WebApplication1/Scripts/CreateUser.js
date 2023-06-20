
isRequired('#fullname')
isRequired('#email')
checkEmail('#email')
isRequired('#password')
minlength('#password', 4)
isRequired('#password_confirmation')
isConfirm('#password_confirmation', '#password')
isRequired('#phone-number')
checkPhoneNumber('#phone-number')

var formElement = document.querySelector('#form-1')
formElement.onclick = function (e) {
    e.preventDefault()
    document.querySelector('.form-submit').onclick = function () {
        if (isRequired('#fullname')
            && isRequired('#email') && isRequired('#password') && minlength('#password', 4)
         && isRequired('#password_confirmation')
         && isConfirm('#password_confirmation', '#password')
         && isRequired('#phone-number')
         && checkPhoneNumber('#phone-number'))
        {
                    console.log("gia tri dung")
                    let fullname = $('#fullname').val();
                    let email = $('#email').val();
                    let password = $('#password').val();
                    let phonenumber = $('#phone-number').val();
                    let data = {
                        fullname: fullname,
                        email: email,
                        phonenumber: phonenumber,
                        password: password
                 }
            console.log(data)
          //  checkName(fullname);
            CreateUser(data);
            
        }
        else {
            alert('thông tin nhập vào không đúng!')
        }
    }
}
CreateUser = (data) => {
    $.ajax ( {
        type: "POST",
        url: "/Home/Create/",
        data:data,
        success: function (respone) {
            console.log(respone)
            if (respone == "1") {
                alert("tạo tài khoản thành công");
                loadHome();
            }
            else {
                alert('tên đăng nhập đã tồn tại')
            }
        }, Error: function (err) {
            alter('có lỗi xảy ra');
            console.log(err)
        }
    })
}



loadHome = () => {
    /// chuyển về trang index
    window.location.href = "login"; //chưa tìm được thông tin chổ này
}