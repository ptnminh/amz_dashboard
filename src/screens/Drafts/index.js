import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Drafts.module.sass";
import Card from "../../components/Card";
import Form from "../../components/Form";

import Table from "./Table";
import { Box, LoadingOverlay, Pagination } from "@mantine/core";
import Icon from "../../components/Icon";
import { isEmpty, map } from "lodash";
import { campaignServices } from "../../services";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "../../utils/index";

const CampaignHistories = () => {
  const [search, setSearch] = useState("");
  const [visibleModalDuplicate, setVisibleModalDuplicate] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [
    visibleLoadingCampaignHistories,
    {
      open: openLoadingCampaignHistories,
      close: closeLoadingCampaignHistories,
    },
  ] = useDisclosure(false);

  const fetchCampaigns = async (page = 1) => {
    openLoadingCampaignHistories();
    try {
      const response = await campaignServices.getCampaignHistories({
        search,
        page,
      });
      console.log(response);
      const { data, pagination } = response;

      if (data) {
        setCampaigns(data);
        setPagination(pagination);
      } else {
        showNotification("Thất bại", "Không tìm thấy Campaigns", "red");
      }
    } catch (error) {
      showNotification("Thất bại", "Có lỗi xảy ra", "red");
    } finally {
      closeLoadingCampaignHistories();
    }
  };

  useEffect(() => {
    fetchCampaigns(pagination.currentPage);
  }, [search, pagination.currentPage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCampaigns(1);
  };

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleChangeCampaignName = (id) => {
    setSelectedFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllCampaigns = () => {
    setSelectedFilters((prev) =>
      isEmpty(prev) ? map(campaigns, (x) => x.campaignName) : []
    );
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  return (
    <>
      <Box pos="relative">
        <LoadingOverlay
          visible={visibleLoadingCampaignHistories}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
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
                onSubmit={handleSubmit}
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
              handleSelectAllCampaigns={handleSelectAllCampaigns}
            />
          </div>
        </Card>
        <Pagination
          total={pagination.totalPages}
          page={pagination.currentPage}
          onChange={handlePageChange}
          color="pink"
          size="md"
          style={{ marginTop: "20px", marginLeft: "auto" }}
        />
      </Box>
    </>
  );
};

export default CampaignHistories;
