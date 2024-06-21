import React, { useState } from "react";
import cn from "classnames";
import styles from "./Drafts.module.sass";
import Card from "../../components/Card";
import Form from "../../components/Form";

import { campaigns } from "../../mocks/campaigns";
import Table from "./Table";
import { Pagination } from "@mantine/core";
import Icon from "../../components/Icon";
import { isEmpty } from "lodash";

const Drafts = () => {
  const [search, setSearch] = useState("");
  const [visibleModalDuplicate, setVisibleModalDuplicate] = useState(false);

  const handleSubmit = (e) => {
    alert();
  };

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChangeCampaignName = (id) => {
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
            <button
              className={cn(
                "button-stroke-purple button-small",
                styles.clearButton
              )}
              style={{ cursor: "pointer", marginLeft: "auto" }}
              onClick={() => setVisibleModalDuplicate(true)}
              disabled={isEmpty(selectedFilters)}
            >
              <Icon name="share" size="16" />
              <span>Duplicate</span>
            </button>
          </>
        }
      >
        <div className={styles.wrapper}>
          <Table
            items={campaigns}
            title="Last edited"
            handleChangeCampaignName={handleChangeCampaignName}
            selectedFilters={selectedFilters}
            visibleModalDuplicate={visibleModalDuplicate}
            setVisibleModalDuplicate={setVisibleModalDuplicate}
          />
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
