using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.ViewModel
{
    public class JsonResultModel
    {
        public int status { get; set; }
        public int code { get; set; }
        public string message { get; set; }
        public object data { get; set; }
        public JsonResultModel (int status , int code , string message , object data)
        {
            this.status = status;
            this.code = code;
            this.message = message;
            this.data = data;
        }
    }
}
