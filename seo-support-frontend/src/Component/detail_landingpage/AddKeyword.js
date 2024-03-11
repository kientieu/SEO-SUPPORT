import AsyncSelect from 'react-select/async';
import { KeywordURL } from "../../Constants/KeywordURL";
import { DetailLPURL } from "../../Constants/DetailLPURL";
import { useState } from "react";
import usePostFetch from "../../Hook/usePostFetch";
import { useParams } from "react-router-dom";

const AddKeyword = ({ onAction, setOnAction }) => {
  const { lp_id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [keyword, setKeyword] = useState(null);

  const filterOptions = (options, inputValue) => {
    const candidate = inputValue.toLowerCase();
    return options.filter(({ label }) =>
      label.toLowerCase().trim().includes(candidate)
    );
  };

  const loadOptions = (inputValue, callback) => {
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(KeywordURL.getSearch(inputValue), requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.code === 200) {
          const keywords = data.data;
          const toSelectOption = ({ name }) => ({ label: name, value: name });

          // map server data to options
          const asyncOptions = keywords.map(toSelectOption);

          // Filter options if needed
          const filtered = filterOptions(asyncOptions, inputValue);

          // Call callback with mapped and filtered options
          callback(filtered);
        }
      });
  };

  const handleOnChange = (option, { action }) => {
    switch (action) {
      case 'input-change':
        if (option) setKeyword(option.label);
        return;
      case 'menu-close':
        return;
      case 'clear':
        setKeyword(null);
        return;
      case 'select-option':
        if (option) setKeyword(option.label);
        return;
      default:
        return;
    }
  };

  const handleOnInputchange = (val, { action }) => {
    if (action === "menu-close") {
      if (!val) {
        setKeyword(keyword);
      }
    } else {
      setKeyword(val);
    }
  }

  const newSubKW = {
    kwName: keyword,
  };

  const AddKW = async (e) => {
    e.preventDefault();
    // console.log(keyword);
    const result = await usePostFetch(
      DetailLPURL.getAdd(lp_id),
      "POST",
      null,
      newSubKW,
      onAction,
      setOnAction,
      setIsPending,
      null
    );
    if (result) {
      setKeyword(null);
    }
  };

  return (
    <form className="mt-10" onSubmit={(e) => AddKW(e)}>
      <div className="form-group row">
        <label className="col-4 font-weight-bold col-form-label">
          Thêm từ khoá
        </label>
        <div className="col-11" style={{width: '300px'}}>
          <AsyncSelect
            key={JSON.stringify(isPending)}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
            isClearable
            placeholder="Nhập từ khoá..."
            value={keyword && { label: keyword }}
            onChange={handleOnChange}
            onInputChange={handleOnInputchange}
            maxMenuHeight="100"
          />
        </div>
        {isPending ? (
          <button
            className="btn btn-sm btn-primary col-1 mb-1 mt-1"
            type="submit"
            disabled
          >
            <i className="fas fa-plus fa-sm text-white-50" />
          </button>
        ) : (
          <button
            className="btn btn-sm btn-primary col-1 mb-1 mt-1"
            type="submit"
          >
            <i className="fas fa-plus fa-sm text-white-50" />
          </button>
        )}
      </div>
    </form>
  );
};

export default AddKeyword;
