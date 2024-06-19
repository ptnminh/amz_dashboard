import React, { useEffect, useState } from "react";
import styles from "./NewCampaigns.module.sass";
import CampaignInfo from "./CampaignInfo";
import Preview from "./Preview";
import DefaultValue from "./Price";
import cn from "classnames";
import Card from "../../components/Card";
import Editor from "../../components/Editor";
import {
  CAMP_TYPES,
  CHANNELS,
  CREATE_CAMP_METHOD,
  EXPRESSION_TYPES,
  MATCH_TYPES,
  PRODUCT_LINES_OPTIONS,
  STORES,
  STRATEGIES,
  DEFAULT_VALUES_NAVIGATIONS,
} from "../../constant";
import Checkbox from "../../components/Checkbox";
import TextInput from "../../components/TextInput";
import Icon from "../../components/Icon";
import { useForm } from "react-hook-form";

const NewCampaigns = () => {
  const [activeProductLineTab, setActiveProductLineTab] = useState(
    PRODUCT_LINES_OPTIONS[0]
  );
  const [content, setContent] = useState();
  const [selectedCreateCampMethodForSKU, setSelectedCreateCampMethodForSKU] =
    useState(1);
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [store, setStore] = useState(STORES[0]);
  const [campType, setCampType] = useState(CAMP_TYPES[0]);
  const [selectedCreateCampMethodForKW, setSelectedCreateCampMethodForKW] =
    useState(1);

  const handleChangeForKW = (id) => {
    setSelectedCreateCampMethodForKW(id);
  };

  const handleChangeForSKU = (id) => {
    setSelectedCreateCampMethodForSKU(id);
  };

  const [activeDefaultValueTab, setActiveDefaultValueTab] = useState(
    DEFAULT_VALUES_NAVIGATIONS[0]
  );
  const [strategy, setStrategy] = useState(STRATEGIES[0]);
  const [matchType, setMatchType] = useState(MATCH_TYPES[0]);
  const [expressionType, setExpressionType] = useState(EXPRESSION_TYPES[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => console.log(data);

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            />
            <Card
              className={cn(styles.card)}
              title="Kết quả"
              classTitle="title-red"
            >
              <Editor
                state={content}
                onChange={setContent}
                classEditor={styles.editor}
                label="Chi tiết kết quả"
                tooltip="Description Message to reviewer"
              />
            </Card>
          </div>
          <div className={styles.col}>
            <Card
              className={cn(styles.card)}
              title="Product Line"
              classTitle="title-orange"
              head={
                <div className={cn(styles.nav, "tablet-hide")}>
                  {PRODUCT_LINES_OPTIONS.map((x, index) => (
                    <div
                      className={cn(styles.link, {
                        [styles.active]: x === activeProductLineTab,
                      })}
                      onClick={() => setActiveProductLineTab(x)}
                      key={index}
                    >
                      {x}
                    </div>
                  ))}
                </div>
              }
            >
              <div
                className={cn(
                  "button-stroke button-small",
                  styles.createButton
                )}
                type="button"
              >
                <Icon name="link" size="12" />
                <span>Sync</span>
              </div>
              <Preview />
            </Card>
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
                    placeholder="Enter Keywords/ASINs"
                    register={register("keywords", { required: true })}
                    error={errors.keywords}
                  />
                  {CREATE_CAMP_METHOD.map((x, index) => (
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
                      name="prefix"
                      type="number"
                      placeholder="3"
                      tooltip="BT-P005_Gr_1kw"
                      register={register("maximumKwPerCampaign", {
                        required: true,
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
      </form>
    </>
  );
};

export default NewCampaigns;
