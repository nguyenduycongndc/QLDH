
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace QuanLyDonHang.Common.Utils
{
    public class Util
    {
        //đổi đầu số +84 = 0
        public static string convertPhone(string phonenumber)
        {
            if (phonenumber.Contains("+84"))
            {
                int length = phonenumber.Length - 3;
                phonenumber = "0" + phonenumber.Substring(3, length);
            }
            return phonenumber;
        }

        //check định dạng sđt
        public static bool validPhone(string phone)
        {
            return Regex.Match(phone, @"^0[1-9]{1}[0-9]{8}$").Success;
        }

        //check định dạng số
        public static bool validNumber(string number)
        {
            // \d bắt buộc là số, dấu + bắt buộc xuất hiện 1 lần
            return Regex.Match(number, @"^[\d]+$").Success;
        }

        //check định dạng IMEI
        public static bool validImei(string number)
        {
            // \d bắt buộc là số, {15} bắt buộc đúng 15 số
            return Regex.Match(number, @"^[\d]{15}$").Success;
        }


        public static string CreateMD5(string input)
        {
            //bam du lieu
            // Use input string to calculate MD5 hash
            using (System.Security.Cryptography.MD5 md5 = System.Security.Cryptography.MD5.Create())
            {
                byte[] inputBytes = System.Text.Encoding.ASCII.GetBytes(input);
                byte[] hashBytes = md5.ComputeHash(inputBytes);

                // Convert the byte array to hexadecimal string
                System.Text.StringBuilder sb = new System.Text.StringBuilder();
                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }
        public static string CheckNullString(string input)
        {
            string output = "";
            try
            {
                output = input.ToString();
            }
            catch
            {

            }
            return output;
        }
        private static readonly string[] VietNamChar = new string[]
{
        "aAeEoOuUiIdDyY",
        "áàạảãâấầậẩẫăắằặẳẵ",
        "ÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴ",
        "éèẹẻẽêếềệểễ",
        "ÉÈẸẺẼÊẾỀỆỂỄ",
        "óòọỏõôốồộổỗơớờợởỡ",
        "ÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠ",
        "úùụủũưứừựửữ",
        "ÚÙỤỦŨƯỨỪỰỬỮ",
        "íìịỉĩ",
        "ÍÌỊỈĨ",
        "đ",
        "Đ",
        "ýỳỵỷỹ",
        "ÝỲỴỶỸ"
};
        private static readonly string[] VietNamCharFile = new string[]
{

        "aA",
        "ã",
        "Ã",
};
        public static string ConvertsExportFile(string str)
        {
            //Thay thế và lọc dấu từng char      
            for (int i = 1; i < VietNamCharFile.Length; i++)
            {
                for (int j = 0; j < VietNamCharFile[i].Length; j++)
                    str = str.Replace(VietNamCharFile[i][j], VietNamCharFile[0][i - 1]);
            }
            return str;
        }
        public static string Converts(string str)
        {
            //Thay thế và lọc dấu từng char      
            for (int i = 1; i < VietNamChar.Length; i++)
            {
                for (int j = 0; j < VietNamChar[i].Length; j++)
                    str = str.Replace(VietNamChar[i][j], VietNamChar[0][i - 1]);
            }
            return str;
        }
        public static string RandomString(int size, bool lowerCase)
        {
            StringBuilder builder = new StringBuilder();
            Random random = new Random();
            char ch;
            for (int i = 0; i < size; i++)
            {
                ch = Convert.ToChar(Convert.ToInt32(Math.Floor(26 * random.NextDouble() + 65)));
                builder.Append(ch);
            }
            if (lowerCase)
                return builder.ToString().ToLower();
            else
                return builder.ToString().ToUpper();
        }
        public static int RandomNumber(int min, int max)
        {
            Random random = new Random();
            return random.Next(min, max);
        }


        //Convert Datetime 
        public static Nullable<DateTime> ConvertDate(string date)
        {
            if (date != "")
            {
                try
                {
                    return DateTime.ParseExact(date, SystemParam.CONVERT_DATETIME, null);
                }
                catch (Exception e)
                {
                    return null;
                }
            }
            else
                return null;
        }

        public static string GenPass(string pass)
        {
            return BCrypt.Net.BCrypt.HashPassword(pass, 10);
        }

        public static bool CheckPass(string pass, string userPass)
        {
            try
            {
                return BCrypt.Net.BCrypt.Verify(pass, userPass);
            }
            catch
            {
                return false;
            }
        }
        //hàm tách firstname,lastname
        //public GetFirstNameLastName SeparateFullName(string FullName)
        //{
        //    GetFirstNameLastName result = new GetFirstNameLastName();
        //    string[] NameSurname = new string[2];
        //    string[] NameSurnameTemp = FullName.Split(' ');
        //    for (int i = 0; i < NameSurnameTemp.Length; i++)
        //    {
        //        if (i < NameSurnameTemp.Length - 1)
        //        {
        //            if (!string.IsNullOrEmpty(NameSurname[0]))
        //                NameSurname[0] += " " + NameSurnameTemp[i];
        //            else
        //                NameSurname[0] += NameSurnameTemp[i];
        //        }
        //        else
        //            NameSurname[1] = NameSurnameTemp[i];
        //    }
        //    result.FirstName = NameSurname[0];
        //    result.LastName = NameSurname[1];
        //    return result;
        //}
        //public static int compare(int a, int b)
        //{
        //    if (a > b) return 1;
        //    else if (a == b) return 0;
        //    else return -1;
        //}
    }
}
