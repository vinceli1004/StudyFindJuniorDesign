import React, { useState, useEffect } from "react";
import { Input, Button, AutoComplete } from "antd";
import { useHistory } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

const Searchbar = (props) => {
  // -------------------------------------------------------------------
  // ------------------------------ state ------------------------------
  // -------------------------------------------------------------------

  const searchbar = React.createRef();
  const history = useHistory();
  const [options, setOptions] = useState([]);

  // ------------------------------------------------------------------
  // --------------------------- life-cycle ---------------------------
  // ------------------------------------------------------------------

  // only update full options if keywords ever change
  useEffect(() => {
    setOptions(props.keywords.map((word) => ({ value: word })));
  }, [props.keywords]);

  // ------------------------------------------------------------------
  // ---------------------------- handlers ----------------------------
  // ------------------------------------------------------------------

  const filterOptions = (input, option) => {
    return option.value.startsWith(input.toLowerCase());
  };

  const enterSearch = (event) => {
    history.push(`/search/${searchbar.current.state.value}/page/1`);
  };

  // ------------------------------------------------------------------
  // ----------------------------- render -----------------------------
  // ------------------------------------------------------------------

  return (
    <>
      <div className="homepage-searchbar-div">
        <AutoComplete
          className="homepage-searchbar-input"
          options={options}
          filterOption={filterOptions}
          dropdownClassName="searchbar-autocomplete-dropdown"
        >
          <Input
            ref={searchbar}
            style={{ borderRadius: "50px", height: "50px" }}
            prefix={<SearchOutlined />}
            size="large"
            onPressEnter={(event) => enterSearch(event)}
          />
        </AutoComplete>
      </div>
      <Button
        className="homepage-search-button"
        type="primary"
        onClick={(event) => enterSearch(event)}
      >
        Search
      </Button>
    </>
  );
};

export default Searchbar;
