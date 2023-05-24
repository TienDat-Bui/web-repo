

$('.btn-submit').on('click', (e) => {
    e.preventDefault();
    var required = isRequired('#email');
    var checkmail = checkEmail('#email');
    console.log("required:" + required + "  checkmail:" + checkmail)
    if (required && checkmail) {
        var email = $('#email').val();
        reNewPassword(email);
    }
    else
    {
        alert("vui lòng nhập email")
    }
})

const  reNewPassword = (email) => {
    $.ajax({
        type: "POST",
        url: "/home/reNewPassword/",
        data:{ email: email },
        success: function (respone) {
            console.log(respone)
            if (respone == '1') {
                alert("Vui lòng kiểm tra mail để nhận mật khẩu mới")
            }
            else {
                alert("Email chưa tồn tại. Vui lòng kiểm tra email")
            }
            
        },
        Error: function (err) {
            console.log(err);
            alert("có lỗi xảy ra");
        }
    })
}