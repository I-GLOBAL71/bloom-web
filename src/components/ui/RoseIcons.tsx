import React from 'react';
import { GiRose, GiFlowerEmblem, GiGardeningShears } from 'react-icons/gi';
import { FaCanadianMapleLeaf } from 'react-icons/fa';
import { BiLeaf } from 'react-icons/bi';

const RoseIcons = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="flex flex-col items-center">
        <GiRose size={40} className="text-red-600" />
        <span>GiRose</span>
        <span className="text-sm text-gray-500">(Rose détaillée)</span>
      </div>
      <div className="flex flex-col items-center">
        <GiFlowerEmblem size={40} className="text-red-500" />
        <span>GiFlowerEmblem</span>
        <span className="text-sm text-gray-500">(Rose stylisée)</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <GiRose size={40} className="text-red-600" />
          <BiLeaf size={20} className="text-green-500 absolute -bottom-2 -right-2" />
        </div>
        <span>GiRose + BiLeaf</span>
        <span className="text-sm text-gray-500">(Rose avec feuille)</span>
      </div>
    </div>
  );
};

export default RoseIcons;