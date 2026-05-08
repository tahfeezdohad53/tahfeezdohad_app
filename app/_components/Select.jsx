'use client';
import { useState } from 'react';

import Select from 'react-select';

export default function CustomSelect({options}) {
  return (
    <>
      <Select
        className="basic-single"
        options={options}
        // onChange={}
      />

        
    </>
  );
};