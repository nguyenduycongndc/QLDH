import { Col, Input, Row, Radio, Empty, Checkbox } from "antd";
import Button from "components/Button";
import PaginationComponent from "components/PaginationComponent";
import ScreenWrapper from "components/ScreenWrapper";
import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import { setLocale } from "yup";
import { STRING } from "constants/Constant";
import InputField from "components/InputField";
import SelectField from "components/SelectField";
import {
  supplierList,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "network/SupplierApi";
import Moment from "moment";
import RadioField from "components/RadioField";
import DatePickerField from "components/DatePickerField";
import { notifyFail, notifySuccess } from "utils/notify";
import ConfirmModal from "components/ConfirmModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactExport from "react-export-excel";
import FormikErrorFocus from "formik-error-focus";

import { getMoneyUnit } from "network/OrderApi";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const headerTable = [
  { title: STRING.numericalOrder, chinese: "顺序" },
  { title: STRING.supplierCode, chinese: "供应商代码" },
  { title: STRING.supplierName, chinese: "供应商名称" },
  { title: STRING.phoneNumber, chinese: "电话号码" },
  { title: `${STRING.email} người đại diện`, chinese: "聯絡人的" },
  { title: STRING.representative, chinese: "代表人" },
  { title: "Mã số thuế", chinese: "稅號" },
  { title: STRING.contactAddress, chinese: "聯絡地址" },
  { title: STRING.creator, chinese: "创作者" },
  { title: STRING.updatePerson, chinese: "更新的人" },
  { title: "Export excel", chinese: "" },
  { title: "checkbox", chinese: "" },
];

const recordsPerPage = 20;

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

const formatNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getCurrency = (id, currencyList) => {
  const currency = currencyList.length
    ? currencyList.find((item) => item.id === id)
    : {};
  return currency.name;
};

function SupplierListScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldAddItem, setShouldAddItem] = useState(true);
  const [supplierData, setSupplierData] = useState([]);
  const [checkItemList, setCheckItemList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchedName, setSearchedName] = useState("");
  const [paging, setPaging] = useState({
    totalItem: 0,
    totalPage: 0,
  });
  const inputRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const [chosenIndex, setChosenIndex] = useState(0);

  const [moneyUnit, setMoneyUnit] = useState([]);

  var buttonSubmitting = false;

  useEffect(() => {
    getMoneyType();
  }, []);

  useEffect(() => {
    getSupplierList();
  }, [activePage]);

  useEffect(() => inputRef?.current?.focus(), [searchedName]);

  const toggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  const HeaderButton = () => {
    return (
      <>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn-warning btn mr-2"
          table="export__excel__supplier"
          filename={`nha-cung-cap`}
          sheet="tablexls"
          buttonText="Export Excel/出口 Excel"
        ></ReactHTMLTableToExcel>
        <Button
          className="btn btn-danger mr-2"
          onClick={() => {
            if (countNumberOfElementIsChecked(checkItemList) < 1) {
              notifyFail("Vui lòng chọn ít nhất 1 nhà cung cấp để xóa!");
              return;
            }
            setConfirmModal(true);
          }}
        >
          {`${STRING.delete}/抹去`}
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() => {
            setShouldAddItem(true);
            setIsModalVisible(true);
          }}
        >
          {`${STRING.addNew}/添新`}
        </Button>
      </>
    );
  };

  const FilterField = () => {
    return (
      <Row className="mb-4" gutter={16} justify="space-between">
        <Col span={10}>
          <Input
            placeholder="Tên, số điện thoại nhà cung cấp/供应商名称，电话号码"
            style={{ width: "100%" }}
            value={searchedName}
            onKeyUp={onKeyUp}
            ref={inputRef}
            onChange={(e) => setSearchedName(e.target.value)}
          />
        </Col>
      </Row>
    );
  };

  const ButtonGroup = () => {
    return (
      <div className="text-right mb-4">
        <Button
          className="btn btn-success mr-2"
          onClick={() => getSupplierList()}
        >
          {`${STRING.search}/搜索`}
        </Button>
        <Button
          className="btn btn-secondary"
          onClick={() => {
            clearSearching();
          }}
        >
          {`${STRING.deleteSearching}/删除搜寻`}
        </Button>
        {/* <Button
          className="btn btn-warning"
          onClick={() => {
            const counter = countNumberOfElementIsChecked(checkItemList);
            if (counter < 1) {
              notifyFail("Vui lòng chọn 1 nhà cung cấp để sửa!");
              return;
            }
            if (counter > 1) {
              notifyFail("Chỉ được sửa 1 nhà cung cấp!");
              return;
            }
            setShouldAddItem(false);
            setIsModalVisible(true);
          }}
        >
          {STRING.edit}
        </Button> */}
      </div>
    );
  };

  const ExportDetail = (props) => {
    const { item, index } = props;

    // const multiDataSet = [
    //   {
    //     columns: ["Name", "Salary", "Sex"],
    //     data: [
    //       ["Johnson", 30000, "Male"],
    //       ["Monika", 355000, "Female"],
    //       ["Konstantina", 20000, "Female"],
    //       ["John", 250000, "Male"],
    //       ["Josef", 450500, "Male"],
    //     ],
    //   },
    //   {
    //     xSteps: 1, // Will start putting cell with 1 empty cell on left most
    //     ySteps: 1, //will put space of 5 rows,
    //     columns: ["Name", "Department"],
    //     data: [
    //       ["Johnson", "Finance"],
    //       ["Monika", "IT"],
    //       ["Konstantina", "IT Billing"],
    //       ["John", "HR"],
    //       ["Josef", "Testing"],
    //     ],
    //   },
    // ];

    return (
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button btn-warning btn"
        table={`${item.code}_${index}`}
        filename={item.name}
        sheet="tablexls"
        buttonText="Export"
      ></ReactHTMLTableToExcel>
      // <ExcelFile
      //   filename={item.name}
      //   element={
      //     <Button className="btn btn-link text-decoration-underline">
      //       <u>Export</u>
      //     </Button>
      //   }
      // >
      //   <ExcelSheet dataSet={multiDataSet} name="Organization" />
      //   <ExcelSheet data={[supplierData[index]]} name="Employees">
      //     <ExcelColumn label="Mã nhà cung cấp" value="code" />
      //     <ExcelColumn label="Tên nhà cung cấp" value="name" />
      //     <ExcelColumn label="Số điện thoại" value="phoneNumber" />
      //     <ExcelColumn label="Email" value="email" />
      //     <ExcelColumn label="Người đại diện" value="representative" />
      //     <ExcelColumn label="Mã nhà cung cấp" value="code" />
      //     <ExcelColumn label="Tên nhà cung cấp" value="name" />
      //   </ExcelSheet>
      // </ExcelFile>
    );
  };

  const ModalAddEdit = () => {
    // let index = checkItemList.findIndex((item) => item === true);
    let value = supplierData ? supplierData[chosenIndex] : null;

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
      // ---------------------------------------
      supplierNameEng: "",
      website: "",
      charterCapital: "",
      authorizedCapital: "",
      salesYear: "",
      // ---------------------------------------
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

    const chosenValues = {
      supplierCode: value?.code || "",
      supplierName: value?.name || "",
      email: value?.email || "",
      tax: value?.tax || "",
      phoneNumber: value?.phoneNumber || "",
      dateOfCompanyRegistration: value?.registrationDate
        ? Moment(value?.registrationDate).format("DD/MM/YYYY")
        : "",
      productCertification:
        value?.certificateProduct === -1 ? 0 : value?.certificateProduct,
      fax: value?.fax || "",
      representative: value?.representative || "",
      contactPerson: value?.contact || "",
      contactPersonPhone: value?.contactPhoneNumber || "",
      officeAddress: value?.officeAddress || "",
      contactAddress: value?.address || "",
      productType: value?.productType || "",
      constructType: value?.contructionType || "",
      // ---------------------------------------
      supplierNameEng: value?.engName,
      website: value?.web || "",
      charterCapital: value?.charterCapital || "",
      authorizedCapital: "",
      salesYear: value?.revenue || "",
      // ---------------------------------------
      bankName: value?.bankName || "",
      accountNumber: value?.accountNumber || "",
      type: value?.type,
      note: value?.note || "",
      // ---------------------------------------
      swiftCode: value?.swiftCode,
      moneyTypeCharterCapital: value?.moneyTypeCharterCapital,
      moneyTypeRevenue: value?.moneyTypeRevenue,
      contactPersonEmail: value?.emailContactPerson,
      supplierNameChina: value?.subName,
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
        min: "Trường này phải có ít nhất ${min} kí tự!",
        max: "Trường này nhiều nhất là ${max} kí tự!",
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
        // .min(10)
        // .max(11)
        // .matches(vnf_regex, "Sai định dạng số điện thoại Viêt Nam!")
        .required("Số điện thoại nhà cung cấp không được để trống!"),
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
      //   .matches(vnf_regex, "Sai định dạng số điện thoại Viêt Nam!")
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

    const validationSchemaToEdit = Yup.object().shape({
      supplierCode: Yup.string().required(
        "Mã nhà cung cấp không được để trống!"
      ),
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
        // .min(10)
        // .max(11)
        .required("Số điện thoại nhà cung cấp không được để trống!"),
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
      //   .matches(vnf_regex, "Sai định dạng số điện thoại Viêt Nam!")
      //   .min(10)
      //   .max(11),
      accountNumber: Yup.string().matches(
        tax_regex,
        "Số tài khoản chỉ được nhập số!"
      ),
      // .required("Số điện thoại liên hệ không được để trống!"),
      // officeAddress: Yup.string().required(
      //   "Địa chỉ trụ sở không được để trống!"
      // ),
      // contactAddress: Yup.string().required(
      //   "Địa chỉ liên hệ không được để trống!"
      // ),
      productType: Yup.string().required("Loại sản phẩm không được để trống!"),
      constructType: Yup.string().required(
        "Loại công trình không được để trống!"
      ),
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
          initialValues={shouldAddItem ? initialValues : chosenValues}
          onSubmit={async (values) => {
            if (!buttonSubmitting) {
              buttonSubmitting = true;

              try {
                // setIsLoading(true);
                if (shouldAddItem) {
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
                    subName: values.supplierNameChina?.trim()
                      ? values.supplierNameChina?.trim()
                      : "",
                    engName: values.supplierNameEng?.trim()
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
                } else {
                  const payload = {
                    id: value.id,
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
                    subName: values.supplierNameChina?.trim()
                      ? values.supplierNameChina?.trim()
                      : "",
                    engName: values.supplierNameEng?.trim()
                      ? values.supplierNameEng?.trim()
                      : "",
                    web: values.website?.trim() ? values.website?.trim() : "",
                    charterCapital: values.charterCapital.trim()
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
                  await updateSupplier(payload);
                }

                buttonSubmitting = false;

                notifySuccess(STRING.success);
                getSupplierList();
                setIsModalVisible(false);
              } catch (error) {
                // setIsLoading(false);
                // getSupplierList();
                // setIsModalVisible(false);
                buttonSubmitting = false;
                notifyFail(STRING.fail);
                console.log(error);
              }
            }
          }}
          validationSchema={
            shouldAddItem ? validationSchemaToAdd : validationSchemaToEdit
          }
        >
          {(formikProps) => {
            return (
              <Modal isOpen={isModalVisible} size="xl" toggle={toggle} centered>
                <Form>
                  <ModalHeader toggle={toggle}>
                    {shouldAddItem
                      ? "Thêm nhà cung cấp/添加供应商"
                      : "Sửa nhà cung cấp/供應商變更"}
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
                    <Button className="btn btn-secondary" onClick={toggle}>
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

  const DataTable = (props) => {
    const { hidden } = props;

    return (
      <div className="card" style={hidden ? { display: "none" } : {}}>
        <div className="card-body">
          <Table
            striped
            bordered
            hover
            responsive
            className="mb-3"
            id={hidden && "export__excel__supplier"}
          >
            <thead>
              <tr>
                {headerTable.map((item, index) => {
                  return item.title === "checkbox" ? (
                    !hidden && (
                      <th key={index} className="text-center align-middle">
                        <input
                          type="checkbox"
                          checked={checkItemList.every(Boolean)}
                          onChange={() => onChangeCheckAllItem()}
                        />
                      </th>
                    )
                  ) : item.title === "Export excel" ? (
                    !hidden && (
                      <th key={index} className="text-center align-middle">
                        {item.title}
                      </th>
                    )
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
              {supplierData?.length ? (
                supplierData.map((item, index) => {
                  return (
                    <tr key={index} style={{ cursor: "pointer" }}>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {index + recordsPerPage * ((activePage || 1) - 1) + 1}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.code || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.name || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.phoneNumber || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.email || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.representative || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.tax || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.address || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.createdBy || "--"}
                        <br />(
                        {item.createdDate
                          ? Moment(item.createdDate).format("hh:mm DD/MM/YYYY")
                          : "--:--"}
                        )
                        {/* {`${item.createdBy || "--"} (${
                          item.createdDate
                            ? Moment(item.createdDate).format(
                                "hh:mm DD/MM/YYYY"
                              )
                            : "--:--"
                        })`} */}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() => {
                          setChosenIndex(index);
                          setShouldAddItem(false);
                          setIsModalVisible(true);
                        }}
                      >
                        {item.modifiedBy || "--"}
                        <br />(
                        {item.modifiedDate
                          ? Moment(item.modifiedDate).format("hh:mm DD/MM/YYYY")
                          : "--:--"}
                        )
                        {/* {`${item.modifiedBy || "--"} (${
                          item.modifiedDate
                            ? Moment(item.modifiedDate).format(
                                "hh:mm DD/MM/YYYY"
                              )
                            : "--:--"
                        })`} */}
                      </td>
                      {!hidden && (
                        <>
                          <td className="text-center align-middle">
                            <ExportDetail item={item} index={index} />
                          </td>
                          <td className="text-center align-middle">
                            <input
                              type="checkbox"
                              checked={checkItemList[index]}
                              onChange={() => onChangeCheckItem(index)}
                            />
                          </td>
                        </>
                      )}
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
          <PaginationComponent
            activePage={activePage}
            itemCountPerPage={recordsPerPage}
            totalItemsCount={paging.totalItem}
            action={handleChangePage}
          />
        </div>
      </div>
    );
  };

  const DetailTableToExport = () => {
    const item = { ...supplierData[0] };

    return supplierData.length
      ? supplierData.map((item, index) => (
          <div className="card" key={index} style={{ display: "none" }}>
            <div className="card-body">
              <Table bordered responsive id={`${item.code}_${index}`}>
                <tbody>
                  <tr>
                    <td
                      colSpan="10"
                      // className="text-center"
                      // style={{ paddingLeft: 150 }}
                    >
                      <h3>Công ty TNHH Công nghệ công trình SHENG HUEI</h3>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="10" // className="text-center"
                      // style={{ paddingLeft: 300 }}
                    >
                      <h3>聖暉工程科技有限公司</h3>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" className="text-center"></td>
                  </tr>
                  <tr>
                    <td colSpan="10" className="text-center"></td>
                  </tr>
                  <tr>
                    <td
                      colSpan="10" // className="text-center"
                      // style={{ paddingLeft: 150 }}
                    >
                      <h4>Bảng tư liệu nhà cung cấp</h4>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="10" // className="text-center"
                      // style={{ paddingLeft: 300 }}
                    >
                      <h4>廠商資料表</h4>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="10" className="text-center"></td>
                  </tr>
                  <tr>
                    <td colSpan="10">
                      廠商代號 Số hiệu nhà cung cấp: {item.code || ""}
                    </td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td
                      colSpan="2"
                      rowSpan="17"
                      // className="align-start"
                    >
                      基 本 資 料 Tư Liệu Cơ Bản
                    </td>
                    <td colSpan="2">
                      廠商中文名稱 <br /> Tên tiếng Việt
                    </td>
                    <td colSpan="6">{item.name || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      廠商中文名稱
                      <br /> Tên tiếng Trung
                    </td>
                    <td colSpan="6">{item.subName || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      廠商中文名稱
                      <br /> Tên tiếng Anh
                    </td>
                    <td colSpan="6">{item.engName || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      網址
                      <br /> Trang Web
                    </td>
                    <td colSpan="3">{item.web || "--"}</td>
                    <td>
                      統一編號
                      <br /> Mã số thuế
                    </td>
                    <td colSpan="2">{item.tax || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      負責人
                      <br /> Người phụ trách
                    </td>
                    <td colSpan="3">{item.representative || "--"}</td>
                    <td>
                      資本額
                      <br /> Vốn điều lệ
                    </td>
                    <td colSpan="2">
                      {item.charterCapital
                        ? formatNumber(item.charterCapital)
                        : "--"}{" "}
                      {item.moneyTypeCharterCapital
                        ? getCurrency(item.moneyTypeCharterCapital, moneyUnit)
                        : ""}
                    </td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      電話
                      <br /> Điện thoại
                    </td>
                    <td colSpan="3">{item.phoneNumber || "--"}</td>
                    <td>
                      傳真
                      <br /> Fax
                    </td>
                    <td colSpan="2">{item.fax || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      聯絡人
                      <br /> Tên người liên lạc
                    </td>
                    <td colSpan="3">{item.contact || "--"}</td>
                    <td>
                      行動電話
                      <br /> Điện thoại DĐ
                    </td>
                    <td colSpan="2">{item.contactPhoneNumber || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      公司設立日期
                      <br /> Ngày thành lập công ty
                    </td>
                    <td colSpan="3">
                      {item.registrationDate
                        ? Moment(item.registrationDate).format("DD/MM/YYYY")
                        : "--"}
                    </td>
                    <td>
                      年營業額
                      <br /> Doanh thu năm
                    </td>
                    <td colSpan="2">
                      {item.revenue ? formatNumber(item.revenue) : "--"}{" "}
                      {item.moneyTypeRevenue
                        ? getCurrency(item.moneyTypeRevenue, moneyUnit)
                        : ""}
                    </td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      產品認證
                      <br /> Tiêu chuẩn sản phẩm
                    </td>
                    <td colSpan="6">
                      {item.certificateProduct === 1 ? "ISO" : "Khác/其他"}
                    </td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      設立地址
                      <br /> Địa chỉ thành lập
                    </td>
                    <td colSpan="6">{item.officeAddress || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      聯絡地址
                      <br /> Địa chỉ liên lạc
                    </td>
                    <td colSpan="6">{item.address || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      銀行及分行名 <br />
                      Tên ngân hàng
                    </td>
                    <td colSpan="6">{item.bankName || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      銀行帳號
                      <br /> Số tài khoản
                    </td>
                    <td colSpan="2">{item.accountNumber || "--"}</td>
                    <td>Swift code</td>
                    <td colSpan="3">{item.swiftCode || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td rowSpan="2" colSpan="2">
                      類型 Loại hình
                    </td>
                    <td>
                      <input type="checkbox" checked={item.type === 1} />
                    </td>
                    <td colSpan="2">Sản xuất chế tạo/製造商</td>
                    <td>
                      <input type="checkbox" checked={item.type === 2} />
                    </td>
                    <td colSpan="2">Đại lí/承包商</td>
                  </tr>
                  {/* ----------------------------- */}
                  {/* <tr>
                    
                  </tr> */}
                  {/* ----------------------------- */}
                  {/* <tr>
                    
                  </tr> */}
                  {/* ----------------------------- */}
                  <tr>
                    <td>
                      <input type="checkbox" checked={item.type === 3} />
                    </td>
                    <td colSpan="2">Xuất khẩu/出口商</td>
                    <td>
                      <input type="checkbox" checked={item.type === 4} />
                    </td>
                    <td colSpan="2">Khác/其他</td>
                  </tr>
                  {/* ----------------------------- */}
                  {/* <tr>
                   
                  </tr> */}
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      產品類別
                      <br /> Loại sản phẩm
                    </td>
                    <td colSpan="6">{item.productType || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td>
                      <input type="checkbox" checked={false} />
                    </td>
                    <td colSpan="2">指定廠商 Chỉ định nhà cung cấp</td>
                    <td>
                      <input type="checkbox" checked={false} />
                    </td>
                    <td>特殊狀況 Điều kiện đặc biệt</td>
                    <td>
                      <input type="checkbox" checked={false} />
                    </td>
                    <td colSpan="2">客戶指定 Khách hàng chỉ định</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      備註
                      <br /> Ghi chú
                    </td>
                    <td colSpan="8">{item.note || "--"}</td>
                  </tr>
                  {/* ----------------------------- */}
                  <tr>
                    <td colSpan="2">
                      核准
                      <br /> Phê chuẩn
                    </td>
                    <td colSpan="2">--</td>
                    <td>
                      審核
                      <br /> Xét duyệt
                    </td>
                    <td colSpan="2">--</td>
                    <td>
                      承 辦<br /> Lập bảng
                    </td>
                    <td colSpan="2">--</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        ))
      : "";
  };

  const getSupplierList = async () => {
    try {
      setIsLoading(true);
      const res = await supplierList({
        str: searchedName.trim(),
        page: activePage,
      });
      setPaging({
        ...paging,
        totalItem: res?.data?.totalItem,
        totalPage: res?.data?.totalPage,
      });
      setSupplierData(res?.data?.list);
      let isCheckedItems = Array(res?.data?.list.length).fill(false);
      setCheckItemList(isCheckedItems);
      setIsLoading(false);
    } catch (error) {}
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

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      let text = e.target.value;
      if (!text) {
        return;
      }

      text = text.trim();
      if (!text) {
        return;
      }
      getSupplierList();
    }
  };

  const handleChangePage = (page) => {
    setActivePage(page);
  };

  const clearSearching = async () => {
    try {
      setIsLoading(true);
      setSearchedName("");
      const res = await supplierList({
        str: "",
        page: 1,
      });
      setSupplierData(res?.data?.list);
      setPaging({
        ...paging,
        totalItem: res?.data?.totalItem,
        totalPage: res?.data?.totalPage,
      });
      let isCheckedItems = Array(res?.data?.list.length).fill(false);
      setCheckItemList(isCheckedItems);
      setIsLoading(false);
    } catch (error) {}
  };

  const countNumberOfElementIsChecked = (arrCheck) => {
    return arrCheck.filter((item) => item).length;
  };

  const onChangeCheckAllItem = () => {
    let checkedAllItems = [...checkItemList];
    checkedAllItems.fill(!checkedAllItems.every(Boolean));
    setCheckItemList(checkedAllItems);
  };

  const onChangeCheckItem = (index) => {
    let checkedItems = [...checkItemList];
    checkedItems[index] = !checkItemList[index];
    setCheckItemList(checkedItems);
  };

  const onDeleteItem = async () => {
    const idItemArr = [];
    checkItemList.forEach((item, index) => {
      if (item) {
        idItemArr.push(supplierData[index].id);
      }
    });
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("listId", idItemArr.join());
      // const payload = {
      //   listId: idItemArr.join(),
      // };
      await deleteSupplier(formData);
      setConfirmModal(false);
      notifySuccess(STRING.success);
      getSupplierList();
    } catch (error) {
      setConfirmModal(false);
      notifyFail(STRING.fail);
      getSupplierList();
    }
  };

  return (
    <ScreenWrapper
      titleHeader={`${STRING.supplier}/供应商`}
      isLoading={isLoading}
      isError={isError}
      hasButton={true}
    >
      <HeaderButton />
      <>
        <ModalAddEdit />
        <ConfirmModal
          isOpen={confirmModal}
          onHide={() => setConfirmModal(false)}
          title={`${STRING.delete}/抹去 ${countNumberOfElementIsChecked(
            checkItemList
          )} nhà cung cấp/供应商`}
          action={() => onDeleteItem()}
        />
        <FilterField />
        <ButtonGroup />
        <DataTable hidden={false} />
        <DataTable hidden={true} />
        <DetailTableToExport />
      </>
    </ScreenWrapper>
  );
}

SupplierListScreen.propTypes = {};

export default SupplierListScreen;
