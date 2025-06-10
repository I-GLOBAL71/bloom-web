import React from 'react';
import { GiFlowers, GiFlowerPot, GiFlowerTwirl, GiFlowerStar } from 'react-icons/gi';
import { BsFlower1, BsFlower2, BsFlower3 } from 'react-icons/bs';
import { FaCanadianMapleLeaf } from 'react-icons/fa';

const FlowerIcons = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="flex flex-col items-center">
        <GiFlowers size={40} />
        <span>GiFlowers</span>
      </div>
      <div className="flex flex-col items-center">
        <GiFlowerPot size={40} />
        <span>GiFlowerPot</span>
      </div>
      <div className="flex flex-col items-center">
        <GiFlowerTwirl size={40} />
        <span>GiFlowerTwirl</span>
      </div>
      <div className="flex flex-col items-center">
        <GiFlowerStar size={40} />
        <span>GiFlowerStar</span>
      </div>
      <div className="flex flex-col items-center">
        <BsFlower1 size={40} />
        <span>BsFlower1</span>
      </div>
      <div className="flex flex-col items-center">
        <BsFlower2 size={40} />
        <span>BsFlower2</span>
      </div>
      <div className="flex flex-col items-center">
        <BsFlower3 size={40} />
        <span>BsFlower3</span>
      </div>
      <div className="flex flex-col items-center">
        <FaCanadianMapleLeaf size={40} />
        <span>FaCanadianMapleLeaf</span>
      </div>
    </div>
  );
};

export default FlowerIcons;