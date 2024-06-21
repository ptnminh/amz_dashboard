import React, { useEffect, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import DefaultValue from "./Price";
import cn from "classnames";
import Card from "../../components/Card";
import Editor from "../../components/Editor";
import {
  CAMP_TYPES,
  CHANNELS,
  EXPRESSION_TYPES,
  MATCH_TYPES,
  PRODUCT_LINES_OPTIONS,
  STORES,
  STRATEGIES,
  DEFAULT_VALUES_NAVIGATIONS,
  CREATE_KW_CAMP_METHOD,
  STORE_PREFIX_BRAND,
  MAPPED_STRATEGY,
} from "../../constant";
import Checkbox from "../../components/Checkbox";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm } from "react-hook-form";
import { chunk, compact, first, isEmpty, join, map, split, trim } from "lodash";
import moment from "moment-timezone";
import Table from "./CampaignInfo/Table";
import CryptoJS from "crypto-js";
import { useDisclosure } from "@mantine/hooks";
import { Box, LoadingOverlay } from "@mantine/core";
import { showNotification } from "../../utils/index";
import ProductLine from "./ProductLine";
import { campaignServices, portfolioServices } from "../../services";
import { Tooltip } from "react-tooltip";

const generateRandomBytes = (length) => {
  return CryptoJS.lib.WordArray.random(length).toString();
};
const NewCampaigns = () => {
  const [
    visibleSyncLoadingProductLine,
    { open: openLoadingProductLine, close: closeLoadingProductLine },
  ] = useDisclosure(false);
  const [
    visibleLoadingCreateCamp,
    { open: openLoadingCreateCamp, close: closeLoadingCreateCamp },
  ] = useDisclosure(false);
  const [activeProductLineTab, setActiveProductLineTab] = useState(
    PRODUCT_LINES_OPTIONS[0]
  );
  const [selectedCreateCampMethodForSKU, setSelectedCreateCampMethodForSKU] =
    useState(1);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [store, setStore] = useState(STORES[0]);
  const [campType, setCampType] = useState(CAMP_TYPES[0]);
  const [selectedCreateCampMethodForKW, setSelectedCreateCampMethodForKW] =
    useState(1);

  const handleChangeForKW = (id) => {
    setSelectedCreateCampMethodForKW(id);
    if (id !== 3) {
      setValue("maximumKwPerCampaign", null);
    }
  };

  const handleChangeForSKU = (id) => {
    setSelectedCreateCampMethodForSKU(id);
    if (id !== 3) {
      setValue("maximumSKUPerCampaign", null);
    }
  };

  const [activeDefaultValueTab, setActiveDefaultValueTab] = useState(
    DEFAULT_VALUES_NAVIGATIONS[0]
  );
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [matchType, setMatchType] = useState(MATCH_TYPES[0]);
  const [expressionType, setExpressionType] = useState(EXPRESSION_TYPES[0]);
  const [visiblePreviewData, setVisiblePreviewData] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [portfolioId, setPortfolioId] = useState();
  const [createCampaignResult, setCreateCampaignResult] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  const handleSyncProductLine = async () => {
    openLoadingProductLine();
    const SKUs = getValues("SKUs");
    if (isEmpty(SKUs)) {
      showNotification("Thất bại", "Giá trị SKU không tồn tại", "red");
      closeLoadingProductLine();
      return;
    }
    const firstSKU = first(compact(SKUs.split("\n")));
    const prefix = split(firstSKU, "-")[0];
    const portfolios = await portfolioServices.syncPortfolio({
      store,
      prefix,
    });
    if (portfolios) {
      showNotification("Thành công", "Đồng bộ thành công", "green");
      setPortfolios(portfolios);
      const firstPortfolio = first(portfolios);
      setPortfolioId(firstPortfolio.portfolioId);
    } else {
      showNotification("Thất bại", "Đồng bộ thất bại", "red");
      setPortfolioId();
      setPortfolios([]);
    }
    closeLoadingProductLine();
    return;
  };

  const transformedData = (data) => {
    const {
      maximumKwPerCampaign,
      keywords,
      SKUs,
      maximumSKUPerCampaign,
      extendPrefix,
      defaultBid,
      budget,
      bid,
      topOfSearch,
      portfolioId: inputPortfolioId,
    } = data;
    const listSKUs = compact(map(split(trim(SKUs), "\n"), (SKU) => trim(SKU)));
    const listKeywords = compact(
      map(split(trim(keywords), "\n"), (keyword) => trim(keyword))
    );
    let chunkedSKUs = [];
    let chunkedKeywords = [];
    if (selectedCreateCampMethodForSKU === 1 && !maximumSKUPerCampaign) {
      chunkedSKUs = [listSKUs];
    } else if (selectedCreateCampMethodForSKU === 2 && !maximumSKUPerCampaign) {
      chunkedSKUs = chunk(listSKUs, 1);
    } else if (selectedCreateCampMethodForSKU === 3 && maximumSKUPerCampaign) {
      chunkedSKUs = chunk(listSKUs, maximumSKUPerCampaign);
    }

    if (selectedCreateCampMethodForKW === 1 && !maximumKwPerCampaign) {
      chunkedKeywords = [listKeywords];
    } else if (selectedCreateCampMethodForKW === 2 && !maximumKwPerCampaign) {
      chunkedKeywords = chunk(listKeywords, 10);
    } else if (selectedCreateCampMethodForKW === 3 && maximumKwPerCampaign) {
      chunkedKeywords = chunk(listKeywords, maximumKwPerCampaign);
    }
    const preparedData = [];
    for (let index = 0; index < chunkedSKUs.length; index++) {
      const chunkListSKUs = chunkedSKUs[index];
      const transformedSKUs = map(chunkListSKUs, (SKU) => {
        if (store !== "PFH") {
          return `${SKU}-${STORE_PREFIX_BRAND[store].prefix}`;
        }
        return SKU;
      });
      for (let i = 0; i < chunkedKeywords.length; i++) {
        const chunkListKeywords = chunkedKeywords[i];
        const firstSKU = transformedSKUs[0];
        const transformedCampType = campType === "KEYWORD" ? "KW" : campType;
        let campaignName = `${channel}_${firstSKU}${
          extendPrefix ? "_" + extendPrefix : ""
        }_${transformedCampType}_${moment().format(
          "MMMDD"
        )}_${generateRandomBytes(6)}`;
        if (strategy && strategy === "UP_AND_DOWN") {
          campaignName = `${channel}_${firstSKU}${
            extendPrefix ? "_" + extendPrefix : ""
          }_${transformedCampType}_U&D_${moment().format(
            "MMMDD"
          )}_${generateRandomBytes(6)}`;
        }
        preparedData.push({
          skus: join(transformedSKUs, ","),
          ...(campType === "KEYWORD"
            ? {
                keywords: join(chunkListKeywords, ","),
              }
            : campType === "ASIN"
            ? {
                asins: join(chunkListKeywords, ","),
              }
            : {}),
          store,
          defaultBid,
          state: "ENABLED",
          dailyBudget: budget,
          ...(campType !== "AUTO" && { bid }),
          ...(campType === "KEYWORD" && { matchType }),
          ...(campType === "ASIN" && { expressionType }),
          type: campType === "AUTO" ? "AUTO" : "MANUAL",
          topOfSearch,
          adGroupName: `Ad group - ${moment().format(
            "YYYY-MM-DD HH:mm:ss.SSS"
          )}`,
          campaignName,
          strategy: MAPPED_STRATEGY[strategy],
          portfolioId: inputPortfolioId || portfolioId,
        });
      }
    }
    console.log(preparedData);
    return preparedData;
  };

  const onSubmit = async (data) => {
    if (!portfolioId) {
      const inputPortfolioId = getValues("portfolioId");
      if (!inputPortfolioId) {
        showNotification("Thât bại", "Chưa sync Product Line", "red");
        return;
      }
    }
    openLoadingCreateCamp();
    const preparedData = transformedData(data);
    if (isEmpty(preparedData)) {
      closeLoadingCreateCamp();
      showNotification("Thất bại", "Vui lòng reload lại page & thử lại", "red");
      return;
    }
    const createCampaignsResult = await campaignServices.createCamps(
      preparedData
    );
    if (!createCampaignsResult) {
      showNotification("Thất bại", "Tạo campaign thất bại", "red");
      setCreateCampaignResult("Contact IT để biết chi tiết lỗi");
    } else {
      setCreateCampaignResult(createCampaignsResult);
      showNotification("Thành công", "Tạo campaign thành công", "green");
    }
    setPortfolioId("");
    setPortfolios([]);
    setReviewData([]);
    closeLoadingCreateCamp();
    return true;
  };

  const handlePreviewData = () => {
    const data = getValues();
    console.log(data);
    if (!data.SKUs) {
      showNotification("Thất bại", "Vui lòng nhập SKUs hoặc Keywords", "red");
      setReviewData([]);
      return;
    }
    if (campType !== "AUTO" && isEmpty(data.keywords)) {
      showNotification("Thất bại", "Vui lòng nhập KW/ASIN", "red");
      setReviewData([]);
      return;
    }
    if (
      campType !== "AUTO" &&
      selectedCreateCampMethodForKW === 3 &&
      !data.maximumKwPerCampaign
    ) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập Maximum KW/ASIN Per Campaign",
        "red"
      );
      setReviewData([]);
      return;
    }
    if (selectedCreateCampMethodForSKU === 3 && !data.maximumSKUPerCampaign) {
      showNotification(
        "Thất bại",
        "Vui lòng nhập Maximum SKU Per Campaign",
        "red"
      );
      setReviewData([]);
      return;
    }
    const preparedData = transformedData(data);
    console.log(preparedData);
    setReviewData(preparedData);
    setVisiblePreviewData(true);
  };

  const handleResetData = () => {
    setValue("SKUs", "");
    setValue("keywords", "");
    setValue("extendPrefix", "");
    setValue("portfolioId", "");
    setPortfolioId("");
    setPortfolios([]);
    setReviewData([]);
    setVisiblePreviewData(false);
    setCreateCampaignResult("");
    setActiveDefaultValueTab(DEFAULT_VALUES_NAVIGATIONS[0]);
    setCampType(CAMP_TYPES[0]);
    setValue("maximumKwPerCampaign", null);
    setValue("maximumSKUPerCampaign", null);
  };

  useEffect(() => {
    switch (campType) {
      case "AUTO":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1.25);
          setValue("budget", 10);
          setValue("topOfSearch", 0);
        }
        break;
      case "KEYWORD":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1);
          setValue("budget", 10);
          setValue("topOfSearch", 0);
          setValue("bid", 1.25);
        }
        break;
      case "ASIN":
        if (activeDefaultValueTab === "Default") {
          setValue("defaultBid", 1);
          setValue("budget", 15);
          setValue("topOfSearch", 0);
          setValue("bid", 1);
        }
        break;
      default:
        break;
    }
  }, [campType, activeDefaultValueTab]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: "relative" }}>
        <LoadingOverlay
          visible={visibleLoadingCreateCamp}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <CampaignInfo
              className={styles.card}
              campType={campType}
              setCampType={setCampType}
              channel={channel}
              setChannel={setChannel}
              store={store}
              setStore={setStore}
              selectedCreateCampMethod={selectedCreateCampMethodForSKU}
              handleChange={handleChangeForSKU}
              handleSubmit={handleSubmit}
              register={register}
              errors={errors}
              onSubmit={onSubmit}
              setVisibleReviewTable={setVisiblePreviewData}
              setReviewData={setReviewData}
              handleResetData={handleResetData}
              previewData={reviewData}
              handlePreviewData={handlePreviewData}
            />
            <Card
              className={cn(styles.card)}
              title="Kết quả"
              classTitle="title-red"
            >
              <TextInput
                className={styles.maximumCamp}
                name="createCampaignResult"
                type="text"
                label={"Chi tiết kết quả"}
                isTextArea={true}
                value={createCampaignResult}
              />
            </Card>
          </div>
          <div className={styles.col}>
            <Box pos="relative">
              <LoadingOverlay
                visible={visibleSyncLoadingProductLine}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
                loaderProps={{ color: "pink", type: "bars" }}
              />
              <Card
                className={cn(styles.card)}
                title="Product Line"
                classTitle="title-orange"
                head={
                  <>
                    <div className={cn(styles.nav, "tablet-hide")}>
                      {PRODUCT_LINES_OPTIONS.map((x, index) => (
                        <div
                          className={cn(styles.link, {
                            [styles.active]: x === activeProductLineTab,
                          })}
                          onClick={() => setActiveProductLineTab(x)}
                          key={index}
                          style={{ cursor: "pointer" }}
                        >
                          {x}
                        </div>
                      ))}
                    </div>
                  </>
                }
              >
                {activeProductLineTab === "Default" && (
                  <>
                    <a
                      data-tooltip-id="my-tooltip"
                      data-tooltip-html="Data được sync từ Google Sheet, ví dụ SKU: ONM-K12 thì sẽ lấy prefix là ONM để đi tìm bên Google Sheet <br>Trường hợp có nhiều Product Line được tìm thấy thì mặc định sẽ lấy Product Line đầu tiên</br>
                      <br>Click để xem chi tiết</br>"
                      data-tooltip-place="top"
                      style={{ cursor: "pointer", marginRight: "12px" }}
                      target="_blank"
                      href="https://docs.google.com/spreadsheets/d/1F1CIRG4LzfBl2fKu9cNWa6wzGSTB93qTCPcozDb9aS0/edit?exids=71471476%2C71471470&gid=273441149#gid=273441149"
                    >
                      <Icon name="info" size={24} />
                    </a>
                    <Tooltip id="my-tooltip" />
                    <div
                      className={cn(
                        "button-stroke button-small",
                        styles.createButton
                      )}
                      type="button"
                      style={{ cursor: "pointer", marginBottom: "24px" }}
                      onClick={handleSyncProductLine}
                    >
                      <Icon name="link" size="12" />
                      <span>Sync</span>
                    </div>
                    {!isEmpty(portfolios) && (
                      <ProductLine data={portfolios} activeTable={true} />
                    )}
                  </>
                )}
                {activeProductLineTab === "New" && (
                  <div className={styles.description}>
                    <TextInput
                      className={styles.maximumCamp}
                      name="portfolioId"
                      type="text"
                      placeholder="Enter Portfolio ID"
                      register={register("portfolioId", { required: true })}
                      error={errors.portfolioId}
                    />
                  </div>
                )}
              </Card>
            </Box>
            <Card
              className={cn(styles.card)}
              title="KW/ASIN"
              classTitle="title-green"
            >
              <div className={styles.description}>
                <div
                  className={styles.group}
                  style={{ width: "100%", marginBottom: 24 }}
                >
                  <TextInput
                    className={styles.maximumCamp}
                    name="keywords"
                    type="text"
                    isTextArea={true}
                    placeholder={`B0C99KFYS6\nB09P48SXPN\nB0CBKT4SJ5\nB09CMDDTW3\nB08P7587QQ\nB0BWKBM2YN\nB09245S1RL\nB07QVJ4MLS\nB0BQYFTJCS`}
                    register={register("keywords", {
                      required: campType !== "AUTO",
                    })}
                    error={errors.keywords}
                  />
                  {CREATE_KW_CAMP_METHOD.map((x, index) => (
                    <Checkbox
                      className={styles.checkbox}
                      content={x.title}
                      value={selectedCreateCampMethodForKW === x.id}
                      onChange={() => handleChangeForKW(x.id)}
                      key={index}
                    />
                  ))}
                  {selectedCreateCampMethodForKW === 3 && (
                    <TextInput
                      className={styles.maximumCamp}
                      name="maximumKwPerCampaign"
                      type="number"
                      placeholder="3"
                      tooltip="BT-P005_Gr_1kw"
                      register={register("maximumKwPerCampaign", {
                        required: true,
                        valueAsNumber: true,
                      })}
                      error={errors.maximumKwPerCampaign}
                    />
                  )}
                </div>
              </div>
            </Card>
            <DefaultValue
              className={styles.defaultValue}
              activeDefaultValueTab={activeDefaultValueTab}
              setActiveDefaultValueTab={setActiveDefaultValueTab}
              setStrategy={setStrategy}
              strategy={strategy}
              matchType={matchType}
              setMatchType={setMatchType}
              expressionType={expressionType}
              setExpressionType={setExpressionType}
              campaignType={campType}
              register={register}
              errors={errors}
            />
          </div>
        </div>
        {visiblePreviewData && (
          <div>
            <Card
              className={cn(styles.card)}
              title="Review"
              classTitle="title-blue"
              head={
                <div className={cn(styles.nav, "tablet-hide")}>
                  <div
                    className={cn(styles.link, {
                      [styles.active]: visiblePreviewData,
                    })}
                    onClick={() => setVisiblePreviewData(false)}
                    style={{ cursor: "pointer" }}
                  >
                    Hide
                  </div>
                </div>
              }
            >
              <Table
                className={styles.table}
                activeTable={visiblePreviewData}
                setActiveTable={visiblePreviewData}
                data={reviewData}
              />
            </Card>
          </div>
        )}
      </form>
    </>
  );
};

export default NewCampaigns;
