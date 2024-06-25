import React, { useEffect } from "react";
import cn from "classnames";
import styles from "./CampaignInfo.module.sass";
import Card from "../../../components/Card";
import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import Dropdown from "../../../components/Dropdown";
import Checkbox from "../../../components/Checkbox";
import {
  CAMP_TYPES,
  CHANNELS_OPTIONS,
  CREATE_SKU_CAMP_METHOD,
  STORES,
} from "../../../constant";
import { isEmpty } from "lodash";

const CampaignInfo = ({
  className,
  campType,
  setCampType,
  selectedCreateCampMethod,
  handleChange,
  store,
  setStore,
  channel,
  setChannel,
  register,
  errors,
  onSubmit,
  setVisibleReviewTable,
  setReviewData,
  handleResetData,
  previewData,
  handlePreviewData,
  setFormValue,
}) => {
  useEffect(() => {
    if (!isEmpty(previewData)) setVisibleReviewTable(true);
  }, [previewData]);
  return (
    <>
      <Card
        className={cn(styles.card, className)}
        title="1. Create Type"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
      >
        <div className={styles.description}>
          <div className={styles.campType}>
            <Dropdown
              className={styles.dropdown}
              classDropdownHead={styles.dropdownHead}
              value={campType}
              setValue={setCampType}
              options={CAMP_TYPES}
            />{" "}
          </div>
        </div>
      </Card>
      <Card
        className={cn(styles.card, className)}
        title="2. SKU"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
      >
        <div
          className={styles.group}
          style={{ width: "100%", marginBottom: 24 }}
        >
          <TextInput
            className={styles.textarea}
            // label={"SKUs"}
            name="SKUs"
            type="text"
            isTextArea={true}
            placeholder={`GL-Q006 \nGL-MH002 \nGL-MH003 \nGL-MH001 \nGL-Q002 \nGL-Q003`}
            register={register("SKUs", { required: true })}
            error={errors.SKUs}
          />
          <div
            style={{
              display: "flex",
              minWidth: "100%",
              marginLeft: 6,
            }}
          >
            {CREATE_SKU_CAMP_METHOD.map((x, index) => (
              <Checkbox
                className={styles.checkbox}
                content={x.title}
                value={selectedCreateCampMethod === x.id}
                onChange={() => {
                  if (x.id === 1 || x.id === 3)
                    setFormValue("extendPrefix", "Gr");
                  else setFormValue("extendPrefix", "");
                  handleChange(x.id);
                }}
                key={index}
              />
            ))}
          </div>
          {selectedCreateCampMethod === 3 && (
            <TextInput
              className={styles.maximumCamp}
              name="maximumSKUPerCampaign"
              type="number"
              placeholder="3"
              tooltip="BT-P005_Gr_1kw"
              error={errors.maximumSKUPerCampaign}
              register={register("maximumSKUPerCampaign", {
                required: true,
                valueAsNumber: true,
              })}
            />
          )}
        </div>
      </Card>
      <Card
        className={cn(styles.card, className)}
        title="4. Store"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        head={
          <>
            <Dropdown
              className={cn(styles.dropdown, styles.storeDropdown)}
              classDropdownHead={styles.dropdownHead}
              value={store}
              setValue={setStore}
              options={STORES}
            />{" "}
          </>
        }
      ></Card>
      <Card
        className={cn(styles.card, className)}
        title="6. Prefix (Camp Name)"
        classTitle="title-green"
        classCardHead={styles.classCardHead}
        head={
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "15px",
              }}
            >
              {CHANNELS_OPTIONS.map((x, index) => (
                <Checkbox
                  className={styles.checkboxChannel}
                  content={x.title}
                  value={channel === x.title}
                  onChange={() => setChannel(x.title)}
                  key={index}
                />
              ))}
            </div>
          </>
        }
      >
        <TextInput
          style={{ marginTop: "12px" }}
          className={styles.field}
          name="extendPrefix"
          type="text"
          placeholder="Occasions (Optional)"
          tooltip="BT-P005_Gr_1kw"
          register={register("extendPrefix", { required: false })}
          error={errors.extendPrefix}
        />
        <div className={styles.actions}>
          <div
            className={cn("button-stroke-red button-small", styles.clearButton)}
            style={{ cursor: "pointer" }}
            onClick={handleResetData}
          >
            <Icon name="trash" size="16" />
            <span>Clear</span>
          </div>
          <div
            className={cn(
              "button-stroke-purple button-small",
              styles.clearButton
            )}
            style={{ cursor: "pointer" }}
            onClick={handlePreviewData}
          >
            <Icon name="repeat" size="16" />
            <span>Preview</span>
          </div>
          <button
            className={cn("button-stroke button-small", styles.createButton)}
            type="submit"
          >
            <Icon name="plus" size="16" />
            <span>Tạo</span>
          </button>
        </div>
      </Card>
    </>
  );
};

export default CampaignInfo;
