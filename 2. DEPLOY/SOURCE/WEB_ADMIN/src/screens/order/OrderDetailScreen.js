import {
  PlusCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
} from "antd";
import {
  createUser,
  updateUser,
  deleteUser,
  userList,
  userDetail,
  resetPassword,
} from "network/AccountApi";
import Button from "components/Button";
import ScreenWrapper from "components/ScreenWrapper";
import { ROUTER, STRING } from "constants/Constant";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { notifyFail, notifySuccess } from "utils/notify";
import Moment from "moment";
import { createSupplier } from "network/SupplierApi";
import InputField from "components/InputField";
import ConfirmModal from "components/ConfirmModal";
import RadioField from "components/RadioField";
import {
  orderDetail,
  getMoneyUnit,
  supplierFullList,
  deleteOrder,
} from "network/OrderApi";
import SelectField from "components/SelectField";

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
];

const formatNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function OrderDetailScreen(props) {
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
  const [paymentMethod, setPaymentMethod] = useState({
    paymentClause: undefined,
    paymentPercent: "",
    createdDate: "",
    // -----------------
    code: "",
    receivedDate: "",
    numberOfAcceptance: "",
    amountOfAcceptance: "",
    currency: undefined,
  });
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [selectedSupplierCode, setSelectedSupplierCode] = useState("");

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
    vatRate: "",
    moneyAfterTax: "",
    constructionCode: "",
    paymentCondition: "",
    // -------------------------------
    estimatedCategory: "",
    estimatedCategoryName: "",
    amountOfEstimating: "",
    estimatingCurrency: undefined,
  });

  const [supplierName, setSupplierName] = useState("");

  // const userRole = localStorage.getItem("userRole");

  const history = useHistory();

  useEffect(() => {
    // getSupplierList();
    // getMoneyType();
    // if (state.isUpdate) {
    getOrderDetail(id);
    // }
  }, []);

  const HeaderButton = () => {
    return (
      <>
        <Button
          className="btn btn-danger mr-2"
          onClick={() => {
            setConfirmModal(true);
          }}
        >
          Xóa/抹去
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() =>
            history.push({
              pathname: `/sua-don-hang/${id}`,
              state: { isUpdate: true },
            })
          }
        >
          Chỉnh sửa/编辑
        </Button>
      </>
    );
  };

  console.table(paymentMethodList);

  const PaymentMethodTable = () => {
    return (
      <Table striped bordered hover className="mb-3">
        <thead>
          <tr>
            {headerTable.map((item, index) => {
              return (
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
          {paymentMethodList?.length ? (
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
                  <td className="text-center align-middle">{`${
                    item.amountOfPayment
                      ? item.amountOfPayment
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      : "--"
                  } ${
                    orderObject.moneyUnit === 1
                      ? "VNĐ"
                      : orderObject.moneyUnit === 3
                      ? "USD"
                      : orderObject.moneyUnit === 4
                      ? "CNY"
                      : orderObject.moneyUnit === 5
                      ? "TWD"
                      : ""
                  }`}</td>
                  <td className="text-center align-middle">
                    {`${item.paymentPercent}%`}
                  </td>
                  <td className="text-center align-middle">
                    {item.createdDate}
                  </td>
                  <td className="text-center align-middle">
                    {`${item.accumulatedPayment
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${
                      orderObject.moneyUnit === 1
                        ? "VNĐ"
                        : orderObject.moneyUnit === 3
                        ? "USD"
                        : orderObject.moneyUnit === 4
                        ? "CNY"
                        : orderObject.moneyUnit === 5
                        ? "TWD"
                        : ""
                    }`}
                  </td>
                  <td className="text-center align-middle">{`${item.accumulatedPaymentPercent}%`}</td>
                  <td className="text-center align-middle">{item.code}</td>
                  <td className="text-center align-middle">
                    {item.receivedDate}
                  </td>
                  <td className="text-center align-middle">
                    {item.numberOfAcceptance}
                  </td>
                  <td className="text-center align-middle">
                    {item.amountOfAcceptance
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
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
                </tr>
              );
            })
          ) : (
            <tr className="text-center">
              <td className="p-2" colSpan={11}>
                <Empty description={<span>{STRING.emptyList}</span>} />
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    );
  };

  console.log({ orderObject });

  const getOrderDetail = async (orderId) => {
    try {
      setIsLoading(true);
      const res = await orderDetail({ Id: orderId });
      let suppliersRes = await supplierFullList();
      const baseUrl = "http://qldh.winds.vn:6886";
      const fileArr = res.data?.path?.split(",");

      let newListFileList =
        fileArr?.length && fileArr[0]
          ? fileArr?.map((file, index) => ({
              uid: index,
              name: file.split("/")[file.split("/").length - 1],
              status: "done",
              url: `${baseUrl}${file}`,
              path: file,
            }))
          : [];

      setListFileUpload(newListFileList);

      const selectedObj = suppliersRes.data.find(
        (item) => item.id === res.data.providerID
      );

      setSelectedSupplierCode(selectedObj?.code);

      setOrderObject({
        ...orderObject,
        supplierId: res.data.providerID,
        constructionName: res.data.contructionName,
        taxMoney: res.data.amountBeforeTax,
        moneyUnit: res.data.moneyTypeID,
        dueWarranty: res.data.warrantyPeriod,
        finePerDay: res.data.outOfDate,
        contractCode: res.data.contactCode,
        dueDate: res.data.deadlineDate ? res.data.deadlineDate : "--",
        isImport: res.data.isImport == 1 ? true : false,
        productType: res.data.productType,
        constructionType: res.data.contructionType,
        purchaseContent: res.data.description,
        status: res.data.status,
        orderCode: res.data.code,
        vatRate: res.data.rate,
        moneyAfterTax: parseInt(res.data.amountAfterTax),
        constructionCode: res.data.constructionCode,
        paymentCondition: res.data.paymentTerms,
        // -------------------------
        estimatedCategory: res.data.estimatedCategory,
        estimatedCategoryName: res.data.estimatedName,
        amountOfEstimating: res.data.amountMoney
          ? parseFloat(res.data.amountMoney)
          : "",
        estimatingCurrency: res.data.amountMoneyType,
      });

      let supplierRes = await supplierFullList();
      // console.log(res.data.providerID, supplierRes.data, "supplierRes");
      const name = supplierRes.data.filter(
        (ducanh) => ducanh.id === res.data.providerID // wtf ducanh?
      );
      // console.log(name[0].name, "ÁDasjbkfehbjefhbedfqujh");
      setSupplierName(name[0]?.name);

      // let newArr = [...res.data.orderPaymentDetails];

      // for (let index = 0; index <= newArr.length; index++) {
      //   if (newArr[index].percent === null) {
      //     newArr.splice(index, 1);
      //   }
      // }
      // newArr.forEach((item, index) => {
      //   if (item.percent == null) {
      //     newArr.splice(index, 1)
      //   }
      // })

      if (res.data.orderPaymentDetails?.length) {
        res.data.orderPaymentDetails.forEach((item, index) => {
          item.paymentPercent = parseFloat(
            res.data.orderPaymentDetails[index].percent
          );
          item.createdDate = res.data.orderPaymentDetails[index].paymentDate;
          item.paymentClause = parseInt(
            res.data.orderPaymentDetails[index].paymentType
          );
          item.accumulatedPayment = parseFloat(
            res.data.orderPaymentDetails[index].moneyAccumulation
          );
          item.accumulatedPaymentPercent = parseFloat(
            res.data.orderPaymentDetails[index].percentAccumulation
          );
          item.amountOfPayment = parseFloat(
            res.data.orderPaymentDetails[index].paymentAmount
          );

          // ----------------------------------------
          item.AmountOfAcceptance = parseFloat(
            res.data.orderPaymentDetails[index].AmountOfAcceptance
          );
          item.code = res.data.orderPaymentDetails[index].receiveCode;
          item.receivedDate = res.data.orderPaymentDetails[index].receiveDate;
          item.numberOfAcceptance = parseInt(
            res.data.orderPaymentDetails[index].numberOfTests
          );
          item.currency = parseInt(
            res.data.orderPaymentDetails[index].amountOfAcceptanceType
          );

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
      }

      setPaymentMethodList(res.data.orderPaymentDetails);

      // arr = [
      //   {paymentClause: 1, paymentPercent: 12, createdDate: "20/12/2021"},
      //   {paymentClause: 2, paymentPercent: 40, createdDate: "20/12/2021"},
      //   {paymentClause: 3, paymentPercent: 42, createdDate: "20/12/2021"}
      // ]

      setIsLoading(false);
    } catch (error) {
      console.log(error, "error detail");
      notifyFail(STRING.fail);
    }
  };

  const [confirmModal, setConfirmModal] = useState(false);

  // const handleMultiFile = async (value) => {
  //   if (value.fileList.length > listFileUpload.length) {
  //     try {
  //       let lengthArr = value.fileList.length;
  //       let formData = new FormData();

  //       formData.append("Name", "");
  //       formData.append("Path", "http://qldh.winds.vn:6886/api");
  //       formData.append("OrderId", "");
  //       formData.append("File", value.fileList[lengthArr - 1].originFileObj);
  //       const res = await uploadDocument(formData);

  //       let newListFileUpload = [...listFileUpload];

  //       newListFileUpload.push({
  //         uid: value.fileList[lengthArr - 1].uid,
  //         name: res.data.fileName.split("/")[
  //           res.data.fileName.split("/").length - 1
  //         ],
  //         status: "done",
  //         url: `http://qldh.winds.vn:6886${res.data.fileName}`,
  //         path: res.data.fileName,
  //       });

  //       setListFileUpload(newListFileUpload);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     let newListFileUpload = JSON.parse(JSON.stringify(listFileUpload));
  //     let listElmUploaded = newListFileUpload.map(
  //       (fileUpload) => fileUpload.uid
  //     );
  //     for (let index = 0; index < listElmUploaded.length; index++) {
  //       let currentIndexIsDeleted = value.fileList.findIndex(
  //         (item) => listElmUploaded[index] === item.uid
  //       );

  //       if (currentIndexIsDeleted === -1) {
  //         newListFileUpload.splice(index, 1);
  //         break;
  //       }
  //     }
  //     setListFileUpload(newListFileUpload);
  //   }
  // };

  const onDeleteItem = async () => {
    try {
      // setIsLoading(true);
      let formData = new FormData();
      formData.append("listId", id.toString());
      // console.log(formData);
      await deleteOrder(formData);
      setConfirmModal(false);
      notifySuccess(STRING.success);
      history.push("/don-hang");
    } catch (error) {
      setConfirmModal(false);
      // notifyFail(STRING.fail);
      // getUserList();
    }
  };

  console.log();

  return (
    <ScreenWrapper
      titleHeader="Chi tiết đơn hàng/订单详细信息"
      isLoading={isLoading}
      isError={isError}
      hasButton={true}
      detail={true}
      context={props}
    >
      <HeaderButton />
      <div className="card">
        <div className="card-body">
          <Divider orientation="left">
            <h5>{STRING.orderInfo}/訂單信息</h5>
          </Divider>
          <Row gutter={[24, 16]}>
            <Col className="gutter-row" span={12}>
              {/* ------------------Mã đơn hàng--------------------- */}
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
              {/* ------------------Nhà cung cấp--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.supplier}</span>
                    <br />
                    <span>供應商</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <label>{supplierName || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Mã hhà cung cấp--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.supplierCode}</span>
                    <br />
                    <span>供應商代碼</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <label>{selectedSupplierCode || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Mã công trình--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.constructionCode}</span>
                    <br />
                    <span>工程編號</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <label>{orderObject.constructionCode || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Tên công trình--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.constructionName}</span>
                    <br />
                    <span>工程名稱</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <label>{orderObject.constructionName || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Số tiền trước thuế--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.taxMoney}</span>
                    <br />
                    <span>稅前金額</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <label>
                        {orderObject.taxMoney
                          ? orderObject.taxMoney
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "--"}{" "}
                        {orderObject.moneyUnit === 1
                          ? "VNĐ"
                          : orderObject.moneyUnit === 3
                          ? "USD"
                          : orderObject.moneyUnit === 4
                          ? "CNY"
                          : orderObject.moneyUnit === 5
                          ? "TWD"
                          : ""}
                      </label>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* ------------------Tỉ lệ VAT--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={10}>
                    <span>{STRING.vatRate}</span>
                    <br />
                    <span>稅率</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <label>{orderObject.vatRate || "0"}%</label>
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
                      <label>
                        {orderObject.moneyAfterTax
                          ? orderObject.moneyAfterTax
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "--"}{" "}
                        {orderObject.moneyUnit === 1
                          ? "VNĐ"
                          : orderObject.moneyUnit === 3
                          ? "USD"
                          : orderObject.moneyUnit === 4
                          ? "CNY"
                          : orderObject.moneyUnit === 5
                          ? "TWD"
                          : ""}
                      </label>
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
                    <span>保固期間</span>
                  </Col>
                  <Col className="gutter-row" span={14}>
                    <div className="d-flex justify-content-between">
                      <label>{`${
                        orderObject.dueWarranty || "--"
                      } Năm/年`}</label>
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
                      <label>{`${orderObject.finePerDay || "--"}%`}</label>
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
                      {...props}
                      // onChange={handleMultiFile}
                      fileList={listFileUpload}
                    >
                      <ButtonAntd disabled icon={<UploadOutlined />}>
                        Đăng file/附件檔案
                      </ButtonAntd>
                    </Upload>
                    <label>{orderObject.document}</label>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col className="gutter-row" span={12}>
              {/* ------------------Trạng thái đơn hàng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.status}</span>
                    <br />
                    <span>訂單狀態</span>
                  </Col>
                  <Col span={14}>
                    <label>
                      {orderObject.status === 1
                        ? "Đã đặt hàng/已訂購"
                        : orderObject.status === 2
                        ? "Đang vận chuyển/運輸中"
                        : orderObject.status === 3
                        ? "Đã về cảng/已到港口"
                        : orderObject.status === 4
                        ? "Hoàn thành/完成"
                        : ""}
                    </label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Mã hợp đồng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.contractCode}</span>
                    <br />
                    <span>合約編號</span>
                  </Col>
                  <Col span={14}>
                    <label>{orderObject.contractCode || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Thời hạn hoàn công--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{`${STRING.dueDate} (Giao hàng)`}</span>
                    <br />
                    <span>完工 (交貨) 期限</span>
                  </Col>
                  <Col span={14}>
                    <label>
                      {/* {orderObject.dueDate
                        ? Moment(orderObject.dueDate).format("DD/MM/YYYY")
                        : "--"} */}
                      {orderObject.dueDate}
                    </label>
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
                    <Checkbox checked={orderObject.isImport} disabled />
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
                    <label>{orderObject.estimatedCategory || "--"}</label>
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
                    <label>{orderObject.estimatedCategoryName || "--"}</label>
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
                    <label>
                      {orderObject.amountOfEstimating
                        ? orderObject.amountOfEstimating
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "--"}{" "}
                      {orderObject.estimatingCurrency === 1
                        ? "VNĐ"
                        : orderObject.estimatingCurrency === 3
                        ? "USD"
                        : orderObject.estimatingCurrency === 4
                        ? "CNY"
                        : orderObject.estimatingCurrency === 5
                        ? "TWD"
                        : ""}
                    </label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Loại sản phẩm--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.productType}</span>
                    <br />
                    <span>產品類別</span>
                  </Col>
                  <Col span={14}>
                    <label>{orderObject.productType || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Loại công trình--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.constructType}</span>
                    <br />
                    <span>工程類別</span>
                  </Col>
                  <Col span={14}>
                    <label>{orderObject.constructionType || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Nội dung mua hàng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>{STRING.purchaseContent}</span>
                    <br />
                    <span>購買內容</span>
                  </Col>
                  <Col span={14}>
                    <label>{orderObject.purchaseContent || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Điều kiện thanh toán--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Điều kiện thanh toán</span>
                    <br />
                    <span>付款條件</span>
                  </Col>
                  <Col span={14}>
                    <label>{orderObject.paymentCondition || "--"}</label>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          {/* --------------------------Phương thức thanh toán----------------------------------- */}
          {/* <div className="mt-2 mb-4">
            
          </div> */}
          <ConfirmModal
            isOpen={confirmModal}
            onHide={() => setConfirmModal(false)}
            title={`${STRING.delete}/抹去 
              đơn hàng/訂單 ${orderObject.orderCode}`}
            action={() => onDeleteItem()}
          />
          <PaymentMethodTable />
        </div>
      </div>
    </ScreenWrapper>
  );
}

OrderDetailScreen.propTypes = {};

export default OrderDetailScreen;
