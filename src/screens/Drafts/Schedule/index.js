import React, { useState } from "react";
import styles from "./Schedule.module.sass";
import cn from "classnames";
import Item from "./Item";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import Icon from "../../../components/Icon";
import Dropdown from "../../../components/Dropdown";
import { STORES } from "../../../constant";

const Schedule = ({
  className,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
}) => {
  const [visibleDate, setVisibleDate] = useState(false);
  const [visibleTime, setVisibleTime] = useState(false);

  const handleClick = () => {
    setStartDate(null);
    setTimeout(() => setStartDate(new Date()), 10);
    setVisibleDate(false);
  };
  const [store, setStore] = useState(STORES[0]);

  return (
    <div className={cn(styles.schedule, className)}>
      <div className={cn("title-red", styles.title)}>Duplicate Campaign</div>
      <div className={styles.note}>Choose a store for duplicate Campaign</div>
      <div className={styles.list}>
        <Dropdown
          className={styles.dropdown}
          classDropdownHead={styles.dropdownHead}
          value={store}
          setValue={setStore}
          options={STORES}
          label={"Store"}
        />{" "}
      </div>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)}>Duplicate</button>
      </div>
    </div>
  );
};

export default Schedule;
