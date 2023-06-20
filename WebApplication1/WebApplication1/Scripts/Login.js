isRequired('#fullname');
isRequired('#password');
minlength('#password', 4);
$('.form-submit').on('click', (e) => {
    e.preventDefault();
    //$('#btn-submit').on('click', () => {
    if (isRequired('#fullname') && isRequired('#password') && minlength('#password', 4)) {
        var fullname = $('#fullname').val();
        var password = $('#password').val();
        console.log(fullname, password);
        localStorage.setItem('userName', fullname);
        LoginUser(fullname, password);
    }
    else {
        alert ("vui lòng nhập tên đăng nhập và mật khẩu")
        }
    //})
})
const LoginUser = (fullname, password) => {
    $.ajax({
        type: "POST",
        url: "/home/LoginUser/",
        data: {
            fullname: fullname,
            password : password
        },
        success: function (respone) {
            console.log(typeof (respone))
            console.log(respone)
            if (respone == '1') {
                console.log('đăng nhập thành công')
                loadHome();
                //alert('đăng nhập thành công');
            }
            else {
                alert("có lỗi - tên đăng nhập hoặc mật khẩu không đúng")
        }
    },
        Error: function (err) {
            console.log(err)
            alert ("có lỗi login")
        }
    })
}


loadHome = () => {
    window.location.href = "home/chat";
}