import {
  PlusCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { setLocale } from "yup";
import {
  Col,
  Divider,
  Input,
  Row,
  Select,
  Upload,
  Button as ButtonAntd,
  Checkbox,
  DatePicker,
  Empty,
  InputNumber,
} from "antd";
import Button from "components/Button";
import ScreenWrapper from "components/ScreenWrapper";
import { ROUTER, STRING } from "constants/Constant";
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { notifyFail, notifySuccess } from "utils/notify";
import Moment from "moment";
import { createSupplier } from "network/SupplierApi";
import InputField from "components/InputField";
import RadioField from "components/RadioField";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  supplierFullList,
  createOrder,
  uploadDocument,
  deleteDocument,
  orderDetail,
  updateOrder,
  getMoneyUnit,
} from "network/OrderApi";
import SelectField from "components/SelectField";
import DatePickerField from "components/DatePickerField";
import SubDatePickerField from "components/SubDatePickerField";
import FormikErrorFocus from "formik-error-focus";
import ConfirmModal from "components/ConfirmModal";

const { Option } = Select;
const { TextArea } = Input;

const headerTable = [
  { title: STRING.numericalOrder, chinese: "顺序" },
  { title: STRING.paymentClause, chinese: "實際付款資料" },
  { title: STRING.amountOfPayment, chinese: "稅後金額" },
  { title: `% ${STRING.payment}`, chinese: "付款率" },
  { title: STRING.paymentDate, chinese: "付款票期" },
  { title: STRING.accumulatedPayment, chinese: "" },
  { title: STRING.accumulatedPaymentPercent, chinese: "" },
  { title: "Mã số nhận hàng", chinese: "收貨單號" },
  { title: "Ngày nhận hàng", chinese: "收貨日期" },
  { title: "Số lượng nghiệm thu", chinese: "驗收數量" },
  { title: "Số tiền nghiệm thu", chinese: "驗收含稅金額" },
  { title: "Action" },
];

const radioOptions = [
  { value: 1, label: "ISO" },
  { value: 2, label: "Khác/其他" },
];

const types = [
  { value: 1, label: "Sản xuất chế tạo/製造商" },
  { value: 2, label: "Đại lí/承包商" },
  { value: 3, label: "Xuất khẩu/出口商" },
  { value: 4, label: "Khác/其他" },
  { value: 5, label: "Mua bán/Thương mại" },
];

const orderStatus = [
  { value: 1, label: `${STRING.ordered}/已訂購` },
  { value: 2, label: `${STRING.transporting}/運輸中` },
  { value: 3, label: `${STRING.returnedToPort}/已到港口` },
  { value: 4, label: `${STRING.complete}/完成` },
];

const paymentClauseList = [
  { value: 1, label: "Khoản tạm ứng/預付款" },
  { value: 2, label: "Khoản trước giao hàng/出貨前" },
  { value: 3, label: "Khoản sau giao hàng/出貨后" },
  // --------------------------
  { value: 4, label: "Khoản tiến độ/進度款" },
  { value: 5, label: "Khoản hoàn công/完工款" },
  { value: 6, label: "Khoản nghiệm thu/驗收款" },
  { value: 7, label: "Khoản bảo hành/保固款" },
];

const formatNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatPureNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "");
};

const formatFloatNumber = (value) => {
  value += "";
  const list = value.split(".");
  const prefix = list[0].charAt(0) === "-" ? "-" : "";
  let num = prefix ? list[0].slice(1) : list[0];
  let result = "";
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
};

