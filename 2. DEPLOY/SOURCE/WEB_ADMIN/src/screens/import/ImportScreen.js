import { Col, DatePicker, Input, Row, Select, Empty, AutoComplete } from "antd";
import Button from "components/Button";
import PaginationComponent from "components/PaginationComponent";
import ScreenWrapper from "components/ScreenWrapper";
import { ROUTER, STRING } from "constants/Constant";
import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { notifyFail, notifySuccess } from "utils/notify";
import { orderList, deleteOrder, supplierFullList } from "network/OrderApi";
import Moment from "moment";
import ConfirmModal from "components/ConfirmModal";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import {
  couponList,
  deleteCoupon,
  filteredOrderList,
} from "network/WarehouseReceiptApi";

const { RangePicker } = DatePicker;

const { Option } = Select;

const headerTable = [
  { title: STRING.numericalOrder, chinese: "顺序" },
  { title: STRING.orderCode, chinese: "訂單編號" },
  { title: STRING.supplier, chinese: "供應商" },
  { title: STRING.purchaseContent, chinese: "購買內容" },
  { title: STRING.requestTime, chinese: "所需的工作時間" },
  { title: STRING.ETD },
  { title: STRING.ETA },
  { title: STRING.portOfExport, chinese: "出口港" },
  { title: STRING.contNumber, chinese: "Cont 數量" },
  { title: "Thực tế ETD", chinese: "實際 ETD" },
  { title: "Thực tế ETA", chinese: "實際 ETA" },
  { title: STRING.actualDateToScene },
  { title: STRING.createdDate, chinese: "訂單創建日期" },
  { title: "Ghi chú", chinese: "備註" },
  { title: "checkbox", chinese: "" },
];

const headerTableExcel = [
  { title: STRING.numericalOrder, chinese: "顺序" },
  { title: STRING.orderCode, chinese: "訂單編號" },
  { title: STRING.supplier, chinese: "供應商" },
  { title: STRING.purchaseContent, chinese: "購買內容" },
  { title: STRING.requestTime, chinese: "完工（交貨) 期限" },
  { title: STRING.ETD },
  { title: STRING.ETA },
  { title: STRING.portOfExport, chinese: "出口港" },
  { title: STRING.contNumber },
  { title: "Thực tế ETD", chinese: "實際 ETD" },
  { title: "Thực tế ETA", chinese: "實際 ETA" },
  { title: STRING.actualDateToScene },
  { title: STRING.createdDate, chinese: "訂單創建日期" },
  { title: "Ghi chú", chinese: "備註" },
  // -------------------------------------------
  { title: "Số tiền hàng ban đầu", chinese: "原始訂單金額" },
  { title: "Điều kiện thanh toán", chinese: "付款條件" },
  { title: "Phí đại lý", chinese: "代理費" },
  { title: "Phí khác", chinese: "其他費用" },
  { title: "Tiến độ xuất hàng", chinese: "出貨進度" },
  { title: "Điều kiện mua bán", chinese: "貿易條件" },
  { title: "Tài liệu xuất hàng", chinese: "出貨資料" },
];

const recordsPerPage = 20;

function OrderListScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [couponData, setCouponData] = useState([]);
  const [checkItemList, setCheckItemList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [searchedName, setSearchedName] = useState("");
  const [paging, setPaging] = useState({
    totalItem: 0,
    totalPage: 0,
  });
  const inputRef = useRef(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const [supplierId, setSupplierId] = useState(undefined);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [supplierData, setSupplierData] = useState([]);
  const [searchedStatus, setSearchedStatus] = useState();
  const [orderList, setOrderList] = useState(undefined);

  const history = useHistory();
  useEffect(() => {
    getSupplierList();
    getListOrder();
  }, []);

  useEffect(() => {
    getCouponList();
  }, [activePage, supplierId, fromDate, toDate]);

  useEffect(() => inputRef?.current?.focus(), [searchedName]);

  const HeaderButton = () => {
    return (
      <>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn-warning btn mr-2"
          table="export__excel"
          filename={`thong-ke-phieu-nhap`}
          sheet="tablexls"
          buttonText="Export Excel/出口 Excel"
        ></ReactHTMLTableToExcel>
        <Button
          className="btn btn-danger mr-2"
          onClick={() => {
            if (countNumberOfElementIsChecked(checkItemList) < 1) {
              notifyFail("Vui lòng chọn ít nhất 1 phiếu nhập để xóa!");
              return;
            }
            setConfirmModal(true);
          }}
        >
          {`${STRING.delete}/抹去`}
        </Button>
        <Button
          className="btn btn-primary"
          onClick={() =>
            history.push({
              pathname: "/tao-phieu-nhap",
              state: { isUpdate: false },
            })
          }
        >
          {`${STRING.addNew}/添新`}
        </Button>
      </>
    );
  };

  const FilterField = () => {
    return (
      <Row className="mb-4" gutter={16} justify="space-between">
        <Col span={8}>
          <Input
            placeholder={`${STRING.orderCode}/代码顺序`}
            style={{ width: "100%" }}
            onKeyUp={onKeyUp}
            value={searchedName}
            ref={inputRef}
            onChange={(e) => setSearchedName(e.target.value.toUpperCase())}
          />
          {/* <AutoComplete
            placeholder={STRING.orderCode}
            style={{ width: "100%" }}
            id="orderCode"
            value={searchedName}
            onChange={async (value) => {
              console.log(value);
              setSearchedName(value ? value.toUpperCase() : "");
            }}
            filterOption={(inputValue, option) => {
              console.log({ inputValue, option });
              return (
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              );
            }}
            ref={inputRef}
            options={orderList}
            allowClear
            autoClearSearchValue
          ></AutoComplete> */}
        </Col>
        <Col span={8}>
          <Select
            placeholder={`${STRING.supplier}/供应商`}
            style={{ width: "100%" }}
            value={supplierId}
            onChange={(value) => setSupplierId(value)}
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
        </Col>

        <Col span={8}>
          <RangePicker
            style={{ width: "100%" }}
            placeholder={[
              `${STRING.fromDate}/自从`,
              `${STRING.toDate}/迄今为止`,
            ]}
            format="DD/MM/YYYY"
            // defaultValue={[
            //   fromDate ? Moment(fromDate, "DD/MM/YYYY") : Moment(),
            //   toDate ? Moment(toDate, "DD/MM/YYYY") : Moment(),
            // ]}
            value={[
              fromDate ? Moment(fromDate, "DD/MM/YYYY") : null,
              toDate ? Moment(toDate, "DD/MM/YYYY") : null,
            ]}
            onChange={(dates, dateStrings) => {
              setFromDate(dateStrings[0]);
              setToDate(dateStrings[1]);
            }}
            allowEmpty={[true, true]}
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
          onClick={() => getCouponList()}
        >
          {`${STRING.search}/搜索`}
        </Button>
        <Button className="btn btn-secondary" onClick={() => clearSearching()}>
          {`${STRING.deleteSearching}/删除搜寻`}
        </Button>
      </div>
    );
  };

  const DataTable = (props) => {
    // khai báo một biến hidden để dùng cho việc ẩn cái bảng cần xuất excel và một số thông tin khác
    // const { hidden } = props;

    return (
      <div className="card">
        <div className="card-body">
          <Table striped bordered hover responsive className="mb-3">
            <thead>
              <tr>
                {headerTable.map((item, index) => {
                  return item.title === "checkbox" ? (
                    <th key={index} className="text-center align-middle">
                      <input
                        type="checkbox"
                        checked={checkItemList.every(Boolean)}
                        onChange={() => onChangeCheckAllItem()}
                      />
                    </th>
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
              {couponData?.length ? (
                couponData.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {index + recordsPerPage * ((activePage || 1) - 1) + 1}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.code || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.providerName || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.content || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.constructionDate
                          ? item.constructionDate
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.etd
                          ? Moment(item.etd).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.etd
                          ? Moment(item.etd).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.portExport || "--"}
                      </td>
                      {/* <td
                        className="text-right align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.totalMoney || "--"}
                      </td> */}
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.contNumber || "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.realityETD
                          ? Moment(item.realityETD).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.realityETA
                          ? Moment(item.realityETA).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.realityDate
                          ? Moment(item.realityDate).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.createdDate
                          ? Moment(item.createdDate).format("hh:mm DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td
                        className="text-center align-middle"
                        onClick={() =>
                          history.push({
                            pathname: `/sua-phieu-nhap/${item.id}`,
                            state: { isUpdate: true },
                          })
                        }
                      >
                        {item.note || "--"}
                      </td>
                      <td className="text-center align-middle">
                        <input
                          type="checkbox"
                          checked={checkItemList[index]}
                          onChange={() => onChangeCheckItem(index)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="text-center">
                  <td className="p-2" colSpan={15}>
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

  const DataTableExcel = () => {
    return (
      <div className="card" style={{ display: "none" }}>
        <div className="card-body">
          <Table
            striped
            bordered
            hover
            responsive
            className="mb-3"
            id="export__excel"
          >
            <thead>
              <tr>
                {headerTableExcel.map((item, index) => {
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
              {couponData?.length &&
                couponData.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center align-middle">
                        {index + recordsPerPage * ((activePage || 1) - 1) + 1}
                      </td>
                      <td className="text-center align-middle">
                        {item.code || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.providerName || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.content || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.constructionDate ? item.constructionDate : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.etd
                          ? Moment(item.etd).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.eta
                          ? Moment(item.eta).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.portExport || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.contNumber || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.realityETD
                          ? Moment(item.realityETD).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.realityETA
                          ? Moment(item.realityETA).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.realityDate
                          ? Moment(item.realityDate).format("DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td>
                        {item.createdDate
                          ? Moment(item.createdDate).format("hh:mm DD/MM/YYYY")
                          : "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.note || "--"}
                      </td>
                      {/* ---------------------------------------- */}
                      <td className="text-center align-middle">
                        {item.orderMoney
                          ? item.orderMoney
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "--"}{" "}
                        {item.orderMoneyType === 1
                          ? "VNĐ"
                          : item.orderMoneyType === 3
                          ? "USD"
                          : item.orderMoneyType === 4
                          ? "CNY"
                          : item.orderMoneyType === 5
                          ? "TWD"
                          : ""}
                      </td>
                      <td className="text-center align-middle">
                        {item.paymentTerms || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.agentMoney
                          ? item.agentMoney
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "--"}{" "}
                        {item.agentMoneyType === 1
                          ? "VNĐ"
                          : item.agentMoneyType === 3
                          ? "USD"
                          : item.agentMoneyType === 4
                          ? "CNY"
                          : item.agentMoneyType === 5
                          ? "TWD"
                          : ""}
                      </td>
                      <td className="text-center align-middle">
                        {item.otherMoney
                          ? item.otherMoney
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "--"}{" "}
                        {item.otherMoneyType === 1
                          ? "VNĐ"
                          : item.otherMoneyType === 3
                          ? "USD"
                          : item.otherMoneyType === 4
                          ? "CNY"
                          : item.otherMoneyType === 5
                          ? "TWD"
                          : ""}
                      </td>
                      <td className="text-center align-middle">
                        {item.deliveryProgress === 1
                          ? "Đang chuẩn bị hàng/備料中"
                          : item.deliveryProgress === 2
                          ? "Đã đóng hàng lên cont/已裝櫃"
                          : item.deliveryProgress === 3
                          ? "Đã xuất cảng/已出港"
                          : item.deliveryProgress === 4
                          ? "Đã đến cảng/已到港"
                          : item.deliveryProgress === 5
                          ? "Đã đến công trình/已到港現場"
                          : ""}
                      </td>
                      <td className="text-center align-middle">
                        {item.termsOfSale || "--"}
                      </td>
                      <td className="text-center align-middle">
                        {item.shippingDocuments || "--"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  const getCouponList = async () => {
    try {
      setIsLoading(true);
      const payload = {
        Code: searchedName.trim(),
        ProviderId: supplierId ? supplierId : -1,
        FromDate: fromDate,
        ToDate: toDate,
        page: activePage,
      };
      const res = await couponList(payload);
      // console.table(res.data.list);
      setPaging({
        ...paging,
        totalItem: res?.data?.totalItem,
        totalPage: res?.data?.totalPage,
      });
      setCouponData(res?.data?.list);
      let isCheckedItems = Array(res?.data?.list.length).fill(false);
      setCheckItemList(isCheckedItems);
      setIsLoading(false);
    } catch (error) {}
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
      getCouponList();
    }
  };

  const handleChangePage = (page) => {
    setActivePage(page);
  };

  const clearSearching = async () => {
    try {
      setSearchedName("");
      setSupplierId(undefined);
      setFromDate(null);
      setToDate(null);
      setIsLoading(true);
      setActivePage(1);
      const res = await couponList({
        Code: "",
        ProviderId: -1,
        FromDate: "",
        ToDate: "",
        page: 1,
      });
      setCouponData(res?.data?.list);
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
        idItemArr.push(couponData[index].id);
      }
    });
    try {
      setIsLoading(true);
      let formData = new FormData();
      formData.append("listId", idItemArr.join());

      await deleteCoupon(formData);
      setConfirmModal(false);
      notifySuccess(STRING.success);
      getCouponList();
    } catch (error) {
      setConfirmModal(false);
      notifyFail(STRING.fail);
      getCouponList();
    }
  };

  return (
    <ScreenWrapper
      titleHeader={`${STRING.enterCoupon}/進口資料`}
      isLoading={isLoading}
      isError={isError}
      hasButton={true}
    >
      <HeaderButton />
      <>
        <ConfirmModal
          isOpen={confirmModal}
          onHide={() => setConfirmModal(false)}
          title={`${STRING.delete}/抹去 ${countNumberOfElementIsChecked(
            checkItemList
          )} phiếu nhập`}
          action={() => onDeleteItem()}
        />
        <FilterField />
        <ButtonGroup />
        <DataTable />
        <DataTableExcel />
      </>
    </ScreenWrapper>
  );
}

OrderListScreen.propTypes = {};

export default OrderListScreen;
