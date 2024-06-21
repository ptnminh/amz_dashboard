import React, { useState } from "react";
import styles from "./Table.module.sass";
import Row from "./Row";

const Table = ({
  items,
  handleChangeCampaignName,
  selectedFilters,
  visibleModalDuplicate,
  setVisibleModalDuplicate,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.row}>
          <div className={styles.col}></div>
          <div className={styles.col}>Name</div>
          <div className={styles.col}>SKUs</div>
          <div className={styles.col}>KW/ASIN</div>
          <div className={styles.col}>Budget</div>
          <div className={styles.col}>Default Bid</div>
          <div className={styles.col}>Bid</div>
          <div className={styles.col}>Store</div>
        </div>
        {items.map((x, index) => (
          <Row
            item={x}
            key={index}
            index={index}
            value={selectedFilters.includes(x.campaignName)}
            onChange={() => handleChangeCampaignName(x.campaignName)}
            visibleModalDuplicate={visibleModalDuplicate}
            setVisibleModalDuplicate={setVisibleModalDuplicate}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