function CreateOrderScreen(props) {
  const state = props.location.state;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listFileUpload, setListFileUpload] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isModalAddSupplierVisible, setIsModalAddSupplierVisible] = useState(
    false
  );
  const [isModalEditPaymentMethod, setIsModalEditPaymentMethod] = useState(
    false
  );
  const [chosenOrderToImport, setChosenOrderToImport] = useState({});
  const [confirmImportVisible, setConfirmImportVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({
    paymentClause: undefined,
    paymentPercent: "",
    createdDate: "",
    amountOfPayment: "",
    accumulatedPayment: "",
    accumulatedPaymentPercent: "",
    // ----------------------------------------
    code: "",
    receivedDate: "",
    numberOfAcceptance: "",
    amountOfAcceptance: "",
    currency: undefined,
  });
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [supplierData, setSupplierData] = useState([]);

  const [orderObject, setOrderObject] = useState({
    status: undefined,
    supplierId: undefined,
    constructionName: "",
    taxMoney: "",
    moneyUnit: undefined,
    dueWarranty: "",
    finePerDay: "",
    contractCode: "",
    dueDate: "",
    isImport: false,
    productType: "",
    constructionType: "",
    purchaseContent: "",
    orderCode: "",
    constructionCode: "",
    vatRate: "",
    amountAfterTax: "",
    paymentCondition: "",
    warehouseReceiptID: null,
    // ------------------------------
    estimatedCategory: "",
    estimatedCategoryName: "",
    amountOfEstimating: "",
    estimatingCurrency: undefined,
  });
  const [selectedSupplierCode, setSelectedSupplierCode] = useState("");

  const [moneyUnit, setMoneyUnit] = useState([]);

  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(0);

  const history = useHistory();

  const buttonRef = useRef();

  useEffect(() => {
    getSupplierList();
    getMoneyType();
    if (state.isUpdate) {
      getOrderDetail(id);
    }
  }, []);

  // useEffect(() => {
  //   let value =
  //     parseInt(formatPureNumber(orderObject.taxMoney)) +
  //     formatPureNumber(orderObject.taxMoney) * (orderObject.vatRate / 100);
  //   setOrderObject({
  //     ...orderObject,
  //     amountAfterTax: (Math.round(value * 100) / 100).toString(),
  //   });
  // }, [orderObject.taxMoney, orderObject.vatRate]);

  useEffect(() => {
    if (orderObject.taxMoney) {
      let value =
        orderObject.taxMoney +
        orderObject.taxMoney * (orderObject.vatRate / 100);
      setOrderObject({
        ...orderObject,
        amountAfterTax: parseInt(Math.round(value * 100) / 100),
      });
    } else {
      setOrderObject({
        ...orderObject,
        amountAfterTax: "",
      });
    }
  }, [orderObject.taxMoney, orderObject.vatRate]);

  // console.log(orderObject.amountAfterTax, typeof orderObject.amountAfterTax);

  const toggleAddSupplier = () => {
    setIsModalAddSupplierVisible(!isModalAddSupplierVisible);
  };

  const toggleEditPaymentMethod = () => {
    setIsModalEditPaymentMethod(!isModalEditPaymentMethod);
  };

  var buttonSubmitting = false;
  var buttonSubmittingSupplier = false;

  const HeaderButton = () => {
    return (
      <>
        <Button
          className="btn btn-secondary mr-2"
          onClick={() => history.goBack()}
        >
          {STRING.cancel}/取消
        </Button>
        <Button
          className="btn btn-success"
          // onClick={() => history.push(ROUTER.ORDER)}
          // ref={(buttonRef) => console.log(buttonRef, "aaaaaaaaaaaaa")}
          onClick={() =>
            !state.isUpdate ? addNewOrder() : updateChosenOrder()
          }
        >
          {STRING.save}/存
        </Button>
      </>
    );
  };

  const ModalAddEdit = () => {
    const initialValues = {
      supplierCode: "",
      supplierName: "",
      email: "",
      tax: "",
      phoneNumber: "",
      productCertification: "",
      fax: "",
      dateOfCompanyRegistration: "",
      representative: "",
      contactPerson: "",
      contactPersonPhone: "",
      officeAddress: "",
      contactAddress: "",
      productType: "",
      constructType: "",
      // -----------------------------------
      supplierNameEng: "",
      website: "",
      charterCapital: "",
      authorizedCapital: "",
      salesYear: "",
      // -----------------------------------
      bankName: "",
      accountNumber: "",
      type: null,
      note: "",
      // ---------------------------------------
      swiftCode: "",
      moneyTypeCharterCapital: null,
      moneyTypeRevenue: null,
      // ---------------------------------------
      contactPersonEmail: "",
      supplierNameChina: "",
    };

    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})|(02+([0-9]{9}))\b)/i;
    const tax_regex = /(([0-9])\b)/g;
    const fax_regex = /^\+?[0-9]+$/;

    setLocale({
      string: {
        min: "Trường này phải có ít nhất ${min} kí tự!",
        max: "Trường này nhiều nhất là ${max} kí tự!",
      },
      number: {
        min: "Trường này phải lớn hơn hoặc bằng ${min}!",
        max: "Trường này phải nhỏ hơn hoặc bằng ${max}!",
      },
    });

    const validationSchemaToAdd = Yup.object().shape({
      supplierCode: Yup.string()
        .max(15)
        .required("Mã nhà cung cấp không được để trống!"),
      supplierName: Yup.string().required(
        "Tên nhà cung cấp không được để trống!"
      ),
      email: Yup.string().email("Sai định dạng mail (Vd: @gmail.com)"),
      // .required("Email không được để trống!"),
      contactPersonEmail: Yup.string().email(
        "Sai định dạng mail (Vd: @gmail.com)"
      ),
      tax: Yup.string()
        .min(10)
        .max(13)
        .matches(tax_regex, "Mã số thuế chỉ được nhập số!")
        .required("Mã số thuế không được để trống!"),
      phoneNumber: Yup.string()
        // .matches(vnf_regex, "Sai định dạng số điện thoại Viêt Nam!")
        .required("Số điện thoại nhà cung cấp không được để trống!"),
      // .min(10)
      // .max(11),
      // productCertification: Yup.number().required(
      //   "Chứng nhận sản phẩm không được để trống"
      // ),
      fax: Yup.string()
        .max(15)
        .matches(fax_regex, "Sai định dạng! VD: +8438233318"),
      // .required("Fax không được để trống!"),
      // dateOfCompanyRegistration: Yup.string().required(
      //   "Ngày đăng ký công ty chưa được chọn!"
      // ),
      // representative: Yup.string().required(
      //   "Người đại diện không được để trống!"
      // ),
      // contactPerson: Yup.string().required(
      //   "Người liên hệ không được để trống!"
      // ),
      // contactPersonPhone: Yup.string()
      //   .matches(vnf_regex, "Nhập sai định dạng")
      //   .min(10)
      //   .max(11),
      // .required("Số điện thoại liên hệ không được để trống!"),
      // officeAddress: Yup.string().required(
      //   "Địa chỉ trụ sở không được để trống!"
      // ),
      // contactAddress: Yup.string().required(
      //   "Địa chỉ liên hệ không được để trống!"
      // ),
      accountNumber: Yup.string().matches(
        tax_regex,
        "Số tài khoản chỉ được nhập số!"
      ),
      productType: Yup.string().required("Loại sản phẩm không được để trống!"),
      constructType: Yup.string().required(
        "Loại công trình không được để trống!"
      ),
      type: Yup.number().required("Loại hình chưa được chọn!").nullable(),
      charterCapital: Yup.string().matches(
        tax_regex,
        "Vốn điều lệ chỉ được nhập số!"
      ),
      salesYear: Yup.string().matches(
        tax_regex,
        "Doanh thu năm chỉ được nhập số!"
      ),
    });

    return (
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            if (!buttonSubmittingSupplier) {
              try {
                buttonSubmittingSupplier = true;

                // setIsLoading(true);
                const payload = {
                  code: values.supplierCode?.trim(),
                  name: values.supplierName?.trim(),
                  tax: values.tax?.trim(),
                  phoneNumber: values.phoneNumber?.trim(),
                  email: values.email?.trim(),
                  contact: values.contactPerson?.trim(),
                  contactPhoneNumber: values.contactPersonPhone?.trim(),
                  address: values.contactAddress?.trim(),
                  officeAddress: values.officeAddress?.trim(),
                  fax: values.fax?.trim(),
                  registrationDate: values.dateOfCompanyRegistration,
                  contructionType: values.constructType?.trim(),
                  productType: values.productType?.trim(),
                  representative: values.representative?.trim(),
                  certificateProduct:
                    values.productCertification === ""
                      ? -1
                      : values.productCertification,
                  // -------------------------
                  subName: values.supplierNameChina
                    ? values.supplierNameChina?.trim()
                    : "",
                  engName: values.supplierNameEng
                    ? values.supplierNameEng?.trim()
                    : "",
                  web: values.website?.trim() ? values.website?.trim() : "",
                  charterCapital: values.charterCapital?.trim()
                    ? values.charterCapital?.trim()
                    : "",
                  revenue: values.salesYear?.trim()
                    ? values.salesYear?.trim()
                    : "",
                  bankName: values.bankName?.trim()
                    ? values.bankName?.trim()
                    : "",
                  accountNumber: values.accountNumber?.trim()
                    ? values.accountNumber?.trim()
                    : "",
                  type: values.type,
                  note: values.note?.trim() ? values.note?.trim() : "",
                  // -------------------------
                  swiftCode: values.swiftCode?.trim()
                    ? values.swiftCode?.trim()
                    : "",
                  moneyTypeCharterCapital: values.moneyTypeCharterCapital
                    ? values.moneyTypeCharterCapital
                    : null,
                  moneyTypeRevenue: values.moneyTypeRevenue
                    ? values.moneyTypeRevenue
                    : null,
                  emailContactPerson: values.contactPersonEmail?.trim(),
                };
                await createSupplier(payload);
                const res = await supplierFullList();

                let newArr = [...res.data];
                newArr.sort(function (a, b) {
                  return new Date(a.createdDate) - new Date(b.createdDate);
                });
                const lastSupplier = newArr[newArr.length - 1];

                buttonSubmittingSupplier = false;

                setSelectedSupplierCode(lastSupplier.code);
                setOrderObject({ ...orderObject, supplierId: lastSupplier.id });
                notifySuccess(STRING.success);
                getSupplierList();
                setIsModalAddSupplierVisible(false);
              } catch (error) {
                // setIsLoading(false);
                // getSupplierList();
                // setIsModalAddSupplierVisible(true);
                // notifyFail(STRING.fail);
                buttonSubmittingSupplier = false;
                console.log(error);
              }
            }
          }}
          validationSchema={validationSchemaToAdd}
        >
          {(formikProps) => {
            return (
              <Modal
                isOpen={isModalAddSupplierVisible}
                size="xl"
                toggle={toggleAddSupplier}
                centered
              >
                <Form>
                  <ModalHeader toggle={toggleAddSupplier}>
                    Thêm nhà cung cấp/添加供应商
                  </ModalHeader>
                  <ModalBody>
                    <Row gutter={[32, 16]}>
                      <Col className="gutter-row" span={13}>
                        {/* ------------------Mã nhà cung cấp--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.supplierCode}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>供應商代碼</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="supplierCode"
                                // label={STRING.supplierCode}
                                placeholder={STRING.supplierCode}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Tên nhà cung cấp--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.supplierName} (Tiếng Việt)</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>供應商名稱 (越文)</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="supplierName"
                                // label={STRING.supplierName}
                                placeholder={STRING.supplierName}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Tên nhà cung cấp--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.supplierName} (Tiếng Trung)</span>
                              {/* <span style={{ color: "red" }}> *</span> */}
                              <br />
                              <span>供應商名稱 (中文)</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="supplierNameChina"
                                // label={STRING.supplierName}
                                placeholder={STRING.supplierName}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Tên nhà cung cấp--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.supplierName} (Tiếng Anh)</span>
                              {/* <span style={{ color: "red" }}> *</span> */}
                              <br />
                              <span>供應商名稱 (英文)</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="supplierNameEng"
                                // label={STRING.supplierName}
                                placeholder={STRING.supplierName}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Trang web--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.website}</span>
                              {/* <span style={{ color: "red" }}> *</span> */}
                              <br />
                              <span>網站地址</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="website"
                                // label={STRING.supplierName}
                                placeholder={STRING.website}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Vốn điều lệ--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.charterCapital}</span>
                              {/* <span style={{ color: "red" }}> *</span> */}
                              <br />
                              <span>資本額</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <Row>
                                <Col span={14}>
                                  <FastField
                                    component={InputField}
                                    name="charterCapital"
                                    // label={STRING.supplierName}
                                    placeholder={STRING.charterCapital}
                                  />
                                </Col>
                                <Col span={10}>
                                  <FastField
                                    component={SelectField}
                                    name="moneyTypeCharterCapital"
                                    // label={STRING.representative}
                                    placeholder="Tiền tệ"
                                    options={moneyUnit}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Doanh thu năm--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.salesYear}</span>
                              {/* <span style={{ color: "red" }}> *</span> */}
                              <br />
                              <span>年營業額</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <Row>
                                <Col span={14}>
                                  <FastField
                                    component={InputField}
                                    name="salesYear"
                                    // label={STRING.supplierName}
                                    placeholder={STRING.salesYear}
                                  />
                                </Col>
                                <Col span={10}>
                                  <FastField
                                    component={SelectField}
                                    name="moneyTypeRevenue"
                                    // label={STRING.representative}
                                    placeholder="Tiền tệ"
                                    options={moneyUnit}
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Mã số thuế--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.tax}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>稅號</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="tax"
                                // label={STRING.tax}
                                placeholder={STRING.tax}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Số điện thoại--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.phoneNumber}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>電話</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="phoneNumber"
                                // label={STRING.phoneNumber}
                                placeholder={STRING.phoneNumber}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Chứng nhận sản phẩm--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.productCertification}</span>
                              <br />
                              <span>產品認證</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={RadioField}
                                name="productCertification"
                                // label={STRING.productCertification}
                                options={radioOptions}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Fax--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>Fax</span>
                              <br />
                              <span>傳真</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="fax"
                                // label="Fax"
                                placeholder="Fax"
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Ngày đăng ký công ty--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.dateOfCompanyRegistration}</span>
                              <br />
                              <span>公司設立日期</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={DatePickerField}
                                name="dateOfCompanyRegistration"
                                // label={STRING.dateOfCompanyRegistration}
                                placeholder={STRING.dateOfCompanyRegistration}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Email--------------------- */}
                        <div className="mb-4">
                          <Row gutter={16}>
                            <Col className="gutter-row" span={10}>
                              <span>{STRING.email}</span>
                            </Col>
                            <Col className="gutter-row" span={14}>
                              <FastField
                                component={InputField}
                                name="email"
                                // label={STRING.email}
                                placeholder={STRING.email}
                              />
                            </Col>
                          </Row>
                        </div>
                      </Col>
                      <Col className="gutter-row" span={11}>
                        {/* ------------------Swift code--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>Swift code</span>
                              <br />
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="swiftCode"
                                // label={STRING.representative}
                                placeholder="Swift code"
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Người đại diện--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.representative}</span>
                              <br />
                              <span>代表人</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="representative"
                                // label={STRING.representative}
                                placeholder={STRING.representative}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Tên ngân hàng--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.bankName}</span>
                              <br />
                              <span>銀行及分行名</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="bankName"
                                // label={STRING.representative}
                                placeholder={STRING.bankName}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Số tài khoản--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.accountNumber}</span>
                              <br />
                              <span>銀行及分行名</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="accountNumber"
                                // label={STRING.representative}
                                placeholder={STRING.accountNumber}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Người liên hệ--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.contactPerson}</span>
                              <br />
                              <span>聯絡人</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="contactPerson"
                                // label={STRING.contactPerson}
                                placeholder={STRING.contactPerson}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Số điện thoại người liên hệ--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.contactPersonPhone}</span>
                              <br />
                              <span>聯絡人的電話號碼</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="contactPersonPhone"
                                // label={STRING.contactPersonPhone}
                                placeholder={STRING.contactPersonPhone}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Email người liên hệ--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>Email người liên hệ</span>
                              <br />
                              <span>聯絡人的 Email</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="contactPersonEmail"
                                // label={STRING.contactPersonPhone}
                                placeholder="Email người liên hệ"
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Địa chỉ trụ sở--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.officeAddress}</span>
                              <br />
                              <span>設立地址</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="officeAddress"
                                // label={STRING.officeAddress}
                                placeholder={STRING.officeAddress}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Địa chỉ liên hệ--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.contactAddress}</span>
                              <br />
                              <span>聯絡地址</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="contactAddress"
                                // label={STRING.contactAddress}
                                placeholder={STRING.contactAddress}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Loại sản phẩm--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.productType}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>產品類別</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="productType"
                                // label={STRING.productType}
                                placeholder={STRING.productType}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Loại công trình--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.constructType}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>工程類別</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="constructType"
                                // label={STRING.constructType}
                                placeholder={STRING.constructType}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Loại hình--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.type}</span>
                              <span style={{ color: "red" }}> *</span>
                              <br />
                              <span>類型</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={SelectField}
                                name="type"
                                // label={STRING.representative}
                                placeholder={STRING.type}
                                options={types}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* ------------------Ghi chú--------------------- */}
                        <div className="mb-4">
                          <Row>
                            <Col span={7}>
                              <span>{STRING.note}</span>
                              <br />
                              <span>備註</span>
                            </Col>
                            <Col span={17}>
                              <FastField
                                component={InputField}
                                name="note"
                                // label={STRING.representative}
                                placeholder={STRING.note}
                              />
                            </Col>
                          </Row>
                        </div>
                        {/* Scroll to the first error in your Formik form and set focus */}
                        <FormikErrorFocus
                          offset={0}
                          align={"top"}
                          focusDelay={0}
                          ease={"linear"}
                          duration={0}
                        />
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit" className="btn btn-primary">
                      {`${STRING.save}/存`}
                    </Button>
                    <Button
                      className="btn btn-secondary"
                      onClick={toggleAddSupplier}
                    >
                      {`${STRING.cancel}/取消`}
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            );
          }}
        </Formik>
      </div>
    );
  };

  const ModalEditPayment = () => {
    let value = paymentMethodList[selectedPaymentIndex];
    // console.log({ value });
    const chosenValues = {
      paymentClause: value?.paymentClause,
      amountOfPayment: value?.amountOfPayment,
      createdDate: value?.createdDate,
      code: value?.code,
      receivedDate: value?.receivedDate,
      numberOfAcceptance: value?.numberOfAcceptance,
      amountOfAcceptance: value?.amountOfAcceptance,
      currency: value?.currency,
    };

    const validationSchema = Yup.object().shape({
      paymentClause: Yup.number().required("Khoản thanh toán chưa được chọn!"),
      amountOfPayment: Yup.number().required(
        "Số tiền thanh toán không được để trống!"
      ),
      // .min(1)
      // .max(100),
      createdDate: Yup.string().required(
        "Ngày thanh toán không được để trống!"
      ),
      code: Yup.string().required("Mã số nhận hàng không được để trống!"),
      receivedDate: Yup.string().required(
        "Ngày nhận hàng không được để trống!"
      ),
      numberOfAcceptance: Yup.number().required(
        "Số lượng nghiệm thu không được để trống!"
      ),
      amountOfAcceptance: Yup.number().required(
        "Số tiền nghiệm thu không được để trống!"
      ),
    });

    return (
      <div>
        <Formik
          initialValues={chosenValues}
          onSubmit={(values) => {
            if (values.paymentClause !== chosenValues.paymentClause) {
              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 1
                ) >= 0 &&
                values.paymentClause === 1
              ) {
                notifyFail("Phương thức thanh toán đã có khoản tạm ứng!");
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 2
                ) >= 0 &&
                values.paymentClause === 2
              ) {
                notifyFail(
                  "Phương thức thanh toán đã có khoản trước giao hàng!"
                );
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 3
                ) >= 0 &&
                values.paymentClause === 3
              ) {
                notifyFail("Phương thức thanh toán đã có khoản sau giao hàng!");
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 4
                ) >= 0 &&
                values.paymentClause === 4
              ) {
                notifyFail("Phương thức thanh toán đã có khoản tiến độ!");
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 5
                ) >= 0 &&
                values.paymentClause === 5
              ) {
                notifyFail("Phương thức thanh toán đã có khoản hoàn công!");
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 6
                ) >= 0 &&
                values.paymentClause === 6
              ) {
                notifyFail("Phương thức thanh toán đã có khoản nghiệm thu!");
                return;
              }

              if (
                paymentMethodList.findIndex(
                  (item) => item.paymentClause === 7
                ) >= 0 &&
                values.paymentClause === 7
              ) {
                notifyFail("Phương thức thanh toán đã có khoản bảo hành!");
                return;
              }
            }

            if (values.amountOfPayment >= orderObject.taxMoney) {
              notifyFail(
                "Số tiền thanh toán không được vượt quá số tiền trước thuế!"
              );
              return;
            }
            // console.log(typeof orderObject.amountAfterTax);

            let newValue =
              (values.amountOfPayment / orderObject.amountAfterTax) * 100;

            value.paymentPercent = Math.round(newValue * 100) / 100;

            let newArr = [...paymentMethodList];

            newArr = [
              ...newArr.slice(0, selectedPaymentIndex),
              {
                ...value,
                ...values,
              },
              ...newArr.slice(selectedPaymentIndex + 1, newArr.length),
            ];

            newArr[0].accumulatedPayment = newArr[0].amountOfPayment;
            newArr[0].accumulatedPaymentPercent = newArr[0].paymentPercent;
            if (newArr.length > 1) {
              for (let index = 1; index < newArr.length; index++) {
                let newAccumulatedPayment =
                  newArr[index].amountOfPayment +
                  newArr[index - 1].accumulatedPayment;
                newArr[index].accumulatedPayment =
                  Math.round(newAccumulatedPayment * 100) / 100;

                let newAccumulatedPaymentPercent =
                  newArr[index].paymentPercent +
                  newArr[index - 1].accumulatedPaymentPercent;
                newArr[index].accumulatedPaymentPercent =
                  Math.round(newAccumulatedPaymentPercent * 100) / 100;
              }
            }

            setIsModalEditPaymentMethod(false);
            setPaymentMethodList(newArr);
            notifySuccess(STRING.success);
          }}
          validationSchema={validationSchema}
        >
          {(formikProps) => {
            return (
              <Modal
                isOpen={isModalEditPaymentMethod}
                toggle={toggleEditPaymentMethod}
                centered
              >
                <Form>
                  <ModalHeader toggle={toggleEditPaymentMethod}>
                    Sửa phương thức thanh toán
                    <br />
                    修改付款方式
                  </ModalHeader>
                  <ModalBody>
                    <FastField
                      component={SelectField}
                      name="paymentClause"
                      label="Khoản thanh toán/付款"
                      placeholder="Khoản thanh toán"
                      options={paymentClauseList}
                    />

                    <FastField
                      component={InputField}
                      name="amountOfPayment"
                      label="Số tiền thanh toán/稅後金額"
                      placeholder="Số tiền thanh toán"
                      type="number"
                    />

                    <FastField
                      component={SubDatePickerField}
                      // component={InputField}
                      name="createdDate"
                      label="Ngày thanh toán/付款票期"
                      placeholder="Ngày thanh toán"
                    />

                    <FastField
                      component={InputField}
                      name="code"
                      label="Mã số nhận hàng/收貨單號"
                      placeholder="Mã số nhận hàng"
                    />

                    <FastField
                      component={SubDatePickerField}
                      name="receivedDate"
                      label="Ngày nhận hàng/收貨日期"
                      placeholder="Ngày nhận hàng"
                    />

                    <FastField
                      component={InputField}
                      name="numberOfAcceptance"
                      label="Số lượng nghiệm thu/驗收數量"
                      placeholder="Số lượng nghiệm thu"
                      type="number"
                    />

                    <FastField
                      component={InputField}
                      name="amountOfAcceptance"
                      label="Số tiền nghiệm thu/驗收含稅金額"
                      placeholder="Số tiền nghiệm thu"
                      type="number"
                    />

                    <FastField
                      component={SelectField}
                      name="currency"
                      label="Đơn vị tiền"
                      placeholder="Đơn vị tiền"
                      options={moneyUnit}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button type="submit" className="btn btn-primary">
                      {STRING.save}/救
                    </Button>
                    <Button
                      className="btn btn-secondary"
                      onClick={toggleEditPaymentMethod}
                    >
                      {STRING.cancel}/取消
                    </Button>
                  </ModalFooter>
                </Form>
              </Modal>
            );
          }}
        </Formik>
      </div>
    );
  };

  // console.log(orderObject.amountAfterTax, "amountAfterTax");

  const PaymentMethodTable = () => {
    return (
      <Table striped bordered hover className="mb-3" responsive>
        <thead>
          <tr>
            {headerTable.map((item, index) => {
              return item.title === "Action" ? (
                <th key={index} className="text-center align-middle"></th>
              ) : (
                <th key={index} className="text-center align-middle">
                  {item.title}
                  <br />
                  {item.chinese}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paymentMethodList.length ? (
            paymentMethodList.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">
                    {item.paymentClause == 1
                      ? "Khoản tạm ứng/預付款"
                      : item.paymentClause == 2
                      ? "Khoản trước giao hàng/出貨前"
                      : item.paymentClause == 3
                      ? "Khoản sau giao hàng/出貨后"
                      : item.paymentClause == 4
                      ? "Khoản tiến độ/進度款"
                      : item.paymentClause == 5
                      ? "Khoản hoàn công/完工款"
                      : item.paymentClause == 6
                      ? "Khoản nghiệm thu/驗收款"
                      : item.paymentClause == 7
                      ? "Khoản bảo hành/保固款"
                      : "--"}
                  </td>
                  <td className="text-center align-middle">
                    {/* {formatNumber(item.amountOfPayment.toString())}{" "} */}
                    {item.amountOfPayment
                      ? item.amountOfPayment
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""}{" "}
                    {orderObject.moneyUnit === 1
                      ? "VNĐ"
                      : orderObject.moneyUnit === 3
                      ? "USD"
                      : orderObject.moneyUnit === 4
                      ? "CNY"
                      : orderObject.moneyUnit === 5
                      ? "TWD"
                      : ""}
                  </td>
                  <td className="text-center align-middle">
                    {`${item.paymentPercent}%`}
                  </td>
                  <td className="text-center align-middle">
                    {item.createdDate}
                  </td>
                  <td className="text-center align-middle">
                    {/* {formatNumber(item.accumulatedPayment.toString())}{" "} */}
                    {item.accumulatedPayment
                      ? item.accumulatedPayment
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""}{" "}
                    {orderObject.moneyUnit === 1
                      ? "VNĐ"
                      : orderObject.moneyUnit === 3
                      ? "USD"
                      : orderObject.moneyUnit === 4
                      ? "CNY"
                      : orderObject.moneyUnit === 5
                      ? "TWD"
                      : ""}
                  </td>
                  <td className="text-center align-middle">
                    {`${item.accumulatedPaymentPercent}%`}
                  </td>
                  <td className="text-center align-middle">{item.code}</td>
                  <td className="text-center align-middle">
                    {item.receivedDate}
                  </td>
                  <td className="text-center align-middle">
                    {item.numberOfAcceptance}
                  </td>
                  <td className="text-center align-middle">
                    {item.amountOfAcceptance
                      ? item.amountOfAcceptance
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : ""}{" "}
                    {item.currency === 1
                      ? "VNĐ"
                      : item.currency === 3
                      ? "USD"
                      : item.currency === 4
                      ? "CNY"
                      : item.currency === 5
                      ? "TWD"
                      : ""}
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex justify-content-round">
                      <EditOutlined
                        onClick={() => onEditPayment(index)}
                        className="mr-2"
                      />
                      <DeleteOutlined onClick={() => onDeletePayment(index)} />
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr className="text-center">
              <td className="p-2" colSpan={12}>
                <Empty description={<span>{STRING.emptyList}</span>} />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  const getSupplierList = async () => {
    try {
      setIsLoading(true);
      let res = await supplierFullList();
      res.data.forEach((supplier, index) => {
        res.data[index].value = supplier.id;
        res.data[index].label = supplier.name;
      });
      setSupplierData(res.data);
      setIsLoading(false);
    } catch (error) {}
  };

  const getOrderDetail = async (orderId) => {
    try {
      setIsLoading(true);
      const res = await orderDetail({ Id: orderId });
      let suppliersRes = await supplierFullList();
      const baseUrl = "http://qldh.winds.vn:6886";
      const fileArr = res.data.path.split(",");

      let newListFileList =
        fileArr.length && fileArr[0]
          ? fileArr?.map((file, index) => ({
              uid: index,
              name: file.split("/")[file.split("/").length - 1],
              status: "done",
              url: `${baseUrl}${file}`,
              path: file,
            }))
          : [];

      let newArr = [...res.data.orderPaymentDetails];

      newArr.forEach((item, index) => {
        item.paymentPercent = parseFloat(newArr[index].percent);
        item.createdDate = newArr[index].paymentDate;
        item.paymentClause = parseInt(newArr[index].paymentType);
        item.accumulatedPayment = parseFloat(newArr[index].moneyAccumulation);
        item.accumulatedPaymentPercent = parseFloat(
          newArr[index].percentAccumulation
        );
        item.amountOfPayment = parseFloat(newArr[index].paymentAmount);
        // ----------------------------------------
        item.AmountOfAcceptance = parseFloat(newArr[index].AmountOfAcceptance);
        item.code = newArr[index].receiveCode;
        item.receivedDate = newArr[index].receiveDate;
        item.numberOfAcceptance = parseInt(newArr[index].numberOfTests);
        item.currency = parseInt(newArr[index].amountOfAcceptanceType);

        delete item.percent;
        delete item.paymentDate;
        delete item.paymentType;
        delete item.moneyAccumulation;
        delete item.percentAccumulation;
        delete item.paymentAmount;
        // --------------------
        delete item.receiveCode;
        delete item.receiveDate;
        delete item.numberOfTests;
        delete item.amountOfAcceptanceType;
      });

      const selectedObj = suppliersRes.data.find(
        (item) => item.id === res.data.providerID
      );

      setSelectedSupplierCode(selectedObj.code);

      setListFileUpload(newListFileList);

      setOrderObject({
        ...orderObject,
        supplierId: res.data.providerID,
        constructionName: res.data.contructionName,
        taxMoney: parseFloat(res.data.amountBeforeTax),
        moneyUnit: res.data.moneyTypeID,
        dueWarranty: res.data.warrantyPeriod,
        finePerDay: res.data.outOfDate,
        contractCode: res.data.contactCode,
        dueDate: Moment(res.data.deadlineDate, "DD/MM/YYYY")._i,
        isImport: res.data.isImport == 1 ? true : false,
        productType: res.data.productType,
        constructionType: res.data.contructionType,
        purchaseContent: res.data.description,
        status: res.data.status,
        orderCode: res.data.code,
        vatRate: res.data.rate,
        moneyAfterTax: parseFloat(res.data.amountAfterTax),
        constructionCode: res.data.constructionCode,
        paymentCondition: res.data.paymentTerms,
        warehouseReceiptID: res.data.warehouseReceiptID,
        // -------------------------
        estimatedCategory: res.data.estimatedCategory,
        estimatedCategoryName: res.data.estimatedName,
        amountOfEstimating: res.data.amountMoney
          ? parseFloat(res.data.amountMoney)
          : "",
        estimatingCurrency: res.data.amountMoneyType,
      });

      setPaymentMethodList(newArr);
      setIsLoading(false);
    } catch (error) {
      notifyFail(STRING.fail);
    }
  };

  const getMoneyType = async () => {
    try {
      const res = await getMoneyUnit();
      res.data.forEach((item, index) => {
        item.value = res.data[index].id;
        item.label = res.data[index].name;
        delete item.order;
        delete item.isActive;
        delete item.createdDate;
      });
      setMoneyUnit(res.data);
    } catch (error) {
      notifyFail(STRING.fail);
    }
  };

  const onAddPayment = () => {
    // console.log({ orderObject, paymentMethod });
    let paymentArr = [...paymentMethodList];
    let subPaymentMethod = { ...paymentMethod };

    // Math.round(value * 100) / 100,

    let newPaymentPercentValue =
      (subPaymentMethod.amountOfPayment / orderObject.amountAfterTax) * 100;

    subPaymentMethod.paymentPercent =
      Math.round(newPaymentPercentValue * 100) / 100;

    if (paymentArr.length === 0) {
      subPaymentMethod.accumulatedPayment = subPaymentMethod.amountOfPayment;
      subPaymentMethod.accumulatedPaymentPercent =
        subPaymentMethod.paymentPercent;
    }

    if (paymentArr.length > 0) {
      let newAccumulatedPayment =
        paymentArr[paymentArr.length - 1].accumulatedPayment +
        subPaymentMethod.amountOfPayment;
      subPaymentMethod.accumulatedPayment =
        Math.round(newAccumulatedPayment * 100) / 100;

      let newValue =
        paymentArr[paymentArr.length - 1].accumulatedPaymentPercent +
        subPaymentMethod.paymentPercent;
      subPaymentMethod.accumulatedPaymentPercent =
        Math.round(newValue * 100) / 100;
    }

    subPaymentMethod.amountOfPayment = subPaymentMethod.amountOfPayment;

    if (state.isUpdate) {
      subPaymentMethod.orderPaymentId = null;
    }

    // console.log({ subPaymentMethod });
    if (orderObject.amountAfterTax === "NaN") {
      notifyFail("Chưa có số tiền sau thuế, hãy điền số tiền trước thuế!");
      document.getElementById("taxMoney").focus();
      return;
    }

    if (paymentMethodList.length === 7) {
      notifyFail("Chỉ có tối đa 7 phương thức thanh toán!");
      return;
    }
    if (!paymentMethod.paymentClause) {
      notifyFail("Khoản thanh toán chưa được chọn!");
      return;
    }
    if (!paymentMethod.amountOfPayment) {
      notifyFail("Số tiền thanh toán không được để trống!");
      return;
    }
    // if (paymentMethod.paymentPercent > 100) {
    //   notifyFail("Phần trăm thanh toán không được vượt quá 100%!");
    //   return;
    // }
    // if (paymentMethod.paymentPercent <= 0) {
    //   notifyFail("Phần trăm thanh toán phải lớn hơn 0%!");
    //   return;
    // }
    if (!paymentMethod.createdDate) {
      notifyFail("Ngày thanh toán chưa được chọn!");
      return;
    }
    // if (paymentMethod.createdDate <= 0) {
    //   notifyFail("Số ngày thanh toán thanh toán phải lớn hơn 0!");
    //   return;
    // }
    // if (
    //   paymentMethodList.findIndex((item) => item.paymentClause === 1) >= 0 &&
    //   paymentMethod.paymentClause === 1
    // ) {
    //   notifyFail("Phương thức thanh toán đã có khoản tạm ứng!");
    //   return;
    // }
    // if (
    //   paymentMethodList.findIndex((item) => item.paymentClause === 2) >= 0 &&
    //   paymentMethod.paymentClause === 2
    // ) {
    //   notifyFail("Phương thức thanh toán đã có khoản trước giao hàng!");
    //   return;
    // }
    // if (
    //   paymentMethodList.findIndex((item) => item.paymentClause === 3) >= 0 &&
    //   paymentMethod.paymentClause === 3
    // ) {
    //   notifyFail("Phương thức thanh toán đã có khoản sau giao hàng!");
    //   return;
    // }
    if (subPaymentMethod.accumulatedPayment > orderObject.amountAfterTax) {
      notifyFail(
        "Lũy kế số tiền thanh toán không được vượt mức số tiền sau thuế!"
      );
      return;
    }
    if (!paymentMethod.code) {
      notifyFail("Mã số nhận hàng không được để trống!");
      return;
    }
    if (!paymentMethod.receivedDate) {
      notifyFail("Ngày nhận hàng chưa được chọn!");
      return;
    }
    if (!paymentMethod.numberOfAcceptance) {
      notifyFail("Số lượng nghiệm thu không được để trống!");
      return;
    }
    if (!paymentMethod.amountOfAcceptance) {
      notifyFail("Số tiền nghiệm thu không được để trống!");
      return;
    }
    if (!paymentMethod.currency) {
      notifyFail("Đơn vị tiền chưa được chọn!");
      return;
    }

    paymentArr.push(subPaymentMethod);
    setPaymentMethodList(paymentArr);
    setPaymentMethod({
      paymentClause: undefined,
      paymentPercent: "",
      createdDate: "",
      amountOfPayment: "",
      accumulatedPayment: "",
      accumulatedPaymentPercent: "",
      // ---------------------------------------------
      code: "",
      receivedDate: "",
      numberOfAcceptance: "",
      amountOfAcceptance: "",
      currency: undefined,
    });
  };

  // console.table(paymentMethodList);

  const onEditPayment = (index) => {
    setSelectedPaymentIndex(index);
    setIsModalEditPaymentMethod(true);
  };

  const onDeletePayment = (index) => {
    let paymentArr = [...paymentMethodList];
    paymentArr.splice(index, 1);
    if (paymentArr.length > 0) {
      paymentArr[0].accumulatedPayment = paymentArr[0].amountOfPayment;
      paymentArr[0].accumulatedPaymentPercent = paymentArr[0].paymentPercent;
    }
    if (paymentArr.length > 1) {
      for (let index = 1; index < paymentArr.length; index++) {
        let newAccumulatedPayment =
          paymentArr[index].amountOfPayment +
          paymentArr[index - 1].accumulatedPayment;
        paymentArr[index].accumulatedPayment =
          Math.round(newAccumulatedPayment * 100) / 100;

        let newAccumulatedPaymentPercent =
          paymentArr[index].paymentPercent +
          paymentArr[index - 1].accumulatedPaymentPercent;
        paymentArr[index].accumulatedPaymentPercent =
          Math.round(newAccumulatedPaymentPercent * 100) / 100;
      }
    }
    setPaymentMethodList(paymentArr);
  };

  const handleMultiFile = async (value) => {
    // console.log(value.file.status, "status");
    if (
      value.fileList.length > listFileUpload.length &&
      value.file.status === "uploading"
    ) {
      const isLt10M =
        value.fileList[value.fileList.length - 1].originFileObj.size /
          1024 /
          1024 <
        10;
      if (!isLt10M) {
        notifyFail("Kích cỡ file không được quá 10MB!");
        return;
      }

      try {
        let lengthArr = value.fileList.length;
        let formData = new FormData();

        formData.append("Name", "");
        formData.append("Path", "http://qldh.winds.vn:6886/api");
        formData.append("OrderId", "");
        formData.append("File", value.fileList[lengthArr - 1].originFileObj);
        const res = await uploadDocument(formData);

        let newListFileUpload = [...listFileUpload];

        newListFileUpload.push({
          uid: value.fileList[lengthArr - 1].uid,
          name: res.data.fileName.split("/")[
            res.data.fileName.split("/").length - 1
          ],
          status: "done",
          url: `http://qldh.winds.vn:6886${res.data.fileName}`,
          path: res.data.fileName,
        });

        setListFileUpload(newListFileUpload);
      } catch (error) {
        console.log(error);
      }
    } else {
      let newListFileUpload = JSON.parse(JSON.stringify(listFileUpload));
      let listElmUploaded = newListFileUpload.map(
        (fileUpload) => fileUpload.uid
      );
      for (let index = 0; index < listElmUploaded.length; index++) {
        let currentIndexIsDeleted = value.fileList.findIndex(
          (item) => listElmUploaded[index] === item.uid
        );

        if (currentIndexIsDeleted === -1) {
          newListFileUpload.splice(index, 1);
          break;
        }
      }
      setListFileUpload(newListFileUpload);
    }
  };

  const addNewOrder = async () => {
    if (!buttonSubmitting) {
      try {
        buttonSubmitting = true;

        if (!orderObject.supplierId) {
          notifyFail("Nhà cung cấp chưa được chọn!");
          document.getElementById("supplierId").focus();
          return;
        }
        if (!orderObject.constructionName) {
          notifyFail("Tên công trình không được để trống!");
          document.getElementById("constructionName").focus();
          return;
        }
        if (!orderObject.taxMoney) {
          notifyFail("Số tiền trước thuế không được để trống!");
          document.getElementById("taxMoney").focus();
          return;
        }
        if (orderObject.taxMoney && !orderObject.moneyUnit) {
          notifyFail("Đơn vị tiền chưa được chọn!");
          document.getElementById("moneyUnit").focus();
          return;
        }
        // if (!orderObject.vatRate) {
        //   notifyFail("Tỉ lệ VAT không được để trống!");
        //   document.getElementById("vatRate").focus();
        //   return;
        // }
        // if (orderObject.vatRate <= 0) {
        //   notifyFail("Tỉ lệ VAT phải lớn hơn 0!");
        //   document.getElementById("vatRate").focus();
        //   return;
        // }
        // if (!orderObject.dueWarranty) {
        //   notifyFail("Thời hạn bảo hành không được để trống!");
        //   document.getElementById("dueWarranty").focus();
        //   return;
        // }
        // if (!orderObject.finePerDay) {
        //   notifyFail("Quá hạn phạt mỗi ngày không được để trống!");
        //   document.getElementById("finePerDay").focus();
        //   return;
        // }
        // if (!listFileUpload.length) {
        //   notifyFail("Vui lòng chọn ít nhất 1 file!");
        //   return;
        // }
        if (!orderObject.contractCode) {
          notifyFail("Mã hợp đồng không được để trống!");
          document.getElementById("contractCode").focus();
          return;
        }
        // if (!orderObject.dueDate) {
        //   notifyFail("Thời hạn hoàn công chưa được chọn!");
        //   document.getElementById("dueDate").focus();
        //   return;
        // }
        if (orderObject.amountOfEstimating) {
          if (!orderObject.estimatingCurrency) {
            notifyFail("Đơn vị tiền chưa được chọn!");
            document.getElementById("estimatingCurrency").focus();
            return;
          }
        }
        if (!orderObject.productType) {
          notifyFail("Hạng mục lớn không được để trống!");
          document.getElementById("productType").focus();
          return;
        }
        if (!orderObject.constructionType) {
          notifyFail("Hạng mục nhỏ không được để trống!");
          document.getElementById("constructionType").focus();
          return;
        }
        if (!orderObject.purchaseContent) {
          notifyFail("Nội dung mua hàng không được để trống!");
          document.getElementById("purchaseContent").focus();
          return;
        }
        // if (!paymentMethodList.length) {
        //   notifyFail("Chưa có phương thức thanh toán!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 1) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản tạm ứng!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 2) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản trước giao hàng!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 3) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản sau giao hàng!");
        //   return;
        // }

        let newArr = [...paymentMethodList];

        newArr.forEach((item, index) => {
          item.percent = newArr[index].paymentPercent.toString();
          item.paymentDate = newArr[index].createdDate;
          item.paymentType = parseInt(newArr[index].paymentClause);
          item.moneyAccumulation = newArr[index].accumulatedPayment.toString();
          item.percentAccumulation = newArr[
            index
          ].accumulatedPaymentPercent.toString();
          item.paymentAmount = newArr[index].amountOfPayment.toString();
          // --------------------------------
          item.receiveCode = newArr[index].code.toString();
          item.receiveDate = newArr[index].receivedDate;
          item.numberOfTests = newArr[index].numberOfAcceptance.toString();
          item.amountOfAcceptance = newArr[index].amountOfAcceptance.toString();
          item.amountOfAcceptanceType = parseInt(newArr[index].currency);

          delete item.paymentPercent;
          delete item.createdDate;
          delete item.paymentClause;
          delete item.accumulatedPayment;
          delete item.accumulatedPaymentPercent;
          delete item.amountOfPayment;
        });

        // console.log(orderObject.finePerDay, "orderObject.finePerDay");

        const payload = {
          contructionName: orderObject.constructionName?.trim(),
          contructionType: orderObject.constructionType?.trim(),
          productType: orderObject.productType?.trim(),
          amountBeforeTax: orderObject.taxMoney.toString(),
          contactNumber: "0974747474",
          deadlineDate: orderObject.dueDate
            ? Moment(orderObject.dueDate).format("DD/MM/YYYY")
            : "",
          outOfDate: orderObject.finePerDay ? orderObject.finePerDay : null,
          warrantyPeriod: orderObject.dueWarranty
            ? orderObject.finePerDay
            : null,
          contactCode: orderObject.contractCode?.trim(),
          isImport: orderObject.isImport ? 1 : 0,
          description: orderObject.purchaseContent?.trim(),
          status: 1,
          moneyTypeID: parseInt(orderObject.moneyUnit),
          providerID: parseInt(orderObject.supplierId),
          path: listFileUpload.map((item) => item.path).join(","),
          // payment1: null,
          // paymentDate1: "",
          // payment2: null,
          // paymentDate2: "",
          // payment3: null,
          // paymentDate3: "",
          // ----------------------------
          rate: orderObject.vatRate ? orderObject.vatRate : 0,
          amountAfterTax: orderObject.amountAfterTax
            ? orderObject.amountAfterTax.toString()
            : "",
          orderPaymentCreates: newArr,
          paymentTerms: orderObject.paymentCondition,
          constructionCode: orderObject.constructionCode,
          //-----------------------------
          estimatedCategory: orderObject.estimatedCategory || "",
          estimatedName: orderObject.estimatedCategoryName || "",
          amountMoney: orderObject.amountOfEstimating.toString() || "",
          amountMoneyType: orderObject.estimatingCurrency || null,
        };

        const res = await createOrder(payload);

        if (orderObject.isImport) {
          notifySuccess(STRING.success);
          setConfirmImportVisible(true);
          setChosenOrderToImport({ ...res.data });
          return;
        }

        // if (buttonRef.current) {
        //   buttonRef.current.setAttribute("disabled", true);
        // }

        buttonSubmitting = false;

        notifySuccess(STRING.success);
        history.push(ROUTER.ORDER);
      } catch (error) {
        buttonSubmitting = false;
        console.log(error);
        notifyFail(STRING.fail);
      }
    }
  };

  const updateChosenOrder = async () => {
    // console.table(paymentMethodList);
    if (!buttonSubmitting) {
      try {
        buttonSubmitting = true;

        if (!orderObject.supplierId) {
          notifyFail("Nhà cung cấp chưa được chọn!");
          document.getElementById("supplierId").focus();
          return;
        }
        if (!orderObject.constructionName) {
          notifyFail("Tên công trình không được để trống!");
          document.getElementById("constructionName").focus();
          return;
        }
        if (!orderObject.taxMoney) {
          notifyFail("Số tiền trước thuế không được để trống!");
          document.getElementById("taxMoney").focus();
          return;
        }
        if (orderObject.taxMoney && !orderObject.moneyUnit) {
          notifyFail("Đơn vị tiền chưa được chọn!");
          document.getElementById("moneyUnit").focus();
          return;
        }
        // if (!orderObject.vatRate) {
        //   notifyFail("Tỉ lệ VAT không được để trống!");
        //   document.getElementById("vatRate").focus();
        //   return;
        // }
        // if (orderObject.vatRate <= 0) {
        //   notifyFail("Tỉ lệ VAT phải lớn hơn 0!");
        //   document.getElementById("vatRate").focus();
        //   return;
        // }
        // if (!orderObject.dueWarranty) {
        //   notifyFail("Thời hạn bảo hành không được để trống!");
        //   document.getElementById("dueWarranty").focus();
        //   return;
        // }
        // if (!orderObject.finePerDay) {
        //   notifyFail("Quá hạn phạt mỗi ngày không được để trống!");
        //   document.getElementById("finePerDay").focus();
        //   return;
        // }
        // if (!listFileUpload.length) {
        //   notifyFail("Vui lòng chọn ít nhất 1 file!");
        //   return;
        // }
        // if (!orderObject.status) {
        //   notifyFail("Trạng thái đơn hàng chưa được chọn!");
        //   document.getElementById("contractCode").focus();
        //   return;
        // }
        if (!orderObject.contractCode) {
          notifyFail("Mã hợp đồng không được để trống!");
          document.getElementById("contractCode").focus();
          return;
        }
        // if (!orderObject.dueDate) {
        //   notifyFail("Thời hạn hoàn công chưa được chọn!");
        //   document.getElementById("dueDate").focus();
        //   return;
        // }
        if (orderObject.amountOfEstimating) {
          if (!orderObject.estimatingCurrency) {
            notifyFail("Đơn vị tiền chưa được chọn!");
            document.getElementById("estimatingCurrency").focus();
            return;
          }
        }
        if (!orderObject.productType) {
          notifyFail("Hạng mục lớn không được để trống!");
          document.getElementById("productType").focus();
          return;
        }
        if (!orderObject.constructionType) {
          notifyFail("Hạng mục nhỏ không được để trống!");
          document.getElementById("constructionType").focus();
          return;
        }
        if (!orderObject.purchaseContent) {
          notifyFail("Nội dung mua hàng không được để trống!");
          document.getElementById("purchaseContent").focus();
          return;
        }
        // if (!paymentMethodList.length) {
        //   notifyFail("Chưa có phương thức thanh toán!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 1) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản tạm ứng!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 2) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản trước giao hàng!");
        //   return;
        // }
        // if (paymentMethodList.findIndex((item) => item.paymentClause === 3) < 0) {
        //   notifyFail("Phương thức thanh toán chưa có khoản sau giao hàng!");
        //   return;
        // }

        let newArr = [...paymentMethodList];

        // newArr.forEach((item, index) => {
        //   item.percent = parseInt(newArr[index].paymentPercent);
        //   item.paymentDate = parseInt(newArr[index].createdDate);
        //   item.paymentType = parseInt(newArr[index].paymentClause);
        //   item.moneyAccumulation = newArr[index].accumulatedPayment.toString();
        //   item.percentAccumulation = newArr[
        //     index
        //   ].accumulatedPaymentPercent.toString();
        //   item.paymentAmount = newArr[index].amountOfPayment.toString();

        //   delete newArr[index].paymentPercent;
        //   delete newArr[index].createdDate;
        //   delete newArr[index].paymentClause;
        //   delete newArr[index].accumulatedPayment;
        //   delete newArr[index].accumulatedPaymentPercent;
        //   delete newArr[index].amountOfPayment;
        // });

        const convertedArr = newArr.map((item) => {
          return {
            percent: item.paymentPercent.toString(),
            paymentDate: item.createdDate,
            paymentType: parseInt(item.paymentClause),
            moneyAccumulation: item.accumulatedPayment.toString(),
            percentAccumulation: item.accumulatedPaymentPercent.toString(),
            paymentAmount: item.amountOfPayment.toString(),
            orderPaymentId: item.orderPaymentId
              ? parseInt(item.orderPaymentId)
              : null,
            // --------------------------------
            receiveCode: item.code.toString(),
            receiveDate: item.receivedDate,
            numberOfTests: item.numberOfAcceptance.toString(),
            amountOfAcceptance: item.amountOfAcceptance.toString(),
            amountOfAcceptanceType: parseInt(item.currency),
          };
        });

        // console.log(orderObject.finePerDay, "orderObject.finePerDay");

        const payloadToUpdate = {
          ID: parseInt(id),
          contructionName: orderObject.constructionName?.trim(),
          contructionType: orderObject.constructionType?.trim(),
          productType: orderObject.productType?.trim(),
          amountBeforeTax: orderObject.taxMoney.toString(),
          contactNumber: "0974747474",
          deadlineDate: orderObject.dueDate
            ? Moment(orderObject.dueDate).format("DD/MM/YYYY")
            : "",
          outOfDate: orderObject.finePerDay ? orderObject.finePerDay : null,
          warrantyPeriod: orderObject.dueWarranty,
          contactCode: orderObject.contractCode?.trim(),
          isImport: orderObject.isImport ? 1 : 0,
          description: orderObject.purchaseContent?.trim(),
          status: orderObject.status,
          moneyTypeID: parseInt(orderObject.moneyUnit),
          providerID: parseInt(orderObject.supplierId),
          path: listFileUpload.map((item) => item.path).join(","),
          // payment1: null,
          // paymentDate1: "",
          // payment2: null,
          // paymentDate2: "",
          // payment3: null,
          // paymentDate3: "",
          // ----------------------------
          rate: orderObject.vatRate ? orderObject.vatRate : 0,
          amountAfterTax: orderObject.amountAfterTax
            ? orderObject.amountAfterTax.toString()
            : "",
          orderPaymentUpdates: convertedArr,
          paymentTerms: orderObject.paymentCondition,
          constructionCode: orderObject.constructionCode,
          //-----------------------------
          estimatedCategory: orderObject.estimatedCategory || "",
          estimatedName: orderObject.estimatedCategoryName || "",
          amountMoney: orderObject.amountOfEstimating.toString() || "",
          amountMoneyType: orderObject.estimatingCurrency || null,
        };

        const res = await updateOrder(payloadToUpdate);

        if (orderObject.isImport && !orderObject.warehouseReceiptID) {
          notifySuccess(STRING.success);
          setConfirmImportVisible(true);
          setChosenOrderToImport({ ...res.data });
          return;
        }

        // if (buttonRef.current) {
        //   buttonRef.current.setAttribute("disabled", true);
        // }

        buttonSubmitting = false;

        notifySuccess(STRING.success);
        history.goBack();
      } catch (error) {
        buttonSubmitting = false;
        console.log(error);
        notifyFail(STRING.fail);
      }
    }
  };

  const handleConfirmImport = () => {
    setConfirmImportVisible(false);
    history.push({
      pathname: "/tao-phieu-nhap",
      state: { isUpdate: false, data: chosenOrderToImport },
    });
  };

  const handleRejectImport = () => {
    setConfirmImportVisible(false);
    history.push(ROUTER.ORDER);
  };

  // console.log(typeof orderObject.taxMoney, orderObject.taxMoney, "tax money");

  return (
    <ScreenWrapper
      titleHeader={
        !state.isUpdate
          ? `${STRING.createOrder}/创建订单`
          : `${STRING.editOrder}/正确的顺序`
      }
      isLoading={isLoading}
      isError={isError}
      hasButton={true}
      detail={true}
      context={props}
    >
      <HeaderButton />
      <div className="card">
        <ModalAddEdit />
        <ModalEditPayment />
        <ConfirmModal
          isOpen={confirmImportVisible}
          onHide={() => handleRejectImport()}
          shouldCustomizeTitle={true}
          customizedTitle="Đơn hàng đã được tạo, bạn có muốn tạo phiếu nhập cho đơn hàng này không? 您是否需要填寫進口資料"
          action={() => handleConfirmImport()}
        />
        <div className="card-body">
          <Divider orientation="left">
            <h5>{STRING.orderInfo}/訂單信息</h5>
          </Divider>
          <Row gutter={[24, 16]}>
            <Col className="gutter-row" span={12}>
              {
                // ------------------Mã đơn hàng---------------------
                state.isUpdate && (
                  <div className="mb-4">
                    <Row gutter={16}>
                      <Col className="gutter-row" span={10}>
                        <span>{STRING.orderCode}</span>
                        <br />
                        <span>訂單編號</span>
                      </Col>
                      <Col className="gutter-row" span={14}>
                        <label>{orderObject.orderCode || "--"}</label>
                      </Col>
                    </Row>
                  </div>
                )
              }
              {/* ------------------Nhà cung cấp--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.supplier}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>供應商</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <Select
                      placeholder={STRING.supplier}
                      style={{ width: "80%" }}
                      id="supplierId"
                      value={orderObject.supplierId}
                      onChange={(value) => {
                        setOrderObject({ ...orderObject, supplierId: value });
                        const selectedObj = supplierData.find(
                          (item) => item.id === value
                        );
                        if (selectedObj.id) {
                          setSelectedSupplierCode(selectedObj.code);
                        }
                      }}
                      allowClear
                      autoClearSearchValue
                    >
                      {supplierData.length &&
                        supplierData.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })}
                    </Select>
                    <PlusCircleOutlined
                      style={{ fontSize: "28px", padding: "0 0 0 10px" }}
                      onClick={() => setIsModalAddSupplierVisible(true)}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Mã nhà cung cấp--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.supplierCode}</span>
                    <br />
                    <span>供應商代碼</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    {selectedSupplierCode || "--"}
                  </Col>
                </Row>
              </div>
              {/* ------------------Mã công trình--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.constructionCode}</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>工程編號</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <Input
                      placeholder={STRING.constructionCode}
                      value={orderObject.constructionCode}
                      id="constructionCode"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          constructionCode: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Tên công trình--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.constructionName}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>工程名稱</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <Input
                      placeholder={STRING.constructionName}
                      value={orderObject.constructionName}
                      id="constructionName"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          constructionName: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Số tiền trước thuế--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.taxMoney}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>稅前金額</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder={STRING.taxMoney}
                        style={{ width: "100%" }}
                        id="taxMoney"
                        value={
                          orderObject.taxMoney
                            ? orderObject.taxMoney
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        // value={orderObject.taxMoney}
                        onChange={(value) => {
                          // console.log(value);
                          setOrderObject({
                            ...orderObject,
                            taxMoney: value,
                          });
                        }}
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "120px" }}
                        value={orderObject.moneyUnit}
                        id="moneyUnit"
                        onChange={(value) => {
                          setOrderObject({ ...orderObject, moneyUnit: value });
                        }}
                        allowClear
                        autoClearSearchValue
                      >
                        {moneyUnit.length &&
                          moneyUnit.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Tỉ lệ VAT--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.vatRate}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>稅率</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={STRING.vatRate}
                        // defaultValue={
                        //   orderObject.vatRate ? orderObject.vatRate : ""
                        // }
                        // type="number"
                        // suffix="%"
                        value={orderObject.vatRate}
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        id="vatRate"
                        // value={orderObject.vatRate}
                        onChange={(value) => {
                          // console.log(value, "aaaaaaaaaaaaaaaaaaaaaaaa");
                          setOrderObject({
                            ...orderObject,
                            vatRate: value,
                          });
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Số tiền sau thuế--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.moneyAfterTax}</span>
                    <br />
                    <span>稅後金額</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <Input
                        placeholder={STRING.moneyAfterTax}
                        // type="number"
                        suffix={
                          orderObject.moneyUnit === 1
                            ? "VNĐ"
                            : orderObject.moneyUnit === 3
                            ? "USD"
                            : orderObject.moneyUnit === 4
                            ? "CNY"
                            : orderObject.moneyUnit === 5
                            ? "TWD"
                            : ""
                        }
                        disabled
                        // id="taxMoney"
                        // value={formatNumber(orderObject.amountAfterTax)}
                        value={orderObject.amountAfterTax
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        // onChange={(e) =>
                        //   setOrderObject({
                        //     ...orderObject,
                        //     taxMoney: e.target.value,
                        //   })
                        // }
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Thời hạn bảo hành--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.warrantyPeriod}</span>
                    <br />
                    <span>保固期間 (Năm/年)</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      {/* <Input
                        placeholder={STRING.warrantyPeriod}
                        type="number"
                        value={orderObject.dueWarranty}
                        id="dueWarranty"
                        suffix="Năm/年"
                        onChange={(e) =>
                          setOrderObject({
                            ...orderObject,
                            dueWarranty: e.target.value,
                          })
                        }
                      /> */}
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={STRING.warrantyPeriod}
                        min={0}
                        value={orderObject.dueWarranty}
                        formatter={(value) => `${value}`}
                        id="dueWarranty"
                        onChange={(value) => {
                          setOrderObject({
                            ...orderObject,
                            dueWarranty: value,
                          });
                        }}
                      />
                      {/* <span style={{ fontSize: "16px", marginLeft: "10px" }}>
                        {STRING.year}
                      </span> */}
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Quá hạn phạt mỗi ngày--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.percentFinePerDay}</span>
                    <br />
                    <span>逾期罰款每日</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      {/* <Input
                        placeholder={STRING.percentFinePerDay}
                        type="number"
                        value={orderObject.finePerDay}
                        suffix="%"
                        id="finePerDay"
                        onChange={(e) =>
                          setOrderObject({
                            ...orderObject,
                            finePerDay: e.target.value,
                          })
                        }
                      /> */}
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder={STRING.percentFinePerDay}
                        // defaultValue={
                        //   orderObject.finePerDay ? orderObject.finePerDay : ""
                        // }
                        min={0}
                        max={100}
                        value={orderObject.finePerDay}
                        formatter={(value) => `${value}%`}
                        id="finePerDay"
                        onChange={(value) => {
                          // console.log(value);
                          setOrderObject({
                            ...orderObject,
                            finePerDay: value,
                          });
                        }}
                      />
                      {/* <span style={{ fontSize: "16px", marginLeft: "10px" }}>
                        %
                      </span> */}
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Tài liệu--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.document}</span>
                    <br />
                    <span>附件檔案</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <Upload
                      // {...props}
                      onChange={handleMultiFile}
                      fileList={listFileUpload}
                    >
                      <ButtonAntd icon={<UploadOutlined />}>
                        Đăng file/附件檔案
                      </ButtonAntd>
                    </Upload>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              {
                // ------------------Trạng thái đơn hàng---------------------
                state.isUpdate && (
                  <div className="mb-4">
                    <Row>
                      <Col span={10}>
                        <span>{STRING.status}</span>
                        <br />
                        <span>訂單狀態</span>
                      </Col>
                      <Col span={14}>
                        <Select
                          placeholder={STRING.supplier}
                          style={{ width: "100%" }}
                          value={orderObject.status}
                          id="status"
                          onChange={(value) =>
                            setOrderObject({ ...orderObject, status: value })
                          }
                          // allowClear
                          autoClearSearchValue
                        >
                          {orderStatus.length &&
                            orderStatus.map((item, index) => {
                              return (
                                <Option key={index} value={item.value}>
                                  {item.label}
                                </Option>
                              );
                            })}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                )
              }
              {/* ------------------Mã hợp đồng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.contractCode}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>合約編號</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder={STRING.contractCode}
                      value={orderObject.contractCode}
                      id="contractCode"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          contractCode: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Thời hạn hoàn công--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{`${STRING.dueDate} (Giao hàng)`}</span>
                    <br />
                    <span>完工（交貨）期限</span>
                  </Col>
                  <Col span={14}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      // defaultValue={
                      //   orderObject.dueDate &&
                      //   // Moment(orderObject.dueDate).format("DD/MM/YYYY")
                      //   Moment(orderObject.dueDate).format("DD/MM/YYYY")
                      // }
                      id="dueDate"
                      value={
                        // state.isUpdate
                        //   ? orderObject.dueDate
                        //     ? Moment(orderObject.dueDate._i, "DD/MM/YYYY")
                        //     : ""
                        //   :
                        orderObject.dueDate ? Moment(orderObject.dueDate) : ""
                      }
                      // format="DD/MM/YYYY"
                      format=""
                      onChange={(date, dateString) => {
                        setOrderObject({
                          ...orderObject,
                          dueDate: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Nhập khẩu--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.import}</span>
                    <br />
                    <span>進口</span>
                  </Col>
                  <Col span={14}>
                    <Checkbox
                      checked={orderObject.isImport}
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          isImport: e.target.checked,
                        })
                      }
                      disabled={
                        orderObject.isImport && orderObject.warehouseReceiptID
                          ? true
                          : false
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Hạng mục dự toán--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Hạng mục dự toán</span>
                    <br />
                    <span>預算項次</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Hạng mục dự toán"
                      value={orderObject.estimatedCategory}
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          estimatedCategory: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Tên dự toán--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Tên dự toán</span>
                    <br />
                    <span>預算名稱</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Tên dự toán"
                      value={orderObject.estimatedCategoryName}
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          estimatedCategoryName: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Số tiền--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Số tiền</span>
                    <br />
                    <span>金額</span>
                  </Col>
                  <Col span={14}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder="Số tiền"
                        style={{ width: "100%" }}
                        id="amountOfEstimating"
                        value={
                          orderObject.amountOfEstimating
                            ? orderObject.amountOfEstimating
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        // value={orderObject.amountOfEstimating}
                        onChange={(value) => {
                          // console.log(value);
                          setOrderObject({
                            ...orderObject,
                            amountOfEstimating: value,
                          });
                        }}
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "120px" }}
                        value={orderObject.estimatingCurrency}
                        id="estimatingCurrency"
                        onChange={(value) => {
                          setOrderObject({
                            ...orderObject,
                            estimatingCurrency: value,
                          });
                        }}
                        allowClear
                        autoClearSearchValue
                      >
                        {moneyUnit.length &&
                          moneyUnit.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Loại sản phẩm--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Phân loại đơn hàng</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>(Hạng mục lớn)</span>
                    <br />
                    <span>採購分類(大類)</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Hạng mục lớn"
                      value={orderObject.productType}
                      id="productType"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          productType: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Loại công trình--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Phân loại đơn hàng</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>(Hạng mục nhỏ)</span>
                    <br />
                    <span>採購分類(小類)</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Hạng mục nhỏ"
                      value={orderObject.constructionType}
                      id="constructionType"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          constructionType: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Nội dung mua hàng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.purchaseContent}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>購買內容</span>
                  </Col>
                  <Col span={14}>
                    <TextArea
                      showCount
                      maxLength={300}
                      placeholder={STRING.purchaseContent}
                      value={orderObject.purchaseContent}
                      id="purchaseContent"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          purchaseContent: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Điều kiện thanh toán--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Điều kiện thanh toán</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>付款條件</span>
                  </Col>
                  <Col span={14}>
                    {/* <Input
                      placeholder="Điều kiện thanh toán"
                      value={orderObject.paymentCondition}
                      id="paymentCondition"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          paymentCondition: e.target.value,
                        })
                      }
                    /> */}
                    <TextArea
                      showCount
                      maxLength={100}
                      placeholder="Điều kiện thanh toán"
                      value={orderObject.paymentCondition}
                      id="paymentCondition"
                      onChange={(e) =>
                        setOrderObject({
                          ...orderObject,
                          paymentCondition: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {/* --------------------------Phương thức thanh toán----------------------------------- */}
          <div className="mt-2 mb-4">
            <Row gutter={12}>
              <Col span={5}>
                <div className="align-middle">
                  <label>{STRING.paymentMethod}</label>
                  <br />
                  <label>實際付款資料</label>
                </div>
              </Col>
              <Col span={15}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <div className="align-middle">
                      <Select
                        placeholder={`${STRING.paymentClause}/實際付款資料`}
                        style={{ width: "100%" }}
                        value={paymentMethod.paymentClause}
                        onChange={(value) =>
                          setPaymentMethod({
                            ...paymentMethod,
                            paymentClause: value,
                          })
                        }
                        allowClear
                        autoClearSearchValue
                      >
                        {paymentClauseList.map((item, index) => {
                          return (
                            <Option
                              key={index}
                              value={item.value}
                              disabled={
                                paymentMethodList.findIndex(
                                  (selectItem) =>
                                    selectItem.paymentClause === item.value
                                ) < 0
                                  ? false
                                  : true
                              }
                              // disabled={false}
                            >
                              {item.label}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="align-middle">
                      {/* <Input
                    prefix="%"
                    placeholder="Số thanh toán/付款率"
                    type="number"
                    min="0"
                    max="100"
                    value={paymentMethod.paymentPercent}
                    onChange={(e) =>
                      setPaymentMethod({
                        ...paymentMethod,
                        paymentPercent: e.target.value,
                      })
                    }
                  /> */}
                      <InputNumber
                        placeholder={`${STRING.amountOfPayment}/稅後金額`}
                        // type="number"
                        style={{ width: "100%" }}
                        id="taxMoney"
                        value={
                          paymentMethod.amountOfPayment
                            ? paymentMethod.amountOfPayment
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        onChange={(value) =>
                          setPaymentMethod({
                            ...paymentMethod,
                            amountOfPayment: value,
                          })
                        }
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="align-middle">
                      <DatePicker
                        placeholder="Ngày thanh toán/付款票期"
                        style={{ width: "100%" }}
                        // defaultValue={
                        //   paymentMethod.createdDate
                        //     ? Moment(paymentMethod.createdDate, "DD/MM/YYYY")
                        //     : null
                        // }
                        value={
                          paymentMethod.createdDate
                            ? Moment(paymentMethod.createdDate, "DD/MM/YYYY")
                            : ""
                        }
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) =>
                          setPaymentMethod({
                            ...paymentMethod,
                            createdDate: dateString,
                          })
                        }
                      />
                      {/* <Input
                    placeholder="Số ngày thanh toán/付款天数"
                    type="number"
                    value={paymentMethod.createdDate}
                    onChange={(e) =>
                      setPaymentMethod({
                        ...paymentMethod,
                        createdDate: e.target.value,
                      })
                    } 
                  /> */}
                      {/* <InputNumber
                    style={{ width: "100%" }}
                    placeholder="Số ngày thanh toán/付款天数"
                    min={0}
                    max={100}
                    value={paymentMethod.createdDate}
                    formatter={(value) => `${value}`}
                    onChange={(value) => {
                      console.log(value);
                      setPaymentMethod({
                        ...paymentMethod,
                        createdDate: value,
                      });
                    }}
                  /> */}
                    </div>
                  </Col>
                  <Col span={8}>
                    <Input
                      placeholder="Mã số nhận hàng/收貨單號"
                      value={paymentMethod.code}
                      onChange={(e) =>
                        setPaymentMethod({
                          ...paymentMethod,
                          code: e.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <DatePicker
                      placeholder="Ngày nhận hàng/收貨日期"
                      style={{ width: "100%" }}
                      // defaultValue={
                      //   paymentMethod.createdDate
                      //     ? Moment(paymentMethod.createdDate, "DD/MM/YYYY")
                      //     : null
                      // }
                      value={
                        paymentMethod.receivedDate
                          ? Moment(paymentMethod.receivedDate, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) =>
                        setPaymentMethod({
                          ...paymentMethod,
                          receivedDate: dateString,
                        })
                      }
                    />
                  </Col>
                  <Col span={8}>
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Số lượng nghiệm thu/驗收數量"
                      value={paymentMethod.numberOfAcceptance}
                      onChange={(value) =>
                        setPaymentMethod({
                          ...paymentMethod,
                          numberOfAcceptance: value,
                        })
                      }
                    />
                  </Col>
                  <Col span={16}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder="Số tiền nghiệm thu/驗收含稅金額"
                        style={{ width: "100%" }}
                        // id="taxMoney"
                        value={
                          paymentMethod.amountOfAcceptance
                            ? paymentMethod.amountOfAcceptance
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        // value={orderObject.taxMoney}
                        onChange={(value) => {
                          // console.log(value);
                          setPaymentMethod({
                            ...paymentMethod,
                            amountOfAcceptance: value,
                          });
                        }}
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "120px" }}
                        value={paymentMethod.currency}
                        id="moneyUnit"
                        onChange={(value) => {
                          setPaymentMethod({
                            ...paymentMethod,
                            currency: value,
                          });
                        }}
                        allowClear
                        autoClearSearchValue
                      >
                        {moneyUnit.length &&
                          moneyUnit.map((item, index) => {
                            return (
                              <Option key={index} value={item.id}>
                                {item.name}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={4}></Col>
              <Col span={5}></Col> */}
              <Col span={4}>
                <div className="align-middle">
                  <Button
                    className="btn btn-primary"
                    onClick={() => onAddPayment()}
                  >
                    {STRING.add}/更多
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <PaymentMethodTable />
        </div>
      </div>
    </ScreenWrapper>
  );
}

CreateOrderScreen.propTypes = {};

export default CreateOrderScreen;
