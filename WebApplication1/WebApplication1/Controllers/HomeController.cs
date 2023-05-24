using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Net.Mail;
using System.Net;

namespace WebApplication1.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult CreateAccount()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Login()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        public ActionResult Forgetpass()
        {
            return View();
        }

        public object getAllAccount()
        {
            string queryString = "EXEC dbo.UPS_selecAllACcount";
            DataTable dt = ExcuteQuery(queryString);
            //chuyển table thành json
            List<Dictionary<string, object>> rows = GetTableRows(dt);
            var json = Json(rows, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }
        public object Search(string s)
        {
            string queryString = "SELECT *FROM dbo.allAccount WHERE  fullname LIKE '%"+s+"%'";
            DataTable dt = ExcuteQuery(queryString);
            //chuyển table thành json
            List<Dictionary<string, object>> rows = GetTableRows(dt);
            var json = Json(rows, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = int.MaxValue;
            return json;
        }
        public object Create(string fullname,string email,string phonenumber,string password)
        {
            var hasPass = EncodePassword(password);
            string queryString = "EXEC dbo.UPS_insertAccount @fullname = N'"+fullname+"',@email = '"+ email+"', @phone_number ='"+ phonenumber+"', @pass_word ='"+ hasPass + "'";
            var result = ExcuteNonQuery(queryString);
            return result;
        }
        public object DeleteUser(int id)
        {
            string queryString = "EXEC UPS_deleteAccount @id ="+id;
            var result = ExcuteNonQuery(queryString);
            return result;
        }
        public object UpdateUser(int id, string fullname, string email, string phone_number)
        {
            string queryString = "EXEC dbo.UPS_updateAccount @id ="+ id+", @fullname = N'"+fullname+"',@email = '"+ email + "',@phone_number ='"+ phone_number+ "'" ;
            var result = ExcuteNonQuery(queryString);
            return result;
        }
        public int ChangePassword(int id,string password)
        {
            var hasPass = EncodePassword(password);
            string queryString = "EXEC dbo.USP_ChangePassword @id = " + id + ", @password = '" + hasPass + "'";
            var result = ExcuteNonQuery(queryString);
            return result;
        }
        public object LoginUser(string fullname, string password)
        {
           var hasPass =  EncodePassword(password);
            string queryString = "EXEC dbo.USP_login @fullname = N'" + fullname + "',@password = '" + hasPass + "'";
            var result = ExcuteScalar(queryString);
            return result;
        }
        public int reNewPassword(string email)
        {
            var newPass = RandomPass(4);
            var hasPass = EncodePassword(newPass);
            string queryString = "UPDATE dbo.allAccount SET pass_word = '" + hasPass + "' WHERE email = '" + email + "'";
            var result = ExcuteNonQuery(queryString);
            if (result == 1)
            {
                SendEmail(email, newPass);
                return result;
            }
            else
            {
                return result;
            }
        }
        /* tạo connectstring*/
        private string _connectionString = ConfigurationManager.ConnectionStrings["SQLconnectionString"].ConnectionString;

        //hàm ExcuteQuery : làm việc với database - hiển thị tất cả các kết quả truy vấn 
        DataTable ExcuteQuery (string queryString)
        {
            SqlConnection con = new SqlConnection(_connectionString);
            SqlCommand cmd = new SqlCommand(queryString, con);
            DataTable dt = new DataTable();
            SqlDataAdapter da = new SqlDataAdapter(cmd);
            con.Open();
            da.Fill(dt);
            con.Close();
            return dt;
        }
        //hàm ExceteNonQuery: làm việc với database - hiển thị số dòng bị ảnh hưởng
       int ExcuteNonQuery (string queryString)
        {
            DataTable dt = new DataTable();
            SqlConnection con = new SqlConnection(_connectionString);
            SqlCommand cmd = new SqlCommand(queryString, con);
            SqlDataAdapter da = new SqlDataAdapter();
            con.Open();
            var result = cmd.ExecuteNonQuery(); // trả về số dòng bị ảnh hưởng
            con.Close();
            return result;
        }
        // hàm excuteScalar: làm việc với database- hiển thị dòng đầu tiên của kết quả truy vấn
        object ExcuteScalar(string queryString)
        {
            SqlConnection con = new SqlConnection(_connectionString);
            SqlCommand cmd = new SqlCommand(queryString, con);
            SqlDataAdapter da = new SqlDataAdapter();
            con.Open();
            var result = cmd.ExecuteScalar();
            con.Close();
            return result;
        }

        //Hàm chuyển table thành List dạng key:value
        public List<Dictionary<string, object>> GetTableRows(DataTable table)
        {
            List<Dictionary<string, object>> listRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> rows = null;
            foreach (DataRow rs in table.Rows)
            {
                rows = new Dictionary<string, object>();
                foreach (DataColumn cl in table.Columns)
                {
                    rows.Add(cl.ColumnName, rs[cl]);
                }
                listRow.Add(rows);
            }
            return listRow;
        }
        //hàm mã hóa mật khẩu
        string EncodePassword (string password)
        {
            byte[] temp = ASCIIEncoding.ASCII.GetBytes(password);
            byte[] hasData = new MD5CryptoServiceProvider().ComputeHash(temp);
            string hasPass = "";
            foreach (byte item in hasData)
            {
                hasPass += item.ToString();
            }
            return hasPass;
        }
        // hàm tạo ngẫu nhiên mật khẩu mới
        string RandomPass(int numberRD)
        {
            string newPass = "";
            Random random = new Random();
          string[] temp = new string[numberRD];
            for (int i = 0; i < numberRD; i++)
            {
                temp[i] += Convert.ToChar((Convert.ToInt32(random.Next(65, 126)))).ToString();
                
            }
            newPass = string.Join("", temp);
            return newPass;
        }
        public string SendEmail(string email,string newPass)
        {// send mail thông qua gmail
         // tạo biến  chứa các thông tin người gửi, người nhận, mk, subject, nội dụng
            const string fromPassword = "rglixehbkrcprwao";
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress("buidat386@gmail.com", "DATBUI");
            mail.To.Add(email.ToString());
            mail.Subject = "Cấp lại mật khẩu mới";
            mail.Body = "Mật khẩu mới của bạn là:  \n"+ newPass+"\n Vui lòng đổi lại mật khẩu mới";
            //khai báo host gmail
            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            smtp.EnableSsl = true;
            smtp.Port = 587;
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Credentials = new NetworkCredential(mail.From.Address, fromPassword);// form gmail của sender, mk của sender
            try
            {
                smtp.Send(mail.From.ToString(),mail.To.ToString(),mail.Subject,mail.Body);
                return "OK-đã send mail";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
    }
}
