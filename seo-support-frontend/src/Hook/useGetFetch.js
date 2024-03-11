import { useEffect, useState } from "react";
import ShowToast from "../Services/ShowToast";

const useGetFetch = (
  endpoint,
  headerList = null,
  onAction = null,
) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    setIsLoading(true);
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);
    if (headerList) {
      headerList.map((header) => {
        return myHeaders.append(header.key, header.value);
      });
    }
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch(endpoint, requestOptions, { signal })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data) {
          setData(data.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.trace("successfully aborted");
        } else {
          console.trace(err.message);
          ShowToast.handleErrorToast(
            "Xảy ra lỗi trong quá trình lấy dữ liệu. Vui lòng thử lại sau"
          );
          setIsLoading(false);
        }
      });

    return () => abortController.abort();
  }, [endpoint, headerList, onAction]);

  return { data, isLoading };
};

export default useGetFetch;
