import React from 'react';
import { ModalSelectList }
      from 'react-native-modal-select-list';

 export const SelectDropDown = ({items,
                                 saveModalRef,
                                 onSelectedOption, 
                                 background,
                                 textColor}) => {

    let menuItems = []

    items.map((element) => {
        let item = {
            label: element,
            value: element
        }
        menuItems.push(item);
    });

    return (

        <ModalSelectList
          ref={saveModalRef}
          placeholder={"Search..."}
          closeButtonText={"Close"}
          options={menuItems}
          onSelectedOption={onSelectedOption}
          disableTextSearch={false}
          headerTintColor={background}
          buttonTextColor={textColor}
          numberOfLines={3}
        />
    );
  };

