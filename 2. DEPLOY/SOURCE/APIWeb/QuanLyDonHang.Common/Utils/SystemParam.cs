using System;
using System.Collections.Generic;
using System.Text;

namespace QuanLyDonHang.Common.Utils
{
    public enum ERROR_CODE
    {
        NOT_EXIST_PRODUCT = -11,
        PRODUCT_LOCKED = -12,
        PRODUCT_ACTIVED = -13,
        OTP_EXPIRE = -14,
        OTP_FAIL = -15,
        OTP_FAIL_COUNT = -16,
        OTP_SEND_COUNT = -17,
        PRODUCT_NOT_OUT_WAREHOUSE = -18
    }

    //status of product
    public enum PRODUCT
    {
        LOCK,
        ACTIVE,
        IN_WAREHOUSE,
        OUT_WAREHOUSE
    }

    public enum IS_CUSTOMER
    {
        NO,
        YES
    }
    public class SystemParam
    {
        public const int ERROR = 0;
        public const int SUCCESS = 1;


        public const string CONVERT_DATETIME = "dd/MM/yyyy";
        public const string CONVERT_DATETIME_HAVE_HOUR = "dd/MM/yyyy HH:mm";
        public const int MAX_ROW_IN_LIST = 20;
        public const int ACTIVE = 1;
        public const int NO_ACTIVE = 0;
        public const string DSN_SENTRY = "https://9dd7302f68aa42a2973253ad9ce673d5@o507139.ingest.sentry.io/5665879";
    }
}
