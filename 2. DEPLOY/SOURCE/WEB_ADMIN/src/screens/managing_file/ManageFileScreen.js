import {
  Col,
  Input,
  Row,
  Breadcrumb,
  Empty,
  Button as ButtonAntd,
  Upload,
} from "antd";
import { FolderAddOutlined, UploadOutlined } from "@ant-design/icons";
import Button from "components/Button";
import ScreenWrapper from "components/ScreenWrapper";
import React, { useState, useEffect, useRef } from "react";
import { STRING } from "constants/Constant";
import { createConfig, configDetail } from "network/ConfigApi";
import { notifySuccess, notifyFail } from "utils/notify";
import { Link } from "react-router-dom";
import { FastField, Formik, Form } from "formik";
import InputField from "components/InputField";
import * as Yup from "yup";
import { Tree } from "antd";
import {
  folderList,
  folderDetail,
  createFolder,
  deleteFolder,
  updateFolder,
  uploadFile,
  deleteFile,
} from "network/DocumentApi";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import ConfirmModal from "components/ConfirmModal";
import fileDownload from "js-file-download";
import axios from "axios";

const { DirectoryTree } = Tree;

const url = "http://qldh.winds.vn:6886";

function ManageFileScreen(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [parentId, setParentId] = useState(-1);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [breadcrumbList, setBreadcrumbList] = useState([]);
  // const [folderDetail, setFolderDetail] = useState([]);
  const [confirmModal, setConfirmModal] = useState(false); // modal remove parent folder
  const [subConfirmModal, setSubConfirmModal] = useState(false); // modal remove child folder
  const [confirmModalDelFile, setConfirmModalDelFile] = useState(false); // modal remove file
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [parentFolder, setParentFolder] = useState({});
  const [shouldAddParentFolder, setShouldAddParentFolder] = useState(false);
  const [tempFolder, setTempFolder] = useState({});
  const [shouldUpdateParentFolder, setShouldUpdateParentFolder] = useState(
    false
  );
  const [listFileUpload, setListFileUpload] = useState([]);
  const [tempFile, setTempFile] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getFolderList();
  }, []);

  // useEffect(() => {
  //   setBreadcrumbList([]);
  // }, [selectedFolder]);

  const toggle = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleUpdate = () => {
    setIsModalUpdateVisible(!isModalUpdateVisible);
  };

  const BreadcrumbHeader = () => {
    return (
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center justify-content-start">
              {breadcrumbList.length ? (
                <i className="fas fa-folder-open mr-2"></i>
              ) : (
                ""
              )}
              <Breadcrumb>
                {breadcrumbList.length
                  ? breadcrumbList.map((item, index) => (
                      <Breadcrumb.Item key={index}>
                        <label className="mb-0">{item}</label>
                      </Breadcrumb.Item>
                    ))
                  : ""}
              </Breadcrumb>
            </div>
            {breadcrumbList.length ? (
              <div>
                <i
                  className="fas fa-edit"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setShouldUpdateParentFolder(true);
                    setIsModalUpdateVisible(true);
                  }}
                ></i>
                <i
                  className="fas fa-trash-alt ml-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setConfirmModal(true);
                  }}
                ></i>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  };

  const SelectedFolderDetail = (props) => {
    return selectedFolder.length ? (
      selectedFolder.map((item, index) => {
        if (item.path) {
          console.log(`${url}${item.path}`, "dalsdjlasjdlakjs");
          return (
            <div
              key={index}
              className="d-flex justify-content-between border-bottom mb-3"
            >
              <div>
                <i className="fas fa-paperclip mr-2"></i>
                <a
                  target="_blank"
                  href={`${url}${item.path}`}
                  // type="media_type"
                  hreflang="vi"
                >
                  {item.path.split("/")[2]}
                </a>
              </div>
              <div>
                <a>
                  <i
                    class="fas fa-cloud-download-alt"
                    onClick={() => {
                      axios
                        .get(`${url}${item.path}`, {
                          responseType: "blob",
                        })
                        .then((res) => {
                          fileDownload(res.data, item.name);
                        });
                    }}
                  ></i>
                </a>
                <i
                  className="fas fa-trash-alt ml-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    // console.log({ item });
                    setTempFile({ ...item });
                    setConfirmModalDelFile(true);
                  }}
                ></i>
              </div>
            </div>
          );
        }
        return (
          <div
            key={index}
            className="d-flex justify-content-between border-bottom mb-3"
          >
            <div>
              <i className="far fa-folder mr-2 pb-0"></i>
              <label className="m-0">{item.name}</label>
            </div>
            <div>
              <i
                className="fas fa-edit"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setTempFolder({ ...item });
                  setShouldUpdateParentFolder(false);
                  setIsModalUpdateVisible(true);
                }}
              ></i>
              <i
                className="fas fa-trash-alt ml-2"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setTempFolder({ ...item });
                  setSubConfirmModal(true);
                }}
              ></i>
            </div>
          </div>
        );
      })
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          !parentFolder.parentId
            ? "Chưa chọn thư mục"
            : "Chưa có thư mục hay tài liệu"
        }
      />
    );
  };

  const ModalAddFolder = () => {
    const folderDetail = { ...parentFolder };

    const initialValues = {
      folderName: "",
    };

    const validationSchema = Yup.object().shape({
      folderName: Yup.string().required("Tên thư mục không được để trống!"),
    });

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            await createFolder({
              folderName: values.folderName.trim(),
              parentId: shouldAddParentFolder ? -1 : folderDetail.id,
            });

            if (shouldAddParentFolder) {
              getFolderList();
              setParentFolder({});
            }

            getFolderList();

            const res = await folderList({ id: folderDetail.id });
            setSelectedFolder(res.data.listFiles.concat(res.data.listFolders));

            notifySuccess(STRING.success);
            toggle();
          } catch (error) {}
        }}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          return (
            <Modal isOpen={isModalVisible} toggle={toggle} centered>
              <Form>
                <ModalHeader toggle={toggle}>{STRING.addFolder}</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col span={8}>Thư mục cha</Col>
                    <Col span={16}>
                      {/* {console.log({ folderDetail }, folderDetail.name)} */}
                      <label>
                        {!folderDetail.parentId || shouldAddParentFolder
                          ? "Không có"
                          : folderDetail.name}
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}>
                      <span>Tên thư mục</span>
                      <span style={{ color: "red" }}> *</span>
                    </Col>
                    <Col span={16}>
                      <FastField
                        component={InputField}
                        name="folderName"
                        // label="Tên thư mục"
                        placeholder="Tên thư mục"
                        type="text"
                        required={true}
                      />
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" className="btn btn-primary">
                    {STRING.save}/救
                  </Button>
                  <Button className="btn btn-secondary" onClick={toggle}>
                    {STRING.cancel}/取消
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          );
        }}
      </Formik>
    );
  };

  const ModalUpdateFolder = () => {
    const folderDetail = { ...parentFolder };

    console.log({ folderDetail });

    const initialValues = {
      folderName: shouldUpdateParentFolder
        ? folderDetail.name
        : tempFolder.name,
    };

    const validationSchema = Yup.object().shape({
      folderName: Yup.string().required("Tên thư mục không được để trống!"),
    });

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            await updateFolder({
              // folderName: values.folderName,
              // parentId: shouldAddParentFolder ? -1 : folderDetail.id,
              id: shouldUpdateParentFolder ? folderDetail.id : tempFolder.id,
              updateFolderName: values.folderName.trim(),
              updateParentId: shouldUpdateParentFolder
                ? folderDetail.parentId
                : tempFolder.parentId,
            });

            if (shouldUpdateParentFolder) {
              getFolderList();
              // setParentFolder({});
              const newArr = await getBreadCrumb(folderDetail.id);
              setBreadcrumbList(newArr);
              const res = await folderList({
                id: folderDetail.id,
              });

              setSelectedFolder(
                res.data.listFiles.concat(res.data.listFolders)
              );
            } else {
              getFolderList();
              const res = await folderList({
                id: tempFolder.parentId,
              });

              setSelectedFolder(
                res.data.listFiles.concat(res.data.listFolders)
              );
            }

            notifySuccess(STRING.success);
            toggleUpdate();
          } catch (error) {}
        }}
        validationSchema={validationSchema}
      >
        {(formikProps) => {
          return (
            <Modal isOpen={isModalUpdateVisible} toggle={toggleUpdate} centered>
              <Form>
                <ModalHeader toggle={toggleUpdate}>Sửa tên</ModalHeader>
                <ModalBody>
                  <Row>
                    <Col span={8}>
                      <span>Tên thư mục</span>
                      <span style={{ color: "red" }}> *</span>
                    </Col>
                    <Col span={16}>
                      <FastField
                        component={InputField}
                        name="folderName"
                        // label="Tên thư mục"
                        placeholder="Tên thư mục"
                        type="text"
                        required={true}
                      />
                    </Col>
                  </Row>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" className="btn btn-primary">
                    {STRING.save}/救
                  </Button>
                  <Button className="btn btn-secondary" onClick={toggleUpdate}>
                    {STRING.cancel}/取消
                  </Button>
                </ModalFooter>
              </Form>
            </Modal>
          );
        }}
      </Formik>
    );
  };

  const getFolderList = async () => {
    try {
      setIsLoading(true);
      const res = await folderList({
        id: parentId,
      });
      const formattedFolderTree = res.data.listFolders.map((folder) => {
        return {
          title: folder.name,
          key: folder.id,
          // data: folder,
          // isLeaf: true,
        };
      });
      setFolders(formattedFolderTree);
      setIsLoading(false);
    } catch (error) {}
  };

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }

      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }

      return node;
    });
  }

  const onLoadData = async ({ key, children }) => {
    return new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        folderList({
          id: key,
        }).then((res) => {
          const child = res.data.listFolders.map((folder) => {
            return {
              title: folder.name,
              key: folder.id,
            };
          });
          setFolders((origin) => updateTreeData(origin, key, child));
          resolve();
        }, 1000);
      });
    });
  };

  const onSelectFolder = async (key, data) => {
    try {
      // console.log({ data });
      const res = await folderList({ id: key });
      const detail = await folderDetail({ id: key });
      setParentFolder({ ...detail.data });
      // console.log({ detail });
      // console.table(res.data.listFiles);
      // console.table(res.data.listFolders);
      setSelectedFolder(res.data.listFiles.concat(res.data.listFolders));
      const newArr = await getBreadCrumb(key);
      // console.log({ newArr });
      setBreadcrumbList(newArr);
    } catch (error) {}
  };

  const getBreadCrumb = async (id, arr = []) => {
    let subBreadCrumb = [...arr];
    const res = await folderDetail({ id: id });
    subBreadCrumb.unshift(res.data.name);
    if (res.data.parentId != -1) {
      getBreadCrumb(res.data.parentId, subBreadCrumb);
    }

    return subBreadCrumb;
    // setBreadcrumbList(subBreadCrumb);
  };

  const uploadFileToServer = async ({ onSuccess, onError, file }) => {
    console.log(file);
    console.log(file.size, "file.size");
    if (parentFolder.id) {
      setUploading(true);

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        notifyFail("Kích cỡ file không được quá 10MB!");
        setUploading(false);
        return;
      }

      try {
        let formData = new FormData();
        formData.append("FolderId", parentFolder.id);
        formData.append("File", file);
        const res = await uploadFile(formData);
        onSuccess();
        notifySuccess(STRING.success);
        const detail = await folderList({ id: parentFolder.id });
        setSelectedFolder(
          detail.data.listFiles.concat(detail.data.listFolders)
        );
      } catch (error) {
        console.log(error);
        onError();
      } finally {
        setUploading(false);
      }
    } else {
      notifyFail("Vui lòng chọn 1 thư mục");
      return;
    }
  };

  const handleMultiFile = async (value) => {
    if (parentFolder.id) {
      if (value.fileList.length > listFileUpload.length) {
        try {
          let lengthArr = value.fileList.length;
          let formData = new FormData();

          formData.append("FolderId", parentFolder.id);
          formData.append("File", value.fileList[lengthArr - 1].originFileObj);

          const res = await uploadFile(formData);

          notifySuccess(STRING.success);

          const detail = await folderList({ id: parentFolder.id });
          setSelectedFolder(
            detail.data.listFiles.concat(detail.data.listFolders)
          );

          // let newListFileUpload = [...listFileUpload];

          // newListFileUpload.push({
          //   uid: value.fileList[lengthArr - 1].uid,
          //   name: res.data.fileName.split("/")[
          //     res.data.fileName.split("/").length - 1
          //   ],
          //   status: "done",
          //   url: `http://qldh.winds.vn:6886${res.data.fileName}`,
          //   path: res.data.fileName,
          // });

          // setListFileUpload(newListFileUpload);
        } catch (error) {
          console.log(error);
        }
      } else {
      }
    } else {
      notifyFail("Vui lòng chọn 1 thư mục");
      return;
    }
  };

  // console.log({ breadcrumbList });

  return (
    <ScreenWrapper
      titleHeader={`${STRING.document}/附件`}
      isLoading={isLoading}
      isError={isError}
      hasButton={true}
    >
      <Button
        className="btn btn-primary"
        onClick={() => {
          setShouldAddParentFolder(true);
          setIsModalVisible(true);
        }}
      >
        {`${STRING.addFolder}/新增文件夹`}
      </Button>
      <div>
        {/* remove parent folder */}
        <ConfirmModal
          isOpen={confirmModal}
          onHide={() => setConfirmModal(false)}
          title={`${STRING.delete}/抹去 thư mục ${parentFolder.name}`}
          action={async () => {
            let formData = new FormData();
            formData.append("id", parentFolder.id);
            await deleteFolder(formData);
            getFolderList();

            setBreadcrumbList([]);
            setSelectedFolder([]);
            notifySuccess(STRING.success);
            setConfirmModal(false);
          }}
        />
        {/* remove child folder */}
        <ConfirmModal
          isOpen={subConfirmModal}
          onHide={() => setSubConfirmModal(false)}
          title={`${STRING.delete}/抹去 thư mục ${tempFolder.name}`}
          action={async () => {
            let formData = new FormData();
            formData.append("id", tempFolder.id);
            await deleteFolder(formData);
            getFolderList();
            const res = await folderList({ id: tempFolder.parentId });
            setSelectedFolder(res.data.listFiles.concat(res.data.listFolders)); // reset detail list of parent folder
            notifySuccess(STRING.success);
            setSubConfirmModal(false);
          }}
        />
        {/* remove file */}
        <ConfirmModal
          isOpen={confirmModalDelFile}
          onHide={() => setConfirmModalDelFile(false)}
          title={`${STRING.delete}/抹去 file ${
            tempFile.name ? tempFile.name : ""
          }`}
          action={async () => {
            let formData = new FormData();
            formData.append("id", tempFile.id);
            formData.append("fileName", tempFile ? tempFile.name : "");
            await deleteFile(formData);
            const res = await folderList({ id: tempFile.folderId });
            setSelectedFolder(res.data.listFiles.concat(res.data.listFolders)); // reset detail list of parent folder
            getFolderList();
            notifySuccess(STRING.success);
            setConfirmModalDelFile(false);
          }}
        />
        <ModalAddFolder />
        <ModalUpdateFolder />
        <Row gutter={16}>
          <Col span={8}>
            <div className="card">
              <div className="card-body">
                <h4>Danh sách thư mục</h4>
                <DirectoryTree
                  loadData={onLoadData}
                  treeData={folders}
                  onSelect={onSelectFolder}
                />
              </div>
            </div>
          </Col>
          <Col span={16}>
            <BreadcrumbHeader />
            <div className="card">
              <div className="card-body">
                <div className="text-right mb-4">
                  <ButtonAntd
                    icon={<FolderAddOutlined />}
                    className="mr-2"
                    onClick={() => {
                      if (!parentFolder.parentId) {
                        notifyFail("Chưa chọn thư mục cha!");
                        return;
                      }
                      setShouldAddParentFolder(false);
                      setIsModalVisible(true);
                    }}
                  >
                    {STRING.addFolder}
                  </ButtonAntd>
                  <Upload
                    showUploadList={false}
                    customRequest={uploadFileToServer}
                    onChange={(value) => {
                      console.log(value.file.status);
                    }}
                  >
                    <ButtonAntd loading={uploading} icon={<UploadOutlined />}>
                      Đăng file
                    </ButtonAntd>
                  </Upload>
                </div>
                <SelectedFolderDetail />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </ScreenWrapper>
  );
}

ManageFileScreen.propTypes = {};

export default ManageFileScreen;
