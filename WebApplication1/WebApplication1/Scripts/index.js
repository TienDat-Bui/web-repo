$(document).ready(function () {
    loadUser();
    app();
})

const app = (() => {
    //sự kiện ấn vào nút delete
    $('body').on('click', '.delete-user', (e) => {
        $(".update").attr("style", "display:none")
        let { id } = e.target.dataset;
        console.log(id)
        var result = confirm("Xác nhận xóa tài khoản");
        console.log(result);
        if (result) {
            DeleteUser(id)
        } 
    });
    //sự kiện update thông tin
    $('body').on('click', '.update-user', (e) => {
        //hiện form cập nhật thông tin
        $(".update").removeAttr("style")
        //ẩn đi form đổi mật khẩu nếu có
        $(".changePassword").attr("style", "display:none")
        let { id, fullname, email, phone_number } = e.target.dataset;
        //hiển thị thông tin lên form cập nhật dữ liệu
        $("#id").val(id);
        $("#fullname").val(fullname);
        $("#email").val(email);
        $('#phone_number').val(phone_number);
        // check validate
        isRequired('#fullname');
        isRequired('#email');
        checkEmail('#email');
        isRequired('#phone_number');
        checkPhoneNumber('#phone_number');
    })
    //submit update
    $(".btn-update").click((e) => {
        e.preventDefault();
        if (isRequired('#fullname') && isRequired('#email') && isRequired('#phone_number') && checkPhoneNumber('#phone_number'))
        {
                id = $("#id").val(),
                fullname = $("#fullname").val(),
                email = $("#email").val(),
                phone_number = ($('#phone_number').val()),
                console.log(phone_number)
            let data = {
                id: id,
                fullname: fullname,
                email: email,
                phone_number: phone_number,
            }
            UpdateUser(data);
            $(".update").attr("style", "display:none")
        }
        else {
           alert("cập nhật không thành công")
        }
    });
    //sự kiện đổi mật khẩu
    $('body').on('click', '.change-password', (e) => {
        $(".changePassword").removeAttr("style")
        $(".update").attr("style", "display:none")
        let { id, fullname, email } = e.target.dataset;
        console.log(id, fullname, email)
        //hiển thị thông tin lên form chỉnh sửa
        $("#idchange").val(id);
        $("#fullnamechange").val(fullname);
        $("#emailchange").val(email);
        $('#passwordchange').val('');
        $('#password_confirmationchange').val('');
        //validate dữ liệu
        isRequired('#passwordchange')
        minlength('#passwordchange', 4)
        isRequired('#password_confirmationchange')
        isConfirm('#password_confirmationchange', '#passwordchange')
    })
    //submit đổi mật khẩu
    $(".btn-changePassword").click((e) => {
        e.preventDefault();
        $(".update").attr("style", "display:none")
        // console.log("ấn nút submit")
        if (isRequired('#passwordchange') && minlength('#passwordchange', 4) && isRequired('#password_confirmationchange') && isConfirm('#password_confirmationchange', '#passwordchange')) {
            let id = $("#idchange").val();
            let password = $('#passwordchange').val();
            let data =
                { id: id,
                password: password}
            ChangePassword(data);
            $(".changePassword").attr("style", "display:none")
        }
        else {
            alert("cập nhật không thành công")
        }
    });
    //tìm kiếm
    $(".input-search").on('input', (e) => {
       // console.log(e.target)
        $(".update").attr("style", "display:none")
        $(".changePassword").attr("style", "display:none")
        let s = $(".input-search").val();
        Search(s);
    })
});
 
    //hiển thị tất cả các user
const loadUser = () => {
    $.ajax({
        type: "post",
        url: "/home/getallaccount",
        success: function (respone) {
          //  console.log(respone)
            let tem = ` <table class="table table-hover table-all" >
            <thead class="thead-dark">
                <tr>
                    <th>STT</th>
                    <th>Tên đăng nhập</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                   
                </tr>
            </thead>`
            for (let i = 0; i < respone.length; i++) {
                tem += `<tr>
                    <td>${i + 1}</td>
                    <td>${respone[i].fullname}</td>
                    <td>${respone[i].email}</td>
                    <td>${respone[i].phone_number}</td>
                   
                    <td><a  class="delete-user" data-id=${respone[i].id}>xóa</a></td>
                    <td><a  class="update-user" data-id=${respone[i].id} data-fullname=${respone[i].fullname} data-email=${respone[i].email} data-phone_number=${respone[i].phone_number} /data-password=${respone[i].pass_word} data-gender=${respone[i].gender} >cập nhật</a></td>
                    <td><a  class="change-password" data-id=${respone[i].id} data-fullname=${respone[i].fullname} data-email=${respone[i].email} data-password=${respone[i].pass_word} >đổi mật khẩu</a></td>
                </tr>`
            }
            tem = tem + '</table>'
            $('#tb_grid').html(tem)
        },
        Error: function (err) {
            alter('có lỗi xảy ra');
            console.log(err)
        }
    })
}
//xóa tài khoản
const DeleteUser = (id) => {
        $.ajax({
            type: "POST",
            url: "/Home/DeleteUser/",
            data: {id:id},
            success: function (respone) {
                console.log(respone),
                    loadUser()
            },
            Error: function (err) {
                alert('có lỗi xảy ra');
                console.log(err)
            }


        })
}
//cập nhật thông tin
const UpdateUser = (data) => {
    $.ajax({
        type: 'POST',
        url: '/home/UpdateUser/',
        //data: data,
        data: data,
        success: function (respone) {
            loadUser();
            alert("Cập nhật thành công")

        },
        error: function (err) {
            alert('Có lỗi xảy ra');
            console.log(err);
        },
    });
};
//tìm kiếm
const Search = (s) => {
    $.ajax({
        type: 'POST',
        url: '/home/search/',
        data: { s: s },
        success: function (respone) {
            console.log(respone);
            let tem = ` <table class="table table-hover table-all" >
            <thead class="thead-dark">
                <tr>
                    <th>STT</th>
                    <th>Tên đăng nhập</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    
                </tr>
            </thead>`
            for (let i = 0; i < respone.length; i++) {
                tem += `<tr>
                    <td>${i + 1}</td>
                    <td>${respone[i].fullname}</td>
                    <td>${respone[i].email}</td>
                    <td>${respone[i].phone_number}</td>
                   
                    <td><a  class="delete-user" data-id=${respone[i].id}>xóa</a></td>
                    <td><a  class="update-user" data-id=${respone[i].id} data-fullname=${respone[i].fullname} data-email=${respone[i].email} data-phone_number=${respone[i].phone_number} data-password=${respone[i].pass_word} data-gender=${respone[i].gender} >cập nhật</a></td>
                    <td><a  class="change-password" data-id=${respone[i].id} data-email=${respone[i].email} data-password=${respone[i].pass_word} >đổi mật khẩu</a></td>
                </tr>`
            }
            tem = tem + '</table>'
            $('#tb_grid').html(tem)
        },
        Error: function (err) {
            alter('có lỗi xảy ra');
            console.log(err)
        }
    })
}
//đổi mật khẩu
const ChangePassword = (data) => {
    $.ajax({
        type: "POST",
        url: "/home/ChangePassword",
        data:data,
        success: function (respone) {
            console.log(respone);
            if (respone == '1') {
                alert('Đổi mật khẩu thành công');
            }
            else {
                alert('Đổi mật khẩu không thành công');
            }
        },
        error: function (err) {
            console.log(err)
            alert('có lỗi xảy ra');
        }
      })
}




