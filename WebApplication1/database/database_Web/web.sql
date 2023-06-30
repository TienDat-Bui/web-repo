-- tạo Database
CREATE DATABASE Web
GO
USE Web
GO
--Tạo bảng Account
CREATE TABLE allAccount
( id INT UNIQUE IDENTITY(1,1),
fullname NVARCHAR(100) NOT NULL,
email VARCHAR(30) UNIQUE NOT NULL,
phone_number CHAR(20),
pass_word CHAR(30)NOT NULL)
GO
ALTER TABLE dbo.allAccount ALTER COLUMN pass_word CHAR (40)
--tạo store proceduce deleteAccount
CREATE PROC UPS_deleteAccount
@id int
AS
BEGIN
	DELETE FROM dbo.allAccount WHERE id = @id
END
GO
 --Tạo Store Proceduce selecAllAccount
CREATE PROC UPS_selecAllACcount
AS
BEGIN
	SELECT *FROM dbo.allAccount
END
GO
-CREATE PROC dbo.UPS_insertAccount
@fullname NVARCHAR(100),@email VARCHAR(30),@phone_number CHAR(20),@pass_word CHAR(40)
AS
BEGIN
	 IF ((SELECT COUNT( *) FROM dbo.allAccount WHERE EXISTS (SELECT * FROM dbo.allAccount WHERE fullname = @fullname))=0)
		BEGIN 
			INSERT INTO	dbo.allAccount(fullname,email,phone_number,pass_word)
			VALUES(@fullname, @email, @phone_number, @pass_word)
		END
END
GO
--tạo store updateAccount
CREATE PROC dbo.UPS_updateAccount
@id INT , @fullname NVARCHAR(100),@email VARCHAR(30),@phone_number CHAR(20),@pass_word CHAR(40)
AS
BEGIN
	UPDATE dbo.allAccount SET	 
	 fullname = @fullname,   -- nvarchar(100)
	 email = @email, 
	 phone_number = @phone_number, -- varchar(30)
	 pass_word = @pass_word  -- char(30)
	 WHERE id =@id
END
GO
 --Tạo Store Proceduce selecAllAccount

--Tạo store procudeuce login
CREATE PROC USP_login 
(@fullname NVARCHAR(100),@password CHAR(40))
AS
BEGIN
SELECT COUNT(*) FROM dbo.allAccount WHERE fullname = @fullname AND pass_word = @password
END
GO  
--cập nhật store tìm kiếm 
CREATE PROC dbo.UPS_updateAccount
@id INT , @fullname NVARCHAR(100),@email VARCHAR(30),@phone_number CHAR(40)
AS
BEGIN
	UPDATE dbo.allAccount SET	 
	 fullname = @fullname,   -- nvarchar(100)
	 email = @email, 
	 phone_number = @phone_number
	 	 WHERE id =@id
END
GO
--tạo store đổi mật khẩu
alter PROC USP_ChangePassword (@id INT ,@password CHAR(50))
AS
BEGIN
UPDATE dbo.allAccount SET pass_word = @password WHERE id = @id
END

EXEC dbo.USP_ChangePassword @id = 4,       -- int
                            @password = '1292201552198220877194054219216496220885' -- char(50)


SELECT * FROM dbo.allAccount