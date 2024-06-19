import React, { useState } from "react";
import styles from "./Table.module.sass";
import cn from "classnames";
import Row from "./Row";
import Checkbox from "../../../../components/Checkbox";
import { productLines } from "../../../../mocks/productLines";

const Table = ({ className, activeTable, setActiveTable }) => {
  const [chooseAll, setСhooseAll] = useState(false);
  const [activeId, setActiveId] = useState(productLines[0].id);

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChange = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((x) => x !== id));
    } else {
      setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
    }
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={cn(styles.table)}>
        <div className={cn(styles.row, { [styles.active]: activeTable })}>
          <div className={styles.col}></div>
          <div className={styles.col}>Portfolio</div>
          <div className={styles.col}>Product Line</div>
          <div className={styles.col}>Portfolio ID</div>
          <div className={styles.col}>Store</div>
        </div>
        {productLines.map((x, index) => (
          <Row
            item={x}
            key={index}
            activeTable={activeTable}
            setActiveTable={setActiveTable}
            activeId={activeId}
            setActiveId={setActiveId}
            value={selectedFilters.includes(x.id)}
            onChange={() => handleChange(x.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Table;
