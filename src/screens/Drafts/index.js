import React, { useState } from "react";
import cn from "classnames";
import styles from "./Drafts.module.sass";
import Card from "../../components/Card";
import Form from "../../components/Form";

import { campaigns } from "../../mocks/campaigns";
import Table from "./Table";
import { Pagination } from "@mantine/core";

const sorting = ["list", "grid"];

const Drafts = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [search, setSearch] = useState("");

  const handleSubmit = (e) => {
    alert();
  };

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChange = (id) => {
    if (selectedFilters.includes(id)) {
      setSelectedFilters(selectedFilters.filter((x) => x !== id));
    } else {
      setSelectedFilters((selectedFilters) => [...selectedFilters, id]);
    }
  };

  return (
    <>
      <Card
        className={styles.card}
        classCardHead={styles.head}
        title="Campaigns History"
        classTitle={cn("title-purple", styles.title)}
        head={
          <>
            <Form
              className={styles.form}
              value={search}
              setValue={setSearch}
              onSubmit={() => handleSubmit()}
              placeholder="Search Campaign"
              type="text"
              name="search"
              icon="search"
            />
          </>
        }
      >
        <div className={styles.wrapper}>
          <Table items={campaigns} title="Last edited" />
        </div>
      </Card>
      <Pagination
        total={10}
        color="pink"
        size="md"
        style={{
          marginTop: "20px",
          marginLeft: "auto",
        }}
      />
    </>
  );
};

export default Drafts;
