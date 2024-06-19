import React, { useState } from "react";
import styles from "./Row.module.sass";
import cn from "classnames";
import Checkbox from "../../../../../components/Checkbox";
import Balance from "../../../../../components/Balance";

const Row = ({
  item,
  value,
  onChange,
  activeTable,
  setActiveTable,
  activeId,
  setActiveId,
}) => {
  const handleClick = (id) => {
    setActiveTable(true);
    setActiveId(id);
  };

  return (
    <>
      <div
        className={cn(
          styles.row,
          { [styles.selected]: activeId === item.portfolioId },
          { [styles.active]: activeTable }
        )}
      >
        <div className={styles.col}></div>
        <div className={styles.col}>
          <div className={styles.item} onClick={() => handleClick(item.id)}>
            <div className={styles.details}>
              <div className={styles.user}>{item.portfolio}</div>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.email}>{item.productLine}</div>
        </div>
        <div className={styles.col}>
          <div className={cn("status-green-dark", styles.purchase)}>
            {item.portfolioId}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.lifetime}>
            <div className={styles.price}>{item.store}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Row;
