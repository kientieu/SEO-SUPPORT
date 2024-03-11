import ShowToast from "../Services/ShowToast";

const usePostFetch = async (
  endpoint,
  method,
  headerList,
  newData,
  onAction,
  setOnAction,
  setIsPending = null,
  toggle = null
) => {
  var token = localStorage.getItem("token");
  var myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  if (headerList) {
    headerList.map((header) => {
      return myHeaders.append(header.key, header.value);
    });
  }

  var requestOptions = {
    method,
    headers: myHeaders,
    body: newData ? JSON.stringify(newData) : null,
    // redirect: "follow",
  };
  try {
    setIsPending && setIsPending(true);
    const res = await fetch(endpoint, requestOptions);
    const data = await res.json();
    setIsPending && setIsPending(false);
    console.log(data);
    if (data) {
      if (data.code === 200) {
        toggle && toggle();
        ShowToast.handleSuccessToast(data.message);
        setOnAction && setOnAction(!onAction);
        return data;
      } else {
        ShowToast.handleErrorToast(data.message);
      }
    } else {
      ShowToast.handleErrorToast("Đã có lỗi xảy ra. Vui lòng thử lại sau");
    }
  } catch (err) {
    console.log(err.message);
  }
};

export default usePostFetch;
