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
  AutoComplete,
  InputNumber,
} from "antd";
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
import RadioField from "components/RadioField";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FastField, Form, Formik } from "formik";
import * as Yup from "yup";
import SelectField from "components/SelectField";
import DatePickerField from "components/DatePickerField";
import SubDatePickerField from "components/SubDatePickerField";
import {
  createCoupon,
  updateCoupon,
  couponDetail,
  filteredOrderList,
  filteredSupplierList,
} from "network/WarehouseReceiptApi";
import { getMoneyUnit } from "network/OrderApi";
const { Option } = Select;
const { TextArea } = Input;

const shipmentProgressList = [
  { value: 1, label: "Đang chuẩn bị hàng/備料中" },
  { value: 2, label: "Đã đóng hàng lên cont/已裝櫃" },
  { value: 3, label: "Đã xuất cảng/已出港" },
  { value: 4, label: "Đã đến cảng/已到港" },
  { value: 5, label: "Đã đến công trình/已到港現場" },
];

const formatNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const formatPureNumber = (n) => {
  if (!n) return;
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, "");
};

function CreateImportScreen(props) {
  const [orderList, setOrderList] = useState(undefined);
  const state = props.location.state;
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [listFileUpload, setListFileUpload] = useState([]);
  const [isError, setIsError] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState({
    supplierName: "",
    purchaseContent: "",
    moneyUnit: "",
    originOrderMoney: "",
    paymentTerms: "",
  });

  const [orderConstructionDate, setOrderConstructionDate] = useState("");

  const [moneyUnit, setMoneyUnit] = useState([]);

  const [orderCoupon, setOrderCoupon] = useState({
    orderId: "",
    content: "",
    constructionDate: "",
    etd: "",
    eta: "",
    portExport: "",
    contNumber: "",
    realityETD: "",
    realityETA: "",
    realityDate: "",
    note: "",
    orderCode: "",
    shipmentProgress: null,
    // ---------------------------------------
    agentCost: "",
    agentCurrency: undefined,
    otherCost: "",
    otherCurrency: undefined,
    termsOfSale: "",
    exportDocument: "",
  });

  const history = useHistory();

  var buttonSubmitting = false;

  useEffect(async () => {
    getListOrder();
    getMoneyType();
    if (state.isUpdate) {
      getCouponDetail(id);
      return;
    }
    if (!state.isUpdate && state.data) {
      console.log("okkkeokokokokokok");
      const tempOrderList = await filteredOrderList();
      const chosenOrder = tempOrderList.data.find(
        (item) => item.id === state.data.id
      );
      if (chosenOrder) {
        const supplierDetail = await filteredSupplierList({
          id: chosenOrder.id,
        });
        setSelectedOrder({
          // ...res.data,
          supplierName: supplierDetail.data.providerName,
          purchaseContent: state.data.description,
          orderId: state.data.id,
          providerId: state.data.providerID,
          originOrderMoney: state.data.amountBeforeTax,
          moneyUnit: state.data.amountMoneyType,
          paymentTerms: state.data.paymentTerms,
        });
        setOrderCoupon({
          ...orderCoupon,
          orderCode: chosenOrder ? chosenOrder.code : "",
        });
        setOrderConstructionDate(state.data.deadlineDate);
      }

      console.log(state.data, "state.data");
    }
  }, []);

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
          onClick={() =>
            !state.isUpdate ? addNewCoupon() : updateChosenCoupon()
          }
        >
          {STRING.save}/存
        </Button>
      </>
    );
  };

  const getListOrder = async () => {
    try {
      const res = await filteredOrderList();
      let newArr = [...res.data];
      newArr.forEach((item, index) => {
        item.value = newArr[index].code;
        item.label = newArr[index].code;
      });
      setOrderList(newArr);
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

  const getCouponDetail = async (couponId) => {
    try {
      const res = await couponDetail({ Id: couponId });
      const tempOrderList = await filteredOrderList();
      const chosenOrder = tempOrderList.data.find(
        (item) => item.id === res.data.orderId
      );
      if (chosenOrder) {
        const supplierDetail = await filteredSupplierList({
          id: chosenOrder.id,
        });
        setSelectedOrder({
          ...res.data,
          supplierName: supplierDetail.data.providerName,
          purchaseContent: res.data.content,
          moneyUnit:
            res.data.orderMoneyType !== 0 ? res.data.orderMoneyType : undefined,
          originOrderMoney: res.data.orderMoney
            ? parseFloat(res.data.orderMoney)
            : "",
          paymentTerms: res.data.paymentTerms,
        });
      }
      // console.log({ res });
      setOrderCoupon({
        ...orderCoupon,
        orderCode: chosenOrder ? chosenOrder.code : "",
        orderId: res.data.orderId || "",
        content: res.data.content || "",
        constructionDate: res.data.constructionDate || "",
        etd: res.data.etd ? Moment(res.data.etd).format("DD/MM/YYYY") : "",
        eta: res.data.eta ? Moment(res.data.eta).format("DD/MM/YYYY") : "",
        portExport: res.data.portExport || "",
        contNumber: res.data.contNumber || "",
        realityETD: res.data.realityETD
          ? Moment(res.data.realityETD).format("DD/MM/YYYY")
          : "",
        realityETA: res.data.realityETA
          ? Moment(res.data.realityETA).format("DD/MM/YYYY")
          : "",
        realityDate: res.data.realityDate
          ? Moment(res.data.realityDate).format("DD/MM/YYYY")
          : "",
        note: res.data.note || "",
        shipmentProgress:
          res.data.deliveryProgress !== 0
            ? res.data.deliveryProgress
            : undefined,
        // originOrderMoney: res.data.orderMoney
        //   ? parseFloat(res.data.orderMoney)
        //   : "",
        // moneyUnit:
        //   res.data.orderMoneyType !== 0 ? res.data.orderMoneyType : undefined,
        // -------------------------------------------
        agentCost: res.data.agentMoney ? parseFloat(res.data.agentMoney) : "",
        agentCurrency:
          res.data.agentMoneyType !== 0 ? res.data.agentMoneyType : undefined,
        otherCost: res.data.otherMoney ? parseFloat(res.data.otherMoney) : "",
        otherCurrency:
          res.data.otherMoneyType !== 0 ? res.data.otherMoneyType : undefined,
        termsOfSale: res.data.termsOfSale,
        exportDocument: res.data.shippingDocuments,
      });
      setOrderConstructionDate(chosenOrder.deadlineDate || "");
    } catch (error) {
      notifyFail(STRING.fail);
    }
  };

  // console.log({ selectedOrder });

  const addNewCoupon = async () => {
    if (!buttonSubmitting) {
      buttonSubmitting = true;

      try {
        if (!orderCoupon.orderCode) {
          notifyFail("Mã đơn hàng không được để trống!");
          document.getElementById("orderCode").focus();
          return;
        }
        // if (!orderCoupon.constructionDate) {
        //   notifyFail("Thời gian yêu cầu không được để trống!");
        //   document.getElementById("requiredTime").focus();
        //   return;
        // }
        if (!orderCoupon.portExport) {
          notifyFail("Cảng xuất khẩu không được để trống!");
          document.getElementById("portExport").focus();
          return;
        }
        if (!orderCoupon.contNumber) {
          notifyFail("Số container không được để trống ");
          document.getElementById("contNumber").focus();
          return;
        }
        if (orderCoupon.agentCost) {
          if (!orderCoupon.agentCurrency) {
            notifyFail("Đơn vị tiền phí đại lý chưa được chọn!");
            return;
          }
        }
        if (orderCoupon.otherCost) {
          if (!orderCoupon.otherCurrency) {
            notifyFail("Đơn vị tiền phí khác chưa được chọn!");
            return;
          }
        }

        const payload = {
          orderCode: orderCoupon.orderCode,
          orderId: selectedOrder.orderId ? selectedOrder.orderId : "",
          providerId: selectedOrder.providerId ? selectedOrder.providerId : "",
          providerName: selectedOrder.supplierName
            ? selectedOrder.supplierName
            : "",
          content: selectedOrder.purchaseContent
            ? selectedOrder.purchaseContent
            : "",
          constructionDate: orderConstructionDate
            ? Moment(orderConstructionDate).format("DD/MM/YYYY")
            : "",
          etd: orderCoupon.etd ? orderCoupon.etd : "",
          eta: orderCoupon.eta ? orderCoupon.eta : "",
          PortExport: orderCoupon.portExport.trim()
            ? orderCoupon.portExport.trim()
            : "",
          contNumber: orderCoupon.contNumber ? orderCoupon.contNumber : "",
          realityETD: orderCoupon.realityETD ? orderCoupon.realityETD : "",
          realityETA: orderCoupon.realityETA ? orderCoupon.realityETA : "",
          realityDate: orderCoupon.realityDate ? orderCoupon.realityDate : "",
          note: orderCoupon.note.trim() ? orderCoupon.note.trim() : "",
          deliveryProgress: orderCoupon.shipmentProgress
            ? parseInt(orderCoupon.shipmentProgress)
            : 0,
          // ---------------------------------------------
          orderMoney: selectedOrder.originOrderMoney
            ? selectedOrder.originOrderMoney.toString()
            : "",
          orderMoneyType: selectedOrder.moneyUnit || 0,
          termsOfSale: orderCoupon.termsOfSale || "",
          shippingDocuments: orderCoupon.exportDocument || "",
          agentMoney: orderCoupon.agentCost
            ? orderCoupon.agentCost.toString()
            : "",
          agentMoneyType: orderCoupon.agentCurrency || 0,
          otherMoney: orderCoupon.otherCost
            ? orderCoupon.otherCost.toString()
            : "",
          otherMoneyType: orderCoupon.otherCurrency || 0,
          paymentTerms: selectedOrder.paymentTerms,
        };

        await createCoupon(payload);

        buttonSubmitting = false;

        notifySuccess(STRING.success);
        history.push("/phieu-nhap");
      } catch (error) {
        // notifyFail(STRING.fail);
        // buttonSubmitting = false;
      }
    }
  };

  const updateChosenCoupon = async () => {
    if (!buttonSubmitting) {
      try {
        buttonSubmitting = true;

        if (!orderCoupon.orderCode) {
          notifyFail("Mã đơn hàng không được để trống!");
          document.getElementById("orderCode").focus();
          return;
        }
        // if (!orderCoupon.constructionDate) {
        //   notifyFail("Thời gian yêu cầu không được để trống!");
        //   document.getElementById("requiredTime").focus();
        //   return;
        // }
        if (!orderCoupon.portExport) {
          notifyFail("Cảng xuất khẩu không được để trống!");
          document.getElementById("portExport").focus();
          return;
        }
        if (!orderCoupon.contNumber) {
          notifyFail("Số container không được để trống ");
          document.getElementById("contNumber").focus();
          return;
        }

        if (orderCoupon.agentCost) {
          if (!orderCoupon.agentCurrency) {
            notifyFail("Đơn vị tiền phí đại lý chưa được chọn!");
            return;
          }
        }
        if (orderCoupon.otherCost) {
          if (!orderCoupon.otherCurrency) {
            notifyFail("Đơn vị tiền phí khác chưa được chọn!");
            return;
          }
        }

        const payload = {
          id: parseInt(id),
          orderCode: orderCoupon.orderCode,
          orderId: selectedOrder.orderId ? selectedOrder.orderId : "",
          providerId: selectedOrder.providerId ? selectedOrder.providerId : "",
          providerName: selectedOrder.providerName
            ? selectedOrder.supplierName
            : "",
          content: selectedOrder.purchaseContent
            ? selectedOrder.purchaseContent
            : "",
          constructionDate: orderConstructionDate
            ? Moment(orderConstructionDate).format("DD/MM/YYYY")
            : "",
          etd: orderCoupon.etd ? orderCoupon.etd : "",
          eta: orderCoupon.eta ? orderCoupon.eta : "",
          PortExport: orderCoupon.portExport.trim()
            ? orderCoupon.portExport.trim()
            : "",
          contNumber: orderCoupon.contNumber ? orderCoupon.contNumber : "",
          realityETD: orderCoupon.realityETD ? orderCoupon.realityETD : "",
          realityETA: orderCoupon.realityETA ? orderCoupon.realityETA : "",
          realityDate: orderCoupon.realityDate ? orderCoupon.realityDate : "",
          note: orderCoupon.note.trim() ? orderCoupon.note.trim() : "",
          deliveryProgress: orderCoupon.shipmentProgress
            ? parseInt(orderCoupon.shipmentProgress)
            : 0,
          // -----------------------------------
          orderMoney: selectedOrder.originOrderMoney
            ? selectedOrder.originOrderMoney.toString()
            : "",
          orderMoneyType: selectedOrder.moneyUnit || 0,
          termsOfSale: orderCoupon.termsOfSale || "",
          shippingDocuments: orderCoupon.exportDocument || "",
          agentMoney: orderCoupon.agentCost
            ? orderCoupon.agentCost.toString()
            : "",
          agentMoneyType: orderCoupon.agentCurrency || 0,
          otherMoney: orderCoupon.otherCost
            ? orderCoupon.otherCost.toString()
            : "",
          otherMoneyType: orderCoupon.otherCurrency || 0,
          paymentTerms: selectedOrder.paymentTerms,
        };

        console.log(payload);

        await updateCoupon(payload);

        buttonSubmitting = false;

        notifySuccess(STRING.success);
        history.push("/phieu-nhap");
      } catch (error) {
        // notifyFail(STRING.fail);
        buttonSubmitting = false;
        console.log(error);
      }
    }
  };

  // console.log(orderCoupon.orderCode);

  return (
    <ScreenWrapper
      titleHeader={
        !state.isUpdate
          ? `${STRING.createCoupon}/填寫進口資料`
          : `${STRING.editCoupon}/编辑报名表`
      }
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
            <h5>{STRING.couponInfo}/进口资料</h5>
          </Divider>
          <Row gutter={[24, 16]}>
            <Col className="gutter-row" span={13}>
              {/* ------------------Mã đơn hàng--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>{STRING.orderCode}</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>訂單編號</span>
                  </Col>
                  <Col className="gutter-row" span={13}>
                    <AutoComplete
                      placeholder={STRING.orderCode}
                      style={{ width: "100%" }}
                      id="orderCode"
                      value={orderCoupon.orderCode}
                      onChange={async (value) => {
                        console.log(value, "bbbbbbbbbbbbbbbbbbbbbbbbbbb");
                        setOrderCoupon({
                          ...orderCoupon,
                          orderCode: value ? value.toUpperCase() : "",
                        });

                        const order = orderList.find(
                          (item) => item.code == value
                        );

                        console.log({ order });

                        if (value && order) {
                          console.log(order, "orderrrr");
                          // if (order.deadlineDate) {
                          //   setOrderConstructionDate(
                          //     Moment(order.deadlineDate).format("DD/MM/YYYY")
                          //   );
                          // } else {
                          //   setOrderConstructionDate("");
                          // }

                          const res = await filteredSupplierList({
                            id: order.id,
                          });
                          console.log(
                            res.data,
                            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
                          );
                          if (res.data.deadlineDate) {
                            setOrderConstructionDate(order.deadlineDate);
                          } else {
                            setOrderConstructionDate("");
                          }
                          setSelectedOrder({
                            ...res.data,
                            supplierName: res.data?.providerName,
                            purchaseContent: res.data?.description,
                            moneyUnit: order.amountMoneyType,
                            originOrderMoney: order.amountBeforeTax,
                            paymentTerms: order.paymentTerms,
                          });
                        } else {
                          setSelectedOrder({
                            supplierName: "",
                            purchaseContent: "",
                          });
                          setOrderConstructionDate("");
                        }
                      }}
                      filterOption={(inputValue, option) => {
                        return (
                          option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        );
                      }}
                      options={orderList}
                      allowClear
                      autoClearSearchValue
                    ></AutoComplete>
                  </Col>
                </Row>
              </div>
              {/* ------------------Nhà cung cấp--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>{STRING.supplier}</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>供應商</span>
                  </Col>
                  <Col className="gutter-row" span={13}>
                    <label>{selectedOrder.supplierName || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Nội Dung mua hàng--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col span={11}>
                    <span>{STRING.purchaseContent}</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>購買內容</span>
                  </Col>
                  <Col span={13}>
                    <label>{selectedOrder.purchaseContent || "--"}</label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Thời hạn hoàn công (Giao hàng)--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>{STRING.requestTime}</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>完工（交貨）期限</span>
                  </Col>
                  <Col span={13}>
                    {/* <Input
                      placeholder="Thời gian cồng trình yêu cầu"
                      type="number"
                      suffix="Ngày"
                      value={orderCoupon.constructionDate}
                      id="requiredTime"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          constructionDate: e.target.value,
                        })
                      }
                    /> */}
                    {/* {console.log(orderCoupon.constructionDate, "ababababbab")} */}
                    {/* <InputNumber
                      style={{ width: "100%" }}
                      placeholder="Thời gian hạn hoàn công"
                      min={0}
                      formatter={(value) => `${value}`}
                      id="requiredTime"
                      onChange={(value) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          constructionDate: value,
                        });
                      }}
                      value={orderCoupon.constructionDate}
                      // defaultValue={
                      //   orderCoupon.constructionDate
                      //     ? orderCoupon.constructionDate
                      //     : ""
                      // }
                    /> */}
                    <label>
                      {orderConstructionDate
                        ? !state.isUpdate && state.data
                          ? orderConstructionDate
                          : Moment(orderConstructionDate).format("DD/MM/YYYY")
                        : "--"}
                    </label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Số tiền hàng ban đầu--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>Số tiền hàng ban đầu</span>
                    <br />
                    <span>原始訂單金額</span>
                  </Col>
                  <Col span={13}>
                    <label>
                      {selectedOrder.originOrderMoney
                        ? selectedOrder.originOrderMoney
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : "--"}{" "}
                      {selectedOrder.moneyUnit === 1
                        ? "VNĐ"
                        : selectedOrder.moneyUnit === 3
                        ? "USD"
                        : selectedOrder.moneyUnit === 4
                        ? "CNY"
                        : selectedOrder.moneyUnit === 5
                        ? "TWD"
                        : ""}
                    </label>
                    {/* <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder="Số tiền hàng ban đầu"
                        style={{ width: "100%" }}
                        id="originOrderMoney"
                        value={orderCoupon.originOrderMoney
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        onChange={(value) =>
                          setOrderCoupon({
                            ...orderCoupon,
                            originOrderMoney: value,
                          })
                        }
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "100px" }}
                        value={orderCoupon.moneyUnit}
                        id="moneyUnit"
                        onChange={(value) => {
                          setOrderCoupon({ ...orderCoupon, moneyUnit: value });
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
                    </div> */}
                  </Col>
                </Row>
              </div>
              {/* ------------------Điều kiện thanh toán--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>Điều kiện thanh toán</span>
                    <br />
                    <span>付款條件</span>
                  </Col>
                  <Col span={13}>
                    <label>
                      {selectedOrder.paymentTerms
                        ? selectedOrder.paymentTerms
                        : "--"}
                    </label>
                  </Col>
                </Row>
              </div>
              {/* ------------------Phí đại lý--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>Phí đại lý</span>
                    <br />
                    <span>代理費</span>
                  </Col>
                  <Col span={13}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder="Phí đại lý"
                        style={{ width: "100%" }}
                        // id="taxMoney"
                        value={
                          orderCoupon.agentCost
                            ? orderCoupon.agentCost
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        // value={orderObject.taxMoney}
                        onChange={(value) => {
                          // console.log(value);
                          setOrderCoupon({
                            ...orderCoupon,
                            agentCost: value,
                          });
                        }}
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "120px" }}
                        value={orderCoupon.agentCurrency}
                        // id="moneyUnit"
                        onChange={(value) => {
                          setOrderCoupon({
                            ...orderCoupon,
                            agentCurrency: value,
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
              {/* ------------------Phí khác--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>Phí khác</span>
                    <br />
                    <span>其他費用</span>
                  </Col>
                  <Col span={13}>
                    <div className="d-flex justify-content-between">
                      <InputNumber
                        placeholder="Phí khác"
                        style={{ width: "100%" }}
                        // id="taxMoney"
                        value={
                          orderCoupon.otherCost
                            ? orderCoupon.otherCost
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : ""
                        }
                        // value={orderObject.taxMoney}
                        onChange={(value) => {
                          // console.log(value);
                          setOrderCoupon({
                            ...orderCoupon,
                            otherCost: value,
                          });
                        }}
                      />
                      <Select
                        placeholder={STRING.moneyUnit}
                        style={{ minWidth: "120px" }}
                        value={orderCoupon.otherCurrency}
                        // id="moneyUnit"
                        onChange={(value) => {
                          setOrderCoupon({
                            ...orderCoupon,
                            otherCurrency: value,
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
              {/* ------------------ETD/ETD--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>ETD(Dự kiến ở cảng)/ETD</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                  </Col>
                  <Col span={13}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      id="etd"
                      value={
                        orderCoupon.etd
                          ? Moment(orderCoupon.etd, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          etd: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------ETA/ETA--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>ETA(dự kiến ở cảng Hải Phòng)/ETA</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                  </Col>
                  <Col span={13}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      id="eta"
                      value={
                        orderCoupon.eta
                          ? Moment(orderCoupon.eta, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          eta: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Tiến độ xuất hàng--------------------- */}
              <div className="mb-4">
                <Row gutter={16}>
                  <Col className="gutter-row" span={11}>
                    <span>Tiến độ xuất hàng</span>
                    <br />
                    <span>出貨進度</span>
                  </Col>
                  <Col span={13}>
                    <Select
                      placeholder="Tiến độ xuất hàng"
                      value={orderCoupon.shipmentProgress}
                      style={{ width: "100%" }}
                      id="shipmentProgress"
                      onChange={(value) => {
                        console.log(value, "shipmentProgress");
                        setOrderCoupon({
                          ...orderCoupon,
                          shipmentProgress: value,
                        });
                      }}
                      allowClear
                      autoClearSearchValue
                    >
                      {shipmentProgressList.length ? (
                        shipmentProgressList.map((item, index) => {
                          return (
                            <Option key={index} value={item.value}>
                              {item.label}
                            </Option>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </Select>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* ---------------------------------------------------------------------------------- */}
            <Col className="gutter-row" span={11}>
              {/* ------------------Cảng xuất khẩu--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Cảng xuất khẩu</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>出口港</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Cảng xuất khẩu"
                      value={orderCoupon.portExport}
                      id="portExport"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          portExport: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Số cont--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Số cont</span>
                    <span style={{ color: "red" }}> *</span>
                    <br />
                    <span>Cont 數量</span>
                  </Col>
                  <Col span={14}>
                    <Input
                      placeholder="Số cont"
                      value={orderCoupon.contNumber}
                      id="contNumber"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          contNumber: e.target.value,
                        })
                      }
                    />
                    {/* <Input
                      style={{ width: "100%" }}
                      placeholder="Số cont"
                      min={0}
                      // formatter={(value) => `${value}`}
                      id="contNumber"
                      onChange={(value) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          contNumber: value,
                        });
                      }}
                      value={orderCoupon.contNumber
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      // defaultValue={
                      //   orderCoupon.contNumber ? orderCoupon.contNumber : ""
                      // }
                    /> */}
                  </Col>
                </Row>
              </div>
              {/* ------------------Thực tế ETD--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Thực tế ETD</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>實際 ETD</span>
                  </Col>

                  <Col span={14}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      id="realityETD"
                      value={
                        orderCoupon.realityETD
                          ? Moment(orderCoupon.realityETD, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          realityETD: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Thực tế ETA--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Thực tế ETA</span>
                    {/* <span style={{ color: "red" }}> *</span> */}
                    <br />
                    <span>實際 ETA</span>
                  </Col>
                  <Col span={14}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      id="realityETA"
                      value={
                        orderCoupon.realityETA
                          ? Moment(orderCoupon.realityETA, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          realityETA: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Ngày thực tế đến hiện trường--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col className="gutter-row" span={10}>
                    <span>Ngày thực tế đến hiện trường</span>
                    <br />
                    <span>實際到達日期</span>
                  </Col>
                  <Col span={14}>
                    <DatePicker
                      placeholder={STRING.pickDate}
                      style={{ width: "100%" }}
                      id="realityDate"
                      value={
                        orderCoupon.realityDate
                          ? Moment(orderCoupon.realityDate, "DD/MM/YYYY")
                          : ""
                      }
                      format="DD/MM/YYYY"
                      onChange={(date, dateString) => {
                        setOrderCoupon({
                          ...orderCoupon,
                          realityDate: dateString,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Ghi chú--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Ghi chú</span>
                    <br />
                    <span>備註</span>
                  </Col>
                  <Col span={14}>
                    <TextArea
                      showCount
                      maxLength={300}
                      placeholder="Ghi chú"
                      value={orderCoupon.note}
                      id="note"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          note: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Điều kiện mua bán--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Điều kiện mua bán</span>
                    <br />
                    <span>貿易條件</span>
                  </Col>
                  <Col span={14}>
                    <TextArea
                      showCount
                      maxLength={300}
                      placeholder="Điều kiện mua bán"
                      value={orderCoupon.termsOfSale}
                      // id="note"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          termsOfSale: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
              {/* ------------------Tài liệu xuất hàng--------------------- */}
              <div className="mb-4">
                <Row>
                  <Col span={10}>
                    <span>Tài liệu xuất hàng</span>
                    <br />
                    <span>出貨資料</span>
                  </Col>
                  <Col span={14}>
                    <TextArea
                      showCount
                      maxLength={300}
                      placeholder="Tài liệu xuất hàng"
                      value={orderCoupon.exportDocument}
                      // id="note"
                      onChange={(e) =>
                        setOrderCoupon({
                          ...orderCoupon,
                          exportDocument: e.target.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </ScreenWrapper>
  );
}

CreateImportScreen.propTypes = {};

export default CreateImportScreen;
