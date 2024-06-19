import React from "react";
import cn from "classnames";
import styles from "./CampaignInfo.module.sass";
import Card from "../../../components/Card";
import Icon from "../../../components/Icon";
import TextInput from "../../../components/TextInput";
import Dropdown from "../../../components/Dropdown";
import Checkbox from "../../../components/Checkbox";
import {
  CAMP_TYPES,
  CHANNELS,
  CREATE_SKU_CAMP_METHOD,
  STORES,
} from "../../../constant";

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
}) => {
  return (
    <Card
      className={cn(styles.card, className)}
      title="Campaign Info"
      classTitle="title-green"
    >
      <div className={styles.description}>
        <div className={styles.campType}>
          <Dropdown
            className={styles.dropdown}
            classDropdownHead={styles.dropdownHead}
            value={campType}
            setValue={setCampType}
            options={CAMP_TYPES}
            label={"Camp Type"}
          />{" "}
        </div>
        <div
          className={styles.group}
          style={{ width: "100%", marginBottom: 24 }}
        >
          <TextInput
            className={styles.textarea}
            label={"SKUs"}
            name="SKUs"
            type="text"
            isTextArea={true}
            placeholder="Enter SKUs"
            register={register("SKUs", { required: true })}
            error={errors.SKUs}
          />
          {CREATE_SKU_CAMP_METHOD.map((x, index) => (
            <Checkbox
              className={styles.checkbox}
              content={x.title}
              value={selectedCreateCampMethod === x.id}
              onChange={() => handleChange(x.id)}
              key={index}
            />
          ))}
          {selectedCreateCampMethod === 3 && (
            <TextInput
              className={styles.maximumCamp}
              name="prefix"
              type="number"
              placeholder="3"
              tooltip="BT-P005_Gr_1kw"
              error={errors.maximumSKUPerCampaign}
              register={register("maximumSKUPerCampaign", {
                required: true,
              })}
            />
          )}
        </div>
        <Dropdown
          className={styles.dropdown}
          classDropdownHead={styles.dropdownHead}
          value={store}
          setValue={setStore}
          options={STORES}
          label={"Store"}
        />{" "}
        <Dropdown
          className={styles.dropdown}
          classDropdownHead={styles.dropdownHead}
          value={channel}
          setValue={setChannel}
          options={CHANNELS}
          label={"Prefix"}
        />{" "}
        <TextInput
          className={styles.field}
          name="prefix"
          type="text"
          placeholder="Occasions (Optional)"
          tooltip="BT-P005_Gr_1kw"
          register={register("extendPrefix", { required: false })}
          error={errors.extendPrefix}
        />
      </div>
      <div className={styles.actions}>
        <button
          className={cn("button-stroke-red button-small", styles.clearButton)}
        >
          <Icon name="trash" size="16" />
          <span>Clear</span>
        </button>
        <button
          className={cn("button-stroke button-small", styles.createButton)}
          type="submit"
        >
          <Icon name="plus" size="16" />
          <span>Tạo</span>
        </button>
      </div>
    </Card>
  );
};

export default CampaignInfo;
