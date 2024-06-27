import React, { useState, useMemo, useEffect } from "react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Button, Flex, Text, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useMutation } from "@tanstack/react-query";
import Icon from "../../../components/Icon";
import { keywordServices } from "../../../services";
import { showNotification } from "../../../utils/index";
import { filter, includes, map, uniq } from "lodash";

//CREATE hook (post new user to api)
function useCreateKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      if (includes(exKeywords, keyword)) {
        showNotification("Thất bại", "Keyword đã tồn tại", "red");
        return;
      }
      //send api update request here
      const newKeywords = exKeywords ? [keyword, ...exKeywords] : [keyword];
      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: transformedKeywords,
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error.message, "red");
    },
  });
}

//UPDATE hook (put user in api)
function useUpdateKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      const { id, values } = keyword;
      const newKeywords = exKeywords.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            ...values,
          };
        }
        return item;
      });
      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      //send api update request here
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: transformedKeywords,
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error.message, "red");
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteKeyword(name, exKeywords, setKeywords) {
  return useMutation({
    mutationFn: async (keyword) => {
      const { id } = keyword;
      const newKeywords = filter(exKeywords, (item) => {
        return item.id !== id;
      });
      const transformedKeywords = uniq(map(newKeywords, "keyword"));
      //send api update request here
      const createNewKeywordResponse =
        await keywordServices.createNewKeywordInTemplate({
          name,
          keywords: transformedKeywords,
        });
      return createNewKeywordResponse;
    },
    //client side optimistic update
    onSuccess: (response) => {
      setKeywords(
        map(response.data, (keyword, index) => {
          return {
            id: index,
            keyword: keyword,
          };
        })
      );
    },
    onError: (error) => {
      showNotification("Thất bại", error.message, "red");
    },
  });
}

const KeywordTable = ({ keywords, name }) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [data, setData] = useState(keywords || []);
  const [templateName, setTemplateName] = useState(name);
  useEffect(() => {
    setData(keywords);
    setTemplateName(name);
  }, [keywords, templateName]);
  const columns = useMemo(
    () => [
      {
        accessorKey: "keyword",
        header: "Keyword",
        mantineEditTextInputProps: {
          type: "text",
          required: true,
          error: validationErrors?.data,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              data: undefined,
            }),
        },
      },
    ],
    [validationErrors]
  );

  //call CREATE hook
  const {
    mutateAsync: createKeyword,
    isLoading: isCreatingKeyword,
    status: createKeywordStatus,
  } = useCreateKeyword(templateName, data, setData);

  //call UPDATE hook
  const {
    mutateAsync: updateKeyword,
    isLoading: isUpdatingKeyword,
    status: updateKeywordStatus,
  } = useUpdateKeyword(templateName, data, setData);
  //call DELETE hook
  const {
    mutateAsync: deleteKeyword,
    isLoading: isDeletingKeyword,
    status: deleteKeywordStatus,
  } = useDeleteKeyword(templateName, data, setData);

  //CREATE action
  const handleCreateKeyword = async ({ values, exitCreatingMode }) => {
    try {
      await createKeyword(values);
      exitCreatingMode();
    } catch (e) {
      console.log(e);
    }
  };

  //UPDATE action
  const handleSaveKeyword = async ({ values, table, row }) => {
    try {
      setValidationErrors({});
      const id = row.original.id;
      await updateKeyword({ values, id });
      table.setEditingRow(null); //exit editing mode
    } catch (error) {
      console.log(error);
    }
  };

  //DELETE action
  const openDeleteConfirmModal = (row) =>
    modals.openConfirmModal({
      title: "Are you sure you want to delete this keyword?",
      centered: true,
      children: (
        <Text>
          Are you sure you want to delete {row.original.keyword}? This action
          cannot be undone.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteKeyword({ id: row.original.id }),
    });

  const table = useMantineReactTable({
    columns,
    data,
    createDisplayMode: "row", // ('modal', and 'custom' are also available)
    editDisplayMode: "row", // ('modal', 'cell', 'table', and 'custom' are also available)
    enableEditing: true,
    enablePagination: false,
    getRowId: (row) => row.id,
    mantineTableContainerProps: {
      sx: {
        minHeight: "500px",
        borderRadius: "20px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateKeyword,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveKeyword,
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <div
            onClick={() => table.setEditingRow(row)}
            style={{ cursor: "pointer" }}
          >
            <Icon name="edit" size={24} fill="gray" />
          </div>
        </Tooltip>
        <Tooltip label="Delete">
          <div
            onClick={() => openDeleteConfirmModal(row)}
            style={{ cursor: "pointer" }}
          >
            <Icon name="trash" size={24} fill="gray" />
          </div>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
        }}
      >
        Create New Keyword
      </Button>
    ),
    state: {
      isSaving: isCreatingKeyword || isUpdatingKeyword || isDeletingKeyword,
      showProgressBars:
        updateKeywordStatus === "pending" ||
        createKeywordStatus === "pending" ||
        deleteKeywordStatus === "pending",
    },
  });

  return <MantineReactTable table={table} />;
};

export default KeywordTable;
